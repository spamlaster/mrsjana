import { wordAudioFile } from '../../practice/speech'
import { audioFile, hasRecording, isAudioReviewed } from './audio'
import { getWord, library } from './selectors'
import type { ContentLibrary, LexiconWord } from './types'

// The recordings checklist (components/AudioCheck.tsx): Jana listens and decides, the page writes up
// her decisions, and a person runs the commands. Nothing here marks a recording reviewed.

export type RecordingState = 'reviewed' | 'unreviewed' | 'missing'
// ok / redo: the word's own recording. reuse / new: a word with no recording yet.
export type Verdict = 'ok' | 'redo' | 'reuse' | 'new'
export interface Decision { verdict: Verdict; note?: string }
export type Decisions = Record<string, Decision>

export const recordingState = (word: LexiconWord): RecordingState =>
  isAudioReviewed(audioFile(word)) ? 'reviewed' : hasRecording(word) ? 'unreviewed' : 'missing'

// The articulation recording a word with none could reuse. It may not exist; playing it tells.
export const practiceRecording = (word: LexiconWord) => `words/${wordAudioFile(word.text)}`

export const verdictsFor = (state: RecordingState): Verdict[] =>
  state === 'unreviewed' ? ['ok', 'redo'] : state === 'missing' ? ['reuse', 'new'] : []

export const verdictLabels: Record<Verdict, string> = {
  ok: 'Sounds right',
  redo: 'Redo it',
  reuse: 'Use this one',
  new: 'Make a new one',
}

// A decision still applies only while the word is in the state it was made for.
export const currentDecision = (word: LexiconWord, decisions: Decisions) => {
  const decision = decisions[word.id]
  return decision && verdictsFor(recordingState(word)).includes(decision.verdict) ? decision : undefined
}

// Plain-text write-up of the decisions, with the commands to run. Words in lexicon order.
export function checkReport(decisions: Decisions, by: string, on: string, lib: ContentLibrary = library): string {
  const who = by.trim() || 'Jana'
  const words = (verdict: Verdict) => lib.lexicon.filter(word => currentDecision(word, decisions)?.verdict === verdict)
  const ids = (list: LexiconWord[]) => list.map(word => word.id).join(',')
  const markReviewed = (list: LexiconWord[]) => `npm run voice:minimal-pairs -- --mark-reviewed=${ids(list)} --by=${/^[\w.-]+$/.test(who) ? who : JSON.stringify(who)}`
  const [ok, redo, reuse, fresh] = (['ok', 'redo', 'reuse', 'new'] as const).map(words)
  const lines = [`Recordings checked by ${who} on ${on}`]
  if (!ok.length && !redo.length && !reuse.length && !fresh.length) return [...lines, '', 'Nothing decided yet.'].join('\n')
  if (ok.length) lines.push('', `Sound right (${ok.length}): ${ok.map(word => word.text).join(', ')}`, markReviewed(ok))
  if (redo.length) {
    lines.push('', `Redo (${redo.length}), then check again:`)
    for (const word of redo) lines.push(`- ${word.text}${decisions[word.id].note?.trim() ? `: ${decisions[word.id].note!.trim()}` : ''}`)
    lines.push(`npm run voice:minimal-pairs -- --only=${ids(redo)} --force   (paid API run; add a pronunciationHint first if the meaning was wrong)`)
  }
  if (reuse.length) {
    lines.push('', `Use the Practice recording (${reuse.length}): ${reuse.map(word => word.text).join(', ')}`)
    for (const word of reuse) lines.push(`- lexicon.ts, ${word.id}: audio: '${practiceRecording(word)}'`)
    lines.push('then:', markReviewed(reuse))
  }
  if (fresh.length) lines.push('', `Make a new recording (${fresh.length}): ${fresh.map(word => word.text).join(', ')}`, `npm run voice:minimal-pairs -- --only=${ids(fresh)}   (paid API run; check again afterwards)`)
  return lines.join('\n')
}

// Words that still need a listen: not reviewed and not yet decided.
export const undecided = (wordIds: string[], decisions: Decisions, lib: ContentLibrary = library) =>
  wordIds.map(id => getWord(id, lib)).filter((word): word is LexiconWord => Boolean(word))
    .filter(word => recordingState(word) !== 'reviewed' && !currentDecision(word, decisions))
