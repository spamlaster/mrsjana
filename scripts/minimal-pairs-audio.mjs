// Makes recordings for the Minimal Pairs Therapy Center with OpenAI text-to-speech: one per lexicon word,
// saved as public/audio/minimal-pairs/<word id>.mp3. See docs/minimal-pairs-audio.md.
// Generation calls a paid API: only run it when a generation run has been approved.
// Usage: npm run voice:minimal-pairs -- --dry-run                  report what each word needs; no API calls, no key needed
//        npm run voice:minimal-pairs -- --only=key,tea             generate these word ids if they have no recording
//        npm run voice:minimal-pairs                               generate every word that has no recording
//        npm run voice:minimal-pairs -- --only=key --force         replace a recording (clears its review)
//        npm run voice:minimal-pairs -- --mark-reviewed=key --by=Jana   once Jana has approved it
//        npm run voice:minimal-pairs -- --mark-reviewed=all --by=Jana   every word that has a recording
//        npm run voice:minimal-pairs -- --unreview=key
// Needs OPENAI_API_KEY in the environment or in .env.local, like npm run voice.
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// Same model and voice as the articulation recordings (scripts/generate-word-audio.mjs), so the site sounds consistent.
export const model = 'gpt-4o-mini-tts'
export const voice = 'nova'
export const instructions = 'You are a warm, friendly speech teacher modelling one word for a young child who is learning to hear the difference between similar words. Speak in a clear, natural General American English accent. Say the word once, slowly and clearly, with natural, cheerful intonation. Pronounce every sound fully, especially the first and last sounds: start the word cleanly, and release the final consonant so it can be heard, without adding an extra vowel. Do not exaggerate, stretch, or break the word into pieces. Say only the word.'
export const audioRoot = 'public/audio'
export const recordsFile = 'src/minimal-pairs/content/audio-records.ts'

// Words spelled the same but said differently. Text-to-speech would have to guess, so these
// are not generated until the lexicon entry has a pronunciationHint.
export const heteronyms = new Set(['bass', 'bow', 'close', 'content', 'desert', 'does', 'dove', 'lead', 'live', 'minute', 'object', 'polish', 'present', 'produce', 'project', 'read', 'record', 'refuse', 'row', 'sewer', 'sow', 'tear', 'use', 'wind', 'wound'])

export const slug = text => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
export const today = () => new Date().toLocaleDateString('en-CA')
export const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
export const instructionsFor = word => word.pronunciationHint ? `${instructions} Say the word meaning ${word.pronunciationHint.trim()}.` : instructions

// Load a TypeScript module from src/minimal-pairs/content, resolving its relative imports.
const urls = new Map()
function moduleUrl(file) {
  if (!urls.has(file)) {
    const source = fs.readFileSync(file, 'utf8').replace(/from '(\.\/[\w-]+)'/g, (_, spec) => `from ${JSON.stringify(moduleUrl(path.join(path.dirname(file), `${spec}.ts`)))}`)
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
    urls.set(file, `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
  }
  return urls.get(file)
}
export async function loadContent() {
  const { lexicon } = await import(moduleUrl('src/minimal-pairs/content/lexicon.ts'))
  const { audioRecords } = await import(moduleUrl(recordsFile))
  const { audioFile, isReviewed, reusableAudio } = await import(moduleUrl('src/minimal-pairs/content/audio.ts'))
  return { lexicon, records: audioRecords, audioFile, isReviewed, reusableAudio }
}

// What each word needs. Pure: file access comes in through exists() and hash().
// Returns one entry per word with status (reviewed, unreviewed, missing), whether it will be generated, and notes.
export function planAudio({ lexicon, records, audioFile, isReviewed, reusableAudio, exists, hash, only, force = false }) {
  if (force && !only) throw new Error('--force replaces recordings, so it needs --only=<word ids>.')
  const unknown = (only ?? []).filter(id => !lexicon.some(word => word.id === id))
  if (unknown.length) throw new Error(`Not in the lexicon: ${unknown.join(', ')}`)
  return lexicon.filter(word => !only || only.includes(word.id)).map(word => {
    const file = audioFile(word)
    const notes = []
    const present = exists(file)
    const record = records[file]
    const stale = present && record && record.sha256 !== hash(file)
    const status = !present ? 'missing' : isReviewed(record) && !stale ? 'reviewed' : 'unreviewed'
    if (stale) notes.push('file changed since its record was written; treated as unreviewed')
    let generate = !present || force
    if (word.audio !== undefined) {
      generate = false
      notes.push(reusableAudio.test(word.audio) ? `reuses articulation recording${present ? '' : ' (missing)'}; remove the audio field to give it its own recording` : `audio must look like words/<name>.mp3, not ${word.audio}`)
    } else if (heteronyms.has(word.text.toLowerCase()) && !word.pronunciationHint) {
      generate = false
      notes.push('has more than one pronunciation or meaning: add a pronunciationHint before generating')
    } else if (!present && !only && exists(`words/${slug(word.text)}.mp3`)) {
      generate = false
      notes.push(`articulation recording words/${slug(word.text)}.mp3 exists: reuse it (set audio, after Jana listens) or generate with --only=${word.id}`)
    }
    if (generate && present) notes.push('will be replaced; its review will be cleared')
    return { id: word.id, text: word.text, file, status, generate, notes, word }
  })
}

export function recordsSource(records) {
  const sorted = Object.fromEntries(Object.keys(records).sort().map(file => [file, records[file]]))
  return `// Written by scripts/minimal-pairs-audio.mjs. Do not edit by hand.\nimport type { AudioRecord } from './types'\n\nexport const audioRecords: Record<string, AudioRecord> = ${JSON.stringify(sorted, null, 2)}\n`
}

// Marks recordings reviewed (by is required) or clears their review. Returns the new records.
export function setReview({ ids, lexicon, records, audioFile, exists, hash, by, on = today() }) {
  if (by !== undefined && !String(by).trim()) throw new Error('--mark-reviewed needs --by=<who listened>.')
  const next = { ...records }
  for (const id of ids) {
    const word = lexicon.find(item => item.id === id)
    if (!word) throw new Error(`Not in the lexicon: ${id}`)
    const file = audioFile(word)
    if (by === undefined) {
      if (next[file]) { next[file] = { ...next[file] }; delete next[file].reviewedBy; delete next[file].reviewedOn }
      continue
    }
    if (!exists(file)) throw new Error(`${id} has no recording at ${file}`)
    const sha = hash(file)
    // Keep provenance only if the file is still the one it describes.
    const known = next[file]?.sha256 === sha ? next[file] : { sha256: sha, source: word.audio ? 'existing' : 'openai' }
    next[file] = { ...known, reviewedBy: String(by).trim(), reviewedOn: on }
  }
  return next
}

async function generate(word, file, key, attempt = 1) {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, voice, input: word.text, instructions: instructionsFor(word), response_format: 'mp3' }),
  })
  if ((response.status === 429 || response.status >= 500) && attempt < 5) {
    await new Promise(resolve => setTimeout(resolve, attempt * 2000))
    return generate(word, file, key, attempt + 1)
  }
  if (!response.ok) throw new Error(`${word.id}: ${response.status} ${await response.text()}`)
  // Write to a temporary file first so a failed request never leaves a half-written recording.
  fs.writeFileSync(`${file}.tmp`, Buffer.from(await response.arrayBuffer()))
  fs.renameSync(`${file}.tmp`, file)
}

