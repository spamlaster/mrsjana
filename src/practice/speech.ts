// Novelty and older formant voices (macOS Eloquence/novelty, eSpeak) sound robotic.
const robotic = /albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|ralph|kathy|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|espeak/i
// Voices that tend to sound natural, best first: cloud neural voices, downloaded premium voices, then good local ones.
const natural = [/natural|neural|online/i, /premium/i, /enhanced/i, /^google (us|uk) english/i, /siri/i, /\b(ava|allison|samantha|susan|zoe|joelle|nicky|karen|serena|tessa|moira|aria|jenny|libby|sonia)\b/i]

function score(voice: SpeechSynthesisVoice) {
  const rank = natural.findIndex(pattern => pattern.test(voice.name))
  return (rank === -1 ? 0 : (natural.length - rank) * 10) + (/^en-US$/i.test(voice.lang.replace('_', '-')) ? 2 : 0) + (voice.localService ? 0 : 1)
}
const byQuality = (voices: SpeechSynthesisVoice[]) => [...voices].sort((a, b) => score(b) - score(a))

export function englishVoices() {
  return byQuality((window.speechSynthesis?.getVoices() || []).filter(voice => /^en(?:-|_)/i.test(voice.lang) && !robotic.test(voice.name)))
}
export function chooseVoice(voices: SpeechSynthesisVoice[], uri?: string) {
  return voices.find(voice => voice.voiceURI === uri) || byQuality(voices)[0]
}
export function say(text: string, voiceURI?: string, rate = 1, onEnd?: () => void) {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = chooseVoice(englishVoices(), voiceURI)
  if (voice) utterance.voice = voice
  utterance.lang = voice?.lang || 'en-US'
  utterance.rate = rate
  if (onEnd) utterance.onend = onEnd
  window.speechSynthesis.speak(utterance)
  return true
}

// Recorded word audio, made by scripts/generate-word-audio.mjs.
export const wordAudioFile = (word: string) => word.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') + '.mp3'
let current: HTMLAudioElement | null = null
// Bumped whenever playback stops or restarts, so a stopped clip never runs its onEnd.
let playback = 0
export function stopSpeaking() {
  playback++
  current?.pause()
  current = null
  window.speechSynthesis?.cancel()
}
// Plays a recording, falling back to the device voice saying text if there is no recording.
// A chosen device voice (voiceURI) skips the recording. onEnd runs when it finishes, unless something else interrupted it.
function play(file: string, text: string, voiceURI?: string, rate = 1, onEnd?: () => void) {
  stopSpeaking()
  const id = playback
  const finished = () => { if (id === playback) onEnd?.() }
  if (voiceURI || typeof Audio === 'undefined') return say(text, voiceURI, rate, finished)
  const audio = new Audio(`${import.meta.env?.BASE_URL ?? '/'}audio/${file}`)
  audio.playbackRate = rate
  current = audio
  audio.onended = () => { if (current === audio) current = null; finished() }
  audio.play().catch(() => { if (current === audio) { current = null; say(text, voiceURI, rate, finished) } })
  return true
}
export const sayWord = (word: string, voiceURI?: string, rate = 1) => play(`words/${wordAudioFile(word)}`, word, voiceURI, rate)
// Game feedback phrases, recorded by the phrases list in scripts/generate-word-audio.mjs.
const phrases = {
  'try-again': 'Try again!',
  'oops-try-again': 'Oops, try again!',
  'star-1': 'Wow! You found a hidden star!',
  'star-2': 'Yay! Another sparkly star!',
  'star-3': 'Amazing! You found another star!',
  'star-4': 'Hooray! You found all the stars!',
  'your-turn-1': 'Your turn! Give it a try.',
  'your-turn-2': 'Now you read it. You can do it!',
  'your-turn-3': 'Great listening! Now it’s your turn to read.',
}
export const sayPhrase = (id: keyof typeof phrases, onEnd?: () => void) => play(`phrases/${id}.mp3`, phrases[id], undefined, 1, onEnd)
// Story pages, recorded as public/audio/stories/<story id>-<page number>.mp3.
export const readStoryPage = (storyId: string, pageNumber: number, text: string, onEnd?: () => void) =>
  play(`stories/${storyId}-${pageNumber}.mp3`, text, undefined, 1, onEnd)
