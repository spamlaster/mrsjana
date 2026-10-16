import { useEffect, useState } from 'react'
import { defaultPace, type Pace } from './pace'
import { PaceControls } from './PaceControls'
import type { ActivityProps } from './types'

// The arrow shows for all but the last second of each word, so a word that comes up twice in a row
// visibly points again.

const cheers = ['Super saying!', 'You did it!', 'Great try!', 'Keep going!', 'Wonderful!']

// Both words side by side; an arrow points to the one to say. In unscored practice (onComplete) the
// game runs by itself after Start, so a child can play alone. With grown-up scoring, the arrow stays
// until the grown-up taps a score.
export function SayTheWord({ total, completed, current, words, markId, lastAction, onComplete, onStart }: ActivityProps) {
  const practice = !!onComplete
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [pace, setPace] = useState<Pace>(defaultPace)
  const [hiddenFor, setHiddenFor] = useState(-1)
  const finished = completed >= total || !current
  const running = practice && started && !paused && !finished
  const pointing = !finished && (!practice || started) && hiddenFor !== markId

  useEffect(() => {
    if (!running || !onComplete) return
    const hide = window.setTimeout(() => setHiddenFor(markId), (pace - 1) * 1000)
    const next = window.setTimeout(onComplete, pace * 1000)
    return () => { window.clearTimeout(hide); window.clearTimeout(next) }
  }, [running, markId, pace, onComplete])

  // Changing speed or resuming starts the current word over, arrow and all.
  const changePace = (value: Pace) => { setHiddenFor(-1); setPace(value) }
  const start = () => { setHiddenFor(-1); setStarted(true); onStart?.() }
  const togglePause = () => { setHiddenFor(-1); setPaused(value => !value) }

  const cheer = finished ? 'Every star is shining! 🌟'
    : practice && !started ? 'Press Start, then say the word the arrow points to.'
    : paused ? 'Paused'
    : completed === 0 || !practice ? 'Say the word the arrow points to!' : cheers[completed % cheers.length]

  return (
    <div className="mp-game say-the-word">
      <ol className="stw-stars" aria-label={`${completed} of ${total} stars`}>
        {Array.from({ length: total }, (_, i) => (
          <li
            key={i}
            className={`stw-star${i < completed ? ' lit' : ''}${i === completed ? ' next' : ''}${i === completed - 1 && lastAction === 'mark' ? ' new' : ''}`}
            aria-hidden="true"
          >★</li>
        ))}
      </ol>
      <div className="stw-pair">
        {words.map(word => {
          const target = pointing && current?.word.id === word.id
          return (
            <div key={word.id} className={`stw-word${target ? ' pointed' : ''}`}>
              <span className="stw-arrow-slot">
                {target && (
                  <svg key={markId} className="stw-arrow" viewBox="0 0 60 70" role="img" aria-label={`Say ${word.text}`}>
                    <path d="M18 4h24v30h14L30 66 4 34h14z" />
                  </svg>
                )}
              </span>
              {word.picture}
              <span className="stw-word-text">{word.text}</span>
            </div>
          )
        })}
      </div>
      <p className="mp-game-cheer" key={`${markId}-${started}-${paused}`} aria-live="polite">{cheer}</p>
      {practice && !finished && (
        <PaceControls label="Seconds per word" name="stw-pace" started={started} paused={paused} pace={pace} onStart={start} onTogglePause={togglePause} onPace={changePace} />
      )}
    </div>
  )
}
