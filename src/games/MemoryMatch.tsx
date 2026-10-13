import { useState } from 'react'
import type { SpeechWord, GameProps } from '../types'
import { WordPicture } from '../components/WordPicture'
import { RepetitionCounter } from '../components/RepetitionCounter'
import { sayWord } from '../practice/speech'
import './MemoryMatch.css'

interface Card {
  id: string
  word: SpeechWord
  isFlipped: boolean
  isMatched: boolean
}

// 4 x 3 grid = 6 pairs
const PAIRS = 6

function dealCards(words: SpeechWord[]): Card[] {
  const shuffled = [...words].sort(() => Math.random() - 0.5)
  // Categories with fewer than 6 words repeat some words to fill the grid
  const picked = Array.from({ length: PAIRS }, (_, i) => shuffled[i % shuffled.length])
  return [...picked, ...picked].sort(() => Math.random() - 0.5).map((word, idx) => ({
    id: `${word.id}-${idx}`, word, isFlipped: false, isMatched: false,
  }))
}

export function MemoryMatch({ words, onComplete }: GameProps) {
  const [cards, setCards] = useState<Card[]>(() => dealCards(words))
  const [flipped, setFlipped] = useState<string[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [reps, setReps] = useState(0)
  const [uniqueWordsFound, setUniqueWordsFound] = useState(new Set<string>())

  const initializeGame = () => {
    setCards(dealCards(words))
    setFlipped([])
    setMatched([])
    setReps(0)
    setUniqueWordsFound(new Set())
  }

  const handleCardClick = (cardId: string) => {
    if (flipped.includes(cardId) || matched.includes(cardId)) return
    if (flipped.length >= 2) return
    sayWord(cards.find(c => c.id === cardId)!.word.word)

    const newFlipped = [...flipped, cardId]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const card1 = cards.find(c => c.id === newFlipped[0])
      const card2 = cards.find(c => c.id === newFlipped[1])

      if (card1 && card2 && card1.word.word === card2.word.word) {
        const newMatched = [...matched, ...newFlipped]
        setMatched(newMatched)
        const newUniqueWords = new Set([...uniqueWordsFound, card1.word.word])
        setUniqueWordsFound(newUniqueWords)

        if (newMatched.length === cards.length) {
          setTimeout(() => {
            onComplete({
              wordsPracticed: newUniqueWords.size,
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
