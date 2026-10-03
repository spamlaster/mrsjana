import { useState, useEffect } from 'react'
import type { SpeechWord, GameProps } from '../types'
import { RepetitionCounter } from '../components/RepetitionCounter'
import './SpeechPop.css'

interface Bubble {
  id: string
  word: SpeechWord
  x: number
  y: number
  isPopping: boolean
}

const GOAL = 10

export function SpeechPop({ words, onComplete }: GameProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [poppedCount, setPoppedCount] = useState(0)
  const [reps, setReps] = useState(0)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    createNewBubbles()
  }, [words])

  const createNewBubbles = () => {
    const newBubbles: Bubble[] = words.map(word => ({
      id: word.id,
      word,
      x: Math.random() * 80,
      y: Math.random() * 60,
      isPopping: false,
    }))
    setBubbles(newBubbles)
    setPoppedCount(0)
    setReps(0)
    setCurrentWordIndex(0)
  }

  const handleBubbleClick = (bubbleId: string) => {
    setBubbles(prev =>
      prev.map(b =>
        b.id === bubbleId ? { ...b, isPopping: true } : b
      )
    )

    setTimeout(() => {
      const newPopped = poppedCount + 1
      setPoppedCount(newPopped)

      if (newPopped >= GOAL) {
        setTimeout(() => {
          onComplete({
            wordsPracticed: GOAL,
            speechReps: reps,
            gameName: 'Speech Pop',
          })
        }, 500)
      } else {
        setCurrentWordIndex(prev => (prev + 1) % words.length)
        setBubbles(prev => prev.filter(b => b.id !== bubbleId))

        if (bubbles.length <= 1) {
          createNewBubbles()
          setPoppedCount(newPopped)
        }
      }
    }, 400)
  }

  const currentWord = words[currentWordIndex] || words[0]

  return (
    <div className="speech-pop">
      <div className="game-header">
        <div className="progress">
          <span className="progress-label">Popped</span>
          <span className="progress-value">{poppedCount}/{GOAL}</span>
        </div>
        <div className="current-word-display">
          <span className="label">Say:</span>
          <span className="word">{currentWord.word}</span>
        </div>
      </div>

      <RepetitionCounter
        reps={reps}
        onAdd={(amount) => setReps(r => r + amount)}
        goal={30}
      />

      <div className="bubbles-container">
        {bubbles.map(bubble => (
          <button
            key={bubble.id}
            className={`bubble ${bubble.isPopping ? 'popping' : ''}`}
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
            }}
            onClick={() => handleBubbleClick(bubble.id)}
          >
            <div className="bubble-content">
              <div className="word">{bubble.word.word}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="game-hint">
        <p>Click or tap a bubble to pop it!</p>
      </div>

      <div className="game-actions">
        <button className="reset-btn" onClick={createNewBubbles}>
          Start Over
        </button>
      </div>
    </div>
  )
}
