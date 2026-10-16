import { processes } from './processes'
import { lexicon } from './lexicon'
import { pairs } from './pairs'
import type { ContentLibrary, LexiconWord, MinimalPair, PairRoles, PairStatus, PhonologicalProcess, Position, ProcessId, ProcessRule } from './types'

export const library: ContentLibrary = { processes, lexicon, pairs }

const same = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((sound, i) => sound === b[i])

// The id a rule's target sound goes by in URLs and pickers, e.g. 'k', 'th', 'sn'.
export const soundId = (sounds: readonly string[]) => sounds.join('')

// Where swapping `rule.target` for `rule.error` once turns `from` into `to`, with every other sound
// identical. Null when the words differ in any other way, or only in the middle (medial is not supported).
export function contrastPosition(from: readonly string[], to: readonly string[], rule: ProcessRule): Position | null {
  const { target, error } = rule
  if (from.length - target.length !== to.length - error.length) return null
  for (let i = 0; i + target.length <= from.length; i++) {
    if (
      same(from.slice(0, i), to.slice(0, i)) &&
      same(from.slice(i, i + target.length), target) &&
      same(to.slice(i, i + error.length), error) &&
      same(from.slice(i + target.length), to.slice(i + error.length))
    ) return i === 0 ? 'initial' : i + target.length === from.length ? 'final' : null
  }
  return null
}

// Clinically approved by Jana. Only these pairs are ever offered outside preview mode.
export const isPlayable = (pair: MinimalPair) => Boolean(pair.approval?.by.trim() && pair.approval.on.trim())

// Whether a pair may be offered: approved pairs always, pairs accepted for development only in preview mode.
// Drafts are never offered. `preview` comes from preview.ts in the app and is false unless set explicitly.
export const isUsable = (pair: MinimalPair, preview = false) => isPlayable(pair) || (preview && pair.acceptedForDevelopment === true)

export const pairStatus = (pair: MinimalPair): PairStatus =>
  isPlayable(pair) ? 'approved' : pair.acceptedForDevelopment ? 'accepted-for-development' : 'draft'

export const getProcess = (id: string, lib = library) => lib.processes.find(process => process.id === id)
export const getWord = (id: string, lib = library) => lib.lexicon.find(word => word.id === id)
export const getPair = (id: string, lib = library) => lib.pairs.find(pair => pair.id === id)

// Whether `target` → `contrast` is an error this rule describes, at the pair's position.
function ruleFits(rule: ProcessRule, pair: MinimalPair, target: LexiconWord, contrast: LexiconWord) {
  return rule.positions.includes(pair.position) && contrastPosition(target.phonemes, contrast.phonemes, rule) === pair.position
}

// Which word is the target and which the contrast when practicing `sound` for `processId`.
// The same pair gives opposite roles under Fronting and Backing. Ignores approval; use pairsFor for activities.
export function rolesFor(pair: MinimalPair, processId: ProcessId, sound: string, lib = library): PairRoles | null {
  const process = getProcess(processId, lib)
  const [a, b] = pair.words.map(id => getWord(id, lib))
  if (!process || !a || !b || !pair.processes.includes(processId)) return null
  for (const rule of process.rules.filter(rule => soundId(rule.target) === sound)) {
    if (ruleFits(rule, pair, a, b)) return { target: a, contrast: b }
    if (ruleFits(rule, pair, b, a)) return { target: b, contrast: a }
  }
  return null
}

// Every process whose rules describe this pair's contrast, whatever the pair claims. Used by validation.
export function matchingProcesses(pair: MinimalPair, lib = library): ProcessId[] {
  return lib.processes
    .filter(process => process.rules.some(rule => rolesFor({ ...pair, processes: [process.id] }, process.id, soundId(rule.target), lib)))
    .map(process => process.id)
}

// Selectors for activities: usable pairs only (approved, or accepted for development in preview mode),
// and only choices that lead to at least one pair.
export function pairsFor(processId: ProcessId, sound: string, position: Position, lib = library, preview = false): MinimalPair[] {
  return lib.pairs.filter(pair => isUsable(pair, preview) && pair.position === position && rolesFor(pair, processId, sound, lib))
}

export function soundsFor(processId: ProcessId, lib = library, preview = false): string[] {
  const process = getProcess(processId, lib)
  const sounds = [...new Set(process?.rules.map(rule => soundId(rule.target)) ?? [])]
  return sounds.filter(sound => positionsFor(processId, sound, lib, preview).length > 0)
}

export function positionsFor(processId: ProcessId, sound: string, lib = library, preview = false): Position[] {
  return (['initial', 'final'] as const).filter(position => pairsFor(processId, sound, position, lib, preview).length > 0)
}

export function playableProcesses(lib = library, preview = false): PhonologicalProcess[] {
  return lib.processes.filter(process => soundsFor(process.id, lib, preview).length > 0)
}

// The sounds a target sound is replaced by under a process, e.g. Stopping /th/ → ['t', 'p'].
export const errorSoundsFor = (processId: ProcessId, sound: string, lib = library): string[] =>
  getProcess(processId, lib)?.rules.filter(rule => soundId(rule.target) === sound).map(rule => soundId(rule.error)) ?? []

// Every usable pair a process can practice, across its sounds and positions.
export const pairsForProcess = (processId: ProcessId, lib = library, preview = false): MinimalPair[] =>
  lib.pairs.filter(pair => isUsable(pair, preview) && pair.processes.includes(processId) &&
    soundsFor(processId, lib, preview).some(sound => rolesFor(pair, processId, sound, lib)))
