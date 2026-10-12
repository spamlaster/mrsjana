// Generates natural-sounding MP3s with OpenAI text-to-speech: every practice word, the short game phrases below,
// and every story page (for Listen to Ms. Jana read).
// Usage: npm run voice                      (skips anything that already has audio; story pages are redone when their text changes)
//        npm run voice -- --only=rabbit,sun (just these words, to try a voice)
//        npm run voice -- --force           (regenerate everything)
//        npm run voice -- --voice=nova      (try a different voice; default nova)
// Needs OPENAI_API_KEY in the environment or in .env.local.
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const args = Object.fromEntries(process.argv.slice(2).map(arg => arg.replace(/^--/, '').split('=')).map(([key, value]) => [key, value ?? true]))
const key = process.env.OPENAI_API_KEY
if (!key) { console.error('Set OPENAI_API_KEY (or add it to .env.local) first.'); process.exit(1) }

const voice = args.voice || 'nova'
const instructions = 'You are a warm, friendly speech teacher modelling one word for a young child. Say the word once, slowly and clearly, with natural, cheerful intonation. Pronounce every sound carefully without exaggerating or breaking the word into pieces. Say only the word.'
const outDir = 'public/audio/words'
// Spoken feedback in the games. Keys are file names in public/audio/phrases, played with sayPhrase().
const encourage = 'You are a warm, friendly speech teacher gently encouraging a young child who just made a mistake in a game. Say the phrase once, kindly and cheerfully, so it never sounds like a scolding. Say only the phrase.'
const celebrate = 'You are a warm, friendly speech teacher celebrating with a young child who just found a surprise in a game. Say the phrase once, sounding genuinely thrilled, bright and full of wonder. Say only the phrase.'
const invite = 'You are a warm, friendly speech teacher who just read a page aloud to a young child learning to read. Invite the child to read it themselves. Say the phrase once, warmly and confidently, so the child feels excited to try. Say only the phrase.'
const phrases = {
  'try-again': ['Try again!', encourage],
  'oops-try-again': ['Oops, try again!', encourage],
  // Star Seekers says these in order as each of the four stars is found.
  'star-1': ['Wow! You found a hidden star!', celebrate],
  'star-2': ['Yay! Another sparkly star!', celebrate],
  'star-3': ['Amazing! You found another star!', celebrate],
  'star-4': ['Hooray! You found all the stars!', celebrate],
  // Said after Ms. Jana reads a story page, rotating from page to page.
  'your-turn-1': ['Your turn! Give it a try.', invite],
  'your-turn-2': ['Now you read it. You can do it!', invite],
  'your-turn-3': ['Great listening! Now it’s your turn to read.', invite],
}
const phraseDir = 'public/audio/phrases'
const storyInstructions = 'You are Ms. Jana, a warm, friendly speech teacher reading a page of a picture book aloud to a young child who is learning to read. Read slowly and clearly with gentle, lively expression, giving every word its full sounds so the child can follow along. Pause briefly between sentences, and give characters’ speech a little extra cheer. Read only the text, exactly as written.'
const storyDir = 'public/audio/stories'
// Remembers the text each story page was recorded from, so edited pages are recorded again.
const storyManifest = 'scripts/story-audio.json'
const fileName = word => word.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') + '.mp3'

const load = async file => import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText).toString('base64')}`)
const { speechSounds } = await load('src/data/speeches.ts')
const { stories } = await load('src/data/stories.ts')
const all = [...new Set(speechSounds.flatMap(sound => sound.categories.flatMap(category => category.words.map(word => word.word.toLowerCase()))))]
const words = (args.only ? String(args.only).split(',').map(word => word.trim().toLowerCase()) : all)
  .filter(word => args.force || args.only || !fs.existsSync(path.join(outDir, fileName(word))))

const recorded = fs.existsSync(storyManifest) ? JSON.parse(fs.readFileSync(storyManifest, 'utf8')) : {}
const pages = stories.flatMap(story => story.pages.map((page, index) => ({ file: `${story.id}-${index + 1}.mp3`, text: page.text })))
  .filter(({ file, text }) => !args.only && (args.force || recorded[file] !== text || !fs.existsSync(path.join(storyDir, file))))

for (const dir of [outDir, phraseDir, storyDir]) fs.mkdirSync(dir, { recursive: true })
console.log(`Generating ${words.length} of ${all.length} words and ${pages.length} story pages with voice "${voice}"…`)

async function generate(input, file, prompt = instructions, attempt = 1) {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4o-mini-tts', voice, input, instructions: prompt, response_format: 'mp3' }),
  })
  if ((response.status === 429 || response.status >= 500) && attempt < 5) {
    await new Promise(resolve => setTimeout(resolve, attempt * 2000))
    return generate(input, file, prompt, attempt + 1)
  }
  if (!response.ok) throw new Error(`${input}: ${response.status} ${await response.text()}`)
  fs.writeFileSync(file, Buffer.from(await response.arrayBuffer()))
}

for (const [id, [text, phraseInstructions]] of Object.entries(phrases)) {
  const file = path.join(phraseDir, `${id}.mp3`)
  if (args.only || (!args.force && fs.existsSync(file))) continue
  await generate(text, file, phraseInstructions)
  console.log(`  ✓ "${text}"`)
}

for (const { file, text } of pages) {
  await generate(text, path.join(storyDir, file), storyInstructions)
  recorded[file] = text
  fs.writeFileSync(storyManifest, JSON.stringify(recorded, null, 2) + '\n')
  console.log(`  ✓ story ${file}`)
}

let done = 0
const failed = []
const queue = [...words]
await Promise.all(Array.from({ length: 4 }, async () => {
  for (let word = queue.shift(); word; word = queue.shift()) {
    try { await generate(word, path.join(outDir, fileName(word))); console.log(`  ✓ ${word} (${++done}/${words.length})`) }
    catch (error) { failed.push(word); console.error(`  ✗ ${error.message}`) }
  }
}))
console.log(failed.length ? `Done with ${failed.length} failures: ${failed.join(', ')}. Run again to retry.` : 'Done. Files are in public/audio.')
if (failed.length) process.exit(1)
