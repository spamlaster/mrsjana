import { useState } from 'react'
import { navigate } from '../../routing/router'
import { getActivity } from '../activities/catalog'
import { getWord } from '../content/selectors'
import { centerPath, type CenterRoute } from '../route'
import { summaryText, type SessionResult } from '../session/result'
import { percentCorrect, type RoleSummary } from '../session/trialSession'
import { PairPicture } from './PairPicture'

interface SessionSummaryProps {
  route: CenterRoute
  result?: SessionResult
}

function RoleCard({ wordId, label, summary, listening }: { wordId: string; label: string; summary: RoleSummary; listening: boolean }) {
  const word = getWord(wordId)
  if (!word) return null
  return (
    <div className="mp-summary-card">
      <PairPicture word={word} size="md" />
      <p className="mp-summary-word">{word.text}</p>
      <p className="mp-summary-role">{label}</p>
      <dl className="mp-summary-counts">
        <div className="correct"><dt>{listening ? 'Picked right' : 'Correct'}</dt><dd>{summary.correct}</dd></div>
        <div className="incorrect"><dt>{listening ? 'Picked the other' : 'Incorrect'}</dt><dd>{summary.incorrect}</dd></div>
        {!listening && <div className="cued"><dt>Cued</dt><dd>{summary.cued}</dd></div>}
      </dl>
      <p className="mp-summary-percent">{percentCorrect(summary)}% {listening ? 'correct' : 'correct without cues'} · {summary.total} turns</p>
    </div>
  )
}

// Step 8. The summary lives only in this page's history entry: it is not saved anywhere.
export function SessionSummary({ route, result }: SessionSummaryProps) {
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle')
  const matches = result && result.pairId === route.pairId && result.activityId === route.activityId
  const activity = route.activityId ? getActivity(route.activityId) : undefined
  const again = () => navigate(centerPath({ ...route, view: 'setup' }))
  const otherGame = () => navigate(centerPath({ ...route, activityId: undefined, view: 'activities' }))
  const otherPair = () => navigate(centerPath({ ...route, pairId: undefined, activityId: undefined, view: 'pairs' }))
  const actions = (
    <div className="mp-summary-actions">
      <button className="mp-button" onClick={again}>Play {activity?.name ?? 'again'} again</button>
      <button className="mp-button mp-button-soft" onClick={otherGame}>Choose another game</button>
      <button className="mp-button mp-button-soft" onClick={otherPair}>Choose other words</button>
      <button className="mp-button mp-button-soft" onClick={() => navigate('/phonological')}>All sound patterns</button>
    </div>
  )
  if (!matches) {
    return (
      <section className="mp-picker mp-summary">
        <h2>Nice work!</h2>
        <p className="mp-picker-hint">This summary is no longer available. Summaries are never saved, so they disappear when the page is refreshed.</p>
        {actions}
      </section>
    )
  }
  const practice = result.kind === 'practice'
  const listening = result.kind === 'listening'
  const copy = () => {
    const text = summaryText(result)
    const done = () => setCopied('done')
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, () => setCopied('failed'))
    else setCopied('failed')
  }
  return (
    <section className="mp-picker mp-summary">
      <p className="eyebrow">STEP 8 · ALL DONE!</p>
      <h2>{listening ? 'Super listening!' : 'Great practicing!'} <span aria-hidden="true">🎉</span></h2>
      <p className="mp-picker-hint">{result.activityName} · {result.total} turns{listening ? ' · listening, scored from taps' : ''}</p>
      {practice ? <p className="mp-picker-hint">You popped {result.total} bubbles! You practiced both words. Speech was not scored.</p> : <div className="mp-summary-grid">
        <RoleCard wordId={result.targetId} label="Target word" summary={result.summary.target} listening={listening} />
        <RoleCard wordId={result.contrastId} label="Contrast word" summary={result.summary.contrast} listening={listening} />
      </div>}
      {!result.approved && <p className="mp-summary-preview">Preview: this pair is still awaiting Jana’s clinical approval.</p>}
      <div className="mp-copy">
        <button className="mp-button mp-button-soft" onClick={copy}><span aria-hidden="true">📋</span> Copy summary for my notes</button>
        <span aria-live="polite" className="mp-copy-status">{copied === 'done' ? 'Copied!' : copied === 'failed' ? 'Couldn’t copy here. Select the text below instead.' : ''}</span>
        {copied === 'failed' && <textarea className="mp-copy-text" readOnly value={summaryText(result)} rows={7} />}
        <p className="mp-copy-privacy">Nothing about the child is saved by this site. The summary is gone when you leave or refresh.</p>
      </div>
      {actions}
    </section>
  )
}
