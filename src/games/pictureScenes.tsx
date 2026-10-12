import type { ReactNode } from 'react'

export interface SceneSlot {
  x: number // % from left (sticker center)
  y: number // % from top (sticker center)
  size: number // % of scene width
}

export interface PictureScene {
  id: string
  name: string
  emoji: string
  art: ReactNode
  slots: SceneSlot[] // where the practice word stickers sit in the scene
}

// Small deterministic random so the starfield doesn't jump between renders
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const rand = seeded(7)
const spaceStars = Array.from({ length: 46 }, (_, i) => ({
  id: i,
  x: Math.round(rand() * 500),
  y: Math.round(rand() * 300),
  r: 0.8 + rand() * 2,
  delay: (rand() * 3).toFixed(2),
}))

const flowerColors = ['#ff6fa8', '#ffd23f', '#ffffff', '#b07cff', '#ff8a3d']
const flowers = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 18 + i * 35 + (i % 3) * 6,
  y: 330 + ((i * 37) % 50),
  color: flowerColors[i % flowerColors.length],
}))

function flower({ id, x, y, color }: { id: number; x: number; y: number; color: string }) {
  return (
    <g key={id} transform={`translate(${x} ${y})`}>
      <path d="M0 0v14" stroke="#2f9a44" strokeWidth="2.5" />
      {[0, 72, 144, 216, 288].map(angle => (
        <circle key={angle} cx="0" cy="-6" r="4.5" fill={color} transform={`rotate(${angle})`} />
      ))}
      <circle r="3.5" fill="#ffb703" />
    </g>
  )
}

function fish(x: number, y: number, color: string, className: string, flip = false) {
  return (
    <g className={className}>
      <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
        <path d="M18 0 32-12V12Z" fill={color} />
        <ellipse rx="22" ry="14" fill={color} />
        <path d="M-2-13q8 13 0 26" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="3" />
        <circle cx="-11" cy="-3" r="4" fill="white" />
        <circle cx="-12" cy="-3" r="2" fill="#2b2140" />
      </g>
    </g>
  )
}

