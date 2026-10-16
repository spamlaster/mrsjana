// The shared trial and scoring engine for every production activity. Pure: no React, no browser APIs.
// See docs/minimal-pairs-spec.md, "Trial and scoring engine".

export type Mark = 'correct' | 'incorrect' | 'cued'
export type Role = 'target' | 'contrast'
export type TrialCount = 10 | 20
export const trialCounts: TrialCount[] = [10, 20]
export const isTrialCount = (value: number): value is TrialCount => value === 10 || value === 20

export interface Trial {
  index: number
  wordId: string
  role: Role
  mark?: Mark
}

export interface TrialSessionState {
  trials: Trial[]
  current: number // index of the next trial to score; equals trials.length when every trial is scored
  markId: number // changes on every mark, undo, or restart, so activities can animate
  lastAction: 'start' | 'mark' | 'undo'
}

export type SessionAction = { type: 'mark'; mark: Mark } | { type: 'advance' } | { type: 'undo' } | { type: 'restart'; trials: Trial[] }

export interface RoleSummary {
  correct: number
  incorrect: number
  cued: number // never folded into correct or incorrect
  total: number // trials for this word in the session
}

export interface SessionSummary {
  target: RoleSummary
  contrast: RoleSummary
}

// No word may come up more than this many times in a row.
export const maxRun = 3

export function longestRun(roles: readonly Role[]): number {
  let longest = 0
  let run = 0
  roles.forEach((role, i) => { run = i > 0 && roles[i - 1] === role ? run + 1 : 1; longest = Math.max(longest, run) })
  return longest
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Exactly half target and half contrast, shuffled, with no word more than three times in a row.
// `random` is injectable so tests can check the order is random yet always balanced.
export function buildTrials(targetId: string, contrastId: string, total: TrialCount, random: () => number = Math.random): Trial[] {
  const half = total / 2
  const roles: Role[] = [...Array(half).fill('target'), ...Array(half).fill('contrast')]
  let order = shuffle(roles, random)
  // A random order almost always passes within a few tries; alternate as a last resort.
  for (let tries = 0; longestRun(order) > maxRun && tries < 200; tries++) order = shuffle(roles, random)
  if (longestRun(order) > maxRun) order = roles.map((_, i) => (i % 2 === 0 ? 'target' : 'contrast'))
  return order.map((role, index) => ({ index, role, wordId: role === 'target' ? targetId : contrastId }))
}

export const startSession = (trials: Trial[]): TrialSessionState => ({ trials, current: 0, markId: 0, lastAction: 'start' })

export function sessionReducer(state: TrialSessionState, action: SessionAction): TrialSessionState {
  switch (action.type) {
    case 'advance':
      if (state.current >= state.trials.length) return state
      return { ...state, current: state.current + 1, markId: state.markId + 1, lastAction: 'mark' }
    case 'mark': {
      if (state.current >= state.trials.length) return state
      const trials = state.trials.map((trial, i) => (i === state.current ? { ...trial, mark: action.mark } : trial))
      return { trials, current: state.current + 1, markId: state.markId + 1, lastAction: 'mark' }
    }
    case 'undo': {
      if (state.current === 0) return state
      const previous = state.current - 1
      const trials = state.trials.map((trial, i) => (i === previous ? { index: trial.index, wordId: trial.wordId, role: trial.role } : trial))
      return { trials, current: previous, markId: state.markId + 1, lastAction: 'undo' }
    }
    case 'restart':
      return { ...startSession(action.trials), markId: state.markId + 1 }
  }
}

export const isComplete = (state: TrialSessionState) => state.current >= state.trials.length
export const currentTrial = (state: TrialSessionState): Trial | null => state.trials[state.current] ?? null

export function summarize(trials: readonly Trial[]): SessionSummary {
  const role = (which: Role): RoleSummary => {
    const items = trials.filter(trial => trial.role === which)
    const count = (mark: Mark) => items.filter(trial => trial.mark === mark).length
    return { correct: count('correct'), incorrect: count('incorrect'), cued: count('cued'), total: items.length }
  }
  return { target: role('target'), contrast: role('contrast') }
}

// Independent accuracy: correct without a cue, out of every trial for that word.
export const percentCorrect = (summary: RoleSummary) => (summary.total ? Math.round((100 * summary.correct) / summary.total) : 0)
