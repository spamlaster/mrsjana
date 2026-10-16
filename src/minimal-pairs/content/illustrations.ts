import { illustrationRecords } from './illustration-records'
import type { IllustrationRecord, LexiconWord } from './types'

// Custom illustrations live here, relative to public/, named by the word's stable id, never by its spelling.
export const illustrationDir = 'images/minimal-pairs'

// What scripts/minimal-pairs-images.mjs accepts: a square PNG between these sizes, no larger than maxBytes.
// The biggest picture slot is 160 CSS px, so 512 px stays sharp on 3x screens.
export const illustrationSpec = { minSize: 512, maxSize: 1024, maxBytes: 500 * 1024 }

// The word's illustration, relative to public/. It counts only once it has a record.
export const illustrationFile = (word: LexiconWord) => `${illustrationDir}/${word.id}.png`

// Whether the word has a recorded illustration. Files are never checked by fetching in the browser:
// a file at the expected name without a record is not used.
export const hasIllustration = (word: LexiconWord, records: Record<string, IllustrationRecord> = illustrationRecords) => Boolean(records[word.id])

export type PictureSource = 'illustration' | 'picture' | 'emoji' | 'placeholder'

// What PairPicture shows: a custom illustration first, then a linked WordPicture, then an emoji, else the placeholder.
export const pictureSource = (word: LexiconWord, records: Record<string, IllustrationRecord> = illustrationRecords): PictureSource =>
  hasIllustration(word, records) ? 'illustration' : word.picture ? 'picture' : word.emoji?.trim() ? 'emoji' : 'placeholder'
