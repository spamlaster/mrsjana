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
export function say(text: string, voiceURI?: string, rate = 1) {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = chooseVoice(englishVoices(), voiceURI)
  if (voice) utterance.voice = voice
  utterance.lang = voice?.lang || 'en-US'
  utterance.rate = rate
  window.speechSynthesis.speak(utterance)
  return true
}

// Recorded word audio, made by scripts/generate-word-audio.mjs.
export const wordAudioFile = (word: string) => word.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') + '.mp3'
let current: HTMLAudioElement | null = null
export function stopSpeaking() {
  current?.pause()
  current = null
  window.speechSynthesis?.cancel()
}
// Plays the recorded word, falling back to the device voice if there is no recording.
// A chosen device voice (voiceURI) skips the recording.
export function sayWord(word: string, voiceURI?: string, rate = 1) {
  stopSpeaking()
  if (voiceURI || typeof Audio === 'undefined') return say(word, voiceURI, rate)
  const audio = new Audio(`${import.meta.env?.BASE_URL ?? '/'}audio/words/${wordAudioFile(word)}`)
  audio.playbackRate = rate
  current = audio
  audio.play().catch(() => { if (current === audio) { current = null; say(word, voiceURI, rate) } })
  return true
}
