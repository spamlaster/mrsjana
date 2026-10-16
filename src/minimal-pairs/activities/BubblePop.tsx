import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { defaultPace, type Pace } from './pace'
import { PaceControls } from './PaceControls'
import type { ActivityProps } from './types'

interface Bubble {
  index: number // the trial this bubble carries
  x: number // 0–1 across the sea floor
  rise: number // seconds to reach the top, fixed when it is sent up
}

// A spot along the sea floor away from the last bubble, so bubbles don't rise on top of each other.
function spot(previous?: number): number {
  for (let tries = 0; tries < 12; tries++) {
    const x = Math.random()
    if (previous === undefined || Math.abs(x - previous) > 0.25) return x
  }
  return previous !== undefined && previous < 0.5 ? 0.85 : 0.15
}

// After Start, a bubble rises from a random spot every few seconds and takes half a second longer than
// that to reach the top, where it hovers until popped. In unscored practice (onComplete) any bubble can
// be popped, in any order. With grown-up scoring, scores stay in turn order: the bubble whose turn it is
// glows, and only it can be popped (a score pops it too).
export function BubblePop({ total, completed, words, sequence, onComplete, onStart }: ActivityProps) {
  const practice = !!onComplete
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [pace, setPace] = useState<Pace>(defaultPace)
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [tapped, setTapped] = useState<ReadonlySet<number>>(() => new Set())
  const finished = completed >= total
  const running = started && !paused && !finished

  const send = useCallback(() => {
    setBubbles(list => (list.length >= total ? list : [...list, { index: list.length, x: spot(list.at(-1)?.x), rise: pace + 0.5 }]))
  }, [total, pace])

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(send, pace * 1000)
    return () => window.clearInterval(timer)
  }, [running, pace, send])

  const start = () => { setStarted(true); send(); onStart?.() }
  const isPopped = (index: number) => tapped.has(index) || (!practice && index < completed)
  const pop = (index: number) => {
    if (paused || isPopped(index) || (!practice && index !== completed)) return
    setTapped(set => new Set(set).add(index))
    onComplete?.()
  }

  const cheer = finished ? 'All the bubbles are popped! 🎉'
    : !started ? 'Press Start. Say each word, then pop its bubble!'
    : paused ? 'Paused'
    : practice ? 'Say it, then pop it before it reaches the top!'
    : 'Say the glowing bubble’s word, then pop it!'

  return (
    <div className={`mp-game bubble-pop${paused ? ' paused' : ''}`}>
      <div className="bp-sea">
        <OceanScene />
        <div className="bp-legend" aria-label="The words">
          {words.map(word => <span className="bp-legend-word" key={word.id}>{word.picture}<span>{word.text}</span></span>)}
        </div>
        {bubbles.map(bubble => {
          const word = sequence[bubble.index]
          if (!word) return null
          const done = isPopped(bubble.index)
          const turn = !practice && !done && bubble.index === completed
          return (
            <button
              key={bubble.index}
              className={`bp-bubble${done ? ' popped' : ''}${turn ? ' turn' : ''}`}
              style={{ '--x': bubble.x, '--rise': `${bubble.rise}s` } as CSSProperties}
              onClick={() => pop(bubble.index)}
              disabled={done}
              aria-label={done ? 'Bubble popped' : `Say ${word.text}, then pop the bubble`}
            >
              {done
                ? <span className="bp-splash" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ rotate: `${i * 45}deg` }} />)}</span>
                : <span className="bp-bubble-inner">{word.picture}</span>}
            </button>
          )
        })}
        {finished && <div className="bp-ocean-finish"><span aria-hidden="true">🫧</span><p>Wonderful practicing!</p></div>}
      </div>
      <p className="mp-game-cheer" key={`${started}-${paused}-${finished}`} aria-live="polite">{cheer}</p>
      <div className="bp-progress" role="progressbar" aria-label="Bubbles popped" aria-valuemin={0} aria-valuemax={total} aria-valuenow={completed}>
        <span style={{ width: `${completed / total * 100}%` }} />
      </div>
      <p className="bp-count">{completed} / {total}</p>
      {!finished && <PaceControls label="Seconds per bubble" name="bp-pace" started={started} paused={paused} pace={pace} onStart={start} onTogglePause={() => setPaused(value => !value)} onPace={setPace} />}
    </div>
  )
}

