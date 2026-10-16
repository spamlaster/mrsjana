import type { ActivityProps } from './types'

const columns = 5

// The hidden scene: an island with a treasure chest that opens when every tile is gone.
function TreasureIsland({ open }: { open: boolean }) {
  return (
    <svg className="tr-scene" viewBox="0 0 250 160" aria-hidden="true">
      <rect width="250" height="160" fill="#bfe6f7" />
      <circle cx="205" cy="32" r="18" fill="#ffc957" />
      <path d="M0 108q30-10 60 0t60 0 60 0 70 0V160H0z" fill="#5fb7dd" />
      <ellipse cx="120" cy="118" rx="88" ry="24" fill="#f5d48f" />
      <path d="M72 116q4-48-6-74" stroke="#a37b54" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M66 42q-30-8-40 10 22-6 40-10m0 0q-4-26 18-30-4 20-18 30m0 0q30-14 44 6-26-4-44-6m0 0q-26 6-28 30 12-20 28-30" fill="#6dbb7d" />
      <rect x="112" y="92" width="52" height="30" rx="4" fill="#b77b45" />
      <path d="M112 102h52" stroke="#7b4f2b" strokeWidth="3" />
      <rect x="133" y="98" width="10" height="11" rx="2" fill="#ffc957" />
      {open
        ? <><path d="M110 92l6-24h44l6 24z" fill="#c98a52" /><path d="M120 90q18-22 36 0" fill="#ffd95e" /><path d="m126 74 4 8m10-14v10m12-6-4 8" stroke="#ffc957" strokeWidth="4" strokeLinecap="round" /></>
        : <path d="M112 92q26-18 52 0z" fill="#c98a52" />}
      <path d="m184 118 12 12m0-12-12 12" stroke="#e45a68" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

// Each scored turn lifts one tile. Tiles lift in a scattered but fixed order so Undo puts the same one back.
export function TreasureReveal({ total, completed, markId, lastAction }: ActivityProps) {
  const rows = Math.ceil(total / columns)
  // 7 shares no factor with 10 or 20, so this visits every tile once in a scattered order.
  const rank = (tile: number) => Array.from({ length: total }, (_, i) => (i * 7) % total).indexOf(tile)
  const finished = completed >= total
  return (
    <div className="mp-game treasure-reveal">
      <div className={`tr-board${finished ? ' found' : ''}`}>
        <TreasureIsland open={finished} />
        <div className="tr-tiles" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }} aria-hidden="true">
          {Array.from({ length: total }, (_, tile) => {
            const order = rank(tile)
            const lifted = order < completed
            return <span key={tile} className={`tr-tile${lifted ? ' lifted' : ''}${lifted && order === completed - 1 && lastAction === 'mark' ? ' new' : ''}`}>{lifted ? '' : '?'}</span>
          })}
        </div>
      </div>
      <p className="mp-game-cheer" key={markId} aria-live="polite">
        {finished ? 'You found the treasure! 💎' : completed === 0 ? 'Say the word to start digging!' : `${total - completed} more to find the treasure!`}
      </p>
    </div>
  )
}
