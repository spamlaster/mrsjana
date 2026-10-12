import { useState, type CSSProperties } from 'react'
import type { SpeechWord, GameProps } from '../types'
import { WordPicture } from '../components/WordPicture'
import { RepetitionCounter } from '../components/RepetitionCounter'
import { pictureScenes, type PictureScene } from './pictureScenes'
import './PeekAPicture.css'

interface Tile {
  id: string
  word: SpeechWord
  cleared: boolean
}

// 5 x 4 board of square cards covering a 5:4 picture scene
const BOARD_SIZE = 20
const CARD_COLORS = ['#ff6fa8', '#ff924c', '#ffc93c', '#5cc94f', '#38bdf8', '#9b6bff']
const CONFETTI_COLORS = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#ff6fa8', '#9b6bff']

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

interface Round {
  tiles: Tile[]
  scene: PictureScene
  stickers: SpeechWord[] // practice words drawn into the scene
}

function dealRound(words: SpeechWord[], sceneIndex: number): Round {
  const shuffled = shuffle(words)
  // Categories with fewer than 20 words repeat some words to fill the board
  const tiles = shuffle(
    Array.from({ length: BOARD_SIZE }, (_, i) => {
      const word = shuffled[i % shuffled.length]
      return { id: `${word.id}-${i}`, word, cleared: false }
    }),
  )
  const scene = pictureScenes[sceneIndex % pictureScenes.length]
  return { tiles, scene, stickers: shuffle(words).slice(0, scene.slots.length) }
}

function formatList(items: string[]) {
  return items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

const confetti = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  style: {
    left: `${(i * 37) % 100}%`,
    background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    animationDelay: `${((i * 7) % 12) / 10}s`,
    animationDuration: `${2.2 + ((i * 3) % 10) / 10}s`,
  } as CSSProperties,
}))

export function PeekAPicture({ words, onComplete }: GameProps) {
  const [sceneIndex, setSceneIndex] = useState(() => Math.floor(Math.random() * pictureScenes.length))
  const [round, setRound] = useState(() => dealRound(words, sceneIndex))
  const [reps, setReps] = useState(0)
  const [lastWord, setLastWord] = useState<SpeechWord | null>(null)

  const { tiles, scene, stickers } = round
  const clearedCount = tiles.filter(t => t.cleared).length
  const won = clearedCount === BOARD_SIZE
  const wordsPracticed = new Set(tiles.filter(t => t.cleared).map(t => t.word.id)).size

  const initializeGame = () => {
    // Each new round shows the next scene so kids get a fresh surprise
    const next = sceneIndex + 1
    setSceneIndex(next)
    setRound(dealRound(words, next))
    setReps(0)
    setLastWord(null)
  }

  const handleTileClick = (tile: Tile) => {
    if (tile.cleared) return
    setRound(prev => ({ ...prev, tiles: prev.tiles.map(t => (t.id === tile.id ? { ...t, cleared: true } : t)) }))
    setLastWord(tile.word)
  }

  const finish = () => onComplete({ wordsPracticed, speechReps: reps, gameName: 'Peek-a-Picture' })

  return (
    <div className="peek-a-picture">
      <div className="pr-layout">
        <div className={`pr-board ${won ? 'won' : ''}`}>
          <div className="pr-scene" aria-hidden={!won}>
            <svg className="pr-scene-art" viewBox="0 0 500 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${scene.name} picture`}>
              {scene.art}
            </svg>
            {stickers.map((word, i) => {
              const slot = scene.slots[i]
              return (
                <div
                  key={word.id}
                  className="pr-sticker"
                  style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${slot.size}%`, animationDelay: `${i * 0.4}s` }}
                >
                  <WordPicture word={word} />
                  <span className="pr-sticker-label">{word.word}</span>
                </div>
              )
            })}
            {won && (
              <div className="pr-confetti" aria-hidden="true">
                {confetti.map(piece => <span key={piece.id} style={piece.style} />)}
              </div>
            )}
          </div>

          <div className="pr-cards">
            {tiles.map((tile, i) => (
              <button
                key={tile.id}
                className={`pr-card ${tile.cleared ? 'cleared' : ''}`}
                style={{ '--pr-card-color': CARD_COLORS[i % CARD_COLORS.length] } as CSSProperties}
                onClick={() => handleTileClick(tile)}
                disabled={tile.cleared}
                aria-label={tile.cleared ? undefined : `Say ${tile.word.word}`}
                aria-hidden={tile.cleared}
                tabIndex={tile.cleared ? -1 : undefined}
              >
                <WordPicture word={tile.word} />
                <span className="pr-card-word">{tile.word.word}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="pr-sidebar">
          <div className="pr-progress" role="status" aria-live="polite" aria-label={`${clearedCount} of ${BOARD_SIZE} cards cleared`}>
            <div className="pr-progress-label">Picture revealed</div>
            <div className="pr-progress-bar">
              <div className="pr-progress-fill" style={{ width: `${(clearedCount / BOARD_SIZE) * 100}%` }} />
            </div>
            <div className="pr-progress-count">{clearedCount} / {BOARD_SIZE}</div>
          </div>

          {lastWord && !won && (
            <div className="pr-say-it" key={`${lastWord.id}-${clearedCount}`}>
              <span>Say it!</span>
              <WordPicture word={lastWord} />
              <strong>{lastWord.word}</strong>
            </div>
          )}

          <RepetitionCounter reps={reps} onAdd={amount => setReps(r => r + amount)} goal={30} />
        </aside>
      </div>

      {won ? (
        <div className="pr-win" role="alert">
          <div className="pr-win-emoji" aria-hidden="true">{scene.emoji}</div>
          <h3>You revealed the secret picture: {scene.name}!</h3>
          <p>Can you find {formatList(stickers.map(w => w.word))} in the picture?</p>
          <button className="cta-button" onClick={finish}>All done →</button>
        </div>
      ) : (
        <div className="game-hint">
          <p>Tap a card and say the word. Each card you clear shows more of a secret picture!</p>
        </div>
      )}

      <div className="game-actions">
        <button className="reset-btn" onClick={initializeGame}>
          New Picture
        </button>
      </div>
    </div>
  )
}
