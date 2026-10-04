import { useState } from 'react'
import type { SpeechWord, GameProps } from '../types'
import { WordPicture } from '../components/WordPicture'
import { RepetitionCounter } from '../components/RepetitionCounter'
import './MemoryMatch.css'

interface Card {
  id: string
  word: SpeechWord
  isFlipped: boolean
  isMatched: boolean
}

export function MemoryMatch({ words, onComplete }: GameProps) {
  const [cards, setCards] = useState<Card[]>(() => [...words, ...words].sort(() => Math.random() - 0.5).map((word, idx) => ({
    id: `${word.id}-${idx}`, word, isFlipped: false, isMatched: false,
  })))
  const [flipped, setFlipped] = useState<string[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [reps, setReps] = useState(0)
  const [uniqueWordsFound, setUniqueWordsFound] = useState(new Set<string>())

  const initializeGame = () => {
    const doubled = [...words, ...words].sort(() => Math.random() - 0.5)
    const newCards: Card[] = doubled.map((word, idx) => ({
      id: `${word.id}-${idx}`,
      word,
      isFlipped: false,
      isMatched: false,
    }))
    setCards(newCards)
    setFlipped([])
    setMatched([])
    setReps(0)
    setUniqueWordsFound(new Set())
  }

  const handleCardClick = (cardId: string) => {
    if (flipped.includes(cardId) || matched.includes(cardId)) return
    if (flipped.length >= 2) return

    const newFlipped = [...flipped, cardId]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const card1 = cards.find(c => c.id === newFlipped[0])
      const card2 = cards.find(c => c.id === newFlipped[1])

      if (card1 && card2 && card1.word.word === card2.word.word) {
        const newMatched = [...matched, ...newFlipped]
        setMatched(newMatched)
        setUniqueWordsFound(prev => new Set([...prev, card1.word.word]))

        if (newMatched.length === cards.length) {
          setTimeout(() => {
            onComplete({
              wordsPracticed: uniqueWordsFound.size + 1,
              speechReps: reps,
              gameName: 'Memory Match',
            })
          }, 1000)
        }

        setTimeout(() => setFlipped([]), 600)
      } else {
        setTimeout(() => setFlipped([]), 800)
      }
    }
  }

  return (
    <div className="memory-match">
      <div className="progress">
        <span className="progress-label">Matches</span>
        <span className="progress-value">{matched.length / 2}/{cards.length / 2}</span>
      </div>

      <div className="game-layout">
        <div className="cards-grid">
          {cards.map(card => (
            <button
              key={card.id}
              className={`memory-card ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''}`}
              onClick={() => handleCardClick(card.id)}
              disabled={matched.includes(card.id)}
              aria-label={flipped.includes(card.id) || matched.includes(card.id) ? card.word.word : 'Flip a mystery card'}
              aria-pressed={flipped.includes(card.id) || matched.includes(card.id)}
            >
              <div className="card-inner">
                <div className="card-front" aria-hidden="true">?</div>
                <div className="card-back" aria-hidden={!flipped.includes(card.id) && !matched.includes(card.id)}>
                  <div className="word-content">
                    <WordPicture word={card.word} />
                    <div className="word-display">{card.word.word}</div>
                  </div>
                </div>
              </div>
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

      <div className="game-hint">
        <p>Flip cards to find matching pairs!</p>
      </div>

      <div className="game-actions">
        <button className="reset-btn" onClick={initializeGame}>
          Play Again
        </button>
      </div>
    </div>
  )
}
