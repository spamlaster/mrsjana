import { audioFile, isAudioReviewed, reusableAudio } from './audio'
import { getWord, isPlayable, library } from './selectors'
import { audioRecords } from './audio-records'
import { illustrationRecords } from './illustration-records'
import type { ContentLibrary, MinimalPair } from './types'

export type AssetIssue = 'no-picture' | 'no-audio' | 'audio-not-reviewed'

export interface ReadinessItem {
  pairId: string
  approved: boolean
  wordId: string
  issue: AssetIssue
}

// How to tell whether an asset exists. Supplied by the caller so content stays free of React and Node.
export interface AssetChecks {
  hasPicture: (key: string) => boolean
  hasIllustration?: (wordId: string) => boolean // defaults to the records in illustration-records.ts
  hasAudio: (file: string) => boolean // file is relative to public/audio/
  isReviewed?: (file: string) => boolean // defaults to the review records in audio-records.ts
}

// Pictures and audio still missing for each pair's words. Reported separately from validateLibrary():
// a clinically valid pair can still be waiting for its assets.
export function assetReadiness(checks: AssetChecks, lib: ContentLibrary = library): ReadinessItem[] {
  return lib.pairs.flatMap(pair => pair.words.flatMap(wordId => {
    const word = getWord(wordId, lib)
    if (!word) return []
    const item = (issue: AssetIssue): ReadinessItem => ({ pairId: pair.id, approved: isPlayable(pair), wordId, issue })
    const issues: ReadinessItem[] = []
    // A custom illustration, a linked WordPicture, or a standard emoji; anything else shows the placeholder.
    const illustrated = (checks.hasIllustration ?? (id => Boolean(illustrationRecords[id])))(word.id)
    if (!illustrated && !(word.picture && checks.hasPicture(word.picture)) && !word.emoji?.trim()) issues.push(item('no-picture'))
    const file = audioFile(word)
    if ((word.audio !== undefined && !reusableAudio.test(word.audio)) || !checks.hasAudio(file)) issues.push(item('no-audio'))
    else if (!(checks.isReviewed ?? isAudioReviewed)(file)) issues.push(item('audio-not-reviewed'))
    return issues
  }))
}

// Listening Discrimination needs both pictures and reviewed audio for both words.
export const listeningReady = (pairId: string, readiness: ReadinessItem[]) => !readiness.some(item => item.pairId === pairId)

// The checks the app itself can make without touching the file system: picture keys are trusted
// (scripts/minimal-pairs.test.mjs checks every one against WordPicture), and an illustration or a recording
// exists when its script has a record for it (the test suite checks every record against its file).
export const appAssetChecks: AssetChecks = { hasPicture: () => true, hasAudio: file => Boolean(audioRecords[file]) }

// Listening Discrimination is offered for a pair only when both words have pictures and reviewed recordings.
export const pairListeningReady = (pair: MinimalPair, lib: ContentLibrary = library, checks: AssetChecks = appAssetChecks) =>
  listeningReady(pair.id, assetReadiness(checks, { ...lib, pairs: [pair] }))
