import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import ts from 'typescript'
import { heteronyms, instructions, instructionsFor, loadContent, model, planAudio, recordsSource, setReview, voice } from './minimal-pairs-audio.mjs'

// No test here calls OpenAI: planning is pure, and the command runs with fetch replaced.
const { audioFile, isReviewed, reusableAudio, records } = await loadContent()
const word = (id, extra = {}) => ({ id, text: id, phonemes: ['k'], phonemesReviewed: false, imageAlt: id, ...extra })
const plan = (lexicon, files = {}, options = {}) => planAudio({
  lexicon, records: options.records ?? {}, audioFile, isReviewed, reusableAudio,
  exists: file => file in files, hash: file => files[file], ...options,
})
const byId = entries => Object.fromEntries(entries.map(entry => [entry.id, entry]))

// Settings match the articulation recordings, and the prompt asks for the word only.
assert.equal(model, 'gpt-4o-mini-tts')
assert.equal(voice, 'nova')
assert.match(instructions, /American English/)
assert.match(instructions, /Say only the word\./)
assert.match(instructions, /first and last sounds/)

// One recording per word, named by its id.
let entries = byId(plan([word('key'), word('tea')]))
assert.equal(entries.key.file, 'minimal-pairs/key.mp3')
assert.equal(entries.key.generate, true)
assert.equal(entries.key.status, 'missing')

// Existing recordings are never replaced without --force, and --force needs --only.
entries = byId(plan([word('key'), word('tea')], { 'minimal-pairs/key.mp3': 'a' }))
assert.equal(entries.key.generate, false)
assert.equal(entries.key.status, 'unreviewed', 'A recording without a review record is unreviewed')
assert.equal(entries.tea.generate, true)
assert.throws(() => plan([word('key')], {}, { force: true }), /needs --only/)
entries = byId(plan([word('key'), word('tea')], { 'minimal-pairs/key.mp3': 'a' }, { only: ['key'], force: true }))
assert.deepEqual(Object.keys(entries), ['key'], '--only selects words')
assert.equal(entries.key.generate, true)
assert.match(entries.key.notes.join(), /review will be cleared/)
assert.throws(() => plan([word('key')], {}, { only: ['nope'] }), /Not in the lexicon: nope/)

// Review status follows the file's hash.
const reviewed = { 'minimal-pairs/key.mp3': { sha256: 'a', source: 'openai', reviewedBy: 'Jana', reviewedOn: '2026-10-13' } }
assert.equal(plan([word('key')], { 'minimal-pairs/key.mp3': 'a' }, { records: reviewed })[0].status, 'reviewed')
const stale = plan([word('key')], { 'minimal-pairs/key.mp3': 'changed' }, { records: reviewed })[0]
assert.equal(stale.status, 'unreviewed', 'A changed file loses its review')
assert.match(stale.notes.join(), /changed since/)

// Words with more than one pronunciation are flagged, not guessed.
assert.ok(heteronyms.has('tear') && heteronyms.has('bow'))
const tear = plan([word('tear')])[0]
assert.equal(tear.generate, false)
assert.match(tear.notes.join(), /pronunciationHint/)
const hinted = word('tear', { pronunciationHint: 'a drop of water that falls from your eye' })
assert.equal(plan([hinted])[0].generate, true)
assert.match(instructionsFor(hinted), /Say the word meaning a drop of water that falls from your eye\.$/)
assert.equal(instructionsFor(word('key')), instructions)

// Existing articulation recordings: reused only by choice, never regenerated, and offered as candidates.
const reused = plan([word('sun', { audio: 'words/sun.mp3' })], { 'words/sun.mp3': 'x' }, { only: ['sun'], force: true })[0]
assert.equal(reused.generate, false, 'A reused articulation recording is never overwritten')
assert.equal(reused.file, 'words/sun.mp3')
assert.match(plan([word('sun', { audio: 'sun.mp3' })])[0].notes.join(), /must look like words/)
const candidate = plan([word('sun')], { 'words/sun.mp3': 'x' })[0]
assert.equal(candidate.generate, false, 'A word with an articulation recording waits for a reuse decision')
assert.match(candidate.notes.join(), /words\/sun\.mp3 exists/)
assert.equal(plan([word('sun')], { 'words/sun.mp3': 'x' }, { only: ['sun'] })[0].generate, true, '--only generates it anyway')

