export interface SpeechWord {
  id: string
  word: string
  sound: string
  category: string
  imageAlt: string
}

export interface SpeechCategory {
  id: string
  name: string
  soundId: string
  words: SpeechWord[]
}

export interface SpeechSound {
  id: string
  name: string
  emoji?: string
  categories: SpeechCategory[]
  description?: string
  comingSoon?: boolean
}

export interface GameDefinition {
  id: string
  name: string
  description: string
}

export interface SessionState {
  currentSound: string | null
  currentCategory: string | null
  currentGame: string | null
  wordsPracticed: number
  speechReps: number
  gameStartTime: number | null
}

export interface GameProps {
  words: SpeechWord[]
  onComplete: (stats: GameStats) => void
}

export interface GameStats {
  wordsPracticed: number
  speechReps: number
  gameName: string
}
