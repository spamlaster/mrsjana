import { getProcess } from './selectors'
import type { MinimalPair, PairStatus, Position, ProcessId } from './types'

// Display text for grown-ups. Kept with the content so pickers, summaries, and the review page agree.

export const soundLabel = (sound: string) => `/${sound}/`

export const positionLabels: Record<Position, { name: string; short: string }> = {
  initial: { name: 'Beginning of the word', short: 'beginning' },
  final: { name: 'End of the word', short: 'end' },
}

export const statusLabels: Record<PairStatus, string> = {
  'approved': 'Approved',
  'accepted-for-development': 'Awaiting Jana’s approval',
  'draft': 'Draft, not in preview',
}

// One friendly line per process for the process picker, alongside the process's grown-up note.
export const processTaglines: Record<ProcessId, string> = {
  'fronting': 'For children who say “tea” for “key”',
  'backing': 'For children who say “key” for “tea”',
  'stopping': 'For children who say “pan” for “fan”',
  'cluster-reduction': 'For children who say “no” for “snow”',
  'deaffrication': 'For children who say “tip” for “chip”',
}

export const processIcons: Record<ProcessId, string> = {
  'fronting': '🔑',
  'backing': '☕',
  'stopping': '🐟',
  'cluster-reduction': '❄️',
  'deaffrication': '🍑',
}

// Pairs grouped by process, contrast, and position, in content order, for the review pages.
export function groupPairs(pairs: MinimalPair[]): Map<string, MinimalPair[]> {
  const groups = new Map<string, MinimalPair[]>()
  for (const pair of pairs) {
    const key = `${pair.processes.map(id => getProcess(id)?.name).join(' & ')} · ${pair.contrast.map(soundLabel).join(' vs ')} · ${positionLabels[pair.position].name}`
    groups.set(key, [...(groups.get(key) ?? []), pair])
  }
  return groups
}