// Decoration only: sunbeams, a coral reef, swaying seaweed, and fish. Bubbles rise in front of it.
function OceanScene() {
  return (
    <div className="bp-ocean" aria-hidden="true">
      <svg className="bp-rays" viewBox="0 0 600 480" preserveAspectRatio="none">
        <g fill="#ffffff">
          <path d="M120 0h60L110 480H40z" opacity=".10" />
          <path d="M260 0h40l-20 480h-90z" opacity=".08" />
          <path d="M400 0h70l40 480h-60z" opacity=".10" />
          <path d="M520 0h30l60 480h-40z" opacity=".07" />
        </g>
      </svg>
      {Array.from({ length: 9 }, (_, i) => <span className="bp-tiny-bubble" key={i} style={{ left: `${5 + i * 11}%`, animationDelay: `${i * -1.4}s`, animationDuration: `${9 + (i % 3) * 3}s` }} />)}
      <svg className="bp-fish bp-fish-1" viewBox="0 0 60 36"><path d="M44 18 60 4v28z" fill="#ff9f1c" /><ellipse cx="26" cy="18" rx="24" ry="14" fill="#ffbf47" /><path d="M20 6q6 12 0 24" stroke="#ff9f1c" strokeWidth="4" fill="none" /><circle cx="12" cy="15" r="3" fill="#24324a" /></svg>
      <svg className="bp-fish bp-fish-2" viewBox="0 0 60 36"><path d="M44 18 60 4v28z" fill="#e84393" /><ellipse cx="26" cy="18" rx="24" ry="13" fill="#ff7eb6" /><circle cx="12" cy="15" r="3" fill="#24324a" /></svg>
      <svg className="bp-fish bp-fish-3" viewBox="0 0 60 36"><path d="M44 18 60 4v28z" fill="#00a8a8" /><ellipse cx="26" cy="18" rx="24" ry="12" fill="#55efc4" /><path d="M18 7v22M28 6v24" stroke="#00a8a8" strokeWidth="3" /><circle cx="11" cy="15" r="3" fill="#24324a" /></svg>
      <svg className="bp-seafloor" viewBox="0 0 600 170" preserveAspectRatio="xMidYMax slice">
        <path d="M0 95Q90 60 190 88T400 80T600 70V170H0Z" fill="#1d7a8c" opacity=".55" />
        <g className="bp-weed" strokeLinecap="round" fill="none" strokeWidth="11">
          <path d="M40 150Q15 110 38 70T30 10" stroke="#20bf6b" />
          <path d="M62 152Q85 115 60 85T70 40" stroke="#26de81" />
        </g>
        <g className="bp-weed bp-weed-slow" strokeLinecap="round" fill="none" strokeWidth="11">
          <path d="M548 152Q525 110 550 75T540 20" stroke="#20bf6b" />
          <path d="M575 152Q598 118 572 88T585 50" stroke="#26de81" />
          <path d="M330 155Q318 128 334 106" stroke="#2bcbba" />
        </g>
        <g strokeLinecap="round" fill="none" strokeWidth="9" stroke="#ff6b81">
          <path d="M140 150V112M140 128 120 104M140 120 158 96M120 104l-8-14M158 96l6-14" />
        </g>
        <path d="M420 150q-34-60 0-86 34 26 0 86z" fill="#a55eea" />
        <path d="M420 148V80M420 112l-16-16M420 104l16-16" stroke="#d6a2ff" strokeWidth="3" fill="none" />
        <ellipse cx="232" cy="146" rx="34" ry="22" fill="#ff9f43" />
        <path d="M206 142q13-10 26 0t26 0M210 152q11-8 22 0t22 0" stroke="#e17f1f" strokeWidth="3" fill="none" />
        <g fill="#fed330"><rect x="478" y="112" width="13" height="40" rx="6" /><rect x="494" y="100" width="13" height="52" rx="6" /><rect x="510" y="120" width="13" height="32" rx="6" /></g>
        <path d="M0 150Q120 132 260 146T600 140V170H0Z" fill="#f7d794" />
        <path d="M0 160Q150 150 300 160T600 156V170H0Z" fill="#f3c66f" />
        <path d="m300 140 6-15 6 15 16 1-12 10 4 15-14-8-14 8 4-15-12-10z" fill="#ff7f50" />
        <path d="M368 156a12 12 0 0 1 24 0z" fill="#ffe0e6" />
        <path d="M373 156l7-11 7 11" stroke="#f7a8b8" strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}
