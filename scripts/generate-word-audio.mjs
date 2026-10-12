// Generates a natural-sounding MP3 for every practice word with OpenAI text-to-speech.
// Usage: npm run voice                      (skips words that already have audio)
//        npm run voice -- --only=rabbit,sun (just these words, to try a voice)
//        npm run voice -- --force           (regenerate everything)
//        npm run voice -- --voice=nova      (try a different voice; default coral)
// Needs OPENAI_API_KEY in the environment or in .env.local.
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const args = Object.fromEntries(process.argv.slice(2).map(arg => arg.replace(/^--/, '').split('=')).map(([key, value]) => [key, value ?? true]))
const key = process.env.OPENAI_API_KEY
if (!key) { console.error('Set OPENAI_API_KEY (or add it to .env.local) first.'); process.exit(1) }

const voice = args.voice || 'coral'
const instructions = 'You are a warm, friendly speech teacher modelling one word for a young child. Say the word once, slowly and clearly, with natural, cheerful intonation. Pronounce every sound carefully without exaggerating or breaking the word into pieces. Say only the word.'
const outDir = 'public/audio/words'
const fileName = word => word.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') + '.mp3'

const compiled = ts.transpileModule(fs.readFileSync('src/data/speeches.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const { speechSounds } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
const all = [...new Set(speechSounds.flatMap(sound => sound.categories.flatMap(category => category.words.map(word => word.word.toLowerCase()))))]
const words = (args.only ? String(args.only).split(',').map(word => word.trim().toLowerCase()) : all)
  .filter(word => args.force || args.only || !fs.existsSync(path.join(outDir, fileName(word))))

fs.mkdirSync(outDir, { recursive: true })
console.log(`Generating ${words.length} of ${all.length} words with voice "${voice}"…`)

async function generate(word, attempt = 1) {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4o-mini-tts', voice, input: word, instructions, response_format: 'mp3' }),
  })
  if ((response.status === 429 || response.status >= 500) && attempt < 5) {
    await new Promise(resolve => setTimeout(resolve, attempt * 2000))
    return generate(word, attempt + 1)
  }
  if (!response.ok) throw new Error(`${word}: ${response.status} ${await response.text()}`)
  fs.writeFileSync(path.join(outDir, fileName(word)), Buffer.from(await response.arrayBuffer()))
}

let done = 0
const failed = []
const queue = [...words]
await Promise.all(Array.from({ length: 4 }, async () => {
  for (let word = queue.shift(); word; word = queue.shift()) {
    try { await generate(word); console.log(`  ✓ ${word} (${++done}/${words.length})`) }
    catch (error) { failed.push(word); console.error(`  ✗ ${error.message}`) }
  }
}))
console.log(failed.length ? `Done with ${failed.length} failures: ${failed.join(', ')}. Run again to retry.` : `Done. Files are in ${outDir}.`)
if (failed.length) process.exit(1)
