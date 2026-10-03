import { useSyncExternalStore } from 'react'
import { games, getSpeechCategory, getSpeechSound } from '../data/speeches'
import { stories } from '../data/stories'

export interface Route {
  screen: 'home' | 'sound-select' | 'category-select' | 'game-select' | 'playing' | 'complete' | 'stories'
  soundId?: string
  categoryId?: string
  gameId?: string
  storyId?: string
  page?: number
  filter?: string
  stats?: { wordsPracticed: number; speechReps: number }
}

export function parseRoute(hash: string): Route {
  const [path, query] = hash.replace(/^#/, '').split('?')
  const parts = (path || '/').split('/').filter(Boolean)
  const [section, soundId, categoryId, gameId, result] = parts
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
    cachedRoute = { ...parseRoute(window.location.hash), stats: window.history.state?.practiceStats }
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

export function navigate(path: string, stats?: Route['stats']) {
  const url = `#${path}`
  if (window.location.hash === url && !stats) return
  window.history.pushState({ practiceIndex: (window.history.state?.practiceIndex || 0) + 1, practiceStats: stats }, '', url)
  // Invalidate even when returning to a previously visited URL: old game callbacks must stay stale.
  cachedKey = ''
  emit()
  window.scrollTo(0, 0)
}

export function goBack(fallback: string) {
  if (window.history.state?.practiceIndex > 0) window.history.back()
  else navigate(fallback)
}

export function useRoute() { return useSyncExternalStore(subscribe, getRoute) }
