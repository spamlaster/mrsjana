import { useSyncExternalStore } from 'react'
import { games, getSpeechCategory, getSpeechSound } from '../data/speeches'
import { stories } from '../data/stories'
import { trackPageView } from './analytics'
import { studentTracking } from '../practice/features'
import { parseCenterRoute, type CenterRoute } from '../minimal-pairs/route'
import type { SessionResult } from '../minimal-pairs/session/result'

export interface Route {
  screen: 'home' | 'sound-select' | 'category-select' | 'game-select' | 'playing' | 'complete' | 'stories' | 'coach' | 'review' | 'grown-ups' | 'phonological'
  soundId?: string
  categoryId?: string
  gameId?: string
  storyId?: string
  page?: number
  filter?: string
  stats?: { wordsPracticed: number; speechReps: number }
  center?: CenterRoute // the Minimal Pairs Therapy Center, under #/phonological
  centerResult?: SessionResult // a finished minimal pairs session, from history.state
}

export function parseRoute(hash: string): Route {
  const [path, query] = hash.replace(/^#/, '').split('?')
  const parts = (path || '/').split('/').filter(Boolean)
  const [section, soundId, categoryId, gameId, result] = parts
  if (section === 'review' && !studentTracking) return { screen: 'home' }
  if (section === 'coach' || section === 'review' || section === 'grown-ups') return { screen: section }
  if (section === 'phonological') return { screen: section, center: parseCenterRoute(parts.slice(1), query) }
  if (section === 'stories') {
    const filter = new URLSearchParams(query).get('sound') || 'all'
    if (!soundId) return { screen: 'stories', filter: filter === 'all' || getSpeechSound(filter) ? filter : 'all' }
    const story = stories.find(item => item.id === soundId)
    if (!story) return { screen: 'stories' }
    const page = Number(categoryId || 1)
    return { screen: 'stories', storyId: story.id, page: Number.isInteger(page) && page >= 1 && page <= story.pages.length + 1 ? page : 1 }
  }
  if (section !== 'sounds') return { screen: 'home' }
  if (!soundId) return { screen: 'sound-select' }
  const sound = getSpeechSound(soundId)
  if (!sound || sound.comingSoon) return { screen: 'sound-select' }
  if (!categoryId || !getSpeechCategory(soundId, categoryId)) return { screen: 'category-select', soundId }
  if (!gameId || !games.some(game => game.id === gameId)) return { screen: 'game-select', soundId, categoryId }
  return { screen: result === 'complete' ? 'complete' : 'playing', soundId, categoryId, gameId }
}

let cachedKey = ''
let cachedRoute: Route
const listeners = new Set<() => void>()
function emit() { listeners.forEach(listener => listener()) }

export function getRoute(): Route {
  const key = `${window.location.hash}:${JSON.stringify(window.history.state)}`
  if (key !== cachedKey || !cachedRoute) {
    cachedKey = key
    cachedRoute = { ...parseRoute(window.location.hash), stats: window.history.state?.practiceStats, centerResult: window.history.state?.centerResult }
  }
  return cachedRoute
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('popstate', listener)
  window.addEventListener('hashchange', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('popstate', listener)
    window.removeEventListener('hashchange', listener)
  }
}

export function navigate(path: string, stats?: Route['stats'], centerResult?: SessionResult) {
  const url = `#${path}`
  if (window.location.hash === url && !stats && !centerResult) return
  window.history.pushState({ practiceIndex: (window.history.state?.practiceIndex || 0) + 1, practiceStats: stats, centerResult }, '', url)
  // Invalidate even when returning to a previously visited URL: old game callbacks must stay stale.
  cachedKey = ''
  emit()
  trackPageView()
  window.scrollTo(0, 0)
}

export function goBack(fallback: string) {
  if (window.history.state?.practiceIndex > 0) window.history.back()
  else navigate(fallback)
}

export function useRoute() { return useSyncExternalStore(subscribe, getRoute) }
