import { useEffect, useState } from 'react'
import { navigate } from '../../routing/router'
import { checkReport, currentDecision, practiceRecording, recordingState, undecided, verdictLabels, verdictsFor, type Decisions, type RecordingState, type Verdict } from '../content/audio-check'
import { audioFile } from '../content/audio'
import { groupPairs } from '../content/labels'
import { getWord, library } from '../content/selectors'
import type { LexiconWord, MinimalPair } from '../content/types'
import { playAudioFile } from '../playback'
import { centerPath } from '../route'
import { today } from '../session/result'

// Decisions stay in this browser so a long check can be finished later. They are a draft:
// recordings are marked reviewed only when a person runs the command in the report.
const storageKey = 'mp-audio-check'
interface Saved { decisions: Decisions; by: string }
function readSaved(): Saved {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || 'null')
    if (data && typeof data.decisions === 'object') return { decisions: data.decisions, by: typeof data.by === 'string' ? data.by : 'Jana' }
  } catch { /* Unavailable or damaged storage starts empty. */ }
  return { decisions: {}, by: 'Jana' }
}

const stateLabels: Record<RecordingState, string> = {
  reviewed: '✓ Already checked',
  unreviewed: 'New recording',
  missing: 'No recording of its own yet. This is the one from the Practice section:',
}

// The file a reviewer hears for a word: its own recording, or the Practice one it could reuse.
const fileFor = (word: LexiconWord) => (recordingState(word) === 'missing' ? practiceRecording(word) : audioFile(word))

