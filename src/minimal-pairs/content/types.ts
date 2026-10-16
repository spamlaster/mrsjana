// Therapy content for the Minimal Pairs Therapy Center. See docs/minimal-pairs-spec.md.
// Nothing in content/ may import React or game code.

export type ProcessId = 'fronting' | 'backing' | 'stopping' | 'cluster-reduction' | 'deaffrication'
// Medial pairs are not supported in this version.
export type Position = 'initial' | 'final'

// One rule means "the child says `error` in place of `target`". Sounds are phoneme
// sequences (lowercase ARPAbet, see phonemes in processes.ts) so s-blends fit too.
export interface ProcessRule {
  target: string[]
  error: string[]
  positions: Position[]
}

export interface PhonologicalProcess {
  id: ProcessId
  name: string
  rules: ProcessRule[]
  grownUpNote: string
}

export interface LexiconWord {
  id: string // unique; homographs get distinct ids
  text: string
  phonemes: string[] // only used to validate the curated list, never to generate words
  phonemesReviewed: boolean // true once a person has checked the transcription; required before approval
  imageAlt: string
  // Assets are tracked separately from clinical validity: missing ones show up in the readiness report.
  // A custom illustration needs no field here: public/images/minimal-pairs/<id>.png is used once
  // scripts/minimal-pairs-images.mjs has recorded it (see illustrations.ts), ahead of picture and emoji.
  picture?: string // key into the WordPicture SVG/emoji maps; only for pictures that identify this word (see picture-audit.ts)
  // A standard emoji that clearly identifies the word, for words WordPicture has no accurate picture for.
  emoji?: string
  // What any illustration of this word must or must not show, e.g. 'a chubby cat, never a person'.
  pictureRequirement?: string
  // Recording, relative to public/audio/. Leave unset for the word's own recording, minimal-pairs/<id>.mp3.
  // Set to an articulation recording such as 'words/sun.mp3' only when Jana has chosen to reuse it.
  audio?: string
  // Required for words with more than one pronunciation or meaning, e.g. 'the tear that falls from your eye'.
  // Passed to text-to-speech so it says the intended word.
  pronunciationHint?: string
}

// One recording in audio-records.ts, keyed by its path relative to public/audio/.
// Written only by scripts/minimal-pairs-audio.mjs. A recording counts as reviewed only while
// sha256 still matches the file, so regenerating or replacing it clears the review.
export interface AudioRecord {
  sha256: string
  source: 'openai' | 'existing'
  model?: string
  voice?: string
  generatedOn?: string // YYYY-MM-DD
  reviewedBy?: string // set only by --mark-reviewed, once Jana has approved the recording
  reviewedOn?: string // YYYY-MM-DD
}

// One custom illustration in illustration-records.ts, keyed by word id. Written only by
// scripts/minimal-pairs-images.mjs after the file passed its checks; the test suite fails if the
// file is missing or no longer matches sha256.
export interface IllustrationRecord {
  sha256: string
  width: number
  height: number
}

// Clinical sign-off, added by hand only after Jana approves the pair. Never set automatically,
// and passing automated validation is never a substitute for it.
export interface PairApproval {
  by: string
  on: string // ISO date, YYYY-MM-DD
}

export interface MinimalPair {
  id: string
  words: [string, string] // lexicon ids, unordered; roles come from the process
  contrast: [string, string] // sound ids, unordered, e.g. ['k', 't'] or ['sn', 'n']
  position: Position
  processes: ProcessId[] // every process this pair serves, e.g. ['fronting', 'backing']
  approval?: PairApproval // clinical sign-off; without it a pair is never shown outside preview mode
  // The project owner accepted the pair as working content for building and previewing activities.
  // This is not clinical approval: it only makes the pair usable in preview mode (see preview.ts).
  acceptedForDevelopment?: boolean
  notes?: string
}

// approved: Jana's clinical sign-off. accepted-for-development: usable in preview mode only. draft: neither.
export type PairStatus = 'approved' | 'accepted-for-development' | 'draft'

export interface ContentLibrary {
  processes: PhonologicalProcess[]
  lexicon: LexiconWord[]
  pairs: MinimalPair[]
}

export interface PairRoles {
  target: LexiconWord
  contrast: LexiconWord
}
