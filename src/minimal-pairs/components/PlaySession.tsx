import { useCallback, useMemo, useReducer, useState } from 'react'
import { navigate } from '../../routing/router'
import type { ActivityInfo } from '../activities/catalog'
import { productionGames } from '../activities/registry'
import type { ActivityWord } from '../activities/types'
import { canPlayRecording, hasRecording } from '../content/audio'
import { getWord, isPlayable } from '../content/selectors'
import type { MinimalPair, PairRoles } from '../content/types'
import { centerPath, type CenterRoute } from '../route'
import { today, type SessionResult } from '../session/result'
import { buildTrials, currentTrial, isComplete, sessionReducer, startSession, summarize, type Mark, type TrialCount } from '../session/trialSession'
import { pairWords, playById, toActivityWord } from './activityWords'
import { AdultScoringBar } from './AdultScoringBar'
import { TrialPrompt } from './TrialPrompt'
import { TurnsOption } from './TurnsOption'

interface PlaySessionProps {
  route: CenterRoute & Required<Pick<CenterRoute, 'processId' | 'sound' | 'position' | 'pairId' | 'activityId'>>
  pair: MinimalPair
  roles: PairRoles
  activity: ActivityInfo
  trials: TrialCount
  preview: boolean
}

// The shell around every production game: the trial order, the current word, and the grown-up scoring bar.
// Games request practice completion; this shell owns advancement, marks, undo, and summaries.
export function PlaySession({ route, pair, roles, activity, trials, preview }: PlaySessionProps) {
  const [adultScoring, setAdultScoring] = useState(false)
  const [started, setStarted] = useState(false)
  const practice = !!activity.practiceByDefault && !adultScoring
  const Game = productionGames[activity.id]
  const [state, dispatch] = useReducer(sessionReducer, undefined, () => startSession(buildTrials(roles.target.id, roles.contrast.id, trials)))
  const [revealedAt, setRevealedAt] = useState(-1)
  const words = useMemo(() => pairWords(pair).map(word => toActivityWord(word, preview)), [pair, preview])
  const wordById = (id: string) => words.find(word => word.id === id) as ActivityWord
  const trial = currentTrial(state)
  const current = trial ? { word: wordById(trial.wordId) } : null
  const done = state.trials.slice(0, state.current).map(item => wordById(item.wordId))
  const sequence = state.trials.map(item => wordById(item.wordId))
  const revealed = !activity.revealsWord || revealedAt === state.markId
  const finished = isComplete(state)

  const mark = useCallback((value: Mark) => dispatch({ type: 'mark', mark: value }), [])
  const advance = useCallback(() => dispatch({ type: 'advance' }), [])
  const undo = useCallback(() => dispatch({ type: 'undo' }), [])
  const onReveal = useCallback(() => setRevealedAt(state.markId), [state.markId])
  const onStart = useCallback(() => setStarted(true), [])
  // A new round remounts the game, so timed games (Bubble Pop, Say the Word) start fresh.
  const [round, setRound] = useState(0)
  const restart = () => { setRound(value => value + 1); dispatch({ type: 'restart', trials: buildTrials(roles.target.id, roles.contrast.id, trials) }) }
  const finish = () => {
    const result: SessionResult = {
      kind: practice ? 'practice' : 'production', activityId: activity.id, activityName: activity.name,
      processId: route.processId, sound: route.sound, position: route.position, pairId: pair.id,
      targetId: roles.target.id, contrastId: roles.contrast.id, total: trials,
      summary: summarize(state.trials), approved: isPlayable(pair), finishedOn: today(),
    }
    navigate(centerPath({ ...route, view: 'complete' }), undefined, result)
  }

  // Preview status is shown above the game; these notes are only about this turn's word.
  const notes: string[] = []
  const lexiconWord = trial ? getWord(trial.wordId) : undefined
  if (lexiconWord && !canPlayRecording(lexiconWord, preview)) notes.push(`No recording for “${lexiconWord.text}” yet, so say it yourself if the child needs a model.`)
  else if (lexiconWord && preview && !canPlayRecording(lexiconWord, false) && hasRecording(lexiconWord)) notes.push(`The recording for “${lexiconWord.text}” has not been reviewed yet.`)

  return (
    <div className={`mp-play mp-play-${activity.id}`}>
      <p className="mp-play-howto"><span aria-hidden="true">{activity.icon}</span> {activity.howTo}</p>
      {state.current === 0 && !started && (
        <div className="mp-play-options" aria-label="Grown-up options" role="group">
          <TurnsOption route={route} trials={trials} noun={activity.turnNoun} />
          {activity.practiceByDefault && <label className="mp-adult-option"><input type="checkbox" checked={adultScoring} onChange={event => setAdultScoring(event.target.checked)} /> Grown-up scoring</label>}
        </div>
      )}
      <div className={`mp-play-main${activity.pictureInGame || activity.promptInGame ? ' mp-play-main-compact' : ''}`}>
        {!activity.promptInGame && <TrialPrompt word={current?.word ?? null} showPicture={!activity.pictureInGame} hidden={!revealed} onListen={word => playById(word.id)} />}
        <Game key={`${practice ? 'practice' : 'scored'}-${round}`} onComplete={practice ? advance : undefined} onStart={onStart} total={trials} completed={state.current} current={current} done={done} sequence={sequence} words={words} markId={state.markId} lastAction={state.lastAction} revealed={revealed} onReveal={onReveal} />
      </div>
      {finished && (
        <div className="mp-finish" role="status">
          <p className="mp-finish-title">All done! <span aria-hidden="true">🎉</span></p>
          <div className="mp-finish-actions">
            <button className="mp-button" onClick={finish}>See how it went</button>
            <button className="mp-button mp-button-soft" onClick={restart}>Play again</button>
          </div>
        </div>
      )}
      {!practice && <AdultScoringBar completed={state.current} total={trials} finished={finished} onMark={mark} onUndo={undo} notes={notes} />}
    </div>
  )
}
