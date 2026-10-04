import type { ReactNode } from 'react'
import type { SpeechWord } from '../types'
import './WordPicture.css'

const face = <><circle cx="38" cy="49" r="3" fill="#343047" /><circle cx="62" cy="49" r="3" fill="#343047" /><path d="M42 64 Q50 72 58 64" fill="none" /></>
const person = <><circle cx="50" cy="23" r="11" fill="#f9c99a" /><path d="M50 36v26m-22-17 22-9 22 9M50 62 30 84m20-22 20 22" stroke="#7658c9" strokeWidth="8" fill="none" /></>
const car = <><path d="M15 55h70v22H15zM26 55l10-23h29l13 23" fill="#ed745b" /><path d="M38 37h22l8 18H30z" fill="#bfe4f3" /><circle cx="30" cy="77" r="10" fill="#343047" /><circle cx="72" cy="77" r="10" fill="#343047" /></>
const pictures: Record<string, ReactNode> = {
  rabbit: <><ellipse cx="36" cy="24" rx="10" ry="21" fill="#fff" /><ellipse cx="64" cy="24" rx="10" ry="21" fill="#fff" /><ellipse cx="36" cy="24" rx="4" ry="13" fill="#efaabb" /><ellipse cx="64" cy="24" rx="4" ry="13" fill="#efaabb" /><ellipse cx="50" cy="60" rx="32" ry="29" fill="#fff" />{face}<path d="m46 57 4 5 4-5z" fill="#ed91aa" /></>,
  rain: <><path d="M20 49C3 44 15 22 29 29 28 7 61 9 65 28 87 20 97 48 78 49Z" fill="#a9c7dc" /><path d="m26 62-5 12m30-12-5 12m30-12-5 12" stroke="#489bc6" strokeWidth="7" /></>,
  rainbow: <><path d="M13 80a37 37 0 0 1 74 0" fill="none" stroke="#eb7568" strokeWidth="10" /><path d="M23 80a27 27 0 0 1 54 0" fill="none" stroke="#ffc957" strokeWidth="10" /><path d="M33 80a17 17 0 0 1 34 0" fill="none" stroke="#72b997" strokeWidth="10" /><path d="M43 80a7 7 0 0 1 14 0" fill="none" stroke="#8d78cd" strokeWidth="10" /></>,
  red: <circle cx="50" cy="50" r="34" fill="#e83d45" />,
  ring: <><circle cx="50" cy="62" r="25" fill="none" stroke="#e8b43b" strokeWidth="10" /><path d="m34 25 9-13h14l9 13-16 18z" fill="#b5e0f4" /></>,
  road: <><path d="M30 12h40l22 78H8z" fill="#788794" /><path d="M50 18v12m0 12v12m0 12v14" stroke="#fff0b5" strokeWidth="5" /></>,
  robot: <><path d="M50 12v12" /><circle cx="50" cy="10" r="5" fill="#f8ca62" /><rect x="22" y="24" width="56" height="43" rx="9" fill="#8cc9d2" /><circle cx="37" cy="42" r="6" fill="white" /><circle cx="63" cy="42" r="6" fill="white" /><path d="M36 57h28" /><path d="M29 69h42v20H29z" fill="#8cc9d2" /></>,
  rocket: <><path d="m37 69-12 16 3-30 10-12m25 26 12 16-3-30-10-12" fill="#ed745b" /><path d="M35 67V40Q35 21 50 9q15 12 15 31v27z" fill="#fff" /><circle cx="50" cy="38" r="10" fill="#8ecfe8" /><path d="m41 72 9 20 9-20" fill="#ffc957" /></>,
  rope: <><path d="M15 80C10 30 87 3 83 37 78 76 27 78 32 42" fill="none" stroke="#c59b5a" strokeWidth="11" /><path d="m12 76 9 6m8-41 8 4m42-12 8 3m-27 32 5 8" stroke="#84603b" /></>,
  rose: <><path d="M50 42v47" stroke="#64a778" strokeWidth="7" /><path d="M50 75Q16 76 26 55q17 0 24 20" fill="#78b68a" /><circle cx="50" cy="30" r="22" fill="#ed7293" /><path d="M38 30q4-16 19-8 14 12-3 19-14 5-16-11" fill="none" stroke="#b8496b" /></>,
  run: <><circle cx="63" cy="16" r="9" fill="#f9c99a" /><path d="m58 30-13 23 19 13-9 21m-10-34-9 19-19-3m33-27-15-9-13 10m28-1 17 7 11-13" fill="none" stroke="#7658c9" strokeWidth="7" /><path d="M12 25h18M8 39h12" stroke="#8fbccb" /></>,
  rug: <><path d="M20 20h60v60H20z" fill="#e99883" /><path d="m50 29 21 21-21 21-21-21z" fill="#ffe09a" /><path d="M20 12v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8M20 80v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8" /></>,
  arrow: <path d="M12 40h43V20l34 30-34 30V60H12z" fill="#8d78cd" />,
  carrot: <><path d="M35 29 69 42 25 90Z" fill="#f3a451" /><path d="m48 31-1-21m7 25 20-19m-14 21 25-1" stroke="#66a879" strokeWidth="8" /><path d="m36 46 11 4m-16 12 9 3" stroke="#c87932" /></>,
  pirate: <><circle cx="50" cy="58" r="29" fill="#f9c99a" /><path d="M14 35 28 13 50 20 72 13 86 35Z" fill="#343047" /><circle cx="50" cy="28" r="5" fill="white" /><path d="M23 44 77 70" /><circle cx="62" cy="56" r="9" fill="#343047" /><circle cx="38" cy="56" r="3" fill="#343047" /><path d="M39 75q11 6 22 0" fill="none" /></>,
  orange: <><circle cx="50" cy="56" r="31" fill="#f5a13d" /><path d="M50 24Q49 4 77 13 69 29 50 24" fill="#72b48a" /><path d="M50 15v13" /></>,
  parrot: <><ellipse cx="51" cy="54" rx="24" ry="30" fill="#e97868" /><circle cx="56" cy="30" r="18" fill="#e97868" /><path d="m71 28 17 9-18 6" fill="#ffc957" /><circle cx="61" cy="28" r="4" fill="white" /><path d="M32 44q38 9 12 39" fill="#72b48a" /><path d="m40 76-10 17 25-10" fill="#80b6dc" /></>,
  fairy: <><ellipse cx="25" cy="48" rx="15" ry="22" fill="#b9e0ed" /><ellipse cx="75" cy="48" rx="15" ry="22" fill="#b9e0ed" />{person}<path d="m50 38-17 34h34z" fill="#e8a2c2" /><path d="M74 42 88 20" /><path d="m88 9 3 7 8 2-7 4-1 8-5-6-8 1 4-7z" fill="#ffc957" /></>,
  berry: <><path d="M22 32Q50 16 78 32 80 69 50 90 20 69 22 32" fill="#ed7293" /><path d="m50 14 5 13 18-5-9 13H36l-9-13 18 5z" fill="#72b48a" /><path d="M35 45h1m27 0h1M48 58h1m-13 9h1m24 0h1" stroke="#ffe5a1" strokeWidth="5" /></>,
  cherry: <><path d="M30 65q0-45 35-52-4 22 5 52" fill="none" stroke="#72b48a" strokeWidth="5" /><circle cx="29" cy="70" r="18" fill="#e45a68" /><circle cx="71" cy="70" r="18" fill="#e45a68" /></>,
  mirror: <><rect x="45" y="64" width="10" height="28" rx="4" fill="#d7a162" /><ellipse cx="50" cy="38" rx="27" ry="31" fill="#e9bd7a" /><ellipse cx="50" cy="38" rx="20" ry="24" fill="#c7e6f3" /><path d="m40 40 16-19m-7 30 13-16" stroke="white" strokeWidth="5" /></>,
  zebra: <><path d="M30 87 23 51 37 18 58 16 81 44 74 63 57 56 62 87" fill="white" /><path d="m36 24 15 9m-22 6 20 9m-22 6 19 9m-13 9 17 7m-5-62 6-9" stroke="#343047" strokeWidth="6" /><circle cx="60" cy="35" r="3" fill="#343047" /></>,
  bear: <><circle cx="25" cy="25" r="15" fill="#b8875c" /><circle cx="75" cy="25" r="15" fill="#b8875c" /><circle cx="50" cy="54" r="35" fill="#b8875c" />{face}<ellipse cx="50" cy="62" rx="16" ry="12" fill="#e5c5a0" /><circle cx="50" cy="58" r="5" fill="#343047" /></>,
  car,
  door: <><path d="M22 10h56v80H22z" fill="#b98961" /><path d="M31 21h38v29H31zM31 60h38v20H31z" fill="#d6af89" /><circle cx="67" cy="56" r="4" fill="#ffcf64" /></>,
  four: <>{[ [30,30], [70,30], [30,70], [70,70] ].map(([cx,cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="15" fill="#8d78cd" />)}</>,
  hair: <><ellipse cx="50" cy="57" rx="26" ry="32" fill="#f9c99a" /><path d="M21 54V38Q20 8 51 11 82 10 80 48L66 36l-4 15-11-18-10 17-8-11z" fill="#75533f" />{face}</>,
  jar: <><rect x="29" y="10" width="42" height="13" rx="3" fill="#b9a4d9" /><path d="M31 24 23 35v46q0 8 8 8h38q8 0 8-8V35l-8-11z" fill="#c5e5ef" /><path d="M30 55h40v26H30z" fill="#eaa6aa" /></>,
  near: <><circle cx="39" cy="60" r="19" fill="#8d78cd" /><circle cx="78" cy="60" r="19" fill="#f4c45c" /><path d="M53 28h12m-10-4-4 4 4 4m8-8 4 4-4 4" fill="none" /></>,
  star: <path d="m50 8 12 26 29 4-21 21 5 30-25-14-25 14 5-30L9 38l29-4z" fill="#ffc957" />,
  tear: <><path d="M50 12C42 32 22 49 22 63a28 28 0 0 0 56 0C78 49 58 32 50 12Z" fill="#91cde8" /><path d="M35 61q-3 15 10 17" fill="none" stroke="white" strokeWidth="5" /></>,
  year: <><rect x="14" y="19" width="72" height="68" rx="6" fill="white" /><path d="M14 19h72v19H14z" fill="#e97868" /><path d="M30 10v17m40-17v17" /><g fill="#8d78cd" stroke="none">{[0,1,2].flatMap(row => [0,1,2,3].map(col => <rect key={`${row}-${col}`} x={24+col*14} y={47+row*12} width="8" height="7" rx="2" />))}</g></>,
  brain: <><path d="M49 19C31 5 18 21 22 33 4 44 17 64 24 63 18 83 40 92 50 80 61 92 83 83 77 64 96 57 91 36 78 33 82 16 60 6 49 19Z" fill="#eaa4b9" /><path d="M50 22v54M30 27q20 5 7 20m-13-2q-3 18 13 15m29-31q-19 5-7 20m17-3q6 17-11 18" fill="none" stroke="#ba708e" /></>,
  branch: <><path d="m14 82 67-62m-37 35-9-27m24 12 26 12" stroke="#a37b54" strokeWidth="8" /><path d="M32 29Q12 12 28 9q15 0 4 20M68 31q-5-29 12-21 10 10-12 21M75 49q20-17 20-1-1 14-20 1" fill="#78b68a" /></>,
  bread: <><path d="M23 38C2 20 23 5 38 15q12-14 26 0C84 5 99 26 77 38v47H23z" fill="#c78c52" /><path d="M31 40C16 26 31 18 43 24q8-9 16 0c17-7 26 7 10 16v37H31z" fill="#f7dba3" /></>,
  bring: <>{person}<path d="M65 43h25v23H65z" fill="#ffc957" /><path d="M8 48h17m-6-6 6 6-6 6" fill="none" stroke="#72b48a" strokeWidth="4" /></>,
  brush: <><rect x="42" y="52" width="16" height="39" rx="5" fill="#b98bd1" /><rect x="24" y="12" width="52" height="43" rx="14" fill="#b98bd1" /><path d="M34 22v23m10-23v23m12-23v23m10-23v23" stroke="#5f466f" strokeWidth="4" /></>,
  crack: <><path d="M15 18h70v65H15z" fill="#cad4db" /><path d="m55 18-17 22 23 8-25 18 11 17" fill="none" stroke="#495766" strokeWidth="6" /></>,
  crayon: <><path d="M36 28 50 8 64 28v58H36z" fill="#e97868" /><path d="M36 42h28v30H36z" fill="#f7bfac" /><path d="M36 33h28m-28 46h28" /><path d="m45 17 5-9 5 9" fill="#a44239" /></>,
  frog: <><circle cx="30" cy="28" r="15" fill="#79bb79" /><circle cx="70" cy="28" r="15" fill="#79bb79" /><ellipse cx="50" cy="58" rx="38" ry="29" fill="#79bb79" /><circle cx="30" cy="27" r="7" fill="white" /><circle cx="70" cy="27" r="7" fill="white" /><circle cx="30" cy="27" r="3" fill="#343047" /><circle cx="70" cy="27" r="3" fill="#343047" /><path d="M28 58q22 26 44 0" fill="none" /></>,
  grapes: <><path d="M50 10v18m0-10q22-14 28 0-11 17-28 0" fill="#78b68a" /><g fill="#9776bf">{[[33,36],[56,36],[77,38],[43,56],[66,57],[54,77]].map(([cx,cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="13" />)}</g></>,
  truck: <><path d="M10 28h48v44H10z" fill="#8d78cd" /><path d="M58 43h21l12 14v15H58z" fill="#ffc957" /><path d="M64 49h12l8 10H64z" fill="#c5e5ef" /><circle cx="28" cy="75" r="11" fill="#343047" /><circle cx="76" cy="75" r="11" fill="#343047" /></>,
}

const emojiMap: Record<string, string> = {
  zebra: '🦓', zero: '0️⃣', zoo: '🦁', zone: '🗺️', zipper: '🤐', zoom: '🔭', zap: '⚡', zest: '✨', zombie: '🧟', buzz: '🐝', fizz: '✨', fuzz: '☁️', jazz: '🎷', quiz: '❓', dizzy: '😵', dozen: '12️⃣', puzzle: '🧩', wizard: '🧙',
  van: '🚐', vase: '🌺', vest: '🦺', vine: '🍇', violin: '🎻', volcano: '🌋', vote: '🗳️', visit: '👋', velvet: '🧵', video: '📹', seven: '7️⃣', even: '🆚', never: '🚫', river: '💧', level: '📊', heaven: '☁️', avenue: '🛣️', oven: '🔥', favor: '❤️', have: '👐', live: '🏠', love: '❤️', save: '💾', cave: '⛰️', brave: '💪', curve: '↪️', active: '⚡', develop: '🏗️', prove: '✅', serve: '🏐',
  face: '😊', fan: '🌀', farm: '🌾', fast: '⚡', father: '👨', feet: '🦶', fish: '🐟', five: '5️⃣', fly: '🪰', fork: '🍴', fox: '🦊', fun: '🎉', after: '⏳', before: '⏮️', coffee: '☕', different: '❓', elephant: '🐘', life: '💚', office: '🏢', safety: '🛡️', soften: '☁️', waffle: '🧇', beef: '🍖', brief: '📝', chief: '👑', chef: '👨‍🍳', loaf: '🍞', roof: '🏠', safe: '🔒', self: '🪞', shelf: '📚', flame: '🔥', flash: '⚡', flat: '📏', float: '⛵', floor: '🏠', flower: '🌻', frame: '🖼️', fresh: '🍃',
  jacket: '🧥', jam: '🍓', jar: '🫙', jelly: '🍮', jewel: '💎', job: '💼', joke: '😂', journey: '🚀', judge: '⚖️', jump: '🦘', adjust: '🔧', agent: '🕵️', angel: '😇', engine: '🚗', finger: '👆', ginger: '🫑', imagine: '💭', magic: '✨', page: '📄', project: '📋', badge: '🏅', cage: '🔗', edge: '🔪', garage: '🏠', huge: '📏', lodge: '🏠', orange: '🍊', stage: '🎭', bridge: '🌉', cabbage: '🥬', danger: '⚠️', digest: '📖', enjoy: '😊', gentle: '🤲', range: '📊', village: '🏘️',
  paint: '🎨', pan: '🍳', park: '🎡', parrot: '🦜', pear: '🍐', pen: '✏️', penguin: '🐧', pig: '🐷', pink: '🌸', pizza: '🍕', plane: '✈️', play: '🎮', apple: '🍎', carpet: '🧵', happy: '😊', hoppy: '🦘', open: '🚪', paper: '📰', puppet: '🪀', super: '⭐', cap: '🧢', cup: '🥤', drip: '💧', gap: '〰️', grip: '✊', hop: '🦘', keep: '📌', stop: '🛑', trap: '🪤', place: '📍', plan: '📋', plate: '🍽️', please: '🙏', pray: '🙏', present: '🎁', pretend: '🎭', prince: '👑', prize: '🏆',
  baby: '👶', back: '🔙', ball: '⚽', banana: '🍌', bat: '🦇', beach: '🏖️', bear: '🐻', bed: '🛏️', bee: '🐝', bike: '🚲', bird: '🐦', cabin: '🏠', cobweb: '🕷️', rabbit: '🐰', rubber: '🛞', probably: '🤔', robin: '🐦', absorb: '💧', cab: '🚕', club: '🏌️', crab: '🦀', crib: '🛏️', curb: '🛣️', grab: '✊', robe: '👗', tube: '🔬', black: '⬛', blanket: '🛏️', blue: '🔵', brick: '🧱', bride: '👰', bright: '☀️', bring: '🎁', brother: '👨', brown: '🟤',
  table: '🪑', tail: '🐶', take: '✋', talk: '💬', teacher: '👩‍🏫', tea: '☕', ten: '🔟', tent: '⛺', tiger: '🐯', time: '⏰', tire: '🛞', toad: '🐸', better: '👍', bottle: '🍾', butter: '🧈', button: '🔘', cottage: '🏠', kitten: '🐱', letter: '✉️', little: '🤏', mitten: '🧤', water: '💧', beat: '💓', boot: '👢', boat: '⛵', cat: '🐱', dot: '⚪', eat: '🍽️', got: '✅', hat: '🎩', train: '🚂', tree: '🌳', trick: '🎭', trip: '✈️', true: '✅', trust: '🤝', twist: '🌪️', twelve: '🔢',
  dad: '👨', daisy: '🌼', dance: '💃', dark: '🌑', day: '☀️', desk: '🪑', dial: '📞', dig: '🏗️', doll: '🪆', dog: '🐕', door: '🚪', dove: '🕊️', body: '👀', buddy: '👬', idea: '💡', lady: '👩', ladder: '🪜', muddy: '💩', puddle: '💧', teddy: '🧸', bid: '💰', board: '🎯', bread: '🍞', cold: '❄️', good: '👍', hand: '✋', head: '🧠', dragon: '🐉', drain: '💧', drama: '🎭', draw: '✏️', dream: '💭', dress: '👗', dried: '🏜️', drink: '🍹', drive: '🚗', drop: '💧',
  kale: '🥬', kayak: '🛶', kept: '🤝', kettle: '🫖', kick: '⚽', kid: '👦', kill: '❌', king: '👑', kite: '🪁', ankle: '👣', bucket: '🪣', chicken: '🍗', cookie: '🍪', joker: '🃏', market: '🛒', pocket: '👖', rocket: '🚀', ticket: '🎫', book: '📖', break: '☕', cake: '🎂', check: '✅', duck: '🦆', like: '👍', milk: '🥛', ask: '❓', make: '✋', mask: '🎭', shake: '🤝', snake: '🐍', speak: '💬',
  game: '🎮', garden: '🌻', gate: '🚪', gave: '🎁', gift: '🎁', girl: '👧', give: '✋', glass: '🥛', go: '🏃', goat: '🐐', gold: '💛', gone: '👋', anger: '😠', bigger: '📏', budget: '💰', eagle: '🦅', foggy: '🌫️', juggle: '🤹', magnet: '🧲', wagon: '🚜', bag: '👜', big: '📏', bug: '🐛', drug: '💊', egg: '🥚', flag: '🚩', fog: '🌫️', hug: '🤗', glove: '🧤', grace: '🙏', grade: '📊', grain: '🌾', grand: '🏰', grape: '🍇', grass: '🌱', gray: '🩶', green: '💚',
  wait: '⏳', wake: '😴', walk: '🚶', wall: '🧱', want: '🙋', watch: '⌚', wave: '👋', way: '🛣️', we: '👥', well: '🌊', always: '⏰', away: '🏃', between: '〰️', beware: '⚠️', drawing: '🖍️', forward: '⏭️', growing: '📈', power: '⚡', sewing: '🧵', tower: '🗼', blew: '💨', bow: '🏹', brew: '☕', chew: '😁', cow: '🐄', few: '🤏', how: '❓', new: '✨', snow: '❄️', award: '🏆', aware: '👁️', anyway: '🤷', crown: '👑', down: '⬇️', know: '🧠', show: '🎪', slow: '🐢',
  yard: '🏡', yarn: '🧵', year: '📅', yell: '📢', yellow: '💛', yes: '✅', yet: '⏰', you: '👆', young: '👶', your: '🫵', beyond: '➡️', canyon: '🏜️', crayon: '🖍️', layer: '📚', lawyer: '⚖️', player: '🎮', prayer: '🙏', royal: '👑', voyage: '⛵', boy: '👦', busy: '🏃', buy: '🛒', cry: '😭', dry: '🏜️', shy: '😳', beautiful: '✨', bicycle: '🚲', city: '🏙️', copy: '📋', family: '👨‍👩‍👧', funny: '😂', money: '💰', story: '📖',
  mail: '📬', map: '🗺️', match: '🔥', maybe: '🤔', mom: '👩', moon: '🌙', mouse: '🐭', mouth: '👄', move: '📦', animal: '🦁', camera: '📷', camel: '🐪', coming: '👉', hammer: '🔨', home: '🏠', lemon: '🍋', name: '📝', summer: '☀️', arm: '💪', beam: '💡', boom: '💥', cream: '🍦', dam: '🪨', gem: '💎', gym: '🏋️', ham: '🍖', smart: '🧠', smell: '👃', smile: '😊', smith: '🔨', smoke: '💨', smooth: '☁️', snap: '🤏', swamp: '🌿', theme: '🎭',
  nail: '🔨', napkin: '🧻', navy: '⚓', near: '📍', neck: '👕', need: '🙏', nest: '🏠', nine: '9️⃣', no: '❌', nose: '👃', note: '📝', begin: '🔜', belong: '🏠', candle: '🕯️', dinner: '🍽️', listen: '👂', bean: '🫘', been: '✅', born: '👶', brain: '🧠', chain: '⛓️', clean: '🧼', ant: '🐜', branch: '🌳', friend: '👫', plant: '🌱', print: '🖨️', sound: '🔊', thank: '🙏',
  balloon: '🎈', below: '⬇️', color: '🎨', dollar: '💵', pillow: '🛏️', sad: '😢', soap: '🧼', sock: '🧦', seal: '🦭', sit: '🪑', six: '6️⃣', star: '⭐', answer: '💡', baseball: '⚾', basket: '🧺', easy: '😌', fossil: '🦴', insect: '🦗', music: '🎵', bus: '🚌', class: '🏫', cross: '❌', kiss: '💋', loss: '😞', miss: '😘', scale: '⚖️', scare: '😨', skate: '⛸️', skeleton: '💀', skirt: '👗', slide: '🛝', space: '🚀', square: '⬜',
  lamp: '💡', lion: '🦁', lips: '👄', lock: '🔒', log: '🪵', lunch: '🍱', lollipop: '🍭', anything: '🌀', birthday: '🎂', bathing: '🛁', feather: '🪶', gather: '👥', leather: '🧥', mother: '👩', other: '🔄', weather: '⛅', bath: '🛁', both: '👯', cloth: '🧺', earth: '🌍', math: '🔢', month: '📅', path: '🛣️', teeth: '😁', tooth: '🦷', with: '👋', the: '🔤', that: '👉', them: '👥', then: '⏰', there: '📍', these: '👇', they: '👥', this: '👈', those: '👉', through: '➡️',
  shade: '🌳', shadow: '👤', shape: '🔷', share: '🤝', sharp: '🔪', she: '👩', sheep: '🐑', shell: '🐚', shine: '✨', ship: '🚢', shoe: '👟', shop: '🛒', short: '🤏', shoulder: '💪', shout: '📢', shower: '🚿', shut: '🔐', shrimp: '🦐', shrink: '📉', shrug: '🤷',
}

export function WordPicture({ word }: { word: SpeechWord }) {
  const picture = pictures[word.word.toLowerCase()]
  const emoji = emojiMap[word.word.toLowerCase()]

  if (picture) {
    return <svg className="word-picture" viewBox="0 0 100 100" role="img" aria-label={word.imageAlt} fill="none" stroke="#51475d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{picture}</svg>
  }

  if (emoji) {
    return <div className="word-emoji" role="img" aria-label={word.imageAlt}>{emoji}</div>
  }

  return null
}
