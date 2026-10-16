import { stopSpeaking } from '../practice/speech'
import { audioFile } from './content/audio'
import type { LexiconWord } from './content/types'

let current: HTMLAudioElement | null = null

// Plays a word's recording. Unlike sayWord, this never falls back to browser text-to-speech:
// a device voice could blur the very contrast being practiced. Resolves false when the recording
// is missing or cannot play, so the activity can show the word without sound.
export const playWordRecording = (word: LexiconWord): Promise<boolean> => playAudioFile(audioFile(word))

// Plays any file under public/audio/, e.g. an articulation recording being considered for reuse.
// With toEnd, resolves only once the clip finishes (false if another clip interrupts it).
export function playAudioFile(file: string, { toEnd = false } = {}): Promise<boolean> {
  stopSpeaking()
  current?.pause()
  current = null
  if (typeof Audio === 'undefined') return Promise.resolve(false)
  const audio = new Audio(`${import.meta.env?.BASE_URL ?? '/'}audio/${file}`)
  current = audio
  // The pause event also fires at the natural end, when ended is already true.
  const finished = new Promise<boolean>(resolve => { audio.onpause = () => resolve(audio.ended) })
  audio.onended = () => { if (current === audio) current = null }
  return audio.play().then(() => (toEnd ? finished : true), () => {
    if (current === audio) current = null
    return false
  })
}
