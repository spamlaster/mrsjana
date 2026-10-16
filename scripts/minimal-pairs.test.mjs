import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

// Load src/minimal-pairs/content as data URLs, resolving its relative imports.
const urls = new Map()
function moduleUrl(file) {
  if (!urls.has(file)) {
    const source = fs.readFileSync(file, 'utf8').replace(/from '(\.\/[\w-]+)'/g, (_, spec) => `from ${JSON.stringify(moduleUrl(path.join(path.dirname(file), `${spec}.ts`)))}`)
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
    urls.set(file, `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
  }
  return urls.get(file)
}
const content = file => import(moduleUrl(`src/minimal-pairs/content/${file}.ts`))
const { processes, approvedSBlends } = await content('processes')
const { library, rolesFor, pairsFor, soundsFor, positionsFor, playableProcesses, isPlayable, isUsable, pairStatus, contrastPosition, errorSoundsFor, pairsForProcess, getWord } = await content('selectors')
const { validateLibrary } = await content('validate')
const { assetReadiness, listeningReady, pairListeningReady } = await content('readiness')
const { rejectedPictures, pictureCautions } = await content('picture-audit')
const { audioRecords } = await content('audio-records')
const { audioFile, isReviewed, isAudioReviewed, hasRecording, canPlayRecording } = await content('audio')
const { illustrationRecords } = await content('illustration-records')
const { illustrationDir, illustrationFile, hasIllustration, pictureSource } = await content('illustrations')

// Picture keys WordPicture can draw: the property names of its `pictures` and `emojiMap` objects.
function wordPictureKeys() {
  const file = 'src/components/WordPicture.tsx'
  const sourceFile = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const keys = new Set()
  sourceFile.forEachChild(function visit(node) {
    if (ts.isVariableDeclaration(node) && ['pictures', 'emojiMap'].includes(node.name.getText()) && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
      for (const property of node.initializer.properties) if (property.name) keys.add(property.name.getText().replace(/^['"]|['"]$/g, ''))
    }
    node.forEachChild(visit)
  })
  return keys
}
const pictureKeys = wordPictureKeys()
assert.ok(pictureKeys.has('car') && pictureKeys.size > 100, 'WordPicture keys could not be read')

// An illustration counts only when its record matches the file on disk, never because the file name is expected.
const illustrationOnDisk = id => {
  const file = path.join('public', illustrationFile({ id }))
  return Boolean(illustrationRecords[id]) && fs.existsSync(file) && crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') === illustrationRecords[id].sha256
}
const assets = { hasPicture: key => pictureKeys.has(key), hasIllustration: illustrationOnDisk, hasAudio: file => fs.existsSync(path.join('public/audio', file)) }

// The real library must be clinically valid. Missing assets are reported, not failed.
assert.deepEqual(validateLibrary(), [], 'The curated library must pass validation')
const readiness = assetReadiness(assets)

// Audio review records. A reviewed record must still describe its file, or the review would cover a different recording.
for (const [file, record] of Object.entries(audioRecords)) {
  const full = path.join('public/audio', file)
  const current = fs.existsSync(full) && crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex') === record.sha256
  if (isReviewed(record)) assert.ok(current, `${file} changed or disappeared after Jana reviewed it: listen again and re-run --mark-reviewed, or run --unreview`)
  assert.ok(/^(minimal-pairs|words)\/[a-z0-9-]+\.mp3$/.test(file), `${file} is not a recording path`)
}

// Illustration records. Each must describe its file exactly, and each PNG in the folder must have a record,
// or the app would show a file nobody checked or point at one that is gone. Fix with npm run images:minimal-pairs.
for (const [id, record] of Object.entries(illustrationRecords)) {
  assert.ok(library.lexicon.some(item => item.id === id), `Illustration record ${id} is not a lexicon word`)
  assert.ok(illustrationOnDisk(id), `${illustrationFile({ id })} is missing or changed since it was recorded: run npm run images:minimal-pairs`)
  assert.ok(record.width === record.height && record.width >= 512 && record.width <= 1024, `${id} illustration has an unsupported size`)
}
const illustrationFolder = path.join('public', illustrationDir)
for (const name of fs.existsSync(illustrationFolder) ? fs.readdirSync(illustrationFolder).filter(name => !name.startsWith('.')) : []) {
  assert.ok(illustrationRecords[name.replace(/\.png$/, '')] && name.endsWith('.png'), `public/${illustrationDir}/${name} is not linked: run npm run images:minimal-pairs`)
}

// Process rules (checks 6, 7, 8).
const rulesOf = id => processes.find(process => process.id === id).rules
const fronting = rulesOf('fronting').map(rule => `${rule.target}>${rule.error}`).sort()
const backing = rulesOf('backing').map(rule => `${rule.error}>${rule.target}`).sort()
assert.deepEqual(backing, fronting, 'Backing must reverse the Fronting rules')
assert.deepEqual(rulesOf('stopping').map(rule => `${rule.target}>${rule.error}`).sort(), ['f>p', 's>t', 'sh>t', 'th>p', 'th>t'], 'Stopping has exactly the approved contrasts')
assert.ok(!rulesOf('stopping').some(rule => ['ch', 'jh'].some(sound => rule.target.includes(sound))), 'Affricates are never Stopping')
assert.deepEqual(rulesOf('fronting').map(rule => `${rule.target}>${rule.error}`).sort(), ['g>d', 'k>t'], 'Fronting is only /k/→/t/ and /g/→/d/')
assert.deepEqual(rulesOf('deaffrication'), [{ target: ['ch'], error: ['t'], positions: ['initial', 'final'] }], 'Deaffrication is only /ch/ → /t/, initial and final')
assert.deepEqual(approvedSBlends.map(blend => blend.join('')), ['st', 'sn', 'sm', 'sw', 'sk', 'sl'], 'The approved s-blends')
assert.deepEqual(rulesOf('cluster-reduction').map(rule => rule.target.join('')), ['st', 'sn', 'sm', 'sw', 'sk', 'sl'])
for (const rule of rulesOf('cluster-reduction')) assert.deepEqual(rule.positions, ['initial'], 'Cluster Reduction is initial only')
for (const process of processes) for (const rule of process.rules) {
  assert.ok(rule.positions.every(position => ['initial', 'final'].includes(position)), `${process.id} uses initial and final positions only`)
}

// Phoneme matching.
const rule = (target, error) => ({ target, error, positions: ['initial', 'final'] })
assert.equal(contrastPosition(['k', 'iy'], ['t', 'iy'], rule(['k'], ['t'])), 'initial')
assert.equal(contrastPosition(['b', 'ae', 'k'], ['b', 'ae', 't'], rule(['k'], ['t'])), 'final')
assert.equal(contrastPosition(['b', 'ah', 'k', 'ih', 'ng'], ['b', 'ah', 't', 'ih', 'ng'], rule(['k'], ['t'])), null, 'Medial contrasts are not supported')
assert.equal(contrastPosition(['s', 'n', 'ow'], ['n', 'ow'], rule(['s', 'n'], ['n'])), 'initial')
assert.equal(contrastPosition(['k', 'iy'], ['t', 'uw'], rule(['k'], ['t'])), null, 'Any other difference rejects the pair')
assert.equal(contrastPosition(['k', 'iy'], ['t', 'iy'], rule(['g'], ['d'])), null)

// Fixtures: test-only records exercising the checks, never content. Their words are placeholders, not therapy vocabulary.
const word = (id, phonemes, extra = {}) => ({ id, text: `fixture ${id}`, phonemes, phonemesReviewed: true, imageAlt: id, picture: 'car', ...extra })
const approval = { by: 'Fixture Therapist', on: '2026-01-01' }
const fixture = (pairs, extraWords = []) => ({
  processes,
  lexicon: [
    word('k-word', ['k', 'iy']), word('t-word', ['t', 'iy']),
    word('s-word', ['s', 'iy']), word('ch-word', ['ch', 'iy']),
    word('sn-word', ['s', 'n', 'ow']), word('n-word', ['n', 'ow']),
    word('final-k', ['b', 'ae', 'k']), word('final-t', ['b', 'ae', 't']),
    word('th-word', ['th', 'ih', 'n']), word('p-word', ['p', 'ih', 'n']), word('tin-word', ['t', 'ih', 'n']),
    word('final-ch', ['m', 'ae', 'ch']), word('final-t2', ['m', 'ae', 't']),
    ...extraWords,
  ],
  pairs,
})
const pair = (id, words, contrast, position, processIds, extra = {}) => ({ id, words, contrast, position, processes: processIds, approval, ...extra })
const kt = pair('k-t', ['k-word', 't-word'], ['k', 't'], 'initial', ['fronting', 'backing'])
const st = pair('s-t', ['s-word', 't-word'], ['s', 't'], 'initial', ['stopping'])
const cht = pair('ch-t', ['ch-word', 't-word'], ['ch', 't'], 'initial', ['deaffrication'])
const snn = pair('sn-n', ['sn-word', 'n-word'], ['sn', 'n'], 'initial', ['cluster-reduction'])
const finalKt = pair('final-k-t', ['final-k', 'final-t'], ['k', 't'], 'final', ['fronting', 'backing'])
const thp = pair('th-p', ['th-word', 'p-word'], ['th', 'p'], 'initial', ['stopping'])
const finalCht = pair('final-ch-t', ['final-ch', 'final-t2'], ['ch', 't'], 'final', ['deaffrication'])
const valid = fixture([kt, st, cht, snn, finalKt, thp, finalCht])
assert.deepEqual(validateLibrary(valid), [], 'Valid fixtures pass')
const fails = (lib, pattern, message) => assert.ok(validateLibrary(lib).some(problem => pattern.test(problem)), `${message}: ${validateLibrary(lib).join('; ') || 'no problems found'}`)

// 1. Unique identifiers.
fails(fixture([kt, { ...st, id: 'k-t' }]), /Duplicate pair id k-t/, 'Duplicate pair ids fail')
fails(fixture([kt], [word('k-word', ['k', 'ey'])]), /Duplicate word id k-word/, 'Duplicate word ids fail')
fails(fixture([kt, { ...kt, id: 'again' }]), /paired more than once/, 'The same two words cannot be paired twice')

// 2 and 3. Pairs reference two existing lexicon words.
fails(fixture([pair('ghost', ['k-word', 'missing'], ['k', 't'], 'initial', ['fronting', 'backing'])]), /missing words missing/, 'Missing words fail')
fails(fixture([pair('self', ['k-word', 'k-word'], ['k', 't'], 'initial', ['fronting', 'backing'])]), /with itself/, 'A word cannot pair with itself')
fails(fixture([], [word('typo', ['k', 'xx'])]), /unknown phonemes xx/, 'Unknown phonemes fail')

// 4. Words differ only by the intended contrast.
fails(fixture([pair('two-changes', ['k-word', 'tin-word'], ['k', 't'], 'initial', ['fronting', 'backing'])]), /differ only/, 'Extra differences fail')
fails(fixture([{ ...thp, contrast: ['th', 't'] }]), /th\/t contrast under stopping/, 'A declared contrast must be the one the words show')

// 5. Correct process and position.
fails(fixture([{ ...kt, position: 'final' }]), /not a final k\/t contrast/, 'A wrong position fails')
fails(fixture([{ ...st, processes: ['fronting'] }]), /under fronting/, 'A wrong process fails')
fails(fixture([pair('final-cluster', ['n-word', 'sn-word'], ['sn', 'n'], 'final', ['cluster-reduction'])]), /not a final sn\/n contrast/, 'Cluster Reduction is initial only')
fails(fixture([{ ...kt, position: 'medial' }]), /invalid position medial/, 'Medial pairs are not supported')
fails(fixture([pair('medial-k-t', ['medial-k', 'medial-t'], ['k', 't'], 'initial', ['fronting', 'backing'])], [word('medial-k', ['b', 'ah', 'k', 'ih', 'ng']), word('medial-t', ['b', 'ah', 't', 'ih', 'ng'])]), /differ only/, 'A medial contrast fits no position')

// 6. Fronting and Backing share a record with reversed roles.
assert.equal(rolesFor(kt, 'fronting', 'k', valid).target.id, 'k-word')
assert.equal(rolesFor(kt, 'fronting', 'k', valid).contrast.id, 't-word')
assert.equal(rolesFor(kt, 'backing', 't', valid).target.id, 't-word')
assert.equal(rolesFor(kt, 'backing', 't', valid).contrast.id, 'k-word')
assert.equal(rolesFor(finalKt, 'backing', 't', valid).target.id, 'final-t')
assert.equal(rolesFor(kt, 'fronting', 't', valid), null, '/t/ is not a Fronting target')
fails(fixture([{ ...kt, processes: ['fronting'] }]), /also fits backing/, 'A Fronting pair must also serve Backing')
assert.deepEqual(pairsFor('fronting', 'k', 'initial', valid).map(item => item.id), ['k-t'])
assert.deepEqual(pairsFor('backing', 't', 'initial', valid).map(item => item.id), ['k-t'])

// 7. Deaffrication is never Stopping.
assert.equal(rolesFor({ ...cht, processes: ['stopping'] }, 'stopping', 'ch', valid), null)
assert.deepEqual(soundsFor('stopping', valid).sort(), ['s', 'th'])
assert.deepEqual(soundsFor('deaffrication', valid), ['ch'])
assert.deepEqual(positionsFor('deaffrication', 'ch', valid), ['initial', 'final'])
assert.equal(rolesFor(finalCht, 'deaffrication', 'ch', valid).target.id, 'final-ch')
fails(fixture([{ ...cht, processes: ['stopping'] }]), /under stopping/, 'A /ch/–/t/ pair cannot be listed under Stopping')
const chStopping = processes.map(process => process.id === 'stopping' ? { ...process, rules: [...process.rules, rule(['ch'], ['t'])] } : process)
fails({ ...valid, processes: chStopping }, /Stopping must not contain affricate/, 'Stopping cannot gain a /ch/ rule')

// 8. Cluster Reduction uses only approved initial s-blends.
assert.equal(rolesFor(snn, 'cluster-reduction', 'sn', valid).target.id, 'sn-word')
const unapprovedBlend = processes.map(process => process.id === 'cluster-reduction' ? { ...process, rules: [...process.rules, { target: ['s', 'r'], error: ['r'], positions: ['initial'] }] } : process)
fails({ ...valid, processes: unapprovedBlend }, /approved s-blend/, 'Unapproved blends fail')
const spBlend = processes.map(process => process.id === 'cluster-reduction' ? { ...process, rules: [...process.rules, { target: ['s', 'p'], error: ['p'], positions: ['initial'] }] } : process)
fails({ ...valid, processes: spBlend }, /approved s-blend/, '/sp/ is not an approved blend')
const finalBlend = processes.map(process => process.id === 'cluster-reduction' ? { ...process, rules: [{ ...process.rules[0], positions: ['initial', 'final'] }] } : process)
fails({ ...valid, processes: finalBlend }, /initial position only/, 'Blends are initial only')

// 9. Unapproved pairs never appear in playable selectors.
const unapproved = fixture([{ ...kt, approval: undefined }, { ...st, approval: { by: ' ', on: '2026-01-01' } }, cht])
assert.deepEqual(pairsFor('fronting', 'k', 'initial', unapproved), [])
assert.deepEqual(pairsFor('stopping', 's', 'initial', unapproved), [])
assert.deepEqual(playableProcesses(unapproved).map(process => process.id), ['deaffrication'])
assert.deepEqual(positionsFor('fronting', 'k', unapproved), [])
for (const process of playableProcesses(library)) for (const sound of soundsFor(process.id)) for (const position of positionsFor(process.id, sound)) {
  assert.ok(pairsFor(process.id, sound, position).every(isPlayable), 'The real library offers approved pairs only')
}
if (!library.pairs.some(isPlayable)) assert.deepEqual(playableProcesses(library), [], 'With no approved pairs nothing is playable')
fails(fixture([{ ...kt, approval: { by: 'Someone', on: 'yesterday' } }]), /YYYY-MM-DD/, 'Approval needs a real date')
const unchecked = valid.lexicon.map(item => item.id === 't-word' ? { ...item, phonemesReviewed: false } : item)
fails({ ...valid, lexicon: unchecked }, /transcription of t-word has not been checked/, 'Approval requires checked transcriptions')
assert.deepEqual(validateLibrary({ ...valid, lexicon: unchecked, pairs: [{ ...kt, approval: undefined }] }), [], 'Unchecked transcriptions are fine before approval')

// 10. Asset readiness is reported separately from clinical validation.
// Fixture recordings: every file exists and is reviewed unless its name says otherwise.
const fixtureAssets = { hasPicture: assets.hasPicture, hasIllustration: id => id.includes('illustrated'), hasAudio: file => !file.includes('missing'), isReviewed: file => !file.includes('unreviewed') }
const withWord = (id, change) => ({ ...valid, lexicon: valid.lexicon.map(item => item.id === id ? { ...item, ...change } : item) })
const issues = lib => assetReadiness(fixtureAssets, lib).map(item => `${item.pairId}:${item.wordId}:${item.issue}`)
assert.deepEqual(issues(valid), [], 'Fixture assets are ready')
assert.equal(audioFile(valid.lexicon[0]), 'minimal-pairs/k-word.mp3', 'A word records to minimal-pairs/<id>.mp3 by default')
assert.equal(audioFile({ ...valid.lexicon[0], audio: 'words/car.mp3' }), 'words/car.mp3', 'A reused articulation recording keeps its path')
for (const change of [{ picture: 'not-a-picture' }, { picture: undefined }, { id: 'missing-k' }, { audio: 'words/missing.mp3' }, { audio: 'Car Sound.wav' }, { id: 'unreviewed-k' }]) {
  const changed = withWord('k-word', change)
  const lib = change.id ? { ...changed, pairs: [{ ...kt, words: [change.id, 't-word'] }] } : changed
  assert.deepEqual(validateLibrary(lib), [], `Missing assets never fail clinical validation: ${JSON.stringify(change)}`)
}
const renamed = (id, newId) => { const lib = withWord(id, { id: newId }); return { ...lib, pairs: lib.pairs.map(item => ({ ...item, words: item.words.map(w => w === id ? newId : w) })) } }
assert.deepEqual(issues(withWord('k-word', { picture: 'not-a-picture' })), ['k-t:k-word:no-picture'])
assert.deepEqual(issues(withWord('k-word', { picture: undefined })), ['k-t:k-word:no-picture'])
assert.deepEqual(issues(renamed('t-word', 'missing-t')).sort(), ['ch-t:missing-t:no-audio', 'k-t:missing-t:no-audio', 's-t:missing-t:no-audio'])
assert.deepEqual(issues(withWord('k-word', { audio: 'words/missing.mp3' })), ['k-t:k-word:no-audio'], 'A missing reused recording is reported')
assert.deepEqual(issues(withWord('k-word', { audio: 'Car Sound.wav' })), ['k-t:k-word:no-audio'], 'A malformed audio path is reported')
assert.deepEqual(issues(withWord('k-word', { audio: 'minimal-pairs/other.mp3' })), ['k-t:k-word:no-audio'], 'Only articulation recordings can be reused')
assert.deepEqual(issues(renamed('k-word', 'unreviewed-k')), ['k-t:unreviewed-k:audio-not-reviewed'])
assert.deepEqual(assetReadiness({ hasPicture: () => true, hasAudio: () => true }, valid).map(item => item.issue)[0], 'audio-not-reviewed', 'Without a review record, audio is unreviewed')
assert.equal(assetReadiness(fixtureAssets, { ...valid, pairs: [{ ...kt, approval: undefined }], lexicon: valid.lexicon.map(item => ({ ...item, picture: undefined })) })[0].approved, false, 'Readiness covers unapproved pairs too')
const unreviewed = assetReadiness(fixtureAssets, renamed('k-word', 'unreviewed-k'))
assert.equal(listeningReady('k-t', unreviewed), false, 'Listening needs reviewed audio')
assert.equal(listeningReady('s-t', unreviewed), true)
fails(fixture([], [word('Bad_Id', ['k', 'ey'])]), /must be lowercase letters, digits, and hyphens/, 'Word ids must be safe file names')
fails(fixture([], [word('blank-hint', ['k', 'ey'], { pronunciationHint: ' ' })]), /empty pronunciation hint/, 'Pronunciation hints cannot be blank')

// Preview versus clinical approval. Accepted-for-development pairs are usable only in preview mode;
// drafts never; approved pairs always.
const accepted = { ...kt, id: 'accepted', approval: undefined, acceptedForDevelopment: true }
const draft = { ...st, id: 'draft', approval: undefined }
const modes = fixture([accepted, draft, cht])
assert.deepEqual([accepted, draft, cht].map(pairStatus), ['accepted-for-development', 'draft', 'approved'])
assert.ok(!isUsable(accepted) && isUsable(accepted, true), 'Accepted pairs need preview mode')
assert.ok(!isUsable(draft, true), 'Drafts are never usable, even in preview')
assert.ok(isUsable(cht) && isUsable(cht, true), 'Approved pairs are always usable')
assert.deepEqual(pairsFor('fronting', 'k', 'initial', modes), [], 'Production never offers an unapproved pair')
assert.deepEqual(pairsFor('fronting', 'k', 'initial', modes, true).map(item => item.id), ['accepted'])
assert.deepEqual(pairsFor('backing', 't', 'initial', modes, true).map(item => item.id), ['accepted'], 'Preview keeps Fronting/Backing role reversal')
assert.deepEqual(pairsFor('stopping', 's', 'initial', modes, true), [])
assert.deepEqual(playableProcesses(modes).map(process => process.id), ['deaffrication'])
assert.deepEqual(playableProcesses(modes, true).map(process => process.id).sort(), ['backing', 'deaffrication', 'fronting'])
assert.deepEqual(validateLibrary(modes), [], 'Accepting a pair for development does not change clinical validation')

// The real library: every pair accepted for development and approved, every transcription checked.
assert.ok(library.pairs.every(item => item.acceptedForDevelopment === true), 'All curated pairs are accepted for development')
assert.ok(library.pairs.every(item => item.approval), 'Every pair is approved')
assert.ok(library.lexicon.every(item => item.phonemesReviewed), 'Every transcription is marked checked')
assert.equal(playableProcesses(library).length, 5, 'Outside preview, all five processes have approved pairs')
assert.equal(playableProcesses(library, true).length, 5, 'In preview, all five processes have pairs')
const perProcess = Object.fromEntries(processes.map(process => [process.id, pairsForProcess(process.id, library, true).length]))
assert.deepEqual(perProcess, { fronting: 28, backing: 28, stopping: 37, 'cluster-reduction': 31, deaffrication: 7 })
assert.equal(library.pairs.length, 103)
assert.equal(library.lexicon.length, 182)
assert.deepEqual(errorSoundsFor('stopping', 'th'), ['t', 'p'])
assert.deepEqual(soundsFor('stopping', library, true).sort(), ['f', 's', 'sh', 'th'])
assert.deepEqual(positionsFor('cluster-reduction', 'sk', library, true), ['initial'])
assert.equal(rolesFor(library.pairs.find(item => item.id === 'gear-deer'), 'backing', 'd').target.id, 'deer')

// Curated decisions stay in place.
const pairIds = library.pairs.map(item => item.id)
for (const removed of ['moth-mop', 'dug-dud', 'tag-tad', 'gear-dear']) assert.ok(!pairIds.includes(removed), `${removed} stays excluded`)
for (const word of ['moth', 'mop', 'dug', 'dud', 'tag', 'tad', 'dear']) assert.ok(!library.lexicon.some(item => item.id === word), `${word} is not in the lexicon`)
for (const word of library.lexicon) assert.ok(library.pairs.some(item => item.words.includes(word.id)), `${word.id} is used by a pair`)
const lexiconWord = id => library.lexicon.find(item => item.id === id)
assert.equal(lexiconWord('deer').pronunciationHint, 'the animal')
assert.match(lexiconWord('fat').pictureRequirement, /never a person/)
assert.match(lexiconWord('thin').pictureRequirement, /never a person/)

// Picture audit: only pictures that identify the word are linked, and every link resolves.
for (const word of library.lexicon) {
  if (word.picture) assert.ok(pictureKeys.has(word.picture), `${word.id} links a WordPicture that exists`)
  assert.ok(!(word.picture && word.emoji), `${word.id} has one picture source`)
  assert.ok(!(word.picture && rejectedPictures[word.picture]), `${word.id} must not link the rejected picture: ${rejectedPictures[word.picture]}`)
}
for (const id of Object.keys(rejectedPictures)) assert.ok(pictureKeys.has(id) && lexiconWord(id), `${id} is a real WordPicture entry for a library word`)
for (const id of Object.keys(pictureCautions)) assert.ok(lexiconWord(id)?.picture || lexiconWord(id)?.emoji, `${id} has the picture its caution describes`)
const emojiWord = { ...valid.lexicon[0], picture: undefined, emoji: '🔑' }
assert.deepEqual(assetReadiness(fixtureAssets, withWord('k-word', { picture: undefined, emoji: '🔑' })).map(item => item.issue), [], 'An emoji counts as a picture')
assert.equal(emojiWord.emoji, '🔑')
// Custom illustrations: they count as the picture, take priority over WordPicture and emoji, and only a record makes one exist.
const illustratedOnly = renamed('k-word', 'illustrated-k')
assert.deepEqual(issues({ ...illustratedOnly, lexicon: illustratedOnly.lexicon.map(item => item.id === 'illustrated-k' ? { ...item, picture: undefined } : item) }), [], 'An illustration counts as a picture')
const plain = { ...valid.lexicon[0], picture: undefined }
const record = { sha256: 'a'.repeat(64), width: 512, height: 512 }
assert.equal(illustrationFile(plain), 'images/minimal-pairs/k-word.png', 'Illustrations are named by word id')
assert.ok(!hasIllustration(plain, {}), 'A word has no illustration without a record, whatever files exist')
assert.ok(hasIllustration(plain, { 'k-word': record }))
assert.deepEqual([pictureSource(valid.lexicon[0], { 'k-word': record }), pictureSource({ ...plain, emoji: '🔑' }, { 'k-word': record })], ['illustration', 'illustration'], 'An illustration comes first')
assert.deepEqual([pictureSource(valid.lexicon[0], {}), pictureSource({ ...plain, emoji: '🔑' }, {}), pictureSource(plain, {})], ['picture', 'emoji', 'placeholder'])
assert.deepEqual(assetReadiness({ ...fixtureAssets, hasIllustration: () => false }, withWord('k-word', { picture: undefined })).map(item => item.issue), ['no-picture'], 'A missing illustration file is reported')
assert.deepEqual(assetReadiness({ hasPicture: () => true, hasAudio: () => true, isReviewed: () => true }, withWord('k-word', { picture: undefined })).map(item => item.issue), ['no-picture'], 'By default only illustration-records.ts makes an illustration exist')
fails(fixture([], [word('blank-emoji', ['k', 'ey'], { emoji: ' ' })]), /empty emoji/, 'Emoji cannot be blank')

// Recordings: production plays reviewed ones only; preview also plays unreviewed ones; nothing plays without a file.
const records = { 'minimal-pairs/k-word.mp3': { sha256: 'x', source: 'openai' }, 'minimal-pairs/t-word.mp3': { sha256: 'y', source: 'openai', reviewedBy: 'Jana', reviewedOn: '2026-01-01' } }
const [kWord, tWord, sWord] = valid.lexicon
assert.ok(hasRecording(kWord, records) && !hasRecording(sWord, records))
assert.ok(!canPlayRecording(kWord, false, records) && canPlayRecording(kWord, true, records), 'Unreviewed audio plays in preview only')
assert.ok(canPlayRecording(tWord, false, records), 'Reviewed audio plays everywhere')
assert.ok(!canPlayRecording(sWord, true, records), 'Missing audio never plays')
assert.ok(hasRecording({ ...sWord, audio: 'words/sun.mp3' }, records), 'A reused articulation recording counts as a recording')

// Listening readiness on the real library: a pair is ready only when both words have reviewed recordings and pictures.
for (const item of library.pairs.filter(pair => pairListeningReady(pair))) {
  for (const id of item.words) assert.ok(isAudioReviewed(audioFile(getWord(id))), `${item.id} is listening-ready, so ${id} has a reviewed recording`)
}
const allReady = { hasPicture: () => true, hasAudio: () => true, isReviewed: () => true }
assert.ok(pairListeningReady(library.pairs.find(item => item.id === 'key-tea'), library, allReady))
assert.ok(!pairListeningReady(library.pairs.find(item => item.id === 'car-tar'), library, { ...allReady, hasIllustration: () => false }), 'A placeholder picture blocks listening')

const approvedCount = library.pairs.filter(isPlayable).length
console.log(`Minimal pairs content checks passed (${library.lexicon.length} words, ${library.pairs.length} pairs, ${approvedCount} approved, ${library.pairs.filter(item => item.acceptedForDevelopment).length} accepted for development).`)
if (readiness.length) {
  console.log(`Asset readiness: ${readiness.length} item(s) outstanding (not a failure):`)
  for (const item of readiness) console.log(`  ${item.approved ? 'approved' : 'pending '}  ${item.pairId}  ${item.wordId}  ${item.issue}`)
} else console.log('Asset readiness: nothing outstanding.')