const meadow: PictureScene = {
  id: 'meadow',
  name: 'Sunny Meadow',
  emoji: '🌈',
  slots: [
    { x: 13, y: 84, size: 13 },
    { x: 41, y: 70, size: 12 },
    { x: 64, y: 86, size: 13 },
    { x: 88, y: 76, size: 12 },
    { x: 54, y: 30, size: 11 },
    { x: 87, y: 13, size: 10 },
  ],
  art: (
    <>
      <defs>
        <linearGradient id="pr-meadow-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fc8ff" />
          <stop offset="1" stopColor="#d4f4ff" />
        </linearGradient>
      </defs>
      <rect width="500" height="400" fill="url(#pr-meadow-sky)" />

      <g className="pr-spin">
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M75 18v-14" stroke="#ffb703" strokeWidth="6" strokeLinecap="round" transform={`rotate(${i * 30} 75 72)`} />
        ))}
      </g>
      <circle cx="75" cy="72" r="38" fill="#ffd23f" />
      <circle cx="62" cy="66" r="4" fill="#5b3a1e" />
      <circle cx="88" cy="66" r="4" fill="#5b3a1e" />
      <circle cx="56" cy="80" r="6" fill="#ff9f7a" opacity=".7" />
      <circle cx="94" cy="80" r="6" fill="#ff9f7a" opacity=".7" />
      <path d="M63 82q12 12 24 0" fill="none" stroke="#5b3a1e" strokeWidth="3.5" strokeLinecap="round" />

      {['#ff595e', '#ff924c', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'].map((color, i) => (
        <path key={color} d={`M${180 + i * 14} 300a${150 - i * 14} ${150 - i * 14} 0 0 1 ${300 - i * 28} 0`} fill="none" stroke={color} strokeWidth="14" />
      ))}

      <g className="pr-drift">
        <ellipse cx="190" cy="62" rx="34" ry="18" fill="white" />
        <ellipse cx="220" cy="52" rx="28" ry="22" fill="white" />
        <ellipse cx="248" cy="64" rx="28" ry="16" fill="white" />
      </g>
      <g className="pr-drift pr-drift-slow">
        <ellipse cx="370" cy="100" rx="26" ry="14" fill="white" opacity=".9" />
        <ellipse cx="393" cy="92" rx="22" ry="18" fill="white" opacity=".9" />
        <ellipse cx="415" cy="102" rx="22" ry="12" fill="white" opacity=".9" />
      </g>

      <path d="M0 260Q120 190 260 245T500 225V400H0Z" fill="#8ee06f" />
      <path d="M0 300Q140 255 290 300T500 290V400H0Z" fill="#5cc94f" />

      <rect x="56" y="210" width="78" height="62" fill="#fff3c4" stroke="#e0a458" strokeWidth="3" />
      <path d="M46 214 95 168l49 46Z" fill="#ff595e" />
      <rect x="84" y="236" width="22" height="36" rx="10" fill="#b5651d" />
      <rect x="62" y="224" width="16" height="16" fill="#9ee3ff" stroke="#e0a458" strokeWidth="2" />
      <rect x="113" y="224" width="16" height="16" fill="#9ee3ff" stroke="#e0a458" strokeWidth="2" />
      <rect x="116" y="176" width="12" height="22" fill="#b5651d" />

      <rect x="262" y="210" width="14" height="52" rx="4" fill="#9c6b3c" />
      <circle cx="269" cy="196" r="32" fill="#2fae4e" />
      <circle cx="250" cy="208" r="20" fill="#3cc25b" />
      <circle cx="290" cy="210" r="18" fill="#3cc25b" />
      <circle cx="260" cy="190" r="5" fill="#ff595e" />
      <circle cx="282" cy="204" r="5" fill="#ff595e" />
      <circle cx="252" cy="212" r="5" fill="#ff595e" />

      <ellipse cx="380" cy="352" rx="70" ry="20" fill="#4fc3f7" />
      <ellipse cx="368" cy="346" rx="30" ry="6" fill="white" opacity=".45" />

      {flowers.map(flower)}

      <g className="pr-flutter">
        <ellipse cx="330" cy="160" rx="9" ry="6" fill="#ff6fa8" transform="rotate(-30 330 160)" />
        <ellipse cx="344" cy="160" rx="9" ry="6" fill="#ff6fa8" transform="rotate(30 344 160)" />
        <path d="M337 154v14" stroke="#2b2140" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="pr-flutter pr-flutter-late">
        <ellipse cx="170" cy="250" rx="8" ry="5" fill="#b07cff" transform="rotate(-30 170 250)" />
        <ellipse cx="183" cy="250" rx="8" ry="5" fill="#b07cff" transform="rotate(30 183 250)" />
        <path d="M176 245v12" stroke="#2b2140" strokeWidth="3" strokeLinecap="round" />
      </g>
    </>
  ),
}

