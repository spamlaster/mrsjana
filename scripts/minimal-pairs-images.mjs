// Links custom illustrations for the Minimal Pairs Therapy Center. See docs/minimal-pairs-images.md.
// Checks every file in public/images/minimal-pairs/ and records each valid <word id>.png in
// src/minimal-pairs/content/illustration-records.ts. The app shows only recorded illustrations,
// so a file is never used just because it has the expected name. This command never creates images.
// Usage: npm run images:minimal-pairs                 check the files, update the records, print the report
//        npm run images:minimal-pairs -- --check      check and report only; fails if the records are out of date
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

export const publicRoot = 'public'
export const recordsFile = 'src/minimal-pairs/content/illustration-records.ts'

export const sha256 = buffer => crypto.createHash('sha256').update(buffer).digest('hex')

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
  const { illustrationRecords } = await import(moduleUrl(recordsFile))
  const { illustrationDir, illustrationFile, illustrationSpec, pictureSource } = await import(moduleUrl('src/minimal-pairs/content/illustrations.ts'))
  return { lexicon, records: illustrationRecords, illustrationDir, illustrationFile, illustrationSpec, pictureSource }
}

// Width and height from a PNG's IHDR chunk, or null if the bytes are not a PNG.
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
export function pngSize(buffer) {
  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(pngSignature) || buffer.toString('latin1', 12, 16) !== 'IHDR') return null
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}

// Checks one file in the illustration folder. Returns { id, record } for a usable illustration, or { problems }.
export function checkFile(name, buffer, { lexicon, illustrationSpec: spec }) {
  const problems = []
  const match = /^([a-z0-9]+(?:-[a-z0-9]+)*)\.png$/.exec(name)
  if (!match) return { problems: [`${name}: must be named <word id>.png, all lowercase (e.g. fat.png)`] }
  const id = match[1]
  if (!lexicon.some(word => word.id === id)) problems.push(`${name}: ${id} is not a word id in lexicon.ts`)
  const size = pngSize(buffer)
  if (!size) return { problems: [...problems, `${name}: not a PNG file (it may be a renamed JPEG or WebP)`] }
  if (size.width !== size.height) problems.push(`${name}: must be square, not ${size.width}×${size.height}`)
  if (Math.min(size.width, size.height) < spec.minSize || Math.max(size.width, size.height) > spec.maxSize) {
    problems.push(`${name}: must be between ${spec.minSize} and ${spec.maxSize} px on each side, not ${size.width}×${size.height}`)
  }
  if (buffer.length > spec.maxBytes) problems.push(`${name}: ${Math.ceil(buffer.length / 1024)} KB is over the ${spec.maxBytes / 1024} KB limit; compress it`)
  return problems.length ? { problems } : { id, record: { sha256: sha256(buffer), ...size } }
}

// Checks every file. Pure: file access comes in through files, a map of file name to contents.
// Dotfiles (.gitkeep, .DS_Store) are ignored. Returns the new records and any problems.
export function planIllustrations(content, files) {
  const records = {}
  const problems = []
  for (const name of Object.keys(files).filter(name => !name.startsWith('.')).sort()) {
    const result = checkFile(name, files[name], content)
    if (result.problems) problems.push(...result.problems)
    else records[result.id] = result.record
  }
  return { records, problems }
}

export function recordsSource(records) {
  const sorted = Object.fromEntries(Object.keys(records).sort().map(id => [id, records[id]]))
  return `// Written by scripts/minimal-pairs-images.mjs. Do not edit by hand.\nimport type { IllustrationRecord } from './types'\n\nexport const illustrationRecords: Record<string, IllustrationRecord> = ${JSON.stringify(sorted, null, 2)}\n`
}

// One line per word: what it shows now and, for words without an illustration, what one must show.
export function report({ lexicon, illustrationFile, pictureSource }, records) {
  const lines = lexicon.map(word => {
    const source = pictureSource(word, records)
    const status = source === 'illustration' ? 'illustrated' : `missing (shows ${source})`
    const notes = source === 'illustration' ? [] : [`needs ${illustrationFile(word)}: ${word.imageAlt}`]
    if (source !== 'illustration' && word.pictureRequirement) notes.push(`must be: ${word.pictureRequirement}`)
    return `  ${status.padEnd(28)}  ${word.id.padEnd(10)}${notes.map(note => `\n${' '.repeat(42)}${note}`).join('')}`
  })
  const illustrated = lexicon.filter(word => pictureSource(word, records) === 'illustration').length
  return [`${lexicon.length} words: ${illustrated} illustrated, ${lexicon.length - illustrated} without an illustration.`, ...lines].join('\n')
}

function main() {
  const check = process.argv.includes('--check')
  return loadContent().then(content => {
    const dir = path.join(publicRoot, content.illustrationDir)
    const files = fs.existsSync(dir)
      ? Object.fromEntries(fs.readdirSync(dir, { withFileTypes: true }).filter(entry => entry.isFile()).map(entry => [entry.name, fs.readFileSync(path.join(dir, entry.name))]))
      : {}
    const { records, problems } = planIllustrations(content, files)
    console.log(report(content, records))
    const current = recordsSource(records) === fs.readFileSync(recordsFile, 'utf8')
    if (!check && !current) fs.writeFileSync(recordsFile, recordsSource(records))
    if (problems.length) console.error(`\n${problems.length} file(s) not used:\n${problems.map(problem => `  ${problem}`).join('\n')}`)
    if (check && !current) console.error(`\n${recordsFile} is out of date: run npm run images:minimal-pairs`)
    else if (!check) console.log(current ? '\nRecords already up to date.' : `\nUpdated ${recordsFile}.`)
    if (problems.length || (check && !current)) process.exitCode = 1
  })
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exit(1) })
}