// Marking reviewed needs a name and an existing recording; clearing keeps provenance.
const lexicon = [word('key'), word('tea')]
const files = { 'minimal-pairs/key.mp3': 'a' }
const review = options => setReview({ lexicon, records: {}, audioFile, exists: file => file in files, hash: file => files[file], ...options })
assert.throws(() => review({ ids: ['key'], by: ' ' }), /needs --by/)
assert.throws(() => review({ ids: ['tea'], by: 'Jana' }), /no recording/)
const generated = { 'minimal-pairs/key.mp3': { sha256: 'a', source: 'openai', model, voice, generatedOn: '2026-10-01' } }
let next = review({ ids: ['key'], by: 'Jana', on: '2026-10-13', records: generated })
assert.deepEqual(next['minimal-pairs/key.mp3'], { ...generated['minimal-pairs/key.mp3'], reviewedBy: 'Jana', reviewedOn: '2026-10-13' })
next = review({ ids: ['key'], records: next })
assert.deepEqual(next['minimal-pairs/key.mp3'], generated['minimal-pairs/key.mp3'], '--unreview clears only the review')
next = review({ ids: ['key'], by: 'Jana', on: '2026-10-13', records: { 'minimal-pairs/key.mp3': { ...generated['minimal-pairs/key.mp3'], sha256: 'old' } } })
assert.deepEqual(next['minimal-pairs/key.mp3'], { sha256: 'a', source: 'openai', reviewedBy: 'Jana', reviewedOn: '2026-10-13' }, 'Provenance of a different file is dropped')

// The records file is only ever written by the script, in its exact format.
assert.equal(fs.readFileSync('src/minimal-pairs/content/audio-records.ts', 'utf8'), recordsSource(records), 'audio-records.ts was edited by hand')
const compiled = ts.transpileModule(recordsSource(generated), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
assert.deepEqual((await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)).audioRecords, generated)

