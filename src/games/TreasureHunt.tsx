import { useState, useEffect } from 'react'
import type { SpeechWord, GameProps } from '../types'
import { RepetitionCounter } from '../components/RepetitionCounter'
import './TreasureHunt.css'

interface Treasure {
  id: string
  word: SpeechWord
  isRevealed: boolean
  earned: boolean
}

const GOAL = 8

export function TreasureHunt({ words, onComplete }: GameProps) {
  const [treasures, setTreasures] = useState<Treasure[]>([])
  const [coinsEarned, setCoinsEarned] = useState(0)
  const [reps, setReps] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showSayPrompt, setShowSayPrompt] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [words])

  const initializeGame = () => {
    const newTreasures: Treasure[] = words.map(word => ({
      id: word.id,
      word,
      isRevealed: false,
      earned: false,
    }))
    setTreasures(newTreasures)
    setCoinsEarned(0)
    setReps(0)
    setSelectedId(null)
    setShowSayPrompt(false)
  }

  const handleTreasureClick = (treasureId: string) => {
    if (treasures.find(t => t.id === treasureId)?.isRevealed) return

    setSelectedId(treasureId)
    setTreasures(prev =>
      prev.map(t =>
        t.id === treasureId ? { ...t, isRevealed: true } : t
      )
    )
    setShowSayPrompt(true)
  }

  const handleSaidIt = () => {
    if (!selectedId) return

    const newTreasures = treasures.map(t =>
      t.id === selectedId ? { ...t, earned: true } : t
    )
    setTreasures(newTreasures)

    const newCoins = coinsEarned + 1
    setCoinsEarned(newCoins)
    setShowSayPrompt(false)

    if (newCoins >= GOAL) {
      setTimeout(() => {
        onComplete({
          wordsPracticed: GOAL,
          speechReps: reps,
          gameName: 'Treasure Hunt',
        })
      }, 800)
    } else {
      setSelectedId(null)
    }
  }

  const revealedTreasure = selectedId
    ? treasures.find(t => t.id === selectedId)
    : null

  return (
    <div className="treasure-hunt">
      <div className="game-header">
        <div className="coins-earned">
          <span className="coins-icon">💰</span>
          <span className="coins-value">{coinsEarned}/{GOAL}</span>
        </div>
        <div className="progress-text">Coins Earned</div>
      </div>

      <RepetitionCounter
        reps={reps}
        onAdd={(amount) => setReps(r => r + amount)}
        goal={30}
      />

      {showSayPrompt && revealedTreasure ? (
        <div className="reveal-panel">
          <div className="reveal-content">
            <p className="say-prompt">Say this word:</p>
            <div className="revealed-word">{revealedTreasure.word.word}</div>
            <button className="said-it-btn" onClick={handleSaidIt}>
              Said It! ✓
            </button>
          </div>
        </div>
      ) : (
        <div className="treasures-grid">
          {treasures.map(treasure => (
            <button
              key={treasure.id}
              className={`treasure-box ${treasure.isRevealed ? 'opened' : ''} ${treasure.earned ? 'earned' : ''}`}
              onClick={() => handleTreasureClick(treasure.id)}
              disabled={treasure.isRevealed}
            >
              {treasure.earned ? (
                <div className="earned-state">
                  <span className="earned-icon">⭐</span>
                </div>
              ) : treasure.isRevealed ? (
                <div className="open-state">
                  <div className="word-in-box">{treasure.word.word}</div>
                </div>
              ) : (
                <div className="closed-state">
                  <span className="box-icon">📦</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="game-actions">
        <button className="restart-btn" onClick={initializeGame}>
          Start Over
        </button>
      </div>
    </div>
  )
}
