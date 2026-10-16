import type { PhonologicalProcess, Position, ProcessRule } from './types'

// Lowercase ARPAbet. Words and rules may only use these symbols, so a typo fails validation.
export const consonants = ['p', 'b', 't', 'd', 'k', 'g', 'f', 'v', 'th', 'dh', 's', 'z', 'sh', 'zh', 'ch', 'jh', 'm', 'n', 'ng', 'l', 'r', 'w', 'y', 'hh']
export const vowels = ['aa', 'ae', 'ah', 'ao', 'aw', 'ay', 'eh', 'er', 'ey', 'ih', 'iy', 'ow', 'oy', 'uh', 'uw']
export const phonemes = [...consonants, ...vowels]
export const affricates = ['ch', 'jh']

// Initial s-blends allowed in Cluster Reduction. The child drops the /s/, so the contrast word starts with the second consonant.
export const approvedSBlends = [['s', 't'], ['s', 'n'], ['s', 'm'], ['s', 'w'], ['s', 'k'], ['s', 'l']]

const initialAndFinal: Position[] = ['initial', 'final']

const frontingRules: ProcessRule[] = [
  { target: ['k'], error: ['t'], positions: initialAndFinal },
  { target: ['g'], error: ['d'], positions: initialAndFinal },
]

export const processes: PhonologicalProcess[] = [
  {
    id: 'fronting',
    name: 'Fronting',
    rules: frontingRules,
    grownUpNote: 'Sounds made at the back of the mouth, like /k/ and /g/, are said at the front instead, as /t/ and /d/.',
  },
  {
    id: 'backing',
    name: 'Backing',
    // Same pairs as Fronting, with the roles reversed.
    rules: frontingRules.map(rule => ({ ...rule, target: rule.error, error: rule.target })),
    grownUpNote: 'Sounds made at the front of the mouth, like /t/ and /d/, are said at the back instead, as /k/ and /g/.',
  },
  {
    id: 'stopping',
    name: 'Stopping',
    // /ch/ → /t/ is Deaffrication, never Stopping.
    rules: [
      { target: ['f'], error: ['p'], positions: initialAndFinal },
      { target: ['s'], error: ['t'], positions: initialAndFinal },
      { target: ['sh'], error: ['t'], positions: initialAndFinal },
      { target: ['th'], error: ['t'], positions: initialAndFinal },
      { target: ['th'], error: ['p'], positions: initialAndFinal },
    ],
    grownUpNote: 'Long, flowing sounds like /f/, /s/, /sh/, and /th/ are cut short into stop sounds like /p/ and /t/.',
  },
  {
    id: 'cluster-reduction',
    name: 'Cluster Reduction',
    rules: approvedSBlends.map(blend => ({ target: blend, error: blend.slice(1), positions: ['initial'] })),
    grownUpNote: 'An /s/ blend at the start of a word loses its /s/, leaving only the second sound.',
  },
  {
    id: 'deaffrication',
    name: 'Deaffrication',
    rules: [{ target: ['ch'], error: ['t'], positions: initialAndFinal }],
    grownUpNote: 'The /ch/ sound is replaced with a simpler sound, /t/.',
  },
]
