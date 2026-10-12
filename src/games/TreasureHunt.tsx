import { useState } from 'react'
import type { SpeechWord, GameProps } from '../types'
import { WordPicture } from '../components/WordPicture'
import { RepetitionCounter } from '../components/RepetitionCounter'
import './TreasureHunt.css'

interface Treasure {
  id: string
  word: SpeechWord
  isRevealed: boolean
  earned: boolean
}

const GOAL = 8

function TreasureChest() {
  return (
    <svg className="box-icon" viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="#51475d" strokeWidth="2.5" strokeLinejoin="round">
      <path d="M14 46h72v38H14z" fill="#b98961" />
      <path d="M14 46V36q0-20 36-20t36 20v10z" fill="#c99a6b" />
      <path d="M28 18v66m44-66v66" stroke="#e8b43b" strokeWidth="7" />
      <path d="M14 46h72" stroke="#e8b43b" strokeWidth="5" />
      <rect x="42" y="40" width="16" height="20" rx="3" fill="#ffc957" />
      <circle cx="50" cy="49" r="3" fill="#51475d" stroke="none" />
      <path d="M50 51v5" />
    </svg>
  )
}

export function TreasureHunt({ words, onComplete }: GameProps) {
  const [treasures, setTreasures] = useState<Treasure[]>(() => words.map(word => ({ id: word.id, word, isRevealed: false, earned: false })))
  const [coinsEarned, setCoinsEarned] = useState(0)
  const [reps, setReps] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showSayPrompt, setShowSayPrompt] = useState(false)

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

  const unrevealed = treasures.find(t => !t.isRevealed && !t.earned)
  const currentWord = unrevealed?.word || treasures[0]?.word

  return (
    <div className="treasure-hunt">
      <div className="progress">
        <span className="progress-label">Coins</span>
        <span className="progress-value">{coinsEarned}/{GOAL}</span>
      </div>

      {!showSayPrompt && (
        <div className="current-word-display">
          <WordPicture word={currentWord} />
          <span className="word">{currentWord.word}</span>
        </div>
      )}

      {showSayPrompt && revealedTreasure ? (
        <div className="reveal-panel">
          <div className="reveal-content">
            <WordPicture word={revealedTreasure.word} />
            <div className="revealed-word">{revealedTreasure.word.word}</div>
            <button className="cta-button" onClick={handleSaidIt}>
              Said It! ✓
            </button>
          </div>
        </div>
      ) : (
        <div className="game-layout">
          <div className="treasures-grid">
            {treasures.map(treasure => (
              <button
                key={treasure.id}
                className={`treasure-box ${treasure.isRevealed ? 'opened' : ''} ${treasure.earned ? 'earned' : ''}`}
                onClick={() => handleTreasureClick(treasure.id)}
                disabled={treasure.isRevealed}
                aria-label={treasure.isRevealed ? treasure.word.word : "Open a treasure chest"}
              >
                {treasure.earned ? (
                  <div className="earned-state">
                    <span className="earned-icon">⭐</span>
                  </div>
                ) : treasure.isRevealed ? (
                  <div className="open-state">
                    <WordPicture word={treasure.word} />
                    <div className="word-in-box">{treasure.word.word}</div>
                  </div>
                ) : (
                  <div className="closed-state">
                    <TreasureChest />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="game-sidebar">
            <RepetitionCounter
              reps={reps}
              onAdd={(amount) => setReps(r => r + amount)}
              goal={30}
            />
          </div>
        </div>
      )}

      <div className="game-hint">
        <p>Open treasure chests to find words!</p>
      </div>

      <div className="game-actions">
        <button className="reset-btn" onClick={initializeGame}>
          Start Over
        </button>
      </div>
    </div>
  )
}
