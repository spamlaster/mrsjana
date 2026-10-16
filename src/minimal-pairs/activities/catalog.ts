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
  // The game shows both words itself and points to the current one, so there is no prompt above it.
  promptInGame?: boolean
  // Unscored practice the child can do alone, unless a grown-up turns scoring on.
  practiceByDefault?: boolean
  // What a turn is called in the grown-up options, e.g. "bubbles". Defaults to "turns".
  turnNoun?: string
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
    description: 'Both pictures side by side. An arrow points to the word to say, and the game moves on by itself.',
    howTo: 'Say the word the arrow is pointing to.',
    promptInGame: true,
    practiceByDefault: true,
  },
  {
    id: 'bubble-pop',
    name: 'Bubble Pop',
    icon: '🫧',
    kind: 'production',
    description: 'Bubbles float up from the sea floor. Say each word and pop its bubble before it reaches the top!',
    howTo: 'Say the word in a bubble, then pop it before it reaches the top!',
    pictureInGame: true,
    practiceByDefault: true,
    turnNoun: 'bubbles',
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
