import { buildTrials, type Role, type RoleSummary, type SessionSummary, type TrialCount } from './trialSession'

// Listening Discrimination: the app plays one word of the pair and the child taps a picture.
// A wrong tap keeps the same word up until the right picture is found, but only the first tap
// is scored. Because the answer is a tap, it is scored automatically. Its results are receptive and are
// reported on their own, never mixed with production accuracy.

export interface ListeningTrial {
  index: number
  wordId: string // the word played
  role: Role
  answer?: string // the word id the child tapped first
}

export interface ListeningState {
  trials: ListeningTrial[]
  current: number
  markId: number
  lastAction: 'start' | 'answer' | 'miss' | 'undo'
}

export type ListeningAction = { type: 'answer'; wordId: string } | { type: 'undo' } | { type: 'restart'; trials: ListeningTrial[] }

export const buildListeningTrials = (targetId: string, contrastId: string, total: TrialCount, random: () => number = Math.random): ListeningTrial[] =>
  buildTrials(targetId, contrastId, total, random).map(({ index, wordId, role }) => ({ index, wordId, role }))

export const startListening = (trials: ListeningTrial[]): ListeningState => ({ trials, current: 0, markId: 0, lastAction: 'start' })

export function listeningReducer(state: ListeningState, action: ListeningAction): ListeningState {
  switch (action.type) {
    case 'answer': {
      if (state.current >= state.trials.length) return state
      const trial = state.trials[state.current]
      const trials = trial.answer ? state.trials : state.trials.map((item, i) => (i === state.current ? { ...item, answer: action.wordId } : item))
      if (action.wordId !== trial.wordId) return { ...state, trials, lastAction: 'miss' }
      return { trials, current: state.current + 1, markId: state.markId + 1, lastAction: 'answer' }
    }
    case 'undo': {
      // A wrong tap on the current turn is undone first, then the turn before it.
      const previous = state.trials[state.current]?.answer ? state.current : state.current - 1
      if (previous < 0) return state
      const trials = state.trials.map((trial, i) => (i === previous ? { index: trial.index, wordId: trial.wordId, role: trial.role } : trial))
      // Undoing a wrong tap stays on the same turn, so the word already heard still counts.
      return { trials, current: previous, markId: previous === state.current ? state.markId : state.markId + 1, lastAction: 'undo' }
    }
    case 'restart':
      return { ...startListening(action.trials), markId: state.markId + 1 }
  }
}

export const isCorrectAnswer = (trial: ListeningTrial) => trial.answer === trial.wordId

// Same shape as production summaries so the summary screen can share layout; cued is always 0 here.
export function summarizeListening(trials: readonly ListeningTrial[]): SessionSummary {
  const role = (which: Role): RoleSummary => {
    const items = trials.filter(trial => trial.role === which)
    const answered = items.filter(trial => trial.answer !== undefined)
    const correct = answered.filter(isCorrectAnswer).length
    return { correct, incorrect: answered.length - correct, cued: 0, total: items.length }
  }
  return { target: role('target'), contrast: role('contrast') }
}
