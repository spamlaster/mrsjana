import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'

// Exercise the production router with a minimal browser history implementation.
function moduleUrl(source) {
  return `data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText).toString('base64')}`
}
const speechUrl = moduleUrl(fs.readFileSync('src/data/speeches.ts', 'utf8'))
const storiesUrl = moduleUrl(fs.readFileSync('src/data/stories.ts', 'utf8'))
const reactUrl = moduleUrl('export function useSyncExternalStore() {}')
const routerSource = fs.readFileSync('src/routing/router.ts', 'utf8')
  .replace("'react'", JSON.stringify(reactUrl))
  .replace("'../data/speeches'", JSON.stringify(speechUrl))
  .replace("'../data/stories'", JSON.stringify(storiesUrl))

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
  ['#/sounds/r/r-initial', 'game-select'], ['#/sounds/r/r-initial/memory-match', 'playing'], ['#/sounds/r/r-initial/key-house', 'playing'],
  ['#/sounds/r/r-initial/memory-match/complete', 'complete'], ['#/stories', 'stories'],
]) assert.equal(parseRoute(path).screen, screen)
assert.equal(parseRoute('#/sounds/s').screen, 'sound-select')
assert.equal(parseRoute('#/sounds/unknown').screen, 'sound-select')
assert.equal(parseRoute('#/sounds/r/unknown').screen, 'category-select')
assert.equal(parseRoute('#/sounds/r/r-initial/unknown').screen, 'game-select')
assert.equal(parseRoute('#/stories/unknown').screen, 'stories')
assert.equal(parseRoute('#/stories/rabbit-rainbow/999').page, 1)
assert.equal(parseRoute('#/stories/rabbit-rainbow/4').page, 4)
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
navigate('/stories/rabbit-rainbow/1')
navigate('/stories/rabbit-rainbow/2')
goBack('/stories')
assert.equal(getRoute().page, 1)
goBack('/stories')
assert.equal(getRoute().filter, 'r')
browser.history.forward()
assert.equal(getRoute().storyId, 'rabbit-rainbow')
assert(fallbackScrolls > 0)
console.log('Routing checks passed: direct links, invalid routes, Back/Forward, story pages, filters, and results.')
