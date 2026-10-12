import { useState } from 'react'
import type { SpeechWord, GameProps } from '../types'
import { WordPicture } from '../components/WordPicture'
import { RepetitionCounter } from '../components/RepetitionCounter'
import { sayPhrase, sayWord } from '../practice/speech'
import './TreasureHunt.css'

type Clue = 'warm' | 'cold' | 'gold'

interface Chest {
  id: string
  word: SpeechWord
  clue: Clue | null // set once the word has been said
}

// 3 x 3 island: every chest holds a word, and one also holds the gold.
const COLUMNS = 3
const CHEST_COUNT = 9
// The gold never turns up before this many chests are opened, so every hunt practices a few words.
const MIN_CHESTS = 4

const CLUE_TEXT: Record<Clue, string> = {
  warm: 'Getting warmer! The gold is right next to this chest.',
  cold: 'Brrr, cold! The gold is not next to this chest.',
  gold: 'Hooray! You found the treasure!',
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function placeChests(words: SpeechWord[]): Chest[] {
  const shuffled = shuffle(words)
  // Categories with fewer than 9 words repeat some words to fill the island
  return Array.from({ length: CHEST_COUNT }, (_, i) => {
    const word = shuffled[i % shuffled.length]
    return { id: `${word.id}-${i}`, word, clue: null }
  })
}

const allSpots = () => Array.from({ length: CHEST_COUNT }, (_, i) => i)

// Side by side or above/below, not diagonal.
function isNextTo(a: number, b: number) {
  const rows = Math.abs(Math.floor(a / COLUMNS) - Math.floor(b / COLUMNS))
  const cols = Math.abs((a % COLUMNS) - (b % COLUMNS))
  return rows + cols === 1
}

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

function GoldPile({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" stroke="#b07a12" strokeWidth="2.5">
      <ellipse cx="50" cy="80" rx="38" ry="10" fill="#e8a020" />
      <ellipse cx="34" cy="68" rx="14" ry="6" fill="#ffc957" />
      <ellipse cx="62" cy="66" rx="14" ry="6" fill="#ffc957" />
      <ellipse cx="48" cy="54" rx="14" ry="6" fill="#ffd977" />
      <ellipse cx="50" cy="40" rx="14" ry="6" fill="#ffe08a" />
      <path d="M76 22l3 7 7 3-7 3-3 7-3-7-7-3 7-3zM22 30l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#fff4c2" stroke="none" />
    </svg>
  )
}

export function TreasureHunt({ words, onComplete }: GameProps) {
  const [chests, setChests] = useState<Chest[]>(() => placeChests(words))
  // Spots where the gold could still be, given every clue so far. The gold settles into one only when it is found.
  const [goldSpots, setGoldSpots] = useState<number[]>(allSpots)
  const [reps, setReps] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [lastClue, setLastClue] = useState<Clue | null>(null)

  const opened = chests.filter(c => c.clue).length
  const found = lastClue === 'gold'
  const openChest = openIndex === null ? null : chests[openIndex]

  const initializeGame = () => {
    setChests(placeChests(words))
    setGoldSpots(allSpots())
    setReps(0)
    setOpenIndex(null)
    setLastClue(null)
  }

  const handleChestClick = (index: number) => {
    if (found || chests[index].clue) return
    sayWord(chests[index].word.word)
    setOpenIndex(index)
  }

  const handleSaidIt = () => {
    if (openIndex === null) return
    const openedNow = opened + 1
    const stillPossible = goldSpots.filter(spot => spot !== openIndex)
    let clue: Clue
    if (goldSpots.includes(openIndex) && (openedNow >= MIN_CHESTS || stillPossible.length === 0)) {
      clue = 'gold'
      setGoldSpots([openIndex])
    } else {
      const warmSpots = stillPossible.filter(spot => isNextTo(spot, openIndex))
      const coldSpots = stillPossible.filter(spot => !isNextTo(spot, openIndex))
      // Early on, keep the gold hidden longer; once enough words are said, lead toward it.
      const useWarm = warmSpots.length > 0 && (coldSpots.length === 0 || openedNow >= MIN_CHESTS - 1 || warmSpots.length >= coldSpots.length)
      clue = useWarm ? 'warm' : 'cold'
      setGoldSpots(useWarm ? warmSpots : coldSpots)
    }

    setChests(prev => prev.map((c, i) => (i === openIndex ? { ...c, clue } : c)))
    setLastClue(clue)
    setOpenIndex(null)
    sayPhrase(clue === 'gold' ? 'treasure-found' : clue === 'warm' ? 'treasure-warm' : 'treasure-cold')

    if (clue === 'gold') {
      setTimeout(() => {
        onComplete({
          wordsPracticed: openedNow,
          speechReps: reps,
          gameName: 'Treasure Hunt',
        })
      }, 2500)
    }
  }

  return (
    <div className="treasure-hunt">
      <div className={`hunt-banner ${lastClue ? `clue-${lastClue}` : ''}`} aria-live="polite">
        {found ? <GoldPile className="banner-icon" /> : <span className="banner-emoji" aria-hidden="true">{lastClue === 'warm' ? '🔥' : lastClue === 'cold' ? '❄️' : '🗺️'}</span>}
        <div className="banner-text">
          <strong>{lastClue ? CLUE_TEXT[lastClue] : 'Find the hidden gold!'}</strong>
          <span>{found ? `You opened ${opened} chests to find it.` : lastClue ? 'Pick another chest.' : 'Open a chest and say the word to get a clue.'}</span>
        </div>
      </div>

      {openChest ? (
        <div className="reveal-panel">
          <div className="reveal-content">
            <WordPicture word={openChest.word} />
            <div className="revealed-word">{openChest.word.word}</div>
            <button className="cta-button" onClick={handleSaidIt}>
              Said It! ✓
            </button>
          </div>
        </div>
      ) : (
        <div className="game-layout">
          <div className="treasures-grid">
            {chests.map((chest, index) => (
              <button
                key={chest.id}
                className={`treasure-box ${chest.clue ? `opened clue-${chest.clue}` : ''}`}
                onClick={() => handleChestClick(index)}
                disabled={found || !!chest.clue}
                aria-label={chest.clue ? `${chest.word.word}: ${CLUE_TEXT[chest.clue]}` : 'Open a treasure chest'}
              >
                {chest.clue === 'gold' ? (
                  <div className="gold-state">
                    <GoldPile className="gold-icon" />
                  </div>
                ) : chest.clue ? (
                  <div className="open-state">
                    <WordPicture word={chest.word} />
                    <span className="clue-badge" aria-hidden="true">{chest.clue === 'warm' ? '🔥' : '❄️'}</span>
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
        <p>🔥 means the gold is right beside that chest. ❄️ means it isn't.</p>
      </div>

      <div className="game-actions">
        <button className="reset-btn" onClick={initializeGame}>
          Start Over
        </button>
      </div>
    </div>
  )
}
