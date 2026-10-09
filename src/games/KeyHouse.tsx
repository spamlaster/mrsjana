import { useReducer, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
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
    : state.feedback === 'said' ? 'Great trying! Drag another key to its door.' : 'Drag a key to its matching door!'
  const [drag, setDrag] = useState<{ id: string; x: number; y: number; over: string | null } | null>(null)
  const [shaking, setShaking] = useState<string | null>(null)
  // A press only becomes a drag once the pointer moves; a plain tap still selects the key.
  const press = useRef<{ id: string; x: number; y: number; pointerId: number; dragging: boolean } | null>(null)
  const justDragged = useRef(false)

  const doorAt = (x: number, y: number) => {
    const door = document.elementFromPoint(x, y)?.closest<HTMLButtonElement>('.house-door')
    return door && !door.disabled ? door.dataset.door ?? null : null
  }
  const tryDoor = (keyId: string, doorId: string) => {
    if (keyId !== doorId) setShaking(doorId)
    dispatch({ type: 'select', id: keyId })
    dispatch({ type: 'unlock', id: doorId })
  }
  const startPress = (id: string, event: PointerEvent<HTMLButtonElement>) => {
    justDragged.current = false
    if (event.button !== 0) return
    press.current = { id, x: event.clientX, y: event.clientY, pointerId: event.pointerId, dragging: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const movePress = (event: PointerEvent<HTMLButtonElement>) => {
    const current = press.current
    if (!current || current.pointerId !== event.pointerId) return
    if (!current.dragging) {
      if (Math.hypot(event.clientX - current.x, event.clientY - current.y) < 8) return
      current.dragging = true
      dispatch({ type: 'select', id: current.id })
    }
    setDrag({ id: current.id, x: event.clientX, y: event.clientY, over: doorAt(event.clientX, event.clientY) })
  }
  const endPress = (event: PointerEvent<HTMLButtonElement>, cancelled = false) => {
    const current = press.current
    if (!current || current.pointerId !== event.pointerId) return
    press.current = null
    if (!current.dragging) return
    justDragged.current = true
    setDrag(null)
    const door = cancelled ? null : doorAt(event.clientX, event.clientY)
    if (door) tryDoor(current.id, door)
  }

  if (!doors.length) return <p>No practice words available. Choose another category.</p>

  const currentDoor = doors.find(d => d.key.id === state.selectedKey) || doors[0]

  return <section className="key-house-game" aria-label="Key House game">
    <div className="house-status">
      <div className="progress">
        <span className="progress-label">Doors</span>
        <span className="progress-value">{state.practiced.length}/{doors.length}</span>
      </div>
      <p className="house-instruction" role="status">{message}</p>
      {state.selectedKey && (
        <div className="current-word-display">
          <WordPicture word={currentDoor.word} />
          <span className="word">{currentDoor.word.word}</span>
        </div>
      )}
    </div>

    <div className="house-play">
      <div className="house-scene">
        <div className="house-roof" aria-hidden="true"><span>★</span></div>
        <div className="house-walls"><div className="house-doors">
          {doors.map(({ key, word }) => {
            const opened = state.opened.includes(key.id)
            const practiced = state.practiced.includes(key.id)
            return <button key={key.id} data-door={key.id} className={`house-door ${opened ? 'is-open' : ''} ${selected?.id === key.id ? 'matching-key-selected' : ''} ${drag?.over === key.id ? 'is-drop-target' : ''} ${shaking === key.id ? 'is-shaking' : ''}`} style={{ '--door-color': key.color } as CSSProperties}
              onClick={() => selected ? tryDoor(selected.id, key.id) : dispatch({ type: 'unlock', id: key.id })} onAnimationEnd={() => setShaking(null)} disabled={opened || !!active || finished}
              aria-label={opened ? `${key.name} door: ${word.word}${practiced ? ', practiced' : ''}` : `Unlock ${key.name.toLowerCase()} ${key.shape} door`}>
              <span className="house-door-surprise" aria-hidden={!opened}><WordPicture word={word} /><span>{opened ? word.word : ''}</span>{practiced && <span className="door-done">★</span>}</span>
              <span className="house-door-face" aria-hidden="true"><span className="door-window">✦</span><KeyDrawing houseKey={key} lock /><span className="door-knob" /></span>
            </button>
          })}
        </div></div>
      </div>
      <div className="house-panel">
        {active ? <div className="house-word-reveal" key={active.key.id}>
          <WordPicture word={active.word} /><div><p>Look what you found!</p><h3>{active.word.word}</h3><p>Try saying this word aloud.</p></div>
          <button className="cta-button" onClick={() => dispatch({ type: 'say' })}>I said it! ✓</button>
        </div> : finished ? <div className="house-finish"><span aria-hidden="true">🌟</span><h3>Every door is a discovery!</h3><button className="cta-button" onClick={() => onComplete({ wordsPracticed: new Set(doors.map(door => door.word.id)).size, speechReps: state.reps, gameName: 'Key House' })}>See my stars →</button></div> : <div className="house-key-tray">
          <h3>Your keys</h3>
          <div className="house-keys">{keys.map(({ key }) => <button key={key.id} className={`house-key ${selected?.id === key.id ? 'is-selected' : ''} ${drag?.id === key.id ? 'is-dragging' : ''}`} disabled={state.opened.includes(key.id)} aria-pressed={selected?.id === key.id} aria-label={`Choose ${key.name.toLowerCase()} ${key.size} key with a ${key.shape}`}
            onPointerDown={event => startPress(key.id, event)} onPointerMove={movePress} onPointerUp={event => endPress(event)} onPointerCancel={event => endPress(event, true)}
            onClick={() => { if (justDragged.current) justDragged.current = false; else dispatch({ type: 'select', id: key.id }) }}>
            <KeyDrawing houseKey={key} /><span>{key.name} · {key.shape}</span>
          </button>)}</div>
        </div>}
      </div>
    </div>

    {drag && <div className="house-key-ghost" aria-hidden="true" style={{ left: drag.x, top: drag.y }}>
      <KeyDrawing houseKey={doors.find(door => door.key.id === drag.id)!.key} />
    </div>}

    <div className="house-footer">
      <p>Match the color and shape. Some keys are long, some are short! You can also tap a key, then tap its door.</p>
      <button className="house-reset" onClick={() => { setDoors(makeHouseDoors(words)); dispatch({ type: 'reset' }) }}>↻ Start over</button>
    </div>
  </section>
}
