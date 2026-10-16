import { positionLabels, soundLabel } from '../content/labels'
import { getProcess, getWord, library } from '../content/selectors'
import type { Position, ProcessId } from '../content/types'
import { percentCorrect, type RoleSummary, type SessionSummary, type TrialCount } from './trialSession'

// What a finished session hands to the summary screen. It travels in history.state only:
// nothing is stored, and it is gone after a refresh. It never contains anything about the child.
export interface SessionResult {
  kind: 'production' | 'listening' | 'practice'
  activityId: string
  activityName: string
  processId: ProcessId
  sound: string
  position: Position
  pairId: string
  targetId: string
  contrastId: string
  total: TrialCount
  summary: SessionSummary
  approved: boolean // false when the pair was used in preview mode before clinical approval
  finishedOn: string // YYYY-MM-DD, local
}

const line = (word: string, summary: RoleSummary, kind: SessionResult['kind']) => kind === 'practice' ? `${word}: ${summary.total} practice turns (unscored)` : kind === 'listening'
  ? `${word}: picked correctly ${summary.correct} of ${summary.total} (${percentCorrect(summary)}%)`
  : `${word}: ${summary.correct} correct, ${summary.incorrect} incorrect, ${summary.cued} cued, of ${summary.total} (${percentCorrect(summary)}% correct without cues)`

// Plain text the grown-up can copy into their own notes. The app keeps no copy.
export function summaryText(result: SessionResult, lib = library): string {
  const word = (id: string) => getWord(id, lib)?.text ?? id
  const target = word(result.targetId)
  const contrast = word(result.contrastId)
  return [
    `Minimal pairs practice, ${result.finishedOn}`,
    `${getProcess(result.processId, lib)?.name ?? result.processId}: target ${soundLabel(result.sound)}, ${positionLabels[result.position].short} of the word`,
    `Pair: ${target} (target) / ${contrast} (contrast)`,
    `Activity: ${result.activityName}, ${result.total} turns${result.kind === 'listening' ? ' (listening, scored automatically)' : ''}`,
    line(target, result.summary.target, result.kind),
    line(contrast, result.summary.contrast, result.kind),
    ...(result.approved ? [] : ['Preview: this pair is still awaiting Jana’s clinical approval.']),
  ].join('\n')
}

export const today = () => new Date().toLocaleDateString('en-CA')
