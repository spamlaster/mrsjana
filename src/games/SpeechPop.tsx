import { useState } from 'react'
import type { SpeechWord, GameProps } from '../types'
import { WordPicture } from '../components/WordPicture'
import { RepetitionCounter } from '../components/RepetitionCounter'
import './SpeechPop.css'

interface Bubble {
  id: string
  word: SpeechWord
  isPopping: boolean
}

const GOAL = 10

export function SpeechPop({ words, onComplete }: GameProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>(() => words.map(word => ({ id: word.id, word, isPopping: false })))
  const [poppedCount, setPoppedCount] = useState(0)
  const [reps, setReps] = useState(0)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [feedback, setFeedback] = useState<string>('')

  const createNewBubbles = () => {
    const newBubbles: Bubble[] = words.map(word => ({
      id: word.id,
      word,
      isPopping: false,
    }))
    setBubbles(newBubbles)
    setPoppedCount(0)
    setReps(0)
    setCurrentWordIndex(0)
  }

  const handleBubbleClick = (bubbleId: string, bubbleWord: SpeechWord) => {
    if (bubbleWord.word !== currentWord.word) {
      setFeedback(`Oops! That wasn't correct. Try again!`)
      setTimeout(() => setFeedback(''), 2000)
      return
    }

    setFeedback('')
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
      <div className="progress">
        <span className="progress-label">Popped</span>
        <span className="progress-value">{poppedCount}/{GOAL}</span>
      </div>

      <div className="current-word-display">
        <WordPicture word={currentWord} />
        <span className="word">{currentWord.word}</span>
      </div>

      {feedback && <div className="feedback-alert">{feedback}</div>}

      <div className="game-layout">
        <div className="bubbles-container">
          {bubbles.map(bubble => (
            <button
              key={bubble.id}
              className={`bubble ${bubble.isPopping ? 'popping' : ''}`}
              aria-label={`Pop ${bubble.word.word}`}
              disabled={bubble.isPopping}
              onClick={() => handleBubbleClick(bubble.id, bubble.word)}
            >
              <div className="bubble-content">
                <WordPicture word={bubble.word} />
                <div className="word">{bubble.word.word}</div>
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
