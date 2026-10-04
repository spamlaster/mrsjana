import { useEffect, useRef, useState } from 'react'
import { speechSounds } from '../data/speeches'
import { WordPicture } from '../components/WordPicture'
import { newStudent, parseAssessment, readRecords, teacherAttempt, writeRecords, type Attempt } from '../practice/store'
import { englishVoices, say } from '../practice/speech'
import './PracticePage.css'

const endpoint = import.meta.env.VITE_SPEECH_ASSESSMENT_ENDPOINT as string | undefined

export function PracticePage() {
  const [records, setRecords] = useState(readRecords)
  const [studentId, setStudentId] = useState('')
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('r-initial')
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState('Let’s practice together. Listen, then give it a try!')
  const [phase, setPhase] = useState<'idle' | 'permission' | 'listening' | 'scoring'>('idle')
  const [voices, setVoices] = useState(englishVoices)
  const [voiceURI, setVoiceURI] = useState('')
  const [speed, setSpeed] = useState(1)
  const [level, setLevel] = useState(0)
  const audioContext = useRef<AudioContext | null>(null)
  const frame = useRef<number | null>(null)
  const heardSound = useRef(false)
  const finishTest = useRef<(() => void) | null>(null)
  useEffect(() => {
    const refresh = () => setVoices(englishVoices())
    window.speechSynthesis?.addEventListener('voiceschanged', refresh)
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', refresh)
  }, [])
  const run = useRef(0)
  const recorder = useRef<MediaRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const request = useRef<AbortController | null>(null)
  const categories = speechSounds.flatMap(sound => sound.categories)
  const category = categories.find(item => item.id === categoryId) || categories[0]
  const word = category.words[index % category.words.length]
  const student = records.students.find(item => item.id === studentId)

  function release() {
    if (timer.current) clearTimeout(timer.current)
    stream.current?.getTracks().forEach(track => track.stop())
    stream.current = null
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
    void audioContext.current?.close()
    audioContext.current = null
  }
  useEffect(() => () => {
    run.current += 1
    request.current?.abort()
    if (timer.current) clearTimeout(timer.current)
    if (recorder.current?.state === 'recording') recorder.current.stop()
    stream.current?.getTracks().forEach(track => track.stop())
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    void audioContext.current?.close()
    window.speechSynthesis?.cancel()
  }, [])

  function save(attempt: Attempt) {
    const next = { ...readRecords(), attempts: [...readRecords().attempts, attempt] }
    try { writeRecords(next); setRecords(next); setStatus('Saved for review on this device. Great trying!') }
    catch { setStatus('This browser couldn’t save the result. Please try again before moving on.') }
  }
  async function listen() {
    if ((endpoint && !student) || phase !== 'idle') return
    if (!navigator.mediaDevices?.getUserMedia || (endpoint && !window.MediaRecorder)) { setStatus('Microphone practice isn’t supported here. You can still listen and practice.'); return }
    const token = ++run.current
    window.speechSynthesis?.cancel()
    setPhase('permission')
    try {
      const input = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (token !== run.current) { input.getTracks().forEach(track => track.stop()); return }
      stream.current = input
      if (!endpoint) {
        const context = new AudioContext()
        audioContext.current = context
        await context.resume()
        if (token !== run.current) { release(); return }
        const analyser = context.createAnalyser()
        analyser.fftSize = 256
        context.createMediaStreamSource(input).connect(analyser)
        const samples = new Uint8Array(analyser.fftSize)
        heardSound.current = false
        const meter = () => {
          if (token !== run.current) return
          analyser.getByteTimeDomainData(samples)
          const rms = Math.sqrt(samples.reduce((sum, sample) => sum + ((sample - 128) / 128) ** 2, 0) / samples.length)
          if (rms > .015) heardSound.current = true
          setLevel(Math.min(100, rms * 600))
          frame.current = requestAnimationFrame(meter)
        }
        finishTest.current = () => {
          if (token !== run.current) return
          release()
          setLevel(0)
          setPhase('idle')
          setStatus(heardSound.current ? 'Your microphone picked up sound! This was a microphone test, not a pronunciation score. Nothing was saved.' : 'No clear sound was detected. Check your microphone and try again. No score was assigned.')
        }
        setPhase('listening')
        setStatus('Say ' + word.word + '. Watch the microphone meter, then tap Done.')
        meter()
        timer.current = setTimeout(() => finishTest.current?.(), 6000)
        return
      }
      const chunks: Blob[] = []
      const capture = new MediaRecorder(input)
      recorder.current = capture
      capture.ondataavailable = event => { if (event.data.size) chunks.push(event.data) }
      capture.onerror = () => { if (token !== run.current) return; run.current += 1; chunks.length = 0; release(); setPhase('idle'); setStatus('The microphone stopped. Please try again.'); }
      capture.onstop = async () => {
        release()
        if (token !== run.current) { chunks.length = 0; return }
        setPhase('scoring')
        setStatus('Checking your attempt…')
        const controller = new AbortController()
        request.current = controller
        const timeout = setTimeout(() => controller.abort(), 20000)
        try {
          const body = new FormData()
          body.append('audio', new Blob(chunks, { type: capture.mimeType }), 'attempt')
          body.append('word', word.word)
          body.append('sound', word.sound)
          chunks.length = 0
          const response = await fetch(endpoint, { method: 'POST', body, signal: controller.signal, credentials: 'same-origin' })
          if (!response.ok) throw new Error('Assessment unavailable')
          const result = parseAssessment(await response.json())
          if (token !== run.current) return
          save({ ...teacherAttempt(student!.id, word.word, word.sound, word.category, 'unassessed'), source: 'automated', score: result.score, provider: result.provider })
          if (result.score === null) setStatus('This attempt couldn’t be assessed clearly. No score was assigned. Try listening again.')
          say('Thank you for trying! ' + word.word, voiceURI, speed)
        } catch { if (token === run.current) setStatus('We couldn’t assess this attempt. No score was saved. Please try again.') }
        finally { chunks.length = 0; clearTimeout(timeout); if (token === run.current) setPhase('idle') }
      }
      capture.start()
      setPhase('listening')
      setStatus('Your turn! Say ' + word.word + '. Tap Done when you finish.')
      timer.current = setTimeout(() => { if (capture.state === 'recording') capture.stop() }, 6000)
    } catch { if (token === run.current) { release(); setPhase('idle'); setStatus('Microphone access wasn’t available. You can still listen and practice.'); } }
  }
  return <main className="practice-page">
    <p className="eyebrow">LISTEN · TRY · GROW</p><h1>Practice with Ms. Jana</h1>
    <p className="practice-note">A spoken practice guide using your device’s voice. Ms. Jana’s own voice can be added later.</p>
    <div className="practice-setup"><label>Student profile<select value={studentId} disabled={phase !== 'idle'} onChange={event => setStudentId(event.target.value)}><option value="">Choose a student</option>{records.students.map((item, i) => <option value={item.id} key={item.id}>{item.name} · Profile {i + 1}</option>)}</select></label>
      <form onSubmit={event => { event.preventDefault(); if (!name.trim()) return; const profile = newStudent(name); const next = { ...readRecords(), students: [...readRecords().students, profile] }; try { writeRecords(next); setRecords(next); setStudentId(profile.id); setName('') } catch { setStatus('Couldn’t save the profile on this device.') } }}><label>New student’s display name<input value={name} maxLength={60} disabled={phase !== 'idle'} onChange={event => setName(event.target.value)} required /></label><button className="story-back" disabled={phase !== 'idle'}>Create profile</button></form>
      <label>Practice words<select value={categoryId} disabled={phase !== 'idle'} onChange={event => { setCategoryId(event.target.value); setIndex(0) }}>{categories.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
    </div>
    <details className="voice-settings"><summary>Voice & playback settings</summary><p>Preview a voice before using it as a speech model. Available voices vary by device; this is not Ms. Jana’s own voice.</p>
      <label>Voice<select value={voiceURI} disabled={phase !== 'idle'} onChange={event => setVoiceURI(event.target.value)}><option value="">Best available English voice</option>{voices.map(voice => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} · {voice.lang}</option>)}</select></label>
      <label>Playback speed<select value={speed} disabled={phase !== 'idle'} onChange={event => setSpeed(Number(event.target.value))}><option value={1}>Natural speed</option><option value={.9}>Slightly slower</option></select></label>
      <button className="story-back" disabled={phase !== 'idle'} onClick={() => say('Hello! Let’s practice together. Rabbit.', voiceURI, speed)}>Preview voice</button>
    </details>
    <div className="coach-card"><span className="coach-avatar" aria-hidden="true">🌼</span><p role="status">{status}</p><WordPicture word={word} /><h2>{word.word}</h2>
      <div className="coach-actions"><button className="cta-button" disabled={phase !== 'idle'} onClick={() => { if (!say(word.word, voiceURI, speed)) setStatus('Spoken guidance isn’t available in this browser.') }}>🔊 Listen with me</button>
      {phase === 'listening' ? <button className="cta-button" onClick={() => { if (!endpoint) finishTest.current?.(); else if (recorder.current?.state === 'recording') recorder.current.stop() }}>Done speaking ✓</button> : <button className="story-back" disabled={(!!endpoint && !student) || phase !== 'idle'} onClick={listen}>🎤 {phase === 'scoring' ? 'Checking…' : phase === 'permission' ? 'Opening microphone…' : 'My turn'}</button>}
      <button className="story-back" disabled={phase !== 'idle'} onClick={() => { window.speechSynthesis?.cancel(); setIndex(i => i + 1); setStatus('Here’s another word. Listen, then try!') }}>Next word →</button></div>
      {!endpoint && phase === 'listening' && <meter className="microphone-meter" min={0} max={100} value={level} aria-label="Microphone sound level" />}
      {!endpoint && <p className="practice-note">My turn tests your microphone locally. No audio is saved or sent, and no pronunciation score is assigned yet.</p>}
      {endpoint && <p className="practice-note">Microphone audio is sent for assessment, then released from this app’s memory. This app saves results, not recordings.</p>}
    </div>
    <section className="practice-observation"><h2>Adult observation</h2><p>An adult who heard the attempt can save a rating. These are kept separate from automated estimates.</p><div className="coach-actions">{([['independent', 'Correct independently'], ['helped', 'Correct with help'], ['practicing', 'Still practicing'], ['unassessed', 'Not assessed']] as const).map(([outcome, label]) => <button className="story-back" key={outcome} disabled={!student || phase !== 'idle'} onClick={() => save(teacherAttempt(student!.id, word.word, word.sound, word.category, outcome))}>{label}</button>)}</div></section>
    <p className="practice-note">Prototype: profiles and results stay in this browser. Anyone using this device can review them; there is no teacher login or cross-device syncing yet. Clearing browser data removes them.</p>
  </main>
}
