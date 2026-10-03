import type { SpeechCategory } from '../types'
import './CategorySelector.css'

interface CategorySelectorProps {
  categories: SpeechCategory[]
  soundName: string
  onSelect: (categoryId: string) => void
  onBack: () => void
}

export function CategorySelector({
  categories,
  soundName,
  onSelect,
  onBack,
}: CategorySelectorProps) {
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
      <div className="category-grid">
        {categories.map(cat => (
          <button
            key={cat.id}
            className="category-card"
            onClick={() => onSelect(cat.id)}
          >
            <span className="category-symbol" aria-hidden="true">✦</span>
            {cat.name}
            <span className="category-hint">{cat.id.includes('initial') ? 'At the beginning' : cat.id.includes('medial') ? 'In the middle' : cat.id.includes('final') ? 'At the end' : 'Sounds together'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
