import type { SpeechSound } from '../types'
import './SoundSelector.css'

interface SoundSelectorProps {
  sounds: SpeechSound[]
  onSelect: (soundId: string) => void
}

export function SoundSelector({ sounds, onSelect }: SoundSelectorProps) {
  return (
    <div className="sound-selector">
      <p className="eyebrow">YOUR ADVENTURE STARTS HERE</p>
      <h2>Which sound shall we explore?</h2>
      <p className="selector-subtitle">Pick a sound, choose a game, and give it a go!</p>
      <div className="sound-grid">
        {sounds.map(sound => (
          <button
            key={sound.id}
            className={`sound-card ${sound.comingSoon ? 'coming-soon' : ''}`}
            onClick={() => !sound.comingSoon && onSelect(sound.id)}
            disabled={sound.comingSoon}
          >
            <span className="sound-symbol" aria-hidden="true">{sound.comingSoon ? "✧" : "🚀"}</span>
            <div className="sound-name">{sound.name}</div>
            {!sound.comingSoon && <span className="sound-ready">Let’s go →</span>}
            {sound.comingSoon && <div className="coming-soon-badge">Coming Soon</div>}
          </button>
        ))}
      </div>
    </div>
  )
}
