export function englishVoices() {
  return window.speechSynthesis?.getVoices().filter(voice => /^en(?:-|_)/i.test(voice.lang)) || []
}
export function chooseVoice(voices: SpeechSynthesisVoice[], uri?: string) {
  return voices.find(voice => voice.voiceURI === uri)
    || voices.find(voice => /natural|neural|enhanced|premium/i.test(voice.name) && /^en-US$/i.test(voice.lang))
    || voices.find(voice => /natural|neural|enhanced|premium/i.test(voice.name))
    || voices.find(voice => /^en-US$/i.test(voice.lang) && voice.default)
    || voices.find(voice => /^en-US$/i.test(voice.lang)) || voices[0]
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
