import type { ActivityWord } from './types'

interface ListeningDiscriminationProps {
  words: ActivityWord[] // both words of the pair, fixed order
  total: number
  completed: number
  listened: boolean // the word for this turn has been played
  playing: boolean
  feedback: { kind: 'right'; word: ActivityWord } | { kind: 'oops' } | null // the tap just made
  shaking: string | null // the wrong picture just tapped
  onListen: () => void
  onPick: (wordId: string) => void
  onShakeEnd: () => void
}

// Hear one word of the pair, then tap its picture. The word plays by itself, and pictures unlock
// once it has been played, so every answer is a real listening answer. A wrong picture shakes and
// the child tries again; the right one moves on to the next word. Feedback is always gentle.
export function ListeningDiscrimination({ words, total, completed, listened, playing, feedback, shaking, onListen, onPick, onShakeEnd }: ListeningDiscriminationProps) {
  const finished = completed >= total
  return (
    <div className="mp-game listening">
      <ol className="stw-stars ld-progress" aria-label={`${completed} of ${total} turns`}>
        {Array.from({ length: total }, (_, i) => <li key={i} className={`stw-star${i < completed ? ' lit' : ''}`} aria-hidden="true">★</li>)}
      </ol>
      {feedback && (
        <p className={`ld-feedback${feedback.kind === 'right' ? ' right' : ' gentle'}`} aria-live="polite">
          {feedback.kind === 'right' ? `Yes! You heard “${feedback.word.text}”! ⭐` : 'Oops, try again!'}
        </p>
      )}
      {finished ? (
        <p className="mp-game-cheer">Super listening! 🎉</p>
      ) : (
        <>
          <button className="ld-listen" onClick={onListen} disabled={playing}>
            <span aria-hidden="true">🔊</span> {listened ? 'Hear it again' : 'Listen'}
          </button>
          <div className="ld-choices">
            {words.map(word => (
              <button key={word.id} className={`ld-choice${shaking === word.id ? ' is-shaking' : ''}`} onClick={() => onPick(word.id)} onAnimationEnd={onShakeEnd} disabled={!listened || playing} aria-label={word.text}>
                {word.picture}
              </button>
            ))}
          </div>
          <p className="mp-game-cheer">{listened ? 'Which picture did you hear?' : 'Tap Listen to hear a word.'}</p>
        </>
      )}
    </div>
  )
}
