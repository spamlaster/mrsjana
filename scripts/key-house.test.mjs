import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'

const source = fs.readFileSync('src/games/keyHouseState.ts', 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const { keyStyles, initialHouseState, houseReducer, makeHouseDoors } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
const words = Array.from({ length: 12 }, (_, index) => ({ id: `word-${index}`, word: `word-${index}` }))
const doors = makeHouseDoors(words)
assert.equal(doors.length, 6)
assert.equal(new Set(doors.map(door => door.word.id)).size, 6)
assert.equal(new Set(keyStyles.map(key => key.shape)).size, 6)
assert.equal(new Set(keyStyles.map(key => key.size)).size, 2)
assert.equal(makeHouseDoors([]).length, 0)
assert.equal(makeHouseDoors(words.slice(0, 2)).length, 2)
let state = initialHouseState
state = houseReducer(state, { type: 'unlock', id: 'red' })
assert.equal(state.opened.length, 0, 'A door needs a selected key')
state = houseReducer(state, { type: 'select', id: 'red' })
state = houseReducer(state, { type: 'unlock', id: 'blue' })
assert.equal(state.feedback, 'mismatch')
assert.equal(state.opened.length, 0, 'Wrong keys must not open a door')
assert.equal(state.selectedKey, 'red', 'A wrong match keeps the key selected')
state = houseReducer(state, { type: 'unlock', id: 'red' })
assert.equal(state.activeDoor, 'red')
assert.equal(state.reps, 0, 'Unlocking alone must not count as speech practice')
assert.strictEqual(houseReducer(state, { type: 'select', id: 'blue' }), state, 'Finish the word before choosing another key')
state = houseReducer(state, { type: 'say' })
assert.equal(state.reps, 1)
assert.equal(state.activeDoor, null)
assert.deepEqual(state.practiced, ['red'])
assert.strictEqual(houseReducer(state, { type: 'say' }), state, 'Repeated clicks must not double count practice')
assert.strictEqual(houseReducer(state, { type: 'unlock', id: 'red' }), state)
assert.strictEqual(houseReducer(state, { type: 'select', id: 'invalid' }), state)
for (const key of keyStyles.slice(1)) {
  state = houseReducer(state, { type: 'select', id: key.id })
  state = houseReducer(state, { type: 'unlock', id: key.id })
  state = houseReducer(state, { type: 'say' })
}
assert.equal(state.opened.length, 6)
assert.equal(state.practiced.length, 6)
assert.equal(state.reps, 6)
assert.deepEqual(houseReducer(state, { type: 'reset' }), initialHouseState)
console.log('Key House checks passed: board generation, matching, wrong-key feedback, practice counting, completion, and reset.')
