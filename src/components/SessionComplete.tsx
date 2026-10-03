import './SessionComplete.css'

interface SessionCompleteProps {
  soundName: string
  categoryName: string
  gameName: string
  wordsPracticed: number
  speechReps: number
  onPlayAgain: () => void
  onChooseGame: () => void
  onChangeSound: () => void
  onHome: () => void
}

export function SessionComplete({
  soundName,
  categoryName,
  gameName,
  wordsPracticed,
  speechReps,
  onPlayAgain,
  onChooseGame,
  onChangeSound,
  onHome,
}: SessionCompleteProps) {
  return (
    <div className="session-complete">
      <div className="celebration">
        <div className="emoji-burst">🎉</div>
        <h1>Great Job!</h1>
      </div>

      <div className="session-details">
        <div className="detail-row">
          <span className="label">Sound:</span>
          <span className="value">{soundName} — {categoryName}</span>
        </div>
        <div className="detail-row">
          <span className="label">Game:</span>
          <span className="value">{gameName}</span>
        </div>
        <div className="detail-row">
          <span className="label">Words Practiced:</span>
          <span className="value">{wordsPracticed}</span>
        </div>
        <div className="detail-row highlight">
          <span className="label">Speech Repetitions:</span>
          <span className="value">{speechReps}</span>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={onPlayAgain}>
          Play Again
        </button>
        <button className="btn btn-secondary" onClick={onChooseGame}>
          Choose Another Game
        </button>
        <button className="btn btn-tertiary" onClick={onChangeSound}>
          Change Sound
        </button>
        <button className="btn btn-home" onClick={onHome}>
          Home
        </button>
      </div>
    </div>
  )
}
