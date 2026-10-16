import { useEffect } from 'react'
import type { Mark } from '../session/trialSession'

interface AdultScoringBarProps {
  completed: number
  total: number
  finished: boolean
  onMark: (mark: Mark) => void
  onUndo: () => void
  notes?: string[] // short grown-up notes, e.g. preview status or a missing recording
}

const buttons: { mark: Mark; label: string; icon: string; key: string }[] = [
  { mark: 'correct', label: 'Correct', icon: '✓', key: '1' },
  { mark: 'incorrect', label: 'Incorrect', icon: '✗', key: '2' },
  { mark: 'cued', label: 'Cued', icon: '💬', key: '3' },
]

// The only thing that scores. A grown-up listens and taps; nothing listens to the child automatically.
// Keyboard shortcuts for teletherapy: 1 Correct, 2 Incorrect, 3 Cued, Backspace Undo.
export function AdultScoringBar({ completed, total, finished, onMark, onUndo, notes = [] }: AdultScoringBarProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      // Leave typing alone: shortcuts only apply when focus is not in a text field.
      const typing = event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat || typing) return
      const button = buttons.find(item => item.key === event.key)
      if (button && !finished) { event.preventDefault(); onMark(button.mark) }
      if (event.key === 'Backspace' && completed > 0) { event.preventDefault(); onUndo() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [completed, finished, onMark, onUndo])

  return (
    <section className="mp-scoring" aria-label="Grown-up scoring">
      <div className="mp-scoring-head">
        <span className="mp-scoring-title"><span aria-hidden="true">🧑‍🏫</span> Grown-up scoring</span>
        <span className="mp-scoring-count" aria-live="polite">Turn {Math.min(completed + 1, total)} of {total}{finished ? ' · all done' : ''}</span>
      </div>
      <div className="mp-scoring-buttons">
        {buttons.map(button => (
          <button key={button.mark} className={`mp-score mp-score-${button.mark}`} onClick={() => onMark(button.mark)} disabled={finished} aria-keyshortcuts={button.key}>
            <span aria-hidden="true">{button.icon}</span> {button.label}
          </button>
        ))}
        <button className="mp-score mp-score-undo" onClick={onUndo} disabled={completed === 0} aria-keyshortcuts="Backspace">
          <span aria-hidden="true">↶</span> Undo
        </button>
      </div>
      <p className="mp-scoring-hint">Keys: 1 Correct · 2 Incorrect · 3 Cued · Backspace Undo</p>
      {notes.length > 0 && <p className="mp-scoring-note">{notes.join(' · ')}</p>}
    </section>
  )
}