const sea: PictureScene = {
  id: 'sea',
  name: 'Under the Sea',
  emoji: '🐠',
  slots: [
    { x: 14, y: 30, size: 12 },
    { x: 46, y: 22, size: 11 },
    { x: 84, y: 40, size: 12 },
    { x: 30, y: 62, size: 12 },
    { x: 58, y: 85, size: 13 },
    { x: 66, y: 55, size: 11 },
  ],
  art: (
    <>
      <defs>
        <linearGradient id="pr-sea-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4fe0ff" />
          <stop offset=".55" stopColor="#1a9ad6" />
          <stop offset="1" stopColor="#1366b3" />
        </linearGradient>
      </defs>
      <rect width="500" height="400" fill="url(#pr-sea-water)" />
      <path d="M60 0h40L40 330H0ZM200 0h30l-40 330h-50ZM350 0h40l20 330h-60Z" fill="white" opacity=".1" />
      <path d="M0 8q25-12 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0V0H0Z" fill="white" opacity=".55" />

      <path d="M0 330Q110 300 230 328T500 318V400H0Z" fill="#ffd98a" />
      <circle cx="80" cy="360" r="3" fill="#e6b95c" />
      <circle cx="260" cy="372" r="3" fill="#e6b95c" />
      <circle cx="420" cy="380" r="3" fill="#e6b95c" />

      <g className="pr-sway">
        <path d="M40 340q-16-30 0-60t0-60 0-50" fill="none" stroke="#21c47a" strokeWidth="9" strokeLinecap="round" />
        <path d="M62 340q14-28 0-56t0-50" fill="none" stroke="#3ce08f" strokeWidth="8" strokeLinecap="round" />
      </g>
      <g className="pr-sway pr-sway-late">
        <path d="M455 330q-14-28 0-56t0-56 0-40" fill="none" stroke="#21c47a" strokeWidth="9" strokeLinecap="round" />
        <path d="M478 330q12-24 0-48t0-44" fill="none" stroke="#3ce08f" strokeWidth="8" strokeLinecap="round" />
      </g>

      <path d="M170 335v-30m0 10-16-18m16 8 14-22m-14 0v-14m-22 6v-14m36 12 10-12" stroke="#ff6fa8" strokeWidth="9" strokeLinecap="round" />
      <path d="M380 330v-24m0 8-14-14m14 6 12-18" stroke="#ff924c" strokeWidth="8" strokeLinecap="round" />

      <g transform="translate(395 318)">
        <rect x="-30" y="-6" width="60" height="34" rx="4" fill="#b5651d" />
        <path d="M-30-6q30-30 60 0Z" fill="#d68a3c" />
        <rect x="-30" y="-6" width="60" height="6" fill="#ffd23f" />
        <rect x="-5" y="0" width="10" height="12" rx="2" fill="#ffd23f" />
        <circle cx="-14" cy="-12" r="4" fill="#ffd23f" />
        <circle cx="8" cy="-16" r="4" fill="#fff3a3" />
      </g>

      <path d="m110 352 6 12 13 2-10 9 3 13-12-7-12 7 3-13-10-9 13-2z" fill="#ff8a3d" />
      <circle cx="113" cy="368" r="1.6" fill="#2b2140" />
      <circle cx="120" cy="368" r="1.6" fill="#2b2140" />

      {fish(160, 130, '#ffb703', 'pr-swim')}
      {fish(330, 230, '#ff595e', 'pr-swim pr-swim-back', true)}
      {fish(420, 110, '#b07cff', 'pr-swim pr-swim-late')}
      {fish(230, 270, '#ff6fa8', 'pr-swim pr-swim-back pr-swim-late', true)}

      <g className="pr-bob">
      <g transform="translate(270 165)">
        <path d="M-26 0a26 26 0 0 1 52 0Z" fill="#ff9ecf" opacity=".85" />
        <path d="M-18 0q-4 18 2 34M-6 0q-4 20 2 38M6 0q4 20-2 38M18 0q4 18-2 34" fill="none" stroke="#ff9ecf" strokeWidth="3" strokeLinecap="round" />
        <circle cx="-8" cy="-8" r="2.5" fill="#2b2140" />
        <circle cx="8" cy="-8" r="2.5" fill="#2b2140" />
      </g>
      </g>

      {[[90, 300], [300, 320], [470, 260], [210, 340]].map(([cx, cy], i) => (
        <g key={i} className="pr-bubble" style={{ animationDelay: `${i * 1.1}s` }}>
          <circle cx={cx} cy={cy} r="7" fill="none" stroke="white" strokeWidth="2" opacity=".8" />
          <circle cx={cx + 12} cy={cy + 14} r="4" fill="none" stroke="white" strokeWidth="2" opacity=".8" />
        </g>
      ))}
    </>
  ),
}

