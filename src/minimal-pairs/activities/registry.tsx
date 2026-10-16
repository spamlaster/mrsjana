import type { ComponentType } from 'react'
import { BubblePop } from './BubblePop'
import { FeedTheMonster } from './FeedTheMonster'
import { SayTheWord } from './SayTheWord'
import { SoundTrain } from './SoundTrain'
import { SpinAndSay } from './SpinAndSay'
import { TreasureReveal } from './TreasureReveal'
import type { ActivityProps } from './types'

// The production games, by activity id (see catalog.ts). All of them run on the shared trial engine.
// Listening Discrimination is not here: it has its own session (components/ListeningSession.tsx).
export const productionGames: Record<string, ComponentType<ActivityProps>> = {
  'say-the-word': SayTheWord,
  'bubble-pop': BubblePop,
  'feed-the-monster': FeedTheMonster,
  'spin-and-say': SpinAndSay,
  'treasure-reveal': TreasureReveal,
  'sound-train': SoundTrain,
}
