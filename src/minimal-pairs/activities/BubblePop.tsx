import { useEffect, useState } from 'react'
import type { ActivityProps } from './types'

// The bubble waits for the child. A pop celebrates an attempt, never judges speech.
export function BubblePop({ total, completed, current, markId, onComplete }: ActivityProps) {
  const [poppedFor, setPoppedFor] = useState(-1)
  const popped = poppedFor === markId

  useEffect(() => {
    if (!popped || !onComplete) return
    const timer = window.setTimeout(onComplete, 650)
    return () => window.clearTimeout(timer)
  }, [popped, onComplete])

  return (
    <div className="mp-game bubble-pop">
      <div className="bp-ocean" aria-hidden="true">
        <div className="bp-rays" />
        {Array.from({ length: 7 }, (_, i) => <span className="bp-tiny-bubble" key={i} style={{ left: `${8 + i * 14}%`, animationDelay: `${i * -1.7}s` }} />)}
        <svg className="bp-seafloor" viewBox="0 0 600 140" preserveAspectRatio="none">
          <path d="M0 90Q150 55 300 90T600 85V140H0Z" fill="#e9d5a2" />
          <g fill="none" strokeLinecap="round" strokeWidth="12">
            <path d="M35 105Q10 70 30 25M45 110Q70 65 50 40M560 110Q535 65 555 20M575 110Q600 80 580 50" stroke="#278f81" />
            <path d="M70 115Q85 80 75 65M530 110Q510 85 520 60" stroke="#53b59b" />
          </g>
          <ellipse cx="140" cy="116" rx="28" ry="10" fill="#c6b48e" />
          <path d="m440 102 6-17 7 17 18 1-14 11 4 17-15-9-15 9 4-17-14-11z" fill="#ecaa83" />
        </svg>
      </div>
      <div className="bp-stage">
        {current ? (
          <button key={markId} className={`bp-bubble${popped ? ' popped' : ''}`} onClick={() => setPoppedFor(markId)} disabled={popped}
            aria-label={popped ? 'Bubble popped' : `Say ${current.word.text}, then pop the bubble`}>
            {popped ? <span className="bp-splash" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ rotate: `${i * 45}deg` }} />)}</span> : current.word.picture}
          </button>
        ) : <div className="bp-ocean-finish"><span aria-hidden="true">🫧</span><p>Wonderful practicing!</p></div>}
        <p className="mp-game-cheer" aria-live="polite">{!current ? 'All the bubbles are popped! 🎉' : popped ? (onComplete ? 'Pop! Here comes another…' : 'Pop! Ready for your grown-up.') : 'Say it, then pop!'}</p>
      </div>
      <div className="bp-progress" role="progressbar" aria-label="Bubbles popped" aria-valuemin={0} aria-valuemax={total} aria-valuenow={completed}>
        <span style={{ width: `${completed / total * 100}%` }} />
      </div>
      <p className="bp-count">{completed} / {total}</p>
    </div>
  )
}
