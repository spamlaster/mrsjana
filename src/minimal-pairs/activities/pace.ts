// Seconds per turn for the games that run by themselves (Say the Word, Bubble Pop).
export const paces = [2, 3, 4, 5] as const
export type Pace = (typeof paces)[number]
export const defaultPace: Pace = 3
