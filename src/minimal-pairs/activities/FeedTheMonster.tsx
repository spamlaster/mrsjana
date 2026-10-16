import { useState } from 'react'
import type { ActivityProps } from './types'

// Munch, a friendly monster. Mouth open while waiting for a snack, chewing once fed.
function Munch({ chewing, fullness }: { chewing: boolean; fullness: number }) {
  return (
    <svg className={`ftm-monster${chewing ? ' chewing' : ''}`} viewBox="0 0 200 200" role="img" aria-label={chewing ? 'Munch is chewing happily' : 'Munch is waiting for a snack'}>
      <path d="M52 52 40 18l32 24M148 52l12-34-32 24" fill="#7658c9" />
      <ellipse cx="100" cy="112" rx="78" ry="74" fill="#9b7be0" />
      <ellipse cx="100" cy="140" rx="46" ry="38" fill="#c9b6f2" />
      {/* The tummy fills up as snacks are eaten. */}
      <clipPath id="ftm-tummy"><ellipse cx="100" cy="140" rx="46" ry="38" /></clipPath>
      <rect x="54" y={178 - 76 * fullness} width="92" height={76 * fullness} fill="#ffc957" clipPath="url(#ftm-tummy)" className="ftm-fill" />
      <circle cx="74" cy="78" r="17" fill="#fff" /><circle cx="126" cy="78" r="17" fill="#fff" />
      <circle cx="78" cy="81" r="7" fill="#343047" /><circle cx="122" cy="81" r="7" fill="#343047" />
      {chewing
        ? <path d="M70 110q30 22 60 0" fill="none" stroke="#343047" strokeWidth="6" strokeLinecap="round" className="ftm-mouth" />
        : <><ellipse cx="100" cy="112" rx="26" ry="16" fill="#51284f" className="ftm-mouth" /><path d="M86 98v8m14-9v9m14-8v8" stroke="#fff" strokeWidth="5" strokeLinecap="round" /></>}
      <circle cx="52" cy="104" r="8" fill="#f2a5c8" opacity=".7" /><circle cx="148" cy="104" r="8" fill="#f2a5c8" opacity=".7" />
    </svg>
  )
}

// Say the word, then tap the snack to feed Munch. Every scored turn fills Munch's tummy a little more.
export function FeedTheMonster({ total, completed, current, markId }: ActivityProps) {
  const [fedFor, setFedFor] = useState(-1)
  const fed = fedFor === markId
  const finished = !current
  return (
    <div className="mp-game feed-the-monster">
      <div className="ftm-stage">
        <Munch chewing={fed || finished} fullness={completed / total} />
        {current && (
          <button key={markId} className={`ftm-snack${fed ? ' eaten' : ''}`} onClick={() => setFedFor(markId)} disabled={fed} aria-label={fed ? 'Munch ate it!' : `Feed Munch the ${current.word.text}`}>
            <span className="ftm-plate">{current.word.picture}</span>
          </button>
        )}
      </div>
      <p className="mp-game-cheer" aria-live="polite">
        {finished ? 'Munch is full and happy! Thank you! 💜' : fed ? 'Yum yum! Munch loved it!' : 'Say the word, then feed Munch!'}
      </p>
      <p className="ftm-count">Snacks: {completed} of {total}</p>
    </div>
  )
}
