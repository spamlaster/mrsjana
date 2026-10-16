import assert from 'node:assert/strict'
import { createLoader } from './lib/load-ts.mjs'

// Server-renders the Minimal Pairs Therapy Center's screens and games with React, so the real
// components are checked in Node: missing pictures, missing audio, preview labels, and finished games.
const stub = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
const loader = createLoader({ overrides: { './analytics': stub('export function trackPageView() {}') } })
const { createElement: h } = await import('react')
const { renderToStaticMarkup } = await import('react-dom/server')
const render = element => renderToStaticMarkup(element)
const count = (html, text) => html.split(text).length - 1

const { library, getWord, getPair, rolesFor } = await loader.load('src/minimal-pairs/content/selectors.ts')
const { illustrationRecords } = await loader.load('src/minimal-pairs/content/illustration-records.ts')
const { PairPicture } = await loader.load('src/minimal-pairs/components/PairPicture.tsx')
const { TrialPrompt } = await loader.load('src/minimal-pairs/components/TrialPrompt.tsx')
const { AdultScoringBar } = await loader.load('src/minimal-pairs/components/AdultScoringBar.tsx')
const { productionGames } = await loader.load('src/minimal-pairs/activities/registry.tsx')
const { ListeningDiscrimination } = await loader.load('src/minimal-pairs/activities/ListeningDiscrimination.tsx')
const { activityCatalog, getActivity } = await loader.load('src/minimal-pairs/activities/catalog.ts')
const { MinimalPairsCenter } = await loader.load('src/minimal-pairs/MinimalPairsCenter.tsx')
const { parseCenterRoute } = await loader.load('src/minimal-pairs/route.ts')
const word = id => getWord(id)

