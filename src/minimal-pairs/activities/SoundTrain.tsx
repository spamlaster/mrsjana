import type { CSSProperties } from 'react'
import type { ActivityProps } from './types'

const carColors = ['#ed745b', '#ffc957', '#72b48a', '#80b6dc', '#9b7be0']
const visibleCars = 3

// Every scored turn adds a car and moves the train one stop closer to the station.
// The newest cars carry pictures of the words just said.
export function SoundTrain({ total, completed, done, lastAction }: ActivityProps) {
  const finished = completed >= total
  const progress = completed / total
  const cars = done.slice(-visibleCars)
  return (
    <div className="mp-game sound-train">
      <div className="st-track-wrap">
        <div className="st-track" aria-hidden="true">
          {Array.from({ length: total + 1 }, (_, stop) => (
            <span key={stop} className={`st-stop${stop <= completed ? ' passed' : ''}`} style={{ left: `${(stop / total) * 100}%` }} />
          ))}
          <span className="st-station">🏁</span>
        </div>
        <div className="st-train" style={{ '--progress': progress } as CSSProperties} aria-hidden="true">
          {completed > visibleCars && <span className="st-more">+{completed - visibleCars}</span>}
          {cars.map((word, i) => (
            <span key={`${completed - cars.length + i}`} className={`st-car${i === cars.length - 1 && lastAction === 'mark' ? ' new' : ''}`} style={{ background: carColors[(completed - cars.length + i) % carColors.length] }}>
              {word.picture}
            </span>
          ))}
          <svg className="st-engine" viewBox="0 0 64 48">
            <rect x="4" y="8" width="24" height="26" rx="4" fill="#7658c9" />
            <rect x="9" y="13" width="14" height="11" rx="2" fill="#c5e5ef" />
            <path d="M28 18h24q6 0 6 8v8H28z" fill="#9b7be0" />
            <rect x="44" y="6" width="8" height="12" rx="2" fill="#51475d" />
            <path d="M58 34l6 8H52z" fill="#ffc957" />
            <circle cx="16" cy="38" r="7" fill="#343047" /><circle cx="44" cy="38" r="7" fill="#343047" />
          </svg>
        </div>
      </div>
      <p className="mp-game-cheer" aria-live="polite">
        {finished ? `All aboard! ${total} cars made it to the station! 🎉` : completed === 0 ? 'Say the word to add the first car!' : `${completed} ${completed === 1 ? 'car' : 'cars'} so far. Choo choo!`}
      </p>
    </div>
  )
}
