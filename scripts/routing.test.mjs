import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import { createLoader } from './lib/load-ts.mjs'

// Exercise the production router with a minimal browser history implementation.
function moduleUrl(source) {
  return `data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText).toString('base64')}`
}
const speechUrl = moduleUrl(fs.readFileSync('src/data/speeches.ts', 'utf8'))
const storiesUrl = moduleUrl(fs.readFileSync('src/data/stories.ts', 'utf8'))
const reactUrl = moduleUrl('export function useSyncExternalStore() {}')
const analyticsUrl = moduleUrl('export function trackPageView() {}')
const featuresUrl = moduleUrl(fs.readFileSync('src/practice/features.ts', 'utf8'))
const loader = createLoader()
const centerRouteUrl = loader.url('src/minimal-pairs/route.ts')
const routerSource = fs.readFileSync('src/routing/router.ts', 'utf8')
  .replace("'react'", JSON.stringify(reactUrl))
  .replace("'../data/speeches'", JSON.stringify(speechUrl))
  .replace("'../data/stories'", JSON.stringify(storiesUrl))
  .replace("'./analytics'", JSON.stringify(analyticsUrl))
  .replace("'../practice/features'", JSON.stringify(featuresUrl))
  .replace("'../minimal-pairs/route'", JSON.stringify(centerRouteUrl))

const entries = [{ hash: '', state: null }]
let position = 0
let fallbackScrolls = 0
const browser = {
  location: { hash: '' },
  history: {
    state: null,
    pushState(state, unused, hash) {
      entries.splice(position + 1)
      entries.push({ hash, state })
      position += 1
      restore()
    },
    back() { if (position > 0) { position -= 1; restore() } },
    forward() { if (position < entries.length - 1) { position += 1; restore() } },
  },
  scrollTo() { fallbackScrolls += 1 },
}
function restore() {
  browser.location.hash = entries[position].hash
  browser.history.state = entries[position].state
}
globalThis.window = browser
const { parseRoute, navigate, goBack, getRoute } = await import(moduleUrl(routerSource))

assert.equal(getRoute().screen, 'home')
assert.strictEqual(getRoute(), getRoute(), 'Snapshots must be stable between changes')
for (const [path, screen] of [
  ['#/sounds', 'sound-select'], ['#/sounds/r', 'category-select'],
  ['#/sounds/r/r-initial', 'game-select'], ['#/sounds/r/r-initial/memory-match', 'playing'], ['#/sounds/r/r-initial/key-house', 'playing'], ['#/sounds/r/r-initial/star-seekers', 'playing'],
  ['#/sounds/r/r-initial/memory-match/complete', 'complete'], ['#/stories', 'stories'], ['#/coach', 'coach'], ['#/phonological', 'phonological'],
]) assert.equal(parseRoute(path).screen, screen)
assert.equal(parseRoute('#/review').screen, 'home', 'Adult review is hidden while student tracking is off')
assert.equal(parseRoute('#/sounds/s').screen, 'category-select')
assert.equal(parseRoute('#/sounds/unknown').screen, 'sound-select')
assert.equal(parseRoute('#/sounds/r/unknown').screen, 'category-select')
assert.equal(parseRoute('#/sounds/r/r-initial/unknown').screen, 'game-select')
assert.equal(parseRoute('#/stories/unknown').screen, 'stories')
assert.equal(parseRoute('#/stories/ruby-rainbow/999').page, 1)
assert.equal(parseRoute('#/stories/ruby-rainbow/4').page, 4)
assert.equal(parseRoute('#/stories?sound=s').filter, 's')

navigate('/sounds/r')
goBack('/sounds')
assert.equal(getRoute().screen, 'home', 'Back follows actual visits, not a fixed parent')
browser.history.forward()
assert.equal(getRoute().soundId, 'r')
navigate('/sounds/r/r-initial')
navigate('/sounds/r/r-initial/memory-match')
const previousGame = getRoute()
const stats = { wordsPracticed: 12, speechReps: 36 }
navigate('/sounds/r/r-initial/memory-match/complete', stats)
assert.deepEqual(getRoute().stats, stats)
goBack('/')
assert.equal(getRoute().screen, 'playing')
assert.notStrictEqual(getRoute(), previousGame, 'An old completion callback must stay stale')
browser.history.forward()
assert.deepEqual(getRoute().stats, stats)
navigate('/stories?sound=r')
navigate('/stories/ruby-rainbow/1')
navigate('/stories/ruby-rainbow/2')
goBack('/stories')
assert.equal(getRoute().page, 1)
goBack('/stories')
assert.equal(getRoute().filter, 'r')
browser.history.forward()
assert.equal(getRoute().storyId, 'ruby-rainbow')
assert(fallbackScrolls > 0)

