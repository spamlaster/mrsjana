import { useState } from 'react'
import { trialCounts, type TrialCount } from '../session/trialSession'
import { navigate } from '../../routing/router'
import { activityCatalog } from '../activities/catalog'
import { audioFile, hasRecording, isAudioReviewed } from '../content/audio'
import { pictureSource } from '../content/illustrations'
import { positionLabels, processIcons, processTaglines, soundLabel, statusLabels } from '../content/labels'
import { pairListeningReady } from '../content/readiness'
import { errorSoundsFor, getWord, library, pairStatus, pairsFor, pairsForProcess, positionsFor, rolesFor, soundsFor } from '../content/selectors'
import type { MinimalPair, Position, ProcessId } from '../content/types'
import { centerPath } from '../route'
import { PairPicture } from './PairPicture'

const go = (...segments: string[]) => navigate(['/phonological', ...segments].join('/'))
const count = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

function StatusBadge({ pair }: { pair: MinimalPair }) {
  const status = pairStatus(pair)
  return <span className={`mp-status mp-status-${status}`}>{statusLabels[status]}</span>
}

// Two pictures and words; the target first.
export function PairFaces({ pair, processId, sound, size = 'sm' }: { pair: MinimalPair; processId: ProcessId; sound: string; size?: 'sm' | 'md' }) {
  const roles = rolesFor(pair, processId, sound)
  if (!roles) return null
  return (
    <span className="mp-pair-faces">
      <span className="mp-pair-word mp-pair-target"><PairPicture word={roles.target} size={size} /><span>{roles.target.text}</span></span>
      <span className="mp-pair-vs" aria-hidden="true">vs</span>
      <span className="mp-pair-word"><PairPicture word={roles.contrast} size={size} /><span>{roles.contrast.text}</span></span>
    </span>
  )
}

