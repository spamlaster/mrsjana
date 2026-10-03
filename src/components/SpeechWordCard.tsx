import type { SpeechWord } from '../types'
import { getPlaceholderColor, getInitials } from '../utils/imageUtils'
import './SpeechWordCard.css'

interface SpeechWordCardProps {
  word: SpeechWord
  onClick?: () => void
  isActive?: boolean
  size?: 'small' | 'medium' | 'large'
}

export function SpeechWordCard({
  word,
  onClick,
  isActive = false,
  size = 'medium',
}: SpeechWordCardProps) {
  const bgColor = getPlaceholderColor(word.word)
  const initials = getInitials(word.word)

  return (
    <div
      className={`speech-word-card ${size} ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{ '--bg-color': bgColor } as React.CSSProperties}
    >
      <div className="image-placeholder">
        <div className="initials">{initials}</div>
      </div>
      <div className="word-text">{word.word}</div>
    </div>
  )
}
