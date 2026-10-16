import { paces, type Pace } from './pace'

// Start, Pause, and seconds per turn for the games that run by themselves (Say the Word, Bubble Pop).

interface PaceControlsProps {
  label: string // e.g. "Seconds per word"
  name: string // radio group name, unique per game
  started: boolean
  paused: boolean
  pace: Pace
  onStart: () => void
  onTogglePause: () => void
  onPace: (pace: Pace) => void
}

export function PaceControls({ label, name, started, paused, pace, onStart, onTogglePause, onPace }: PaceControlsProps) {
  return (
    <div className="mp-pace-controls">
      {started
        ? <button className="mp-button mp-button-soft mp-button-small" onClick={onTogglePause}>{paused ? '▶ Keep going' : '❚❚ Pause'}</button>
        : <button className="mp-button mp-pace-start" onClick={onStart}>▶ Start</button>}
      <fieldset className="mp-pace">
        <legend>{label}</legend>
        {paces.map(value => (
          <label key={value} className={value === pace ? 'selected' : ''}>
            <input type="radio" name={name} value={value} checked={value === pace} onChange={() => onPace(value)} />
            {value}s
          </label>
        ))}
      </fieldset>
    </div>
  )
}
