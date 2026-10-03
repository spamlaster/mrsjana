import type { SpeechWord } from '../types'

export const keyStyles = [
  { id: 'red', name: 'Red', color: '#df5c62', shape: 'circle', size: 'short' },
  { id: 'blue', name: 'Blue', color: '#4e91c6', shape: 'square', size: 'long' },
  { id: 'yellow', name: 'Yellow', color: '#ecc44d', shape: 'triangle', size: 'short' },
  { id: 'green', name: 'Green', color: '#5aa77b', shape: 'diamond', size: 'long' },
  { id: 'purple', name: 'Purple', color: '#9270c4', shape: 'star', size: 'short' },
  { id: 'orange', name: 'Orange', color: '#e38a46', shape: 'hexagon', size: 'long' },
] as const
export type HouseKey = typeof keyStyles[number]
export interface HouseDoor { key: HouseKey; word: SpeechWord }
export interface HouseState {
  selectedKey: string | null
  opened: string[]
  practiced: string[]
  activeDoor: string | null
  feedback: 'ready' | 'selected' | 'mismatch' | 'unlocked' | 'said'
  reps: number
}
export const initialHouseState: HouseState = { selectedKey: null, opened: [], practiced: [], activeDoor: null, feedback: 'ready', reps: 0 }
export type HouseAction = { type: 'select'; id: string } | { type: 'unlock'; id: string } | { type: 'say' } | { type: 'reset' }
export function houseReducer(state: HouseState, action: HouseAction): HouseState {
  if (action.type === 'reset') return initialHouseState
  if (state.activeDoor) {
    if (action.type !== 'say') return state
    return { ...state, practiced: [...state.practiced, state.activeDoor], activeDoor: null, feedback: 'said', reps: state.reps + 1 }
  }
  if (action.type === 'select') {
    if (!keyStyles.some(key => key.id === action.id) || state.opened.includes(action.id)) return state
    return { ...state, selectedKey: action.id, feedback: 'selected' }
  }
  if (action.type === 'unlock') {
    if (state.opened.includes(action.id) || !keyStyles.some(key => key.id === action.id)) return state
    if (!state.selectedKey) return { ...state, feedback: 'ready' }
    if (state.selectedKey !== action.id) return { ...state, feedback: 'mismatch' }
    return { ...state, opened: [...state.opened, action.id], activeDoor: action.id, selectedKey: null, feedback: 'unlocked' }
  }
  return state
}

export function makeHouseDoors(words: SpeechWord[]): HouseDoor[] {
  const shuffled = [...words]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return keyStyles.slice(0, shuffled.length).map((key, index) => ({ key, word: shuffled[index] }))
}
