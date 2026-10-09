declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

let lastPath = ''

// The app routes with URL hashes, which Google Analytics doesn't treat as separate pages,
// so report each route as its own page path (e.g. #/sounds/r -> /sounds/r).
export function trackPageView() {
  const path = window.location.hash.replace(/^#/, '') || '/'
  if (path === lastPath) return
  lastPath = path
  const base = window.location.pathname.replace(/\/$/, '')
  window.gtag?.('event', 'page_view', {
    page_location: `${window.location.origin}${base}${path}`,
    page_title: document.title,
  })
}

window.addEventListener('popstate', trackPageView)
window.addEventListener('hashchange', trackPageView)
trackPageView()
