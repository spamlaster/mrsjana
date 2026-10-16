import { useState } from 'react'
import { navigate } from '../../routing/router'
import { centerPath, type CenterRoute } from '../route'
import { library, pairsFor, rolesFor, soundsFor, positionsFor, isUsable } from '../content/selectors'
import { pairListeningReady } from '../content/readiness'
import { positionLabels, soundLabel } from '../content/labels'
import { PairFaces } from './CenterPickers'

// Each card carries the full practice context, including target direction.
export function PracticePicker({ route, preview }: { route: CenterRoute; preview: boolean }) {
  const [customizing, setCustomizing] = useState(Boolean(route.processId))
  const [process, setProcess] = useState<string>(route.processId ?? '')
  const [sound, setSound] = useState(route.sound ?? '')
  const [position, setPosition] = useState<string>(route.position ?? '')
  const choices = library.processes.flatMap(pattern => soundsFor(pattern.id, library, preview).flatMap(target =>
    positionsFor(pattern.id, target, library, preview).flatMap(at => {
      const pairs = pairsFor(pattern.id, target, at, library, preview)
      return pairs.map(pair => ({ processId: pattern.id, sound: target, position: at, pair, name: pattern.name }))
    })))
  const filtered = choices.filter(choice => (!process || choice.processId === process) && (!sound || choice.sound === sound) && (!position || choice.position === position))
  // A small, explicit starter selection; the full library lives in customization.
  const starterIds = ['key-tea', 'go-dough', 'fan-pan', 'sea-tea', 'shoe-two', 'thin-tin', 'snow-no', 'chin-tin']
  const starters = choices.filter(choice => choice.processId !== 'backing' && starterIds.includes(choice.pair.id))
  const listening = choices.find(choice => isUsable(choice.pair, preview) && pairListeningReady(choice.pair))
  const cards = (items: typeof choices, detailed = false) => <div className="mp-card-grid mp-pair-grid">{items.map((choice, i) => {
    const roles = rolesFor(choice.pair, choice.processId, choice.sound)!
    return <button key={`${choice.processId}-${choice.sound}-${choice.pair.id}`} className={`mp-card mp-pair-card mp-tone-${i % 5}`} onClick={() => navigate(centerPath({ ...choice, pairId: choice.pair.id }))}>
      <PairFaces pair={choice.pair} processId={choice.processId} sound={choice.sound} />
      <span className="mp-card-tagline">Practice {soundLabel(choice.sound)} · {positionLabels[choice.position].short.toLowerCase()}</span>
      <span className="mp-card-note">{detailed && `${choice.name} · `}Say “{roles.target.text}” clearly.</span>
      <span className="mp-card-foot">Choose a game →</span>
    </button>
  })}</div>
  return <section className="mp-picker">
    <p className="eyebrow">STEP 1 · CHOOSE PRACTICE WORDS</p>
    <h2>Which words shall we play with?</h2>
    <p className="mp-picker-hint">Choose pictures, then a game. If Ms. Jana gave you a practice link, open it to go straight to your games.</p>
    {listening && <div className="mp-quick-listening">
      <div><h3>Not sure where to start?</h3><p>Try listening to two words and finding their pictures.</p><p className="mp-card-note">A listening activity, without choosing a sound pattern.</p></div>
      <button className="mp-button" onClick={() => navigate(centerPath({ ...listening, pairId: listening.pair.id, activityId: 'listening', view: 'playing', trials: 10 }))}>👂 Try a listening game</button>
    </div>}
    {cards(starters)}
    <details className="mp-customize" open={customizing} onToggle={event => setCustomizing(event.currentTarget.open)}>
      <summary>Customize practice · for grown-ups</summary>
      <p>Choose the target your student is working on. For example, Fronting practices K/G; Backing practices T/D.</p>
      <div className="mp-filters">
        <label>Sound pattern<select value={process} onChange={event => { setProcess(event.target.value); setSound(''); setPosition('') }}><option value="">All patterns</option>{library.processes.map(pattern => <option key={pattern.id} value={pattern.id}>{pattern.name}</option>)}</select></label>
        <label>Target sound<select value={sound} onChange={event => { setSound(event.target.value); setPosition('') }}><option value="">All sounds</option>{[...new Set(choices.filter(choice => !process || choice.processId === process).map(choice => choice.sound))].map(target => <option key={target} value={target}>{soundLabel(target)}</option>)}</select></label>
        <label>Where in the word<select value={position} onChange={event => setPosition(event.target.value)}><option value="">Beginning and end</option><option value="initial">Beginning</option><option value="final">End</option></select></label>
      </div>
      <p className="mp-picker-hint">{filtered.length} practice choices. Pick a card to choose a game.</p>
      {customizing && cards(filtered, true)}
      {!filtered.length && <p>No words match these settings. Try another sound or position.</p>}
    </details>
  </section>
}
