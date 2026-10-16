import { navigate } from '../routing/router'
import { getActivity } from './activities/catalog'
import { AudioCheck } from './components/AudioCheck'
import { PracticePicker } from './components/PracticePicker'
import { ActivityPicker } from './components/CenterPickers'
import { ListeningSession } from './components/ListeningSession'
import { PlaySession } from './components/PlaySession'
import { ReviewStatus } from './components/ReviewStatus'
import { SessionSummary } from './components/SessionSummary'
import { soundLabel } from './content/labels'
import { getPair, getProcess, getWord, isPlayable, rolesFor } from './content/selectors'
import { previewMode } from './preview'
import { centerPath, type CenterRoute, type CenterView } from './route'
import type { SessionResult } from './session/result'
import './components/center.css'
import './activities/activities.css'

interface MinimalPairsCenterProps {
  route: CenterRoute
  result?: SessionResult
  preview?: boolean
}

const steps: { label: string; views: CenterView[] }[] = [
  { label: 'Words', views: ['processes', 'sounds', 'positions', 'pairs'] },
  { label: 'Game', views: ['activities', 'setup'] },
  { label: 'Play!', views: ['playing', 'complete'] },
]

// Trail of choices so far; each one goes back to that step.
function Breadcrumbs({ route }: { route: CenterRoute }) {
  const pair = route.pairId ? getPair(route.pairId) : undefined
  const crumbs: { label: string; path: string }[] = [{ label: 'Practice words', path: '/phonological' }]
  if (pair) crumbs.push({ label: `${getProcess(route.processId ?? '')?.name ?? ''} · ${soundLabel(route.sound ?? '')} · ${pair.words.map(id => getWord(id)?.text).join(' / ')}`, path: centerPath({ ...route, activityId: undefined }) })
  if (crumbs.length < 2) return null
  return (
    <nav className="mp-crumbs" aria-label="Your choices">
      <ol>
        {crumbs.map((crumb, i) => (
          <li key={crumb.path}>
            {i === crumbs.length - 1 && route.view !== 'playing' && route.view !== 'complete'
              ? <span aria-current="page">{crumb.label}</span>
              : <button onClick={() => navigate(crumb.path)}>{crumb.label}</button>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// The Minimal Pairs Therapy Center. Chooses the screen from the route; routes are already validated
// against the content (route.ts), so every id here exists and is usable in the current mode.
export function MinimalPairsCenter({ route, result, preview = previewMode }: MinimalPairsCenterProps) {
  const { view, processId, sound, position } = route
  const pair = route.pairId ? getPair(route.pairId) : undefined
  const roles = pair && processId && sound ? rolesFor(pair, processId, sound) : null
  const activity = route.activityId ? getActivity(route.activityId) : undefined
  const currentStep = steps.findIndex(step => step.views.includes(view))

  const screen = () => {
    if (view === 'review') return <ReviewStatus />
    if (view === 'recordings') return <AudioCheck />
    if (['processes', 'sounds', 'positions', 'pairs'].includes(view) || !processId || !sound || !position || !pair || !roles) return <PracticePicker key={centerPath(route)} route={route} preview={preview} />
    if (view === 'activities' || view === 'setup' || !activity || (!route.trials && view !== 'complete')) return <ActivityPicker key={centerPath(route)} processId={processId} sound={sound} position={position} pair={pair} preview={preview} initialTrials={route.trials} />
    if (view === 'complete') return <SessionSummary route={route} result={result} />
    const full = { ...route, processId, sound, position, pairId: pair.id, activityId: activity.id }
    // Keyed by the address so starting again from a link always starts a fresh session.
    const key = centerPath(full)
    return activity.kind === 'listening'
      ? <ListeningSession key={key} route={full} pair={pair} roles={roles} activity={activity} trials={route.trials ?? 10} />
      : <PlaySession key={key} route={full} pair={pair} roles={roles} activity={activity} trials={route.trials ?? 10} preview={preview} />
  }

  // While playing, keep the child's screen calm: one slim bar instead of the banner, steps, and trail.
  if (view === 'playing') {
    return (
      <div className="mp-center mp-view-playing">
        <div className="mp-play-top">
          <button className="mp-button mp-button-soft mp-button-small" onClick={() => navigate(centerPath({ ...route, activityId: undefined, view: 'activities' }))}>← Games</button>
          {preview && pair && !isPlayable(pair) && <span className="mp-preview-chip" role="note">Preview · awaiting Jana’s approval</span>}
        </div>
        {screen()}
      </div>
    )
  }

  return (
    <div className={`mp-center mp-view-${view}`}>
      {preview && (
        <div className="mp-preview-banner" role="note">
          <span><strong>Preview mode.</strong> Word pairs here are still awaiting Jana’s clinical approval. Families only see approved pairs.</span>
          {view !== 'review' && view !== 'recordings' && <button onClick={() => navigate('/phonological/review')}>Review status</button>}
        </div>
      )}
      {view !== 'review' && view !== 'recordings' && (
        <ol className="practice-steps mp-steps" aria-label="Steps">
          {steps.map((step, i) => (
            <li key={step.label} className={i === currentStep ? 'current' : ''} aria-current={i === currentStep ? 'step' : undefined}>{i + 1} · {step.label}</li>
          ))}
        </ol>
      )}
      <Breadcrumbs route={route} />
      {screen()}
    </div>
  )
}