// Minimal Pairs Therapy Center routes (#/phonological). Node has no Vite env, so preview mode is off:
// only approved pairs are reachable from links.
const { parseCenterRoute, centerPath } = await import(centerRouteUrl)
assert.equal(parseRoute('#/phonological').center.view, 'processes')
assert.equal(parseRoute('#/phonological/fronting/k/initial/key-tea/bubble-pop?trials=10').center.view, 'playing', 'Production opens an approved pair')
assert.equal(parseRoute('#/phonological/review').center.view, 'processes', 'The review page is preview-only')
const center = (path, options = {}) => {
  const [route, query] = path.split('?')
  return parseCenterRoute(route.split('/').filter(Boolean), query, { preview: true, ...options })
}
for (const [path, view] of [
  ['', 'processes'], ['review', 'review'], ['nope', 'processes'],
  ['fronting', 'sounds'], ['fronting/x', 'sounds'], ['fronting/t', 'sounds'], ['backing/t', 'sounds'],
  ['fronting/k', 'sounds'], ['fronting/k/medial', 'sounds'], ['fronting/k/initial', 'pairs'],
  ['fronting/k/initial/missing', 'pairs'], ['fronting/k/initial/back-bat', 'pairs'], ['fronting/g/initial/key-tea', 'pairs'],
  ['fronting/k/initial/key-tea', 'activities'], ['backing/t/initial/key-tea', 'activities'],
  ['stopping/ch', 'sounds'], ['deaffrication/ch/final/catch-cat', 'activities'], ['stopping/th/initial/thin-pin', 'activities'],
  ['cluster-reduction/st/final', 'sounds'], ['cluster-reduction/st/initial/stop-top', 'activities'],
  ['fronting/k/initial/key-tea/unknown', 'activities'], ['fronting/k/initial/key-tea/bubble-pop', 'playing'],
  ['fronting/k/initial/key-tea/bubble-pop?trials=15', 'playing'], ['fronting/k/initial/key-tea/bubble-pop?trials=20', 'playing'],
  ['fronting/k/initial/key-tea/sound-train/complete', 'complete'], ['review/recordings', 'recordings'],
]) assert.equal(center(path).view, view, `#/phonological/${path} → ${view}`)
assert.equal(center('fronting/k/initial/key-tea/spin-and-say?trials=20').trials, 20)
assert.equal(center('fronting/k/initial/key-tea/spin-and-say').trials, 20, 'Games default to 20 turns')
assert.equal(center('fronting/k/initial/key-tea/spin-and-say?trials=15').trials, 20, 'An unknown turn count falls back to 20')
assert.equal(center('fronting/k/initial/key-tea/spin-and-say?trials=10').trials, 10)
assert.equal(center('fronting/k/initial/key-tea/listening', { listeningReady: () => false }).view, 'activities', 'Listening stays closed until the pair is ready')
assert.equal(center('fronting/k/initial/key-tea/listening', { listeningReady: () => true }).view, 'playing', 'Listening opens once the pair is ready')
for (const path of ['fronting', 'fronting/k/initial', 'fronting/k/initial/key-tea', 'fronting/k/initial/key-tea/feed-the-monster', 'fronting/k/initial/key-tea/feed-the-monster?trials=10', 'fronting/k/initial/key-tea/feed-the-monster/complete', 'review']) {
  assert.equal(centerPath(center(path)), `/phonological/${path}`, `centerPath round-trips ${path}`)
}
const result = { kind: 'production', pairId: 'key-tea', activityId: 'sound-train', summary: { target: { correct: 5, incorrect: 0, cued: 0, total: 5 }, contrast: { correct: 4, incorrect: 1, cued: 0, total: 5 } } }
navigate('/phonological/fronting/k/initial/key-tea/sound-train/complete', undefined, result)
assert.deepEqual(getRoute().centerResult, result, 'The session summary travels in history.state')
goBack('/')
assert.equal(getRoute().centerResult, undefined)
browser.history.forward()
assert.deepEqual(getRoute().centerResult, result)
console.log('Routing checks passed: direct links, invalid routes, Back/Forward, story pages, filters, results, and minimal pairs center routes.')
