import { getActivity } from './activities/catalog'
import { pairListeningReady } from './content/readiness'
import { getPair, getProcess, library, pairsFor, positionsFor, soundsFor } from './content/selectors'
import type { MinimalPair, Position, ProcessId } from './content/types'
import { previewMode } from './preview'
import { isTrialCount, type TrialCount } from './session/trialSession'

// Routes under #/phonological. Every segment is checked against the content, and an invalid one
// falls back to the nearest valid screen above it, like the articulation routes in routing/router.ts.
//
// The quick picker supplies process, sound, position, and pair together. Partial
// legacy paths still open the combined picker with their filters selected.
//   #/phonological                                         choose practice words
//   #/phonological/review                                  review status (preview mode only)
//   #/phonological/review/recordings                       recordings checklist (preview mode only)
//   #/phonological/fronting                                choose a target sound
//   #/phonological/fronting/k                              choose beginning or end of word
//   #/phonological/fronting/k/initial                      choose a pair
//   #/phonological/fronting/k/initial/key-tea              choose an activity
//   #/phonological/fronting/k/initial/key-tea/bubble-pop   legacy game link (opens game picker)
//   #/phonological/fronting/k/initial/key-tea/bubble-pop?trials=20         play
//   #/phonological/fronting/k/initial/key-tea/bubble-pop/complete          session summary

export type CenterView = 'processes' | 'review' | 'recordings' | 'sounds' | 'positions' | 'pairs' | 'activities' | 'setup' | 'playing' | 'complete'

export interface CenterRoute {
  view: CenterView
  processId?: ProcessId
  sound?: string
  position?: Position
  pairId?: string
  activityId?: string
  trials?: TrialCount
}

export interface CenterRouteOptions {
  preview?: boolean
  lib?: typeof library
  listeningReady?: (pair: MinimalPair) => boolean
}

export function parseCenterRoute(parts: string[], query = '', options: CenterRouteOptions = {}): CenterRoute {
  const { preview = previewMode, lib = library, listeningReady = (pair: MinimalPair) => pairListeningReady(pair, lib) } = options
  const [processId, sound, position, pairId, activityId, result] = parts
  if (processId === 'review') return { view: !preview ? 'processes' : sound === 'recordings' ? 'recordings' : 'review' }
  const process = processId ? getProcess(processId, lib) : undefined
  if (!process || !soundsFor(process.id, lib, preview).length) return { view: 'processes' }
  const base = { processId: process.id }
  if (!sound || !soundsFor(process.id, lib, preview).includes(sound)) return { view: 'sounds', ...base }
  const positions = positionsFor(process.id, sound, lib, preview)
  if (!positions.includes(position as Position)) return { view: 'positions', ...base, sound }
  const at = { ...base, sound, position: position as Position }
  const pair = pairId ? getPair(pairId, lib) : undefined
  if (!pair || !pairsFor(process.id, sound, at.position, lib, preview).includes(pair)) return { view: 'pairs', ...at }
  const withPair = { ...at, pairId: pair.id }
  const activity = activityId ? getActivity(activityId) : undefined
  const requestedTrials = Number(new URLSearchParams(query).get('trials'))
  const savedTrials = isTrialCount(requestedTrials) ? { trials: requestedTrials } : {}
  if (!activity || (activity.kind === 'listening' && !listeningReady(pair))) return { view: 'activities', ...withPair, ...savedTrials }
  const withActivity = { ...withPair, activityId: activity.id }
  if (result === 'complete') return { view: 'complete', ...withActivity, ...savedTrials }
  return isTrialCount(requestedTrials) ? { view: 'playing', ...withActivity, trials: requestedTrials } : { view: 'setup', ...withActivity }
}

// The path for a route, without the leading #. Stops at the first missing segment.
export function centerPath(route: Omit<CenterRoute, 'view'> & { view?: CenterView }): string {
  if (route.view === 'review') return '/phonological/review'
  if (route.view === 'recordings') return '/phonological/review/recordings'
  const segments = [route.processId, route.sound, route.position, route.pairId, route.activityId]
  const end = segments.findIndex(segment => !segment)
  const path = ['/phonological', ...segments.slice(0, end === -1 ? segments.length : end)].join('/')
  const query = route.trials ? `?trials=${route.trials}` : ''
  if (route.view === 'complete') return `${path}/complete${query}`
  return route.view === 'playing' || !route.activityId ? `${path}${query}` : path
}
