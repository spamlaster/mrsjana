import assert from 'node:assert/strict'
import { createLoader } from './lib/load-ts.mjs'

// The shared trial engine, the listening session, and session summaries. Pure modules, no React.
const loader = createLoader()
const session = await loader.load('src/minimal-pairs/session/trialSession.ts')
const listening = await loader.load('src/minimal-pairs/session/listeningSession.ts')
const { summaryText } = await loader.load('src/minimal-pairs/session/result.ts')
const { buildTrials, longestRun, maxRun, sessionReducer, startSession, summarize, percentCorrect, isComplete, currentTrial, isTrialCount } = session

// A seeded random source so failures are reproducible.
const seeded = seed => () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648)

// Trial balancing and randomization.
for (const total of [10, 20]) {
  const orders = new Set()
  for (let seed = 1; seed <= 300; seed++) {
    const trials = buildTrials('key', 'tea', total, seeded(seed))
    assert.equal(trials.length, total)
    assert.equal(trials.filter(trial => trial.role === 'target').length, total / 2, 'Exactly half the trials are the target')
    assert.ok(trials.every(trial => trial.wordId === (trial.role === 'target' ? 'key' : 'tea')), 'Each trial shows its role’s word')
    assert.ok(longestRun(trials.map(trial => trial.role)) <= maxRun, 'No word more than three times in a row')
    assert.deepEqual(trials.map(trial => trial.index), [...Array(total).keys()])
    orders.add(trials.map(trial => trial.role[0]).join(''))
  }
  assert.ok(orders.size > 50, `Orders are shuffled, not fixed (${orders.size} distinct orders for ${total} trials)`)
}
// A random source that always returns the same value would give long runs; the fallback still balances.
const stuck = buildTrials('key', 'tea', 20, () => 0)
assert.ok(longestRun(stuck.map(trial => trial.role)) <= maxRun)
assert.equal(stuck.filter(trial => trial.role === 'contrast').length, 10)
assert.equal(longestRun(['target', 'target', 'contrast', 'contrast', 'contrast', 'target']), 3)
assert.ok(isTrialCount(10) && isTrialCount(20) && !isTrialCount(15) && !isTrialCount(0))

// Scoring, Undo, and completion.
let state = startSession(buildTrials('key', 'tea', 10, seeded(7)))
const order = state.trials.map(trial => trial.role)
assert.equal(currentTrial(state).index, 0)
state = sessionReducer(state, { type: 'undo' })
assert.equal(state.current, 0, 'Undo at the start does nothing')
state = sessionReducer(state, { type: 'mark', mark: 'correct' })
state = sessionReducer(state, { type: 'mark', mark: 'incorrect' })
state = sessionReducer(state, { type: 'mark', mark: 'cued' })
assert.equal(state.current, 3, 'Incorrect and Cued advance like Correct')
assert.equal(state.lastAction, 'mark')
const markId = state.markId
state = sessionReducer(state, { type: 'undo' })
assert.equal(state.current, 2, 'Undo steps back one trial')
assert.equal(state.trials[2].mark, undefined, 'Undo clears the mark')
assert.equal(state.trials[1].mark, 'incorrect', 'Undo leaves earlier marks alone')
assert.equal(state.lastAction, 'undo')
assert.notEqual(state.markId, markId, 'Undo changes markId so games re-render')
state = sessionReducer(sessionReducer(state, { type: 'undo' }), { type: 'undo' })
assert.equal(state.current, 0, 'Undo can go back to the first trial')
assert.deepEqual(state.trials.map(trial => trial.role), order, 'Undo never reshuffles')
const marks = ['correct', 'incorrect', 'cued', 'correct', 'correct', 'incorrect', 'cued', 'correct', 'correct', 'correct']
for (const mark of marks) state = sessionReducer(state, { type: 'mark', mark })
assert.ok(isComplete(state))
assert.equal(currentTrial(state), null)
assert.strictEqual(sessionReducer(state, { type: 'mark', mark: 'correct' }), state, 'Marks after the last trial are ignored')
const finished = sessionReducer(state, { type: 'undo' })
assert.ok(!isComplete(finished), 'Undo after finishing reopens the last trial')

