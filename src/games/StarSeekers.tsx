import { useState } from 'react'
import type { SpeechWord, GameProps } from '../types'
import { WordPicture } from '../components/WordPicture'
import { RepetitionCounter } from '../components/RepetitionCounter'
import './StarSeekers.css'

interface Card {
  id: string
  word: SpeechWord | null // null = hidden star
  isFlipped: boolean
}

// 5 x 4 board: 16 picture words + 4 hidden stars
const BOARD_SIZE = 20
const STAR_COUNT = 4

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function dealCards(words: SpeechWord[]): Card[] {
  const shuffled = shuffle(words)
  // Categories with fewer than 16 words repeat some words to fill the board
  const wordCards: Card[] = Array.from({ length: BOARD_SIZE - STAR_COUNT }, (_, i) => {
    const word = shuffled[i % shuffled.length]
    return { id: `${word.id}-${i}`, word, isFlipped: false }
  })
  const starCards: Card[] = Array.from({ length: STAR_COUNT }, (_, i) => ({ id: `star-${i}`, word: null, isFlipped: false }))
  return shuffle([...wordCards, ...starCards])
}

const STAR_PATH = 'm50 8 12 26 29 4-21 21 5 30-25-14-25 14 5-30L9 38l29-4z'

function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <path
        d={STAR_PATH}
        fill={filled ? '#ffc957' : 'none'}
        stroke={filled ? '#e8a020' : '#c9bfdc'}
        strokeWidth="5"
        strokeLinejoin="round"
        strokeDasharray={filled ? undefined : '8 6'}
      />
    </svg>
  )
}

export function StarSeekers({ words, onComplete }: GameProps) {
  const [cards, setCards] = useState<Card[]>(() => dealCards(words))
  const [reps, setReps] = useState(0)
  const [lastFlippedId, setLastFlippedId] = useState<string | null>(null)

  const starsFound = cards.filter(c => c.isFlipped && !c.word).length
  const won = starsFound === STAR_COUNT
  const wordsFound = new Set(cards.filter(c => c.isFlipped && c.word).map(c => c.word!.id))
  const lastFlipped = cards.find(c => c.id === lastFlippedId)

  const initializeGame = () => {
    setCards(dealCards(words))
    setReps(0)
    setLastFlippedId(null)
  }

  const handleCardClick = (cardId: string) => {
    if (won) return
    setCards(prev => prev.map(c => (c.id === cardId ? { ...c, isFlipped: true } : c)))
    setLastFlippedId(cardId)
  }

  const finish = () => onComplete({ wordsPracticed: wordsFound.size, speechReps: reps, gameName: 'Star Seekers' })

  return (
    <div className="star-seekers">
      <div className="ss-layout">
        <div className="ss-board">
          {cards.map(card => (
            <button
              key={card.id}
              className={`ss-card ${card.isFlipped ? 'flipped' : ''} ${card.word ? '' : 'is-star'}`}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || won}
              aria-label={card.isFlipped ? (card.word ? card.word.word : 'A star!') : 'Flip a card'}
            >
              <div className="ss-card-inner">
                <div className="ss-card-front" aria-hidden="true">
                  <span className="ss-sparkle">✦</span>
                </div>
                <div className="ss-card-back" aria-hidden={!card.isFlipped}>
                  {card.word ? (
                    <>
                      <WordPicture word={card.word} />
                      <div className="ss-word">{card.word.word}</div>
                    </>
                  ) : (
                    <StarIcon filled className="ss-found-star" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <aside className="ss-sidebar">
          <div className="ss-star-tracker" role="status" aria-live="polite" aria-label={`${starsFound} of ${STAR_COUNT} stars found`}>
            <div className="ss-tracker-label">Stars found</div>
            <div className="ss-tracker-stars">
              {Array.from({ length: STAR_COUNT }, (_, i) => (
                <StarIcon key={i} filled={i < starsFound} className={`ss-tracker-star ${i < starsFound ? 'filled' : ''}`} />
              ))}
            </div>
            <div className="ss-tracker-count">{starsFound} / {STAR_COUNT}</div>
          </div>

          {lastFlipped?.word && !won && (
            <div className="ss-say-it">
              <span>Say it!</span>
              <strong>{lastFlipped.word.word}</strong>
            </div>
          )}

          <RepetitionCounter reps={reps} onAdd={amount => setReps(r => r + amount)} goal={30} />
        </aside>
      </div>

      {won ? (
        <div className="ss-win" role="alert">
          <div className="ss-win-stars" aria-hidden="true">⭐⭐⭐⭐</div>
          <h3>You found all the stars!</h3>
          <button className="cta-button" onClick={finish}>See my stars →</button>
        </div>
      ) : (
        <div className="game-hint">
          <p>Flip the cards and say each word. Can you find all {STAR_COUNT} hidden stars?</p>
        </div>
      )}

      <div className="game-actions">
        <button className="reset-btn" onClick={initializeGame}>
          Start Over
        </button>
      </div>
    </div>
  )
}