function printReport(plan) {
  const counts = ['reviewed', 'unreviewed', 'missing'].map(status => `${plan.filter(entry => entry.status === status).length} ${status}`)
  console.log(`${plan.length} words: ${counts.join(', ')}. ${plan.filter(entry => entry.generate).length} to generate.`)
  for (const entry of plan) {
    const action = entry.generate ? 'GENERATE' : '        '
    console.log(`  ${action}  ${entry.status.padEnd(10)}  ${entry.id.padEnd(16)}  ${entry.file}${entry.notes.map(note => `\n              ${note}`).join('')}`)
  }
}

async function main() {
  const args = Object.fromEntries(process.argv.slice(2).map(arg => arg.replace(/^--/, '').split('=')).map(([name, value]) => [name, value ?? true]))
  const list = value => typeof value === 'string' ? value.split(',').map(id => id.trim()).filter(Boolean) : undefined
  const content = await loadContent()
  const exists = file => fs.existsSync(path.join(audioRoot, file))
  const hash = file => sha256(path.join(audioRoot, file))
  const writeRecords = records => fs.writeFileSync(recordsFile, recordsSource(records))

  if (args['mark-reviewed'] || args.unreview) {
    const ids = args['mark-reviewed'] === 'all'
      ? content.lexicon.filter(word => exists(content.audioFile(word))).map(word => word.id)
      : list(args['mark-reviewed'] || args.unreview)
    const by = args['mark-reviewed'] ? (typeof args.by === 'string' ? args.by : '') : undefined
    writeRecords(setReview({ ...content, ids, exists, hash, by }))
    console.log(`${args['mark-reviewed'] ? `Marked reviewed by ${by}` : 'Cleared review for'}: ${ids.join(', ')}`)
    return
  }

  const plan = planAudio({ ...content, exists, hash, only: list(args.only), force: Boolean(args.force) })
  printReport(plan)
  const queue = plan.filter(entry => entry.generate)
  if (args['dry-run'] || !queue.length) return
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('Set OPENAI_API_KEY (or add it to .env.local) first.')

  console.log(`Generating ${queue.length} recordings with ${model}, voice "${voice}"…`)
  fs.mkdirSync(path.join(audioRoot, 'minimal-pairs'), { recursive: true })
  const records = { ...content.records }
  const failed = []
  await Promise.all(Array.from({ length: 4 }, async () => {
    for (let entry = queue.shift(); entry; entry = queue.shift()) {
      try {
        await generate(entry.word, path.join(audioRoot, entry.file), key)
        // A new recording always starts unreviewed.
        records[entry.file] = { sha256: hash(entry.file), source: 'openai', model, voice, generatedOn: today() }
        writeRecords(records)
        console.log(`  ✓ ${entry.id}`)
      } catch (error) { failed.push(entry.id); console.error(`  ✗ ${error.message}`) }
    }
  }))
  console.log(failed.length ? `Done with ${failed.length} failures: ${failed.join(', ')}. Run again to retry.` : 'Done. New recordings are unreviewed until Jana listens to them.')
  if (failed.length) process.exitCode = 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exit(1) })
}