export function ProcessPicker({ preview }: { preview: boolean }) {
  return (
    <section className="mp-picker">
      <p className="eyebrow">STEP 1 · CHOOSE A PATTERN</p>
      <h2>Which sound pattern are we working on?</h2>
      <div className="mp-card-grid mp-process-grid">
        {library.processes.map((process, i) => {
          const pairs = pairsForProcess(process.id, library, preview)
          return (
            <button key={process.id} className={`mp-card mp-tone-${i % 5}`} onClick={() => go(process.id)} disabled={!pairs.length}>
              <span className="mp-card-icon" aria-hidden="true">{processIcons[process.id]}</span>
              <span className="mp-card-title">{process.name}</span>
              <span className="mp-card-tagline">{processTaglines[process.id]}</span>
              <span className="mp-card-note">{process.grownUpNote}</span>
              <span className="mp-card-foot">{pairs.length ? `${count(pairs.length, 'word pair')} · Let’s go →` : 'Coming soon: Ms. Jana is still choosing the words.'}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function SoundPicker({ processId, preview }: { processId: ProcessId; preview: boolean }) {
  return (
    <section className="mp-picker">
      <p className="eyebrow">STEP 2 · CHOOSE A SOUND</p>
      <h2>Which sound should we practice?</h2>
      <div className="mp-card-grid">
        {soundsFor(processId, library, preview).map((sound, i) => {
          const positions = positionsFor(processId, sound, library, preview)
          const pairs = positions.flatMap(position => pairsFor(processId, sound, position, library, preview))
          const errors = errorSoundsFor(processId, sound).map(soundLabel).join(' or ')
          return (
            <button key={sound} className={`mp-card mp-tone-${i % 5}`} onClick={() => (positions.length === 1 ? go(processId, sound, positions[0]) : go(processId, sound))}>
              <span className="mp-card-sound">{soundLabel(sound)}</span>
              <span className="mp-card-tagline">Instead of {errors}</span>
              {pairs[0] && <PairFaces pair={pairs[0]} processId={processId} sound={sound} />}
              <span className="mp-card-foot">{count(pairs.length, 'word pair')} · {positions.map(position => positionLabels[position].short).join(' & ')} of word</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function PositionPicker({ processId, sound, preview }: { processId: ProcessId; sound: string; preview: boolean }) {
  return (
    <section className="mp-picker">
      <p className="eyebrow">STEP 3 · WHERE IS THE SOUND?</p>
      <h2>Practice {soundLabel(sound)} at the…</h2>
      <div className="mp-card-grid mp-two-grid">
        {positionsFor(processId, sound, library, preview).map((position, i) => {
          const pairs = pairsFor(processId, sound, position, library, preview)
          return (
            <button key={position} className={`mp-card mp-tone-${i + 1}`} onClick={() => go(processId, sound, position)}>
              <span className="mp-card-icon" aria-hidden="true">{position === 'initial' ? '⏮️' : '⏭️'}</span>
              <span className="mp-card-title">{positionLabels[position].name}</span>
              {pairs[0] && <PairFaces pair={pairs[0]} processId={processId} sound={sound} />}
              <span className="mp-card-foot">{count(pairs.length, 'word pair')} →</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function PairPicker({ processId, sound, position, preview }: { processId: ProcessId; sound: string; position: Position; preview: boolean }) {
  const pairs = pairsFor(processId, sound, position, library, preview)
  // Stopping /th/ has two contrasts (/th/–/t/ and /th/–/p/); show them as separate groups.
  const groups = errorSoundsFor(processId, sound)
    .map(error => ({ error, pairs: pairs.filter(pair => pair.contrast.includes(error)) }))
    .filter(group => group.pairs.length)
  return (
    <section className="mp-picker">
      <p className="eyebrow">STEP 4 · CHOOSE A WORD PAIR</p>
      <h2>Pick two words to practice</h2>
      <p className="mp-picker-hint">The first word has the {soundLabel(sound)} sound. The second word is what it can sound like instead.</p>
      {groups.map(group => (
        <div key={group.error} className="mp-pair-group">
          {groups.length > 1 && <h3>{soundLabel(sound)} or {soundLabel(group.error)}</h3>}
          <div className="mp-card-grid mp-pair-grid">
            {group.pairs.map((pair, i) => (
              <button key={pair.id} className={`mp-card mp-pair-card mp-tone-${i % 5}`} onClick={() => go(processId, sound, position, pair.id)}>
                <PairFaces pair={pair} processId={processId} sound={sound} />
                {preview && <StatusBadge pair={pair} />}
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

// What a pair still needs before the listening game can be offered. Grown-up wording.
function listeningNeeds(pair: MinimalPair): string[] {
  return pair.words.flatMap(id => {
    const word = getWord(id)
    if (!word) return []
    const needs = []
    if (pictureSource(word) === 'placeholder') needs.push(`a picture of “${word.text}”`)
    if (!hasRecording(word)) needs.push(`a recording of “${word.text}”`)
    else if (!isAudioReviewed(audioFile(word))) needs.push(`a checked recording of “${word.text}”`)
    return needs
  })
}

export function ActivityPicker({ processId, sound, position, pair, preview, initialTrials = 10 }: { processId: ProcessId; sound: string; position: Position; pair: MinimalPair; preview: boolean; initialTrials?: TrialCount }) {
  const [trials, setTrials] = useState<TrialCount>(initialTrials)
  const [shareLink, setShareLink] = useState('')
  const listeningReady = pairListeningReady(pair)
  const needs = listeningNeeds(pair)
  return (
    <section className="mp-picker">
      <p className="eyebrow">STEP 2 · CHOOSE A GAME</p>
      <div className="mp-pair-hero">
        <PairFaces pair={pair} processId={processId} sound={sound} size="md" />
        {preview && <StatusBadge pair={pair} />}
      </div>
      <h2>What should we play?</h2>
      <p className="mp-picker-hint">Pick a game to start. Your practice words are ready!</p>
      <fieldset className="mp-length"><legend>How many turns?</legend>{trialCounts.map(value => (
        <button key={value} type="button" aria-pressed={trials === value} onClick={() => setTrials(value)}>{value} turns</button>
      ))}</fieldset>
      <div className="mp-share"><button className="mp-button mp-button-soft mp-button-small" onClick={() => {
        const url = new URL(window.location.href)
        url.hash = centerPath({ processId, sound, position, pairId: pair.id })
        setShareLink(url.href)
      }}>Get practice link for a student</button>{shareLink && <label>Copy this link to open these words and choose a game:<input aria-label="Student practice link" readOnly value={shareLink} onFocus={event => event.currentTarget.select()} /></label>}</div>
      <div className="mp-card-grid mp-activity-grid">
        {activityCatalog.map((activity, i) => {
          const unavailable = activity.kind === 'listening' && !listeningReady
          return (
            <button
              key={activity.id}
              className={`mp-card mp-activity-card mp-tone-${i % 5}${activity.kind === 'listening' ? ' mp-activity-optional' : ''}`}
              onClick={() => navigate(centerPath({ processId, sound, position, pairId: pair.id, activityId: activity.id, view: 'playing', trials }))}
              disabled={unavailable}
            >
              <span className="mp-card-icon" aria-hidden="true">{activity.icon}</span>
              <span className="mp-card-title">{activity.name}{activity.kind === 'listening' && <span className="mp-optional">Optional</span>}</span>
              <span className="mp-card-note">{activity.description}</span>
              <span className="mp-card-tagline">{activity.kind === 'listening' ? 'Play on your own · tap a picture' : activity.id === 'bubble-pop' ? 'Play on your own · say and pop' : 'Play with a grown-up · scoring each turn'}</span>
              {unavailable
                ? <span className="mp-card-foot mp-card-needs">Not ready yet. Needs {needs.join(', ')}.</span>
                : <span className="mp-card-foot">Let’s play →</span>}
            </button>
          )
        })}
      </div>
    </section>
  )
}
