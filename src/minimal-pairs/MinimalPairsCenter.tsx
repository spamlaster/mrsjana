import { navigate } from '../routing/router'
import { getActivity } from './activities/catalog'
import { AudioCheck } from './components/AudioCheck'
import { ActivityPicker, PairPicker, PositionPicker, ProcessPicker, SoundPicker } from './components/CenterPickers'
import { ListeningSession } from './components/ListeningSession'
import { PlaySession } from './components/PlaySession'
import { ReviewStatus } from './components/ReviewStatus'
import { SessionSetup } from './components/SessionSetup'
import { SessionSummary } from './components/SessionSummary'
import { positionLabels, soundLabel } from './content/labels'
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
  { label: 'Pattern', views: ['processes'] },
  { label: 'Sound', views: ['sounds'] },
  { label: 'Where', views: ['positions'] },
  { label: 'Words', views: ['pairs'] },
  { label: 'Game', views: ['activities'] },
  { label: 'Turns', views: ['setup'] },
  { label: 'Play!', views: ['playing', 'complete'] },
]

// Trail of choices so far; each one goes back to that step.
function Breadcrumbs({ route }: { route: CenterRoute }) {
  const pair = route.pairId ? getPair(route.pairId) : undefined
  const crumbs: { label: string; path: string }[] = [{ label: 'All patterns', path: '/phonological' }]
  if (route.processId) crumbs.push({ label: getProcess(route.processId)?.name ?? route.processId, path: centerPath({ processId: route.processId }) })
  if (route.sound) crumbs.push({ label: soundLabel(route.sound), path: centerPath({ processId: route.processId, sound: route.sound }) })
  if (route.position) crumbs.push({ label: positionLabels[route.position].short, path: centerPath({ processId: route.processId, sound: route.sound, position: route.position }) })
  if (pair) crumbs.push({ label: pair.words.map(id => getWord(id)?.text).join(' / '), path: centerPath({ ...route, activityId: undefined }) })
  if (route.activityId) crumbs.push({ label: getActivity(route.activityId)?.name ?? '', path: centerPath({ ...route, view: 'setup' }) })
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
    if (view === 'processes' || !processId) return <ProcessPicker preview={preview} />
    if (view === 'sounds' || !sound) return <SoundPicker processId={processId} preview={preview} />
    if (view === 'positions' || !position) return <PositionPicker processId={processId} sound={sound} preview={preview} />
    if (view === 'pairs' || !pair || !roles) return <PairPicker processId={processId} sound={sound} position={position} preview={preview} />
    if (view === 'activities' || !activity) return <ActivityPicker processId={processId} sound={sound} position={position} pair={pair} preview={preview} />
    if (view === 'complete') return <SessionSummary route={route} result={result} />
    if (view === 'setup' || !route.trials) return <SessionSetup route={route} activity={activity} roles={roles} />
    const full = { ...route, processId, sound, position, pairId: pair.id, activityId: activity.id }
    // Keyed by the address so starting again from a link always starts a fresh session.
    const key = centerPath(full)
    return activity.kind === 'listening'
      ? <ListeningSession key={key} route={full} pair={pair} roles={roles} activity={activity} trials={route.trials} />
      : <PlaySession key={key} route={full} pair={pair} roles={roles} activity={activity} trials={route.trials} preview={preview} />
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
