import { useState } from 'react'
import type { ActivityWord } from '../activities/types'

interface TrialPromptProps {
  word: ActivityWord | null
  showPicture: boolean
  hidden?: boolean // Spin & Say keeps the word secret until the spinner lands
  onListen: (word: ActivityWord) => Promise<boolean>
}

// The current word: picture, printed word, and a listen button when a recording can be played.
// A word without a recording simply has no listen button; nothing falls back to a device voice.
export function TrialPrompt({ word, showPicture, hidden = false, onListen }: TrialPromptProps) {
  const [failedFor, setFailedFor] = useState<string | null>(null)
  if (!word) return null
  if (hidden) return <div className="mp-prompt mp-prompt-hidden" aria-live="polite"><span aria-hidden="true">❓</span> Spin to find your word!</div>
  const listen = () => onListen(word).then(played => setFailedFor(played ? null : word.id))
  return (
    <div className={`mp-prompt${showPicture ? '' : ' mp-prompt-compact'}`} aria-live="polite">
      {showPicture && word.picture}
      <div className="mp-prompt-word">{word.text}</div>
      {word.canListen && (
        <button className="mp-listen" onClick={listen} aria-label={`Hear ${word.text}`}>
          <span aria-hidden="true">🔊</span> Hear it
        </button>
      )}
      {failedFor === word.id && <p className="mp-prompt-note">The sound didn’t play. Let’s just say it!</p>}
    </div>
  )
}
