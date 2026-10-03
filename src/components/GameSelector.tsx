import type { GameDefinition } from '../types'
import './GameSelector.css'

interface GameSelectorProps {
  games: GameDefinition[]
  soundName: string
  categoryName: string
  onSelect: (gameId: string) => void
  onBack: () => void
}

export function GameSelector({
  games,
  soundName,
  categoryName,
  onSelect,
  onBack,
}: GameSelectorProps) {
  return (
    <div className="game-selector">
      <div className="selector-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back" title="Go back">
          ←
        </button>
        <div className="header-text">
          <h2>{soundName} • {categoryName}</h2>
        </div>
      </div>

      <p className="eyebrow">STEP 3 · PLAYTIME!</p>
      <h3>Pick your adventure</h3>
      <div className="game-grid">
        {games.map(game => (
          <button
            key={game.id}
            className="game-card"
            onClick={() => onSelect(game.id)}
          >
            <span className="game-icon" aria-hidden="true">{game.id === 'key-house' ? '🔑' : game.id === 'memory-match' ? '🃏' : game.id === 'speech-pop' ? '🎈' : '🏴‍☠️'}</span>
            <div className="game-name">{game.name}</div>
            <div className="game-description">{game.description}</div>
            <span className="game-play">Let’s play →</span>
          </button>
        ))}
      </div>
    </div>
  )
}