// The command, end to end, in a scratch copy of the content with fetch stubbed out.
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'minimal-pairs-audio-'))
const contentDir = path.join(scratch, 'src/minimal-pairs/content')
fs.cpSync('src/minimal-pairs/content', contentDir, { recursive: true })
fs.writeFileSync(path.join(contentDir, 'lexicon.ts'), `export const lexicon = ${JSON.stringify([word('fixture-a'), word('fixture-b'), word('tear')])}\n`)
fs.mkdirSync(path.join(scratch, 'public/audio/words'), { recursive: true })
const requests = path.join(scratch, 'requests.log')
fs.writeFileSync(path.join(scratch, 'no-fetch.mjs'), `globalThis.fetch = () => { throw new Error('fetch called') }\n`)
fs.writeFileSync(path.join(scratch, 'fake-fetch.mjs'), `import fs from 'node:fs'
globalThis.fetch = async (url, init) => { fs.appendFileSync(${JSON.stringify(requests)}, init.body + '\\n'); return new Response(new Uint8Array([73, 68, 51, 1])) }\n`)
const env = { ...process.env }
delete env.OPENAI_API_KEY
const run = (args, preload = 'no-fetch.mjs', extraEnv = {}) => spawnSync(process.execPath, ['--import', path.join(scratch, preload), path.resolve('scripts/minimal-pairs-audio.mjs'), ...args], { cwd: scratch, env: { ...env, ...extraEnv }, encoding: 'utf8' })
const recordsIn = async () => {
  const source = ts.transpileModule(fs.readFileSync(path.join(contentDir, 'audio-records.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  return (await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)).audioRecords
}

let result = run(['--dry-run'])
assert.equal(result.status, 0, result.stderr)
assert.match(result.stdout, /3 words: 0 reviewed, 0 unreviewed, 3 missing\. 2 to generate\./)
assert.match(result.stdout, /GENERATE {2}missing {5}fixture-a/)
assert.match(result.stdout, /tear[\s\S]*pronunciationHint/)
assert.ok(!fs.existsSync(path.join(scratch, 'public/audio/minimal-pairs')), 'A dry run writes nothing')

result = run([])
assert.equal(result.status, 1)
assert.match(result.stderr, /Set OPENAI_API_KEY/, 'Generation needs the key from the environment')

result = run(['--only=fixture-a'], 'fake-fetch.mjs', { OPENAI_API_KEY: 'test-key' })
assert.equal(result.status, 0, result.stderr)
assert.ok(fs.existsSync(path.join(scratch, 'public/audio/minimal-pairs/fixture-a.mp3')))
assert.ok(!fs.existsSync(path.join(scratch, 'public/audio/minimal-pairs/fixture-b.mp3')), '--only generates only the selected words')
const body = JSON.parse(fs.readFileSync(requests, 'utf8').trim())
assert.deepEqual({ model: body.model, voice: body.voice, input: body.input, format: body.response_format }, { model, voice, input: 'fixture-a', format: 'mp3' })
let saved = await recordsIn()
assert.equal(saved['minimal-pairs/fixture-a.mp3'].source, 'openai')
assert.equal(isReviewed(saved['minimal-pairs/fixture-a.mp3']), false, 'New recordings start unreviewed')

result = run(['--only=fixture-a'], 'no-fetch.mjs', { OPENAI_API_KEY: 'test-key' })
assert.equal(result.status, 0, 'An existing recording is skipped without calling OpenAI')

result = run(['--mark-reviewed=fixture-a'])
assert.equal(result.status, 1, 'Marking reviewed needs --by')
result = run(['--mark-reviewed=fixture-a', '--by=Jana'])
assert.equal(result.status, 0, result.stderr)
assert.equal(isReviewed((await recordsIn())['minimal-pairs/fixture-a.mp3']), true)

result = run(['--only=fixture-a', '--force'], 'fake-fetch.mjs', { OPENAI_API_KEY: 'test-key' })
assert.equal(result.status, 0, result.stderr)
saved = await recordsIn()
assert.equal(isReviewed(saved['minimal-pairs/fixture-a.mp3']), false, 'Regenerating clears the review')
assert.ok(!fs.readdirSync(path.join(scratch, 'public/audio/minimal-pairs')).some(file => file.endsWith('.tmp')))
result = run(['--mark-reviewed=all', '--by=Jana'])
assert.equal(result.status, 0, result.stderr)
assert.match(result.stdout, /Marked reviewed by Jana: fixture-a$/m, 'all covers every word with a recording, and only those')
assert.equal(isReviewed((await recordsIn())['minimal-pairs/fixture-a.mp3']), true)
fs.rmSync(scratch, { recursive: true, force: true })

// Playback in the center never falls back to browser text-to-speech.
const urls = new Map()
function moduleUrl(file) {
  if (!urls.has(file)) {
    const source = fs.readFileSync(file, 'utf8').replace(/from '(\.\.?\/[\w/-]+)'/g, (_, spec) => `from ${JSON.stringify(moduleUrl(path.join(path.dirname(file), `${spec}.ts`)))}`)
    const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
    urls.set(file, `data:text/javascript;base64,${Buffer.from(output).toString('base64')}`)
  }
  return urls.get(file)
}
let spoken = 0
const played = []
globalThis.window = { speechSynthesis: { cancel() {}, speak() { spoken++ }, getVoices: () => [] } }
globalThis.SpeechSynthesisUtterance = class {}
globalThis.Audio = class {
  constructor(src) { this.src = src; played.push(src) }
  play() { return this.src.includes('missing') ? Promise.reject(new Error('404')) : Promise.resolve() }
  pause() {}
}
const { playWordRecording } = await import(moduleUrl('src/minimal-pairs/playback.ts'))
assert.equal(await playWordRecording(word('key')), true)
assert.equal(played.at(-1), '/audio/minimal-pairs/key.mp3')
assert.equal(await playWordRecording(word('sun', { audio: 'words/sun.mp3' })), true)
assert.equal(played.at(-1), '/audio/words/sun.mp3')
assert.equal(await playWordRecording(word('missing')), false, 'A missing recording reports failure')
assert.equal(spoken, 0, 'No browser text-to-speech')

console.log('Minimal pairs audio checks passed: planning, selection, no overwrites, heteronym flags, reuse, review tracking, dry run, generation with stubbed fetch, and no speech fallback.')
