import { audioRecords } from './audio-records'
import type { AudioRecord, LexiconWord } from './types'

// Recordings this center makes live here, named by the word's stable id, never by its spelling.
export const audioDir = 'minimal-pairs'
// A reused articulation recording must be one of these.
export const reusableAudio = /^words\/[a-z0-9-]+\.mp3$/

// The word's recording, relative to public/audio/.
export const audioFile = (word: LexiconWord) => word.audio ?? `${audioDir}/${word.id}.mp3`

// Reviewed by Jana. The test suite fails if a reviewed record no longer matches its file.
export const isReviewed = (record: AudioRecord | undefined) => Boolean(record?.reviewedBy?.trim() && record.reviewedOn)
export const isAudioReviewed = (file: string, records: Record<string, AudioRecord> = audioRecords) => isReviewed(records[file])

// Whether the word has a recording the app knows about: one the script generated (it writes a record for each),
// or a reused articulation recording. Recordings are never checked by fetching in the browser.
export const hasRecording = (word: LexiconWord, records: Record<string, AudioRecord> = audioRecords) =>
  Boolean(records[audioFile(word)]) || word.audio !== undefined

// Production games play only reviewed recordings. Preview mode also plays unreviewed ones so they can be checked.
// Listening Discrimination needs reviewed recordings in every mode (see readiness.ts).
export const canPlayRecording = (word: LexiconWord, preview = false, records: Record<string, AudioRecord> = audioRecords) =>
  isAudioReviewed(audioFile(word), records) || (preview && hasRecording(word, records))
