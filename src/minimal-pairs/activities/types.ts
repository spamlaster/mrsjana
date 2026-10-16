import type { ReactNode } from 'react'

// What a game is allowed to know about a word: how it looks and reads. Never its role (target or
// contrast), its sounds, or its process. Activities must not import from content/.
export interface ActivityWord {
  id: string
  text: string
  picture: ReactNode
  canListen: boolean
}

// Every production game gets only these props. Visuals are derived from `completed`, so Undo
// rewinds every game without game-specific code. Games never judge speech. Optional onComplete advances unscored practice.
export interface ActivityProps {
  total: number // 10 or 20
  completed: number // trials scored so far
  current: { word: ActivityWord } | null // null once every trial is scored
  done: ActivityWord[] // the words of the scored trials, in order
  words: ActivityWord[] // both words of the pair, in a fixed order that says nothing about roles
  markId: number // changes on every mark, undo, or restart; use it to trigger animation
  lastAction: 'start' | 'mark' | 'undo'
  revealed: boolean // for games that reveal the word (Spin & Say); always true for the others
  onComplete?: () => void // unscored practice: advance after the child’s interaction
  onReveal: () => void
}
