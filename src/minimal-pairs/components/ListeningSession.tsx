import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { navigate } from '../../routing/router'
import type { ActivityInfo } from '../activities/catalog'
import { ListeningDiscrimination } from '../activities/ListeningDiscrimination'
import type { ActivityWord } from '../activities/types'
import { isPlayable } from '../content/selectors'
import type { MinimalPair, PairRoles } from '../content/types'
import { centerPath, type CenterRoute } from '../route'
import { buildListeningTrials, listeningReducer, startListening, summarizeListening } from '../session/listeningSession'
import { today, type SessionResult } from '../session/result'
import type { TrialCount } from '../session/trialSession'
import { sayPhrase } from '../../practice/speech'
import { pairWords, playById, toActivityWord } from './activityWords'
import { TurnsOption } from './TurnsOption'

interface ListeningSessionProps {
  route: CenterRoute & Required<Pick<CenterRoute, 'processId' | 'sound' | 'position' | 'pairId' | 'activityId'>>
  pair: MinimalPair
  roles: PairRoles
  activity: ActivityInfo
  trials: TrialCount
}

// Listening Discrimination. Only reachable when both words have pictures and reviewed recordings
// (route.ts checks pairListeningReady). Answers are taps, so they are scored here automatically
// (first tap only) and reported as receptive results, separate from production.
export function ListeningSession({ route, pair, roles, activity, trials }: ListeningSessionProps) {
  const [state, dispatch] = useReducer(listeningReducer, undefined, () => startListening(buildListeningTrials(roles.target.id, roles.contrast.id, trials)))
  const [listenedFor, setListenedFor] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [failedFor, setFailedFor] = useState(-1)
  const [shaking, setShaking] = useState<string | null>(null)
  // Listening uses reviewed recordings only, in every mode.
  const words = useMemo(() => pairWords(pair).map(word => toActivityWord(word, false)), [pair])
  const wordById = (id: string) => words.find(word => word.id === id) as ActivityWord
  const trial = state.trials[state.current]
  const finished = state.current >= state.trials.length
  const feedback = state.lastAction === 'answer' ? { kind: 'right' as const, word: wordById(state.trials[state.current - 1].wordId) }
    : state.lastAction === 'miss' ? { kind: 'oops' as const } : null

  // quiet: an automatic play the browser may block before the first tap; the Listen button covers that.
  const listen = useCallback((quiet = false) => {
    if (!trial) return
    const markId = state.markId
    setPlaying(true)
    playById(trial.wordId).then(played => {
      setPlaying(false)
      if (played) setListenedFor(markId)
      else if (!quiet) setFailedFor(markId)
    })
  }, [trial, state.markId])

  // Each word plays by itself: at the start, and after the right picture is tapped.
  useEffect(() => {
    if ((state.lastAction !== 'start' && state.lastAction !== 'answer') || finished) return
    const start = state.lastAction === 'start'
    const timer = setTimeout(() => listen(start), start ? 600 : 1400)
    return () => clearTimeout(timer)
  }, [state.markId, state.lastAction, finished, listen])

  const pick = (wordId: string) => {
    if (trial && wordId !== trial.wordId) {
      setShaking(wordId)
      // "Oops, try again!" then the word again. Pictures stay locked until the word has replayed.
      setPlaying(true)
      if (!sayPhrase('oops-try-again', () => listen())) listen()
    }
    dispatch({ type: 'answer', wordId })
  }

  const finish = () => {
    const result: SessionResult = {
      kind: 'listening', activityId: activity.id, activityName: activity.name,
      processId: route.processId, sound: route.sound, position: route.position, pairId: pair.id,
      targetId: roles.target.id, contrastId: roles.contrast.id, total: trials,
      summary: summarizeListening(state.trials), approved: isPlayable(pair), finishedOn: today(),
    }
    navigate(centerPath({ ...route, view: 'complete' }), undefined, result)
  }

  return (
    <div className="mp-play mp-play-listening">
      <p className="mp-play-howto"><span aria-hidden="true">{activity.icon}</span> {activity.howTo}</p>
      {state.current === 0 && !trial?.answer && <div className="mp-play-options" aria-label="Grown-up options" role="group"><TurnsOption route={route} trials={trials} noun={activity.turnNoun} /></div>}
      <ListeningDiscrimination
        words={words}
        total={trials}
        completed={state.current}
        listened={listenedFor === state.markId}
        playing={playing}
        feedback={feedback}
        shaking={shaking}
        onListen={() => listen()}
        onPick={pick}
        onShakeEnd={() => setShaking(null)}
      />
      {failedFor === state.markId && <p className="mp-scoring-note" role="alert">The sound didn’t play. Check the volume, then tap Listen again.</p>}
      {finished && (
        <div className="mp-finish" role="status">
          <p className="mp-finish-title">All done! <span aria-hidden="true">🎉</span></p>
          <div className="mp-finish-actions">
            <button className="mp-button" onClick={finish}>See how it went</button>
            <button className="mp-button mp-button-soft" onClick={() => dispatch({ type: 'restart', trials: buildListeningTrials(roles.target.id, roles.contrast.id, trials) })}>Play again</button>
          </div>
        </div>
      )}
      <section className="mp-scoring mp-scoring-listening" aria-label="Grown-up controls">
        <div className="mp-scoring-head">
          <span className="mp-scoring-title"><span aria-hidden="true">🧑‍🏫</span> Grown-up</span>
          <span className="mp-scoring-count">Scored automatically from the child’s taps</span>
        </div>
        <div className="mp-scoring-buttons">
          <button className="mp-score mp-score-undo" onClick={() => dispatch({ type: 'undo' })} disabled={state.current === 0 && !trial?.answer}><span aria-hidden="true">↶</span> Undo last tap</button>
        </div>
      </section>
    </div>
  )
}