// Grown-up page for Jana (preview mode only): listen to each pair's recordings, mark each word,
// then copy the write-up with the commands that record her decisions.
export function AudioCheck() {
  const [saved, setSaved] = useState<Saved>(readSaved)
  const [showAll, setShowAll] = useState(false)
  const [unplayable, setUnplayable] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState<'' | 'done' | 'failed'>('')
  const { decisions, by } = saved

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(saved)) } catch { /* Not saved; the page still works. */ }
  }, [saved])

  const play = async (word: LexiconWord, toEnd = false) => {
    const ok = await playAudioFile(fileFor(word), { toEnd })
    if (!ok && !toEnd) setUnplayable(set => new Set(set).add(word.id))
    return ok
  }
  const playBoth = async (words: LexiconWord[]) => {
    for (const [i, word] of words.entries()) {
      if (i) await new Promise(resolve => setTimeout(resolve, 600))
      if (!(await play(word, true))) return
    }
  }
  const decide = (word: LexiconWord, verdict: Verdict) => setSaved(current => {
    const next = { ...current.decisions }
    if (next[word.id]?.verdict === verdict) delete next[word.id]
    else next[word.id] = { verdict, note: next[word.id]?.note }
    return { ...current, decisions: next }
  })
  const setNote = (word: LexiconWord, note: string) =>
    setSaved(current => ({ ...current, decisions: { ...current.decisions, [word.id]: { verdict: 'redo', note } } }))
  const reset = () => {
    if (window.confirm('Clear every choice on this page?')) setSaved(current => ({ ...current, decisions: {} }))
  }

  const report = checkReport(decisions, by, today())
  const copy = () => {
    const done = () => setCopied('done')
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(report).then(done, () => setCopied('failed'))
    else setCopied('failed')
  }

  const toCheck = library.lexicon.filter(word => recordingState(word) !== 'reviewed')
  const decided = toCheck.filter(word => currentDecision(word, decisions)).length
  const visible = (pair: MinimalPair) => showAll || undecided(pair.words, decisions).length > 0
  const groups = [...groupPairs(library.pairs)].map(([title, pairs]) => [title, pairs.filter(visible)] as const).filter(([, pairs]) => pairs.length)

  return (
    <section className="mp-review mp-check">
      <button className="mp-button mp-button-soft mp-button-small" onClick={() => navigate(centerPath({ view: 'review' }))}>← Review status</button>
      <p className="eyebrow">FOR GROWN-UPS · RECORDINGS CHECKLIST</p>
      <h2>Do the recordings sound right?</h2>
      <div className="mp-check-howto">
        <ol>
          <li>Tap <strong>Play both</strong> to hear a pair one after the other, or <strong>▶</strong> for one word.</li>
          <li>For each word, listen for:
            <ul>
              <li>the intended word and meaning</li>
              <li>a clear, correct contrast sound</li>
              <li>a first sound that isn’t clipped, and a last sound you can hear, with no extra vowel</li>
              <li>only the word, in a natural, child-friendly voice</li>
            </ul>
          </li>
          <li>Mark it <strong>Sounds right</strong> or <strong>Redo it</strong> (add a note on what’s wrong). Words with no recording of their own play the Practice-section one: choose <strong>Use this one</strong> or <strong>Make a new one</strong>.</li>
          <li>When you’re done, or want to stop for now, <strong>copy the results</strong> at the bottom and send them along.</li>
        </ol>
        <p className="mp-copy-privacy">Your choices are saved in this browser, so you can stop and come back. Nothing is approved until the results are applied to the site.</p>
      </div>

      <dl className="mp-review-totals">
        <div><dt>Words to check</dt><dd>{toCheck.length} of {library.lexicon.length}</dd></div>
        <div><dt>Decided so far</dt><dd>{decided} of {toCheck.length}</dd></div>
      </dl>
      <div className="mp-check-controls">
        <label><input type="checkbox" checked={showAll} onChange={event => setShowAll(event.target.checked)} /> Show pairs already done</label>
        <label>Checked by <input className="mp-check-name" value={by} onChange={event => setSaved(current => ({ ...current, by: event.target.value }))} /></label>
      </div>

      {groups.length === 0 && <p className="mp-check-done">Every pair is done. Copy the results below. 🎉</p>}
      {groups.map(([title, pairs]) => (
        <div key={title} className="mp-review-group">
          <h3>{title} <span>({pairs.length})</span></h3>
          <div className="mp-check-pairs">
            {pairs.map(pair => {
              const words = pair.words.map(id => getWord(id)).filter((word): word is LexiconWord => Boolean(word))
              return (
                <div key={pair.id} className="mp-check-pair">
                  <div className="mp-check-pair-head">
                    <strong>{words.map(word => word.text).join(' / ')}</strong>
                    <button className="mp-button mp-button-small" onClick={() => playBoth(words)}>▶ Play both</button>
                  </div>
                  {pair.notes && <p className="mp-review-note">{pair.notes}</p>}
                  {words.map(word => {
                    const state = recordingState(word)
                    const decision = currentDecision(word, decisions)
                    return (
                      <div key={word.id} className={`mp-check-word${decision ? ` mp-check-${decision.verdict}` : ''}`}>
                        <div className="mp-check-word-head">
                          <button className="mp-check-play" aria-label={`Play ${word.text}`} onClick={() => play(word)}>▶</button>
                          <span className="mp-check-text">{word.text}</span>
                          {word.pronunciationHint && <span className="mp-review-note">meaning {word.pronunciationHint}</span>}
                        </div>
                        <p className="mp-check-state">{unplayable.has(word.id) ? 'This recording couldn’t be played. It may not exist yet.' : stateLabels[state]}</p>
                        {verdictsFor(state).length > 0 && (
                          <div className="mp-check-verdicts" role="group" aria-label={`Decision for ${word.text}`}>
                            {verdictsFor(state).map(verdict => (
                              <button key={verdict} className={`mp-check-verdict mp-check-verdict-${verdict}`} aria-pressed={decision?.verdict === verdict} onClick={() => decide(word, verdict)}>
                                {verdictLabels[verdict]}
                              </button>
                            ))}
                          </div>
                        )}
                        {decision?.verdict === 'redo' && (
                          <input className="mp-check-note" placeholder="What’s wrong? (optional)" aria-label={`What’s wrong with ${word.text}`} value={decision.note ?? ''} onChange={event => setNote(word, event.target.value)} />
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div className="mp-review-group mp-check-report">
        <h3>Results</h3>
        <textarea className="mp-copy-text" readOnly value={report} rows={Math.min(16, report.split('\n').length + 1)} aria-label="Results to send" />
        <div className="mp-check-report-actions">
          <button className="mp-button" onClick={copy}><span aria-hidden="true">📋</span> Copy results</button>
          <button className="mp-button mp-button-soft mp-button-small" onClick={reset}>Clear my choices</button>
          <span aria-live="polite" className="mp-copy-status">{copied === 'done' ? 'Copied!' : copied === 'failed' ? 'Couldn’t copy here. Select the text above instead.' : ''}</span>
        </div>
      </div>
    </section>
  )
}
