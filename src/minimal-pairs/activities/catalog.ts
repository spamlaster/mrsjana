// The activities in the center, in menu order. Plain data (no React) so routes can be validated in Node.
// Listening Discrimination is listed first but is optional: nothing requires it.

export type ActivityKind = 'listening' | 'production'

export interface ActivityInfo {
  id: string
  name: string
  icon: string
  kind: ActivityKind
  description: string // for the grown-up choosing
  howTo: string // one line shown while playing
  // The word stays hidden until the child does something (Spin & Say lands the spinner on it).
  revealsWord?: boolean
  // The game shows the word's picture itself, so the prompt above it shows only the word and listen button.
  pictureInGame?: boolean
}

export const activityCatalog: ActivityInfo[] = [
  {
    id: 'listening',
    name: 'Listening Game',
    icon: '👂',
    kind: 'listening',
    description: 'Hear a word and tap the matching picture. Optional, and scored automatically.',
    howTo: 'Listen to the word, then tap the picture you heard.',
  },
  {
    id: 'say-the-word',
    name: 'Say the Word',
    icon: '🗣️',
    kind: 'production',
    description: 'One big picture at a time. Say the word and earn a star.',
    howTo: 'Look at the picture and say the word.',
  },
  {
    id: 'bubble-pop',
    name: 'Bubble Pop',
    icon: '🫧',
    kind: 'production',
    description: 'Every word floats in a bubble. Say it, then pop it!',
    howTo: 'Say the word in the big bubble, then pop it!',
    pictureInGame: true,
  },
  {
    id: 'feed-the-monster',
    name: 'Feed the Monster',
    icon: '👾',
    kind: 'production',
    description: 'A hungry, friendly monster wants snacks. Say the word, then feed Munch.',
    howTo: 'Say the word, then give Munch a snack!',
    pictureInGame: true,
  },
  {
    id: 'spin-and-say',
    name: 'Spin & Say',
    icon: '🎡',
    kind: 'production',
    description: 'Spin the wheel to find out which word to say.',
    howTo: 'Spin the wheel, then say the word it lands on.',
    revealsWord: true,
    pictureInGame: true,
  },
  {
    id: 'treasure-reveal',
    name: 'Treasure Reveal',
    icon: '💎',
    kind: 'production',
    description: 'Every word uncovers part of a hidden treasure island.',
    howTo: 'Say the word to uncover more of the treasure!',
  },
  {
    id: 'sound-train',
    name: 'Sound Train',
    icon: '🚂',
    kind: 'production',
    description: 'Every word adds a car to the train on its way to the station.',
    howTo: 'Say the word to add a car to the train!',
  },
]

export const getActivity = (id: string) => activityCatalog.find(activity => activity.id === id)
