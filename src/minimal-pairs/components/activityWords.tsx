import type { ActivityWord } from '../activities/types'
import { canPlayRecording } from '../content/audio'
import { getWord } from '../content/selectors'
import type { LexiconWord, MinimalPair } from '../content/types'
import { playWordRecording } from '../playback'
import { PairPicture } from './PairPicture'

// Turns lexicon words into what games may see: text, picture, and whether a recording can play.
// Production games play reviewed recordings only, or any existing recording in preview mode.
export const toActivityWord = (word: LexiconWord, preview: boolean): ActivityWord => ({
  id: word.id,
  text: word.text,
  picture: <PairPicture word={word} size="lg" />,
  canListen: canPlayRecording(word, preview),
})

// Both words of a pair in their stored order, which says nothing about which one is the target.
export const pairWords = (pair: MinimalPair): LexiconWord[] => pair.words.map(id => getWord(id)).filter((word): word is LexiconWord => Boolean(word))

export function playById(id: string): Promise<boolean> {
  const word = getWord(id)
  return word ? playWordRecording(word) : Promise.resolve(false)
}
