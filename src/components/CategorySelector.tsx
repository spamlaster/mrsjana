import { useState } from 'react'
import type { SpeechCategory } from '../types'
import soundPositionsArt from '../assets/where-does-your-sound-go.jpg'
import './CategorySelector.css'

interface CategorySelectorProps {
  categories: SpeechCategory[]
  soundName: string
  onSelect: (categoryId: string) => void
  onBack: () => void
}

type Position = 'initial' | 'medial' | 'final' | 'blends' | 'other'

function getPosition(categoryId: string): Position {
  if (categoryId.includes('initial')) return 'initial'
  if (categoryId.includes('medial')) return 'medial'
  if (categoryId.includes('final')) return 'final'
  if (categoryId.includes('blend')) return 'blends'
  return 'other'
}

const POSITION_INFO: Record<Position, { hint: string; kid: string; grownUp: string }> = {
  initial: {
    hint: 'At the beginning',
    kid: 'Your sound is the very first sound you say in the word.',
    grownUp:
      '"Initial" means the target sound starts the word. This is usually the easiest place to practice a new sound, so it is a great place to begin.',
  },
  medial: {
    hint: 'In the middle',
    kid: 'Your sound hides in the middle of the word, between other sounds.',
    grownUp:
      '"Medial" means the target sound is inside the word, not at the start or end. Choose this once your child can say the sound at the beginning of words.',
  },
  final: {
    hint: 'At the end',
    kid: 'Your sound is the very last sound you say in the word.',
    grownUp:
      '"Final" means the target sound ends the word. Listen for a clear sound at the end; it is easy to drop or soften.',
  },
  blends: {
    hint: 'Sounds together',
    kid: 'Your sound is squished right next to another sound, like two friends holding hands.',
    grownUp:
      '"Blends" (or clusters) pair the target sound with another consonant, with no vowel between them. These are trickier, so they usually come after initial, medial and final practice.',
  },
  other: {
    hint: 'More practice',
    kid: 'Extra words where your sound shows up in fun, tricky spots.',
    grownUp:
      'A mixed set of words with the target sound in less common spellings or positions. Good for extra challenge once the other groups feel easy.',
  },
}

export function CategorySelector({
  categories,
  soundName,
  onSelect,
  onBack,
}: CategorySelectorProps) {
  const [openInfo, setOpenInfo] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(false)

  return (
    <div className="category-selector">
      <div className="selector-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back" title="Go back">
          ←
        </button>
        <h2>{soundName} Sound</h2>
      </div>

      <p className="eyebrow">STEP 2 · FIND YOUR WORDS</p>
      <h3>Where does your sound go?</h3>

      <img
        className="category-art"
        src={soundPositionsArt}
        alt="Ms. Jana smiling, with a speech bubble showing a mouth and a thought bubble showing an apple, an airplane and a frog"
      />

      <div className="category-guide">
        <button
          className="category-guide-toggle"
          onClick={() => setShowGuide(open => !open)}
          aria-expanded={showGuide}
          aria-controls="category-guide-body"
        >
          <span aria-hidden="true">💡</span> Not sure which to pick?
          <span className="category-guide-caret" aria-hidden="true">{showGuide ? '▲' : '▼'}</span>
        </button>
        {showGuide && (
          <div id="category-guide-body" className="category-guide-body">
            <p>
              Every word is made of sounds. Your <strong>{soundName}</strong> sound can show up in
              different places in a word. Say the word slowly and listen: where do you hear it?
            </p>
            <ul>
              {categories.map(cat => {
                const info = POSITION_INFO[getPosition(cat.id)]
                const examples = cat.words.slice(0, 3).map(w => w.word).join(', ')
                return (
                  <li key={cat.id}>
                    <strong>{cat.name}</strong> ({info.hint.toLowerCase()}): {info.kid}
                    {examples && <span className="category-guide-examples"> Like: {examples}.</span>}
                  </li>
                )
              })}
            </ul>
            <p className="category-guide-tip">
              <strong>Grown-ups:</strong> most kids start with words where the sound is at the
              beginning, then move to the middle, the end, and finally blends. Tap the{' '}
              <span aria-hidden="true">ⓘ</span> on any card to learn more.
            </p>
          </div>
        )}
      </div>

      <div className="category-grid">
        {categories.map(cat => {
          const info = POSITION_INFO[getPosition(cat.id)]
          const isOpen = openInfo === cat.id
          const examples = cat.words.slice(0, 3).map(w => w.word)
          return (
            <div key={cat.id} className={`category-item${isOpen ? ' is-open' : ''}`}>
              <button className="category-card" onClick={() => onSelect(cat.id)}>
                <span className="category-symbol" aria-hidden="true">✦</span>
                {cat.name}
                <span className="category-hint">{info.hint}</span>
              </button>
              <button
                className="category-info-btn"
                onClick={() => setOpenInfo(isOpen ? null : cat.id)}
                aria-expanded={isOpen}
                aria-controls={`category-info-${cat.id}`}
                aria-label={`What does ${cat.name} mean?`}
                title={`What does ${cat.name} mean?`}
              >
                {isOpen ? '×' : 'i'}
              </button>
              {isOpen && (
                <div id={`category-info-${cat.id}`} className="category-info" role="note">
                  <p className="category-info-kid">{info.kid}</p>
                  {examples.length > 0 && (
                    <p className="category-info-examples">
                      Words like:{' '}
                      {examples.map(word => (
                        <span key={word} className="category-info-word">{word}</span>
                      ))}
                    </p>
                  )}
                  <p className="category-info-grownup">
                    <strong>For grown-ups:</strong> {info.grownUp}
                  </p>
                  <button className="category-info-go" onClick={() => onSelect(cat.id)}>
                    Practice {cat.name} →
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
