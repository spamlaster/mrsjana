import { useState } from 'react'
import { WordPicture } from '../../components/WordPicture'
import { illustrationRecords } from '../content/illustration-records'
import { illustrationFile, pictureSource } from '../content/illustrations'
import type { IllustrationRecord, LexiconWord } from '../content/types'

interface PairPictureProps {
  word: LexiconWord
  size?: 'sm' | 'md' | 'lg'
  illustrations?: Record<string, IllustrationRecord> // for tests; defaults to illustration-records.ts
}

// Soft colors for placeholders, picked by word so the same word always looks the same.
const placeholderColors = ['#ece3fa', '#ffeadf', '#e6eee2', '#fff0ce', '#e3f0fa', '#fbe4ee']
const colorFor = (id: string) => placeholderColors[[...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % placeholderColors.length]

// A word's picture: a custom illustration, a linked WordPicture, a standard emoji, or a placeholder until it is illustrated.
// If an illustration fails to load, the word falls back to what it would show without one.
// The placeholder never pretends to be the word: it shows a crayon and says the picture is coming.
export function PairPicture({ word, size = 'md', illustrations = illustrationRecords }: PairPictureProps) {
  const [failed, setFailed] = useState(false)
  const className = `mp-picture mp-picture-${size}`
  const source = pictureSource(word, failed ? {} : illustrations)
  if (source === 'illustration') {
    // The hash in the URL makes a replaced file show at once instead of a cached copy.
    const src = `${import.meta.env?.BASE_URL ?? '/'}${illustrationFile(word)}?v=${illustrations[word.id].sha256.slice(0, 12)}`
    return <span className={`${className} mp-picture-illustration`}><img src={src} alt={word.imageAlt} draggable={false} onError={() => setFailed(true)} /></span>
  }
  if (source === 'picture') {
    return <span className={className}><WordPicture word={{ id: word.id, word: word.picture!, sound: '', category: '', imageAlt: word.imageAlt }} /></span>
  }
  if (source === 'emoji') {
    return <span className={`${className} mp-picture-emoji`} role="img" aria-label={word.imageAlt}><span aria-hidden="true">{word.emoji}</span></span>
  }
  return (
    <span className={`${className} mp-placeholder`} style={{ background: colorFor(word.id) }} role="img" aria-label={`Picture coming soon: ${word.imageAlt}`} title="Picture coming soon">
      <span className="mp-placeholder-icon" aria-hidden="true">🖍️</span>
      <span className="mp-placeholder-text" aria-hidden="true">Picture coming soon</span>
    </span>
  )
}
