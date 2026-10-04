import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
const compiled = ts.transpileModule(fs.readFileSync('src/practice/speech.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const { chooseVoice, say } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
const basic = { voiceURI: 'basic', name: 'Basic English', lang: 'en-US', default: true }
const natural = { voiceURI: 'natural', name: 'English Natural', lang: 'en-US' }
assert.equal(chooseVoice([basic, natural]), natural)
assert.equal(chooseVoice([basic, natural], 'basic'), basic)
assert.equal(chooseVoice([]), undefined)
let spoken
let cancelled = false
globalThis.window = { speechSynthesis: { getVoices: () => [basic, natural], cancel: () => { cancelled = true }, speak: value => { spoken = value } } }
globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text } }
assert.equal(say('rabbit'), true)
assert.equal(spoken.rate, 1)
assert.equal(spoken.voice, natural)
assert.equal(spoken.text, 'rabbit')
assert(cancelled)
say('rabbit', 'basic', .9)
assert.equal(spoken.voice, basic)
assert.equal(spoken.rate, .9)
globalThis.window = {}
assert.equal(say('rabbit'), false)
console.log('Speech checks passed: voice preference, explicit selection, natural speed, and unsupported-browser fallback.')
