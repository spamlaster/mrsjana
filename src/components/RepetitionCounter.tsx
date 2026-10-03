import { useState } from 'react'
import './RepetitionCounter.css'

interface RepetitionCounterProps {
  reps: number
  onAdd: (amount: number) => void
  goal?: number
}

export function RepetitionCounter({ reps, onAdd, goal = 50 }: RepetitionCounterProps) {
  const [justAdded, setJustAdded] = useState(false)

  const handleAdd = (amount: number) => {
    onAdd(amount)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 300)
  }

  const percent = Math.min(100, (reps / goal) * 100)

  return (
    <div className="repetition-counter">
      <div className="reps-display">
        <div className="reps-label">Speech Reps</div>
        <div className={`reps-value ${justAdded ? 'just-added' : ''}`}>
          {reps} / {goal}
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percent}%` }}></div>
      </div>

      <div className="rep-buttons">
        <button
          className="rep-btn rep-btn-1"
          onClick={() => handleAdd(1)}
          title="Add 1 repetition"
        >
          +1
        </button>
        <button
          className="rep-btn rep-btn-3"
          onClick={() => handleAdd(3)}
          title="Add 3 repetitions"
        >
          +3
        </button>
        <button
          className="rep-btn rep-btn-5"
          onClick={() => handleAdd(5)}
          title="Add 5 repetitions"
        >
          +5
        </button>
      </div>
    </div>
  )
}