const space: PictureScene = {
  id: 'space',
  name: 'Outer Space',
  emoji: '🚀',
  slots: [
    { x: 13, y: 22, size: 11 },
    { x: 40, y: 38, size: 12 },
    { x: 60, y: 14, size: 10 },
    { x: 16, y: 62, size: 11 },
    { x: 64, y: 62, size: 12 },
    { x: 86, y: 86, size: 12 },
  ],
  art: (
    <>
      <defs>
        <linearGradient id="pr-space-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1452" />
          <stop offset=".6" stopColor="#47238f" />
          <stop offset="1" stopColor="#8a3aa8" />
        </linearGradient>
        <radialGradient id="pr-space-planet" cx=".35" cy=".35">
          <stop offset="0" stopColor="#ffd88a" />
          <stop offset="1" stopColor="#ff7a3d" />
        </radialGradient>
      </defs>
      <rect width="500" height="400" fill="url(#pr-space-sky)" />
      {spaceStars.map(star => (
        <circle key={star.id} cx={star.x} cy={star.y} r={star.r} fill="#fff7d1" className="pr-twinkle" style={{ animationDelay: `${star.delay}s` }} />
      ))}

      <path d="M120 70 40 110" stroke="url(#pr-space-planet)" strokeWidth="4" strokeLinecap="round" className="pr-shoot" />

      <g>
        <ellipse cx="390" cy="115" rx="92" ry="22" fill="none" stroke="#ffe066" strokeWidth="8" transform="rotate(-14 390 115)" opacity=".85" />
        <circle cx="390" cy="115" r="52" fill="url(#pr-space-planet)" />
        <path d="M344 100q46 10 92-6M342 126q48 12 96-4" fill="none" stroke="#ff9f5a" strokeWidth="6" strokeLinecap="round" />
        <path d="M298 115a92 22 0 0 0 184 0" fill="none" stroke="#ffe066" strokeWidth="8" transform="rotate(-14 390 115)" />
      </g>

      <circle cx="235" cy="72" r="22" fill="#38d9c1" />
      <circle cx="228" cy="66" r="5" fill="#2bb5a1" />
      <circle cx="243" cy="80" r="4" fill="#2bb5a1" />

      <g className="pr-bob pr-ufo">
        <ellipse cx="300" cy="215" rx="20" ry="16" fill="#9ee3ff" opacity=".9" />
        <circle cx="300" cy="212" r="7" fill="#7bea6f" />
        <circle cx="297" cy="210" r="1.6" fill="#2b2140" />
        <circle cx="303" cy="210" r="1.6" fill="#2b2140" />
        <ellipse cx="300" cy="226" rx="44" ry="12" fill="#c7c2ff" />
        <circle cx="275" cy="227" r="3.5" fill="#ffd23f" className="pr-twinkle" />
        <circle cx="300" cy="231" r="3.5" fill="#ff6fa8" className="pr-twinkle" />
        <circle cx="325" cy="227" r="3.5" fill="#38d9c1" className="pr-twinkle" />
      </g>

      <path d="M0 320Q130 280 260 312T500 300V400H0Z" fill="#d6d0f0" />
      <ellipse cx="90" cy="346" rx="34" ry="9" fill="#b6aee0" />
      <ellipse cx="250" cy="372" rx="26" ry="7" fill="#b6aee0" />
      <ellipse cx="430" cy="352" rx="18" ry="5" fill="#b6aee0" />

      <path d="M170 316V256" stroke="#9a92c4" strokeWidth="4" strokeLinecap="round" />
      <path d="M172 258h34l-8 10 8 10h-34Z" fill="#ff595e" />

      <g className="pr-bob pr-rocket">
      <g transform="translate(380 228) rotate(18)">
        <path d="M-14 26-28 44l2-26 10-10M14 26l14 18-2-26-10-10" fill="#ff595e" />
        <path d="M-15 30V-6Q-15-30 0-46 15-30 15-6v36z" fill="#f4f1ff" />
        <circle cy="-8" r="8" fill="#5fc8ff" stroke="#9a92c4" strokeWidth="2.5" />
        <path d="M-9 32 0 56 9 32Z" fill="#ffb703" className="pr-flame" />
      </g>
      </g>
    </>
  ),
}

export const pictureScenes: PictureScene[] = [meadow, sea, space]
