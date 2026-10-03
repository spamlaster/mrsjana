import { useReducer, useState, type CSSProperties } from 'react'
import type { GameProps } from '../types'
import { WordPicture } from '../components/WordPicture'
import { houseReducer, initialHouseState, makeHouseDoors, type HouseKey } from './keyHouseState'
import './KeyHouse.css'

function KeyShape({ shape }: { shape: HouseKey['shape'] }) {
  switch (shape) {
    case 'circle': return <circle cx="26" cy="26" r="17" />
    case 'square': return <rect x="10" y="10" width="32" height="32" rx="3" />
    case 'triangle': return <path d="M26 7 46 42H6Z" />
    case 'diamond': return <path d="m26 5 21 21-21 21L5 26z" />
    case 'star': return <path d="m26 5 6 14 16 2-12 11 4 16-14-8-14 8 4-16L4 21l16-2z" />
    case 'hexagon': return <path d="m16 8 20 0 10 18-10 18H16L6 26z" />
  }
}
function KeyDrawing({ houseKey, lock = false }: { houseKey: HouseKey; lock?: boolean }) {
  const length = houseKey.size === 'long' ? 110 : 88
  return <svg className={lock ? 'house-lock-shape' : 'house-key-picture'} viewBox={lock ? '0 0 52 52' : '0 0 130 52'} aria-hidden="true" fill={lock ? '#fffcf5' : houseKey.color} stroke="#343047" strokeWidth="2.5" strokeLinejoin="round">
    {!lock && <path d={`M36 21h${length - 36}v10h-8v11h-9V31H36z`} />}
    <KeyShape shape={houseKey.shape} />
    {!lock && <circle cx="26" cy="25" r="5" fill="#fffcf5" />}
  </svg>
}

export function KeyHouse({ words, onComplete }: GameProps) {
  const [doors, setDoors] = useState(() => makeHouseDoors(words))
  const [state, dispatch] = useReducer(houseReducer, initialHouseState)
  // Put the keys in a different order from the doors, so children match features rather than positions.
  const keys = [...doors].reverse()
  const selected = doors.find(door => door.key.id === state.selectedKey)?.key
  const active = doors.find(door => door.key.id === state.activeDoor)
  const finished = doors.length > 0 && state.practiced.length === doors.length
  const message = state.feedback === 'mismatch' ? 'Try another door! Look for the same color and shape.'
    : active ? 'Click! You unlocked a door. What’s hiding inside?'
    : selected ? `Find the ${selected.name.toLowerCase()} door with a ${selected.shape}.`
    : finished ? 'You unlocked the whole house! Hooray!'
    : state.feedback === 'said' ? 'Great trying! Pick another key.' : 'Pick a key, then tap its matching door.'

  if (!doors.length) return <p>No practice words available. Choose another category.</p>
  return <section className="key-house-game" aria-label="Key House game">
    <div className="key-house-heading"><div><p className="eyebrow">MATCH · UNLOCK · SAY</p><h2>The little key house</h2></div><span className="house-score">🏠 {state.practiced.length} / {doors.length} doors</span></div>
    <p className="house-instruction" role="status">{message}</p>
    <div className="house-scene">
      <div className="house-roof" aria-hidden="true"><span>★</span></div>
      <div className="house-walls"><div className="house-doors">
        {doors.map(({ key, word }) => {
          const opened = state.opened.includes(key.id)
          const practiced = state.practiced.includes(key.id)
          return <button key={key.id} className={`house-door ${opened ? 'is-open' : ''} ${selected?.id === key.id ? 'matching-key-selected' : ''}`} style={{ '--door-color': key.color } as CSSProperties}
            onClick={() => dispatch({ type: 'unlock', id: key.id })} disabled={opened || !!active || finished}
            aria-label={opened ? `${key.name} door: ${word.word}${practiced ? ', practiced' : ''}` : `Unlock ${key.name.toLowerCase()} ${key.shape} door`}>
            <span className="house-door-surprise" aria-hidden={!opened}><WordPicture word={word} /><span>{opened ? word.word : ''}</span>{practiced && <span className="door-done">★</span>}</span>
            <span className="house-door-face" aria-hidden="true"><span className="door-window">✦</span><KeyDrawing houseKey={key} lock /><span className="door-knob" /></span>
          </button>
        })}
      </div></div>
    </div>
    {active ? <div className="house-word-reveal" key={active.key.id}>
      <WordPicture word={active.word} /><div><p>Look what you found!</p><h3>{active.word.word}</h3><p>Try saying this word aloud.</p></div>
      <button className="cta-button" onClick={() => dispatch({ type: 'say' })}>I said it! ✓</button>
    </div> : finished ? <div className="house-finish"><span aria-hidden="true">🌟</span><h3>Every door is a discovery!</h3><button className="cta-button" onClick={() => onComplete({ wordsPracticed: new Set(doors.map(door => door.word.id)).size, speechReps: state.reps, gameName: 'Key House' })}>See my stars →</button></div> : <div className="house-key-tray">
      <h3>Your keys</h3><p>Match the color and shape. Some keys are long, some are short!</p>
      <div className="house-keys">{keys.map(({ key }) => <button key={key.id} className={`house-key ${selected?.id === key.id ? 'is-selected' : ''}`} disabled={state.opened.includes(key.id)} aria-pressed={selected?.id === key.id} aria-label={`Choose ${key.name.toLowerCase()} ${key.size} key with a ${key.shape}`} onClick={() => dispatch({ type: 'select', id: key.id })}>
        <KeyDrawing houseKey={key} /><span>{key.name} · {key.shape}</span>
      </button>)}</div>
    </div>}
    <button className="house-reset" onClick={() => { setDoors(makeHouseDoors(words)); dispatch({ type: 'reset' }) }}>↻ Start over</button>
  </section>
}
