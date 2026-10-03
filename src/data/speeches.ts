import type { SpeechSound } from '../types'

export const speechSounds: SpeechSound[] = [
  {
    id: 'r',
    name: 'R',
    description: 'The /r/ sound',
    categories: [
      {
        id: 'r-initial',
        name: 'Initial R',
        soundId: 'r',
        words: [
          { id: 'r-initial-1', word: 'rabbit', sound: 'r', category: 'initial', imageAlt: 'rabbit' },
          { id: 'r-initial-2', word: 'rain', sound: 'r', category: 'initial', imageAlt: 'rain' },
          { id: 'r-initial-3', word: 'rainbow', sound: 'r', category: 'initial', imageAlt: 'rainbow' },
          { id: 'r-initial-4', word: 'red', sound: 'r', category: 'initial', imageAlt: 'red' },
          { id: 'r-initial-5', word: 'ring', sound: 'r', category: 'initial', imageAlt: 'ring' },
          { id: 'r-initial-6', word: 'road', sound: 'r', category: 'initial', imageAlt: 'road' },
          { id: 'r-initial-7', word: 'robot', sound: 'r', category: 'initial', imageAlt: 'robot' },
          { id: 'r-initial-8', word: 'rocket', sound: 'r', category: 'initial', imageAlt: 'rocket' },
          { id: 'r-initial-9', word: 'rope', sound: 'r', category: 'initial', imageAlt: 'rope' },
          { id: 'r-initial-10', word: 'rose', sound: 'r', category: 'initial', imageAlt: 'rose' },
          { id: 'r-initial-11', word: 'run', sound: 'r', category: 'initial', imageAlt: 'run' },
          { id: 'r-initial-12', word: 'rug', sound: 'r', category: 'initial', imageAlt: 'rug' },
        ],
      },
      {
        id: 'r-medial',
        name: 'Medial R',
        soundId: 'r',
        words: [
          { id: 'r-medial-1', word: 'arrow', sound: 'r', category: 'medial', imageAlt: 'arrow' },
          { id: 'r-medial-2', word: 'carrot', sound: 'r', category: 'medial', imageAlt: 'carrot' },
          { id: 'r-medial-3', word: 'pirate', sound: 'r', category: 'medial', imageAlt: 'pirate' },
          { id: 'r-medial-4', word: 'orange', sound: 'r', category: 'medial', imageAlt: 'orange' },
          { id: 'r-medial-5', word: 'parrot', sound: 'r', category: 'medial', imageAlt: 'parrot' },
          { id: 'r-medial-6', word: 'fairy', sound: 'r', category: 'medial', imageAlt: 'fairy' },
          { id: 'r-medial-7', word: 'berry', sound: 'r', category: 'medial', imageAlt: 'berry' },
          { id: 'r-medial-8', word: 'cherry', sound: 'r', category: 'medial', imageAlt: 'cherry' },
          { id: 'r-medial-9', word: 'mirror', sound: 'r', category: 'medial', imageAlt: 'mirror' },
          { id: 'r-medial-10', word: 'zebra', sound: 'r', category: 'medial', imageAlt: 'zebra' },
        ],
      },
      {
        id: 'r-final',
        name: 'Final R',
        soundId: 'r',
        words: [
          { id: 'r-final-1', word: 'bear', sound: 'r', category: 'final', imageAlt: 'bear' },
          { id: 'r-final-2', word: 'car', sound: 'r', category: 'final', imageAlt: 'car' },
          { id: 'r-final-3', word: 'door', sound: 'r', category: 'final', imageAlt: 'door' },
          { id: 'r-final-4', word: 'four', sound: 'r', category: 'final', imageAlt: 'four' },
          { id: 'r-final-5', word: 'hair', sound: 'r', category: 'final', imageAlt: 'hair' },
          { id: 'r-final-6', word: 'jar', sound: 'r', category: 'final', imageAlt: 'jar' },
          { id: 'r-final-7', word: 'near', sound: 'r', category: 'final', imageAlt: 'near' },
          { id: 'r-final-8', word: 'star', sound: 'r', category: 'final', imageAlt: 'star' },
          { id: 'r-final-9', word: 'tear', sound: 'r', category: 'final', imageAlt: 'tear' },
          { id: 'r-final-10', word: 'year', sound: 'r', category: 'final', imageAlt: 'year' },
        ],
      },
      {
        id: 'r-blends',
        name: 'R Blends',
        soundId: 'r',
        words: [
          { id: 'r-blend-1', word: 'brain', sound: 'r', category: 'blends', imageAlt: 'brain' },
          { id: 'r-blend-2', word: 'branch', sound: 'r', category: 'blends', imageAlt: 'branch' },
          { id: 'r-blend-3', word: 'bread', sound: 'r', category: 'blends', imageAlt: 'bread' },
          { id: 'r-blend-4', word: 'bring', sound: 'r', category: 'blends', imageAlt: 'bring' },
          { id: 'r-blend-5', word: 'brush', sound: 'r', category: 'blends', imageAlt: 'brush' },
          { id: 'r-blend-6', word: 'crack', sound: 'r', category: 'blends', imageAlt: 'crack' },
          { id: 'r-blend-7', word: 'crayon', sound: 'r', category: 'blends', imageAlt: 'crayon' },
          { id: 'r-blend-8', word: 'frog', sound: 'r', category: 'blends', imageAlt: 'frog' },
          { id: 'r-blend-9', word: 'grapes', sound: 'r', category: 'blends', imageAlt: 'grapes' },
          { id: 'r-blend-10', word: 'truck', sound: 'r', category: 'blends', imageAlt: 'truck' },
        ],
      },
    ],
  },
  {
    id: 's',
    name: 'S',
    description: 'The /s/ sound',
    comingSoon: true,
    categories: [],
  },
  {
    id: 'l',
    name: 'L',
    description: 'The /l/ sound',
    comingSoon: true,
    categories: [],
  },
  {
    id: 'th',
    name: 'TH',
    description: 'The /th/ sound',
    comingSoon: true,
    categories: [],
  },
  {
    id: 'sh',
    name: 'SH',
    description: 'The /sh/ sound',
    comingSoon: true,
    categories: [],
  },
  {
    id: 'ch',
    name: 'CH',
    description: 'The /ch/ sound',
    comingSoon: true,
    categories: [],
  },
]

export const games = [
  {
    id: 'key-house',
    name: 'Key House',
    description: 'Match colorful keys to the doors and discover picture words inside',
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Flip cards to find matching pairs and practice saying the words',
  },
  {
    id: 'speech-pop',
    name: 'Speech Pop',
    description: 'Pop bubbles with words and practice saying each one',
  },
  {
    id: 'treasure-hunt',
    name: 'Treasure Hunt',
    description: 'Open treasure chests to find words to practice',
  },
]

export function getSpeechSound(soundId: string): SpeechSound | undefined {
  return speechSounds.find(s => s.id === soundId)
}

export function getSpeechCategory(soundId: string, categoryId: string) {
  const sound = getSpeechSound(soundId)
  if (!sound) return undefined
  return sound.categories.find(c => c.id === categoryId)
}