// Missing picture handling: linked WordPicture, emoji, or a placeholder that says so.
// Checked without custom illustrations, so adding one to the site does not change these.
const picture = id => render(h(PairPicture, { word: word(id), illustrations: {} }))
assert.match(picture('car'), /<svg class="word-picture"/, 'car uses its WordPicture drawing')
assert.match(picture('key'), /🔑/, 'key uses its emoji')
assert.match(picture('tar'), /mp-placeholder/, 'tar has no picture yet, so it shows the placeholder')
assert.match(picture('tar'), /Picture coming soon/)
assert.doesNotMatch(picture('nail'), /🔨/, 'A rejected picture is never shown')
assert.match(picture('nail'), /mp-placeholder/)
assert.match(picture('fat'), /Picture coming soon: a chubby cat/, 'The placeholder describes the required picture')
// A recorded illustration replaces the site picture, emoji, or placeholder; without a record nothing points at the file.
const illustrations = { car: { sha256: 'abc123def4567890', width: 512, height: 512 }, key: { sha256: 'f'.repeat(64), width: 512, height: 512 }, fat: { sha256: '0'.repeat(64), width: 512, height: 512 } }
const illustrated = id => render(h(PairPicture, { word: word(id), illustrations }))
assert.match(illustrated('car'), /<img src="\/images\/minimal-pairs\/car\.png\?v=abc123def456" alt="a car"/, 'An illustration comes before WordPicture')
assert.doesNotMatch(illustrated('car'), /word-picture/)
assert.doesNotMatch(illustrated('key'), /🔑/, 'An illustration comes before an emoji')
assert.match(illustrated('fat'), /images\/minimal-pairs\/fat\.png[^"]*" alt="a chubby cat"/, 'An illustration replaces the placeholder')
assert.doesNotMatch(picture('fat'), /<img/, 'No record, no image, even if the file were there')

// Missing audio handling: no listen button without a playable recording, and never a device voice.
const activityWord = (id, canListen) => ({ id, text: word(id).text, picture: h(PairPicture, { word: word(id) }), canListen })
const prompt = canListen => render(h(TrialPrompt, { word: activityWord('key', canListen), showPicture: true, onListen: () => Promise.resolve(true) }))
assert.doesNotMatch(prompt(false), /Hear it/, 'No recording, no listen button')
assert.match(prompt(true), /Hear it/)
assert.match(render(h(TrialPrompt, { word: activityWord('key', true), showPicture: true, hidden: true, onListen: () => Promise.resolve(true) })), /Spin to find your word/)
assert.doesNotMatch(render(h(TrialPrompt, { word: activityWord('key', true), showPicture: true, hidden: true, onListen: () => Promise.resolve(true) })), />key</, 'Spin & Say keeps the word secret')
assert.equal(render(h(TrialPrompt, { word: null, showPicture: true, onListen: () => Promise.resolve(true) })), '')

// Adult scoring bar: Correct, Incorrect, Cued, Undo; Undo disabled before the first mark.
const bar = (completed, finished = false) => render(h(AdultScoringBar, { completed, total: 10, finished, onMark() {}, onUndo() {}, notes: ['Preview note'] }))
for (const label of ['Correct', 'Incorrect', 'Cued', 'Undo']) assert.match(bar(0), new RegExp(label))
assert.match(bar(0), /<button class="mp-score mp-score-undo" disabled=""/)
assert.doesNotMatch(bar(3), /mp-score-undo" disabled/)
assert.equal(count(bar(10, true), 'disabled=""'), 3, 'When finished only Undo stays available')
assert.match(bar(0), /Preview note/)

// Every production game renders at the start, partway, and finished, without knowing roles.
const words = [activityWord('key', false), activityWord('tea', false)]
const props = (completed, total = 10) => ({
  total, completed, current: completed < total ? { word: words[completed % 2] } : null,
  done: Array.from({ length: completed }, (_, i) => words[i % 2]), words, markId: completed, lastAction: completed ? 'mark' : 'start', revealed: true, onReveal() {},
})
const finishedText = {
  'say-the-word': /Every star is shining/, 'bubble-pop': /All the bubbles are popped/, 'feed-the-monster': /Munch is full and happy/,
  'spin-and-say': /What a great spinner/, 'treasure-reveal': /You found the treasure/, 'sound-train': /All aboard! 20 cars/,
}
assert.deepEqual(Object.keys(productionGames).sort(), activityCatalog.filter(activity => activity.kind === 'production').map(activity => activity.id).sort(), 'Every production activity has a game')
for (const [id, Game] of Object.entries(productionGames)) {
  for (const total of [10, 20]) {
    for (const completed of [0, total / 2, total]) {
      const html = render(h(Game, props(completed, total)))
      assert.ok(html.includes('mp-game'), `${id} renders at ${completed}/${total}`)
      if (completed === total && total === 20) assert.match(html, finishedText[id], `${id} shows completion`)
    }
  }
}
assert.equal(count(render(h(productionGames['say-the-word'], props(4))), 'stw-star lit'), 4, 'Say the Word lights one star per scored turn')
assert.match(render(h(productionGames['bubble-pop'], props(4))), /aria-valuenow="4"/, 'Bubble progress follows completed turns')
assert.equal(count(render(h(productionGames['treasure-reveal'], props(4))), 'tr-tile lifted'), 4, 'Treasure Reveal lifts one tile per turn')
assert.equal(count(render(h(productionGames['treasure-reveal'], props(3))), 'tr-tile lifted'), 3, 'Undo puts a tile back')
assert.match(render(h(productionGames['sound-train'], props(5))), /\+2/, 'Sound Train shows the extra cars')
assert.match(render(h(productionGames['spin-and-say'], { ...props(0), revealed: false })), /Spin! 🎡/)
assert.match(render(h(productionGames['feed-the-monster'], props(2))), /Feed Munch the key/)

// Listening Discrimination: pictures stay locked until the word is heard.
const ld = (listened, feedback = null, shaking = null) => render(h(ListeningDiscrimination, { words, total: 10, completed: 2, listened, playing: false, feedback, shaking, onListen() {}, onPick() {}, onShakeEnd() {} }))
assert.equal(count(ld(false), 'class="ld-choice" disabled=""'), 2, 'Pictures are locked before listening')
assert.equal(count(ld(true), 'class="ld-choice" disabled=""'), 0)
assert.match(ld(true, { kind: 'right', word: words[0] }), /Yes! You heard “key”/)
assert.match(ld(true, { kind: 'oops' }, words[1].id), /Oops, try again!/)
assert.equal(count(ld(true, { kind: 'oops' }, words[1].id), 'ld-choice is-shaking'), 1, 'The wrong picture shakes')

// The center, screen by screen, in preview mode.
const screen = (path, extra = {}) => {
  const [route, query] = path.split('?')
  const center = parseCenterRoute(route.split('/').filter(Boolean), query, { preview: true })
  return render(h(MinimalPairsCenter, { route: center, preview: true, ...extra }))
}
const home = screen('')
assert.match(home, /Preview mode/)
for (const process of library.processes) assert.match(home, new RegExp(process.name))
assert.match(home, /Choose practice words/i)
assert.match(home, /Customize practice/)
assert.match(home, /Try a listening game/)
assert.doesNotMatch(home, /STEP [456]/)
assert.match(screen('stopping'), /Target sound/)
assert.match(screen('fronting/k'), /Where in the word/)
const pairsHtml = screen('stopping/th/initial')
assert.match(pairsHtml, /Practice \/th\//)
assert.match(pairsHtml, /Say “thin” clearly/)
const activities = screen('fronting/k/initial/key-tea')
for (const activity of activityCatalog) assert.match(activities, new RegExp(activity.name.replace('&', '&amp;')))
assert.match(activities, /Optional/)
assert.doesNotMatch(activities, /Not ready yet/, 'key / tea has pictures and reviewed recordings, so Listening is open')
if (!illustrationRecords.catch) assert.match(screen('deaffrication/ch/final/catch-cat'), /Not ready yet\. Needs a picture of “catch”/, 'Listening explains what is missing')
assert.ok(activities.indexOf('Listening Game') < activities.indexOf('Say the Word'), 'Listening is listed first')
assert.match(screen('fronting/k/initial/key-tea/bubble-pop'), /What should we play/,'Legacy game links offer the game picker without a separate setup screen')
assert.match(activities, /aria-pressed="true">10 turns/)
assert.match(activities, /Play on your own/)
assert.match(activities, /Play with a grown-up/)
assert.match(screen('backing/t/initial/key-tea/bubble-pop'), /mp-pair-target"><span class="mp-picture[^"]*"[^>]*>[\s\S]*?<span>tea<\/span>/, 'Backing makes tea the target')

// Playing: every production game in the full shell, with the grown-up bar and preview note.
for (const activity of activityCatalog.filter(item => item.kind === 'production')) {
  const html = screen(`fronting/k/initial/key-tea/${activity.id}?trials=10`)
  assert.match(html, /Grown-up scoring/, `${activity.id} offers scoring`)
  if (activity.id === 'bubble-pop') {
    assert.doesNotMatch(html, /mp-scoring-buttons/, 'Bubble Pop defaults to independent, unscored practice')
    assert.match(html, /bp-seafloor/, 'Bubble Pop includes an underwater scene')
    continue
  }
  assert.match(html, /Turn 1 of 10/)
  assert.doesNotMatch(html, /Preview · awaiting/, `${activity.id} is approved, so it has no preview label`)
  assert.doesNotMatch(html, /mp-steps|mp-crumbs/, 'The play screen stays uncluttered')
  // key and tea have reviewed recordings, so there is nothing to warn about. Missing audio is covered by TrialPrompt above.
  assert.doesNotMatch(html, /No recording for|has not been reviewed yet/, `${activity.id} has no recording warning for key / tea`)
  if (activity.id !== 'spin-and-say') assert.match(html, /Hear it/, `${activity.id} offers the reviewed recording`)
}
assert.match(screen('fronting/k/initial/key-tea/spin-and-say?trials=20'), /Turn 1 of 20/)

// Summary: target and contrast separately, cued separately, a copy button, and nothing saved.
const result = {
  kind: 'production', activityId: 'bubble-pop', activityName: 'Bubble Pop', processId: 'fronting', sound: 'k', position: 'initial',
  pairId: 'key-tea', targetId: 'key', contrastId: 'tea', total: 10, approved: false, finishedOn: '2026-10-13',
  summary: { target: { correct: 3, incorrect: 1, cued: 1, total: 5 }, contrast: { correct: 4, incorrect: 0, cued: 1, total: 5 } },
}
const summary = screen('fronting/k/initial/key-tea/bubble-pop/complete', { result })
assert.match(summary, /Target word[\s\S]*Correct<\/dt><dd>3[\s\S]*Incorrect<\/dt><dd>1[\s\S]*Cued<\/dt><dd>1[\s\S]*60% correct without cues/)
assert.match(summary, /Contrast word[\s\S]*Correct<\/dt><dd>4[\s\S]*80% correct without cues/)
assert.match(summary, /Copy summary/)
assert.match(summary, /Nothing about the child is saved/)
assert.match(summary, /still awaiting Jana’s clinical approval/)
assert.match(screen('fronting/k/initial/key-tea/bubble-pop/complete'), /no longer available/, 'A refreshed summary is gone, by design')
const listeningSummary = screen('fronting/k/initial/key-tea/bubble-pop/complete', { result: { ...result, kind: 'listening' } })
assert.doesNotMatch(listeningSummary, /Cued<\/dt>/, 'Listening results have no cued column')

// Review status page lists every pair and its separate review states.
const review = screen('review')
assert.match(review, /Approved<\/dt><dd>103 of 103 pairs/)
assert.match(review, /Awaiting approval<\/dt><dd>0 pairs/)
assert.match(review, /Sounds \(transcriptions\) checked<\/dt><dd>182 of 182 words/)
assert.equal(count(review, 'mp-button-small">Try it<'), 103, 'Every pair can be opened from the review page')
assert.match(review, new RegExp(`Custom illustrations</dt><dd>${Object.keys(illustrationRecords).length} of 182 words`))
if (!illustrationRecords.fat) assert.match(review, /fat<\/strong>: a chubby cat · <code>images\/minimal-pairs\/fat\.png<\/code> · <em>Must be: a chubby cat or another nonhuman subject, never a person/)

// Recordings checklist: preview only, every word with a recording to check, and a report with the commands.
assert.match(review, /Check recordings/)
assert.equal(parseCenterRoute(['review', 'recordings'], '', { preview: false }).view, 'processes', 'The checklist is preview only')
const { checkReport, recordingState } = await loader.load('src/minimal-pairs/content/audio-check.ts')
const checklist = screen('review/recordings')
assert.match(checklist, /Do the recordings sound right\?/)
const pending = library.lexicon.filter(item => recordingState(item) !== 'reviewed')
assert.match(checklist, new RegExp(`Words to check</dt><dd>${pending.length} of 182`))
assert.equal(count(checklist, 'aria-label="Play '), library.pairs.filter(pair => pair.words.some(id => recordingState(word(id)) !== 'reviewed')).length * 2, 'Both words of every pair still to check have a play button, for comparison')
assert.match(checklist, /Nothing decided yet/)
const firstState = state => pending.find(item => recordingState(item) === state)
const heard = firstState('unreviewed'), absent = firstState('missing')
if (heard) {
  const report = checkReport({ [heard.id]: { verdict: 'ok' } }, 'Jana', '2026-10-14')
  assert.match(report, new RegExp(`--mark-reviewed=${heard.id} --by=Jana`))
  assert.match(checkReport({ [heard.id]: { verdict: 'redo', note: 'clipped start' } }, 'Jana', '2026-10-14'), new RegExp(`- ${heard.text}: clipped start\n.*--only=${heard.id} --force`))
  assert.match(checkReport({ [heard.id]: { verdict: 'ok' } }, 'Ms. Jana R', '2026-10-14'), /--by="Ms\. Jana R"/, 'A name with spaces is quoted')
  assert.match(checkReport({ [heard.id]: { verdict: 'reuse' } }, 'Jana', '2026-10-14'), /Nothing decided yet/, 'A decision for another state is ignored')
}
if (absent) assert.match(checkReport({ [absent.id]: { verdict: 'reuse' } }, 'Jana', '2026-10-14'), new RegExp(`${absent.id}: audio: 'words/[a-z0-9-]+\\.mp3'\nthen:\n.*--mark-reviewed=${absent.id} --by=Jana`))

// Production mode: every process has approved pairs to offer.
const production = render(h(MinimalPairsCenter, { route: parseCenterRoute([], '', { preview: false }), preview: false }))
assert.doesNotMatch(production, /Preview mode/)
assert.equal(count(production, 'disabled=""'), 0, 'Every process has approved pairs')
assert.doesNotMatch(production, /Coming soon: Ms. Jana is still choosing the words/)
assert.ok(getPair('key-tea') && rolesFor(getPair('key-tea'), 'fronting', 'k') && getActivity('bubble-pop'))

console.log('Minimal pairs UI checks passed: pictures and placeholders, missing audio, scoring bar, all games, listening lock, every screen, summaries, review status, recordings checklist, and production mode.')

const practiceSummary = screen('fronting/k/initial/key-tea/bubble-pop/complete', { result: { ...result, kind: 'practice' } })
assert.match(practiceSummary, /You popped 10 bubbles/)
assert.doesNotMatch(practiceSummary, /correct without cues|<dt>Correct<\/dt>/, 'Unscored practice never reports accuracy')
const { sessionReducer, startSession, buildTrials, summarize } = await loader.load('src/minimal-pairs/session/trialSession.ts')
let practiceState = startSession(buildTrials('key', 'tea', 10))
for (let i = 0; i < 10; i++) practiceState = sessionReducer(practiceState, { type: 'advance' })
assert.equal(practiceState.current, 10)
assert.ok(practiceState.trials.every(trial => trial.mark === undefined), 'Popping does not assign speech scores')
assert.equal(summarize(practiceState.trials).target.correct, 0)
assert.equal(sessionReducer(practiceState, { type: 'advance' }), practiceState, 'Extra pops cannot advance a finished session')
assert.equal(sessionReducer(practiceState, { type: 'undo' }).current, 9)

const { summaryText } = await loader.load('src/minimal-pairs/session/result.ts')
const practiceText = summaryText({ ...result, kind: 'practice' })
assert.match(practiceText, /practice turns \(unscored\)/)
assert.doesNotMatch(practiceText, /%|incorrect|cued/)

// Exercise the real navigation handlers without a browser. Hook state starts at the
// supplied values; rendering behavior is covered by the React server tests above.
const actionsLoader = createLoader({ overrides: {
  react: stub('export function useState(initial) { return [initial, () => {}] }'),
  '../../routing/router': stub('export const paths = []; export function navigate(path) { paths.push(path) }'),
} })
const { PracticePicker } = await actionsLoader.load('src/minimal-pairs/components/PracticePicker.tsx')
const { ActivityPicker } = await actionsLoader.load('src/minimal-pairs/components/CenterPickers.tsx')
const { SessionSummary } = await actionsLoader.load('src/minimal-pairs/components/SessionSummary.tsx')
const { paths } = await import(stub('export const paths = []; export function navigate(path) { paths.push(path) }'))
const { centerPath } = await loader.load('src/minimal-pairs/route.ts')
const nodes = tree => !tree || typeof tree !== 'object' ? [] : Array.isArray(tree) ? tree.flatMap(nodes) : [tree, ...nodes(tree.props?.children)]
const click = (tree, predicate) => {
  const button = nodes(tree).find(node => node.type === 'button' && predicate(node.props))
  assert.ok(button, 'Expected navigation button exists')
  button.props.onClick()
  const [path, query] = paths.at(-1).replace('/phonological/', '').split('?')
  return parseCenterRoute(path.split('/'), query, { preview: false })
}
const practiceTree = PracticePicker({ route: { view: 'processes' }, preview: false })
const selected = click(practiceTree, props => props.className?.includes('mp-pair-card'))
assert.equal(selected.view, 'activities', 'A single picture card supplies all practice settings')
const quickListen = click(practiceTree, props => typeof props.children === 'string' && props.children.includes('Try a listening'))
assert.equal(quickListen.view, 'playing')
assert.equal(quickListen.activityId, 'listening')
for (const trials of [10, 20]) {
  const gameTree = ActivityPicker({ ...selected, pair: getPair(selected.pairId), preview: false, initialTrials: trials })
  const playing = click(gameTree, props => props.className?.includes('mp-activity-card') && !props.disabled)
  assert.equal(playing.view, 'playing', 'Selecting a game starts play directly')
  assert.equal(playing.trials, trials)
  const completePath = centerPath({ ...playing, view: 'complete' })
  const [path, query] = completePath.replace('/phonological/', '').split('?')
  const complete = parseCenterRoute(path.split('/'), query, { preview: false })
  assert.equal(complete.trials, trials, 'Turn count survives the summary URL')
  const summaryTree = SessionSummary({ route: complete })
  const again = click(summaryTree, props => Array.isArray(props.children) && props.children[0] === 'Play ')
  assert.equal(again.view, 'playing', 'Replay starts immediately even after refreshing the summary')
  assert.equal(again.trials, trials)
  const another = click(summaryTree, props => props.children === 'Choose another game')
  assert.equal(another.trials, trials, 'Changing games keeps session length')
}
console.log('Quick play navigation passed: word cards, listening shortcut, direct game launch, replay, and retained turn counts.')
