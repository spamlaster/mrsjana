export interface PracticeStory {
  id: string
  title: string
  soundId: string
  targetLetters: string
  description: string
  emoji: string
  pages: { text: string; practiceWords: string[]; emoji: string }[]
}

// Highlight spelling explicitly: letter patterns and speech sounds are not always the same.
export const stories: PracticeStory[] = [
  {
    id: 'rabbit-rainbow',
    title: 'Ruby and the Rainbow',
    soundId: 'r',
    targetLetters: 'r',
    description: 'Join Ruby on a colorful little adventure. A sample R story.',
    emoji: '🌈',
    pages: [
      { text: 'Ruby the rabbit looks out at the rain. “Rain, rain!” says Ruby. She puts on her red boots.', practiceWords: ['Ruby', 'rabbit', 'rain', 'red'], emoji: '🐰' },
      { text: 'Ruby runs down the road. She sees a rose next to a rock. A robin rests on the rock.', practiceWords: ['runs', 'road', 'rose', 'rock', 'robin'], emoji: '🌹' },
      { text: 'The rain stops. Ruby sees a rainbow! “Red is my favorite,” says Ruby. The robin sings along.', practiceWords: ['rain', 'Ruby', 'rainbow', 'red', 'robin'], emoji: '🌈' },
    ],
  },
]