// Session summary: target and contrast separately, cued on its own.
const summary = summarize(state.trials)
const expected = role => {
  const roleMarks = state.trials.filter(trial => trial.role === role).map(trial => trial.mark)
  return { correct: roleMarks.filter(m => m === 'correct').length, incorrect: roleMarks.filter(m => m === 'incorrect').length, cued: roleMarks.filter(m => m === 'cued').length, total: 5 }
}
assert.deepEqual(summary.target, expected('target'))
assert.deepEqual(summary.contrast, expected('contrast'))
assert.equal(summary.target.correct + summary.target.incorrect + summary.target.cued + summary.contrast.correct + summary.contrast.incorrect + summary.contrast.cued, 10)
assert.equal(summary.target.cued + summary.contrast.cued, 2, 'Cued is counted on its own')
assert.equal(percentCorrect({ correct: 3, incorrect: 1, cued: 1, total: 5 }), 60, 'Accuracy is correct without cues, out of all trials')
assert.equal(percentCorrect({ correct: 0, incorrect: 0, cued: 0, total: 0 }), 0)
assert.deepEqual(summarize(startSession(buildTrials('a', 'b', 10)).trials).target, { correct: 0, incorrect: 0, cued: 0, total: 5 })
const restarted = sessionReducer(state, { type: 'restart', trials: buildTrials('key', 'tea', 20, seeded(3)) })
assert.equal(restarted.current, 0)
assert.equal(restarted.trials.length, 20)
assert.ok(restarted.trials.every(trial => !trial.mark))

// Listening Discrimination: taps are scored automatically and reported separately.
let heard = listening.startListening(listening.buildListeningTrials('key', 'tea', 10, seeded(11)))
assert.equal(heard.trials.filter(trial => trial.role === 'target').length, 5)
// A wrong tap stays on the same turn; only the first tap is scored.
for (const trial of heard.trials) {
  if (trial.index % 3 === 0) {
    const before = heard.current
    heard = listening.listeningReducer(heard, { type: 'answer', wordId: trial.wordId === 'key' ? 'tea' : 'key' })
    assert.equal(heard.current, before, 'A wrong tap does not move on')
    assert.equal(heard.lastAction, 'miss')
  }
  heard = listening.listeningReducer(heard, { type: 'answer', wordId: trial.wordId })
}
const wrong = heard.trials.filter(trial => trial.index % 3 === 0).length
const listened = listening.summarizeListening(heard.trials)
assert.equal(listened.target.incorrect + listened.contrast.incorrect, wrong)
assert.equal(listened.target.correct + listened.contrast.correct, 10 - wrong)
assert.equal(listened.target.cued + listened.contrast.cued, 0, 'Listening has no cued result')
assert.strictEqual(listening.listeningReducer(heard, { type: 'answer', wordId: 'key' }), heard)
heard = listening.listeningReducer(heard, { type: 'undo' })
assert.equal(heard.current, 9)
assert.equal(heard.trials[9].answer, undefined)
// Undo clears a wrong tap on the current turn without leaving it.
const missed = listening.listeningReducer(heard, { type: 'answer', wordId: heard.trials[9].wordId === 'key' ? 'tea' : 'key' })
const unmissed = listening.listeningReducer(missed, { type: 'undo' })
assert.equal(unmissed.current, 9)
assert.equal(unmissed.markId, missed.markId, 'The word already heard still counts')
assert.equal(unmissed.trials[9].answer, undefined)
assert.ok(listening.isCorrectAnswer({ wordId: 'key', answer: 'key' }) && !listening.isCorrectAnswer({ wordId: 'key', answer: 'tea' }))

// Copyable summary text: plain, about the session only, and honest about preview pairs.
const result = {
  kind: 'production', activityId: 'bubble-pop', activityName: 'Bubble Pop', processId: 'fronting', sound: 'k', position: 'initial',
  pairId: 'key-tea', targetId: 'key', contrastId: 'tea', total: 10, approved: false, finishedOn: '2026-10-13',
  summary: { target: { correct: 3, incorrect: 1, cued: 1, total: 5 }, contrast: { correct: 5, incorrect: 0, cued: 0, total: 5 } },
}
const text = summaryText(result)
assert.match(text, /Fronting: target \/k\/, beginning of the word/)
assert.match(text, /Pair: key \(target\) \/ tea \(contrast\)/)
assert.match(text, /key: 3 correct, 1 incorrect, 1 cued, of 5 \(60% correct without cues\)/)
assert.match(text, /tea: 5 correct, 0 incorrect, 0 cued, of 5 \(100% correct without cues\)/)
assert.match(text, /awaiting Jana’s clinical approval/)
assert.doesNotMatch(summaryText({ ...result, approved: true }), /awaiting/)
assert.match(summaryText({ ...result, kind: 'listening', activityName: 'Listening Game' }), /key: picked correctly 3 of 5 \(60%\)/)

console.log('Minimal pairs session checks passed: balanced random trials, scoring, undo, completion, summaries, listening, and copy text.')
