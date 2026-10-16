import type { ActivityProps } from './types'

const cheers = ['Super saying!', 'You did it!', 'Great try!', 'Keep going!', 'Wonderful!']

// The simplest game: the shell shows the big picture and word, and every turn lights up a star.
export function SayTheWord({ total, completed, markId, lastAction }: ActivityProps) {
  const finished = completed >= total
  return (
    <div className="mp-game say-the-word">
      <ol className="stw-stars" aria-label={`${completed} of ${total} stars`}>
        {Array.from({ length: total }, (_, i) => (
          <li
            key={i}
            className={`stw-star${i < completed ? ' lit' : ''}${i === completed ? ' next' : ''}${i === completed - 1 && lastAction === 'mark' ? ' new' : ''}`}
            aria-hidden="true"
          >★</li>
        ))}
      </ol>
      <p className="mp-game-cheer" key={markId}>
        {finished ? 'Every star is shining! 🌟' : completed === 0 ? 'Say the word to light a star!' : cheers[completed % cheers.length]}
      </p>
    </div>
  )
}
