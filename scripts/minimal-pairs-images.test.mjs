import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { checkFile, loadContent, planIllustrations, pngSize, recordsFile, recordsSource, report, sha256 } from './minimal-pairs-images.mjs'

// No test here writes to public/ or the records file: checks are pure, and the command runs with --check.
const content = await loadContent()
const { illustrationFile, illustrationSpec, pictureSource } = content

// A real, minimal PNG of the given size (one gray row repeated), so tests never need image files.
function png(width, height = width) {
  const chunk = (type, data) => {
    const body = Buffer.concat([Buffer.from(type), data])
    const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(body))
    const length = Buffer.alloc(4); length.writeUInt32BE(data.length)
    return Buffer.concat([length, body, crc])
  }
  const header = Buffer.alloc(13); header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 0
  const pixels = zlib.deflateSync(Buffer.alloc((width + 1) * height, 0x80))
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', header), chunk('IDAT', pixels), chunk('IEND', Buffer.alloc(0))])
}

// The folder, the naming convention, and the size rules.
assert.equal(content.illustrationDir, 'images/minimal-pairs')
assert.equal(illustrationFile({ id: 'fat' }), 'images/minimal-pairs/fat.png', 'Files are named by word id')
assert.deepEqual(illustrationSpec, { minSize: 512, maxSize: 1024, maxBytes: 500 * 1024 })
assert.deepEqual(pngSize(png(512)), { width: 512, height: 512 })
assert.equal(pngSize(Buffer.from('not a png at all, just some text')), null)

const ok = checkFile('fat.png', png(512), content)
assert.deepEqual(ok, { id: 'fat', record: { sha256: sha256(png(512)), width: 512, height: 512 } })
assert.ok(checkFile('deer.png', png(1024), content).record, '1024 px is allowed')
const problem = (name, buffer, pattern) => assert.match((checkFile(name, buffer, content).problems ?? []).join('; '), pattern, name)
problem('Fat.png', png(512), /all lowercase/)
problem('fat.PNG', png(512), /<word id>\.png/)
problem('fat.jpg', png(512), /<word id>\.png/)
problem('fat cat.png', png(512), /<word id>\.png/)
problem('dear.png', png(512), /dear is not a word id/, 'A spelling that is not a word id is refused')
problem('fat.png', Buffer.from([0xff, 0xd8, 0xff, 0xe0, ...Buffer.alloc(40)]), /not a PNG/)
problem('fat.png', png(512, 600), /must be square/)
problem('fat.png', png(256), /between 512 and 1024/)
problem('fat.png', png(2048), /between 512 and 1024/)
problem('fat.png', Buffer.concat([png(512), Buffer.alloc(illustrationSpec.maxBytes)]), /over the 500 KB limit/)

// Every file is checked; dotfiles are ignored; only valid files get records.
const plan = planIllustrations(content, { '.gitkeep': Buffer.alloc(0), '.DS_Store': Buffer.alloc(8), 'thin.png': png(512), 'fat.png': png(300), 'notes.txt': Buffer.from('x') })
assert.deepEqual(Object.keys(plan.records), ['thin'])
assert.equal(plan.problems.length, 2)
assert.match(recordsSource(plan.records), /^\/\/ Written by scripts\/minimal-pairs-images\.mjs\. Do not edit by hand\./)
assert.match(recordsSource(plan.records), /"thin": \{\n {4}"sha256": "[0-9a-f]{64}",\n {4}"width": 512,\n {4}"height": 512\n {2}\}/)

// An illustration takes priority over a site picture and an emoji; without one the word keeps what it had.
const word = id => content.lexicon.find(item => item.id === id)
const records = { car: { sha256: 'a', width: 512, height: 512 }, key: { sha256: 'b', width: 512, height: 512 }, tar: { sha256: 'c', width: 512, height: 512 } }
assert.deepEqual(['car', 'key', 'tar'].map(id => pictureSource(word(id), records)), ['illustration', 'illustration', 'illustration'])
assert.deepEqual(['car', 'key', 'tar'].map(id => pictureSource(word(id), {})), ['picture', 'emoji', 'placeholder'])

// The report names each missing file and keeps the special picture requirements in view.
const text = report(content, plan.records)
assert.match(text, /^182 words: 1 illustrated, 181 without an illustration\./)
assert.match(text, /illustrated\s+thin/)
assert.match(text, /needs images\/minimal-pairs\/fat\.png: a chubby cat\n\s+must be: a chubby cat or another nonhuman subject, never a person/)
assert.match(text, /missing \(shows emoji\)\s+deer\s+\n\s+needs images\/minimal-pairs\/deer\.png: a deer\n\s+must be: the animal/)

// The command in --check mode agrees with the committed records and never writes.
const before = fs.readFileSync(recordsFile, 'utf8')
const run = spawnSync(process.execPath, [path.join('scripts', 'minimal-pairs-images.mjs'), '--check'], { encoding: 'utf8' })
assert.equal(run.status, 0, `npm run images:minimal-pairs -- --check failed:\n${run.stdout}${run.stderr}`)
assert.match(run.stdout, /^182 words:/)
assert.equal(fs.readFileSync(recordsFile, 'utf8'), before, '--check never writes the records')

console.log('Minimal pairs image checks passed: naming, PNG size rules, records, priority over site pictures and emoji, and the missing-illustration report.')
