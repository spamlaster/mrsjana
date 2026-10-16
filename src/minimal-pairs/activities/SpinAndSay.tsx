import { useEffect, useState } from 'react'
import type { ActivityProps } from './types'

const segmentCount = 8
const segmentAngle = 360 / segmentCount
const segmentColors = [['#ece3fa', '#7658c9'], ['#ffeadf', '#c0583d']]

// A point on the wheel, with 0 degrees at the top and angles growing clockwise.
const point = (angle: number, radius: number) => {
  const radians = ((angle - 90) * Math.PI) / 180
  return `${100 + radius * Math.cos(radians)} ${100 + radius * Math.sin(radians)}`
}

// The wheel alternates the pair's two words. Spinning always lands on the word for this turn,
// so the child finds out what to say; then the grown-up scores as usual.
export function SpinAndSay({ current, words, revealed, onReveal, markId }: ActivityProps) {
  const [rotation, setRotation] = useState(0)
  const [spinningFor, setSpinningFor] = useState(-1)
  const spinning = spinningFor === markId && !revealed

  // Reveal even if the transition end event is missed (for example in a background tab).
  useEffect(() => {
    if (!spinning) return
    const timer = setTimeout(onReveal, 3200)
    return () => clearTimeout(timer)
  }, [spinning, onReveal])

  const spin = () => {
    if (!current || spinning || revealed) return
    const wordIndex = Math.max(0, words.findIndex(word => word.id === current.word.id))
    const choices = Array.from({ length: segmentCount }, (_, i) => i).filter(i => i % words.length === wordIndex)
    const landing = choices[Math.floor(Math.random() * choices.length)]
    const fullTurns = rotation - (rotation % 360) + 360 * 4
    setRotation(fullTurns + 360 - (landing * segmentAngle + segmentAngle / 2))
    setSpinningFor(markId)
  }

  return (
    <div className="mp-game spin-and-say">
      <div className="sas-row">
        <div className="sas-wheel-wrap">
          <span className="sas-pointer" aria-hidden="true">▼</span>
          <svg
            className="sas-wheel"
            viewBox="0 0 200 200"
            style={{ transform: `rotate(${rotation}deg)` }}
            onTransitionEnd={() => { if (spinning) onReveal() }}
            aria-hidden="true"
          >
            {Array.from({ length: segmentCount }, (_, i) => {
              const [fill, ink] = segmentColors[i % 2]
              const start = i * segmentAngle
              const middle = start + segmentAngle / 2
              return (
                <g key={i}>
                  <path d={`M100 100L${point(start, 96)}A96 96 0 0 1 ${point(start + segmentAngle, 96)}Z`} fill={fill} stroke="#fff" strokeWidth="3" />
                  <text transform={`translate(${point(middle, 62)}) rotate(${middle})`} textAnchor="middle" dominantBaseline="middle" fill={ink} fontSize="15" fontWeight="800">
                    {words[i % words.length]?.text}
                  </text>
                </g>
              )
            })}
            <circle cx="100" cy="100" r="16" fill="#ffc957" stroke="#fff" strokeWidth="4" />
          </svg>
        </div>
        <div className="sas-side">
          {current && revealed && <div className="sas-reveal" key={markId}>{current.word.picture}</div>}
          {current && !revealed && (
            <button className="sas-spin" onClick={spin} disabled={spinning}>{spinning ? 'Spinning…' : 'Spin! 🎡'}</button>
          )}
        </div>
      </div>
      <p className="mp-game-cheer" aria-live="polite">
        {!current ? 'What a great spinner! 🎉' : revealed ? 'Say the word!' : spinning ? 'Round and round…' : 'Tap Spin to find your word!'}
      </p>
    </div>
  )
}
