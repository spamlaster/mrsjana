import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
const source = fs.readFileSync('src/practice/store.ts', 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const { newStudent, teacherAttempt, parseAssessment, readRecords, writeRecords } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
const saved = new Map()
globalThis.localStorage = { getItem: key => saved.get(key) || null, setItem: (key, value) => saved.set(key, value) }
const nick1 = newStudent('Nick'), nick2 = newStudent('Nick')
assert.notEqual(nick1.id, nick2.id)
const result = teacherAttempt(nick1.id, 'rabbit', 'r', 'initial', 'helped')
assert.equal(result.source, 'teacher')
assert.equal(result.score, null, 'Adult observation must not invent numeric pronunciation scores')
writeRecords({ students: [nick1, nick2], attempts: [result] })
assert.deepEqual(readRecords().attempts, [result])
assert.equal(readRecords().attempts.filter(item => item.studentId === nick2.id).length, 0)
assert.deepEqual(parseAssessment({ score: 82, provider: 'test-provider', audio: 'must not persist', transcript: 'ignored' }), { score: 82, provider: 'test-provider' })
assert.equal(parseAssessment({ score: null, provider: 'test-provider' }).score, null)
for (const score of [-1, 101, NaN, Infinity, '82', undefined]) assert.throws(() => parseAssessment({ score, provider: 'test-provider' }))
assert.throws(() => parseAssessment({ score: 82 }))
assert(!JSON.stringify(readRecords()).includes('audio'))
localStorage.setItem('ms-jana-practice-v1', 'damaged')
assert.deepEqual(readRecords(), { students: [], attempts: [] })
console.log('Practice checks passed: unique profiles, score validation, observation separation, results-only storage, and damaged storage fallback.')
