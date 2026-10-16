import type { MinimalPair } from './types'

// The therapist-curated minimal pairs. Never generate or add pairs automatically.
// A pair appears in activities only once it has `approval` from the therapist;
// passing scripts/minimal-pairs.test.mjs is not approval.
// Every pair below was kept in the first-round word-list review and is accepted for development.
// All were marked approved on 2026-10-14 so the center can be tested outside preview mode.
export const pairs: MinimalPair[] = [
  // Fronting and Backing share these records; rolesFor reverses target and contrast.
  // Initial /k/ vs /t/
  { id: 'key-tea', words: ['key', 'tea'], contrast: ['k', 't'], position: 'initial', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'car-tar', words: ['car', 'tar'], contrast: ['k', 't'], position: 'initial', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'coat-tote', words: ['coat', 'tote'], contrast: ['k', 't'], position: 'initial', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'cap-tap', words: ['cap', 'tap'], contrast: ['k', 't'], position: 'initial', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'came-tame', words: ['came', 'tame'], contrast: ['k', 't'], position: 'initial', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'cub-tub', words: ['cub', 'tub'], contrast: ['k', 't'], position: 'initial', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'cool-tool', words: ['cool', 'tool'], contrast: ['k', 't'], position: 'initial', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  // Initial /g/ vs /d/
  { id: 'go-dough', words: ['go', 'dough'], contrast: ['g', 'd'], position: 'initial', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'gate-date', words: ['gate', 'date'], contrast: ['g', 'd'], position: 'initial', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'guy-dye', words: ['guy', 'dye'], contrast: ['g', 'd'], position: 'initial', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' }, notes: 'dye sounds the same as die.' },
  { id: 'gown-down', words: ['gown', 'down'], contrast: ['g', 'd'], position: 'initial', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'got-dot', words: ['got', 'dot'], contrast: ['g', 'd'], position: 'initial', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'gum-dumb', words: ['gum', 'dumb'], contrast: ['g', 'd'], position: 'initial', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' }, notes: 'dumb can be heard as an insult.' },
  { id: 'goal-dole', words: ['goal', 'dole'], contrast: ['g', 'd'], position: 'initial', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' }, notes: 'dole may be unfamiliar to children.' },
  { id: 'gear-deer', words: ['gear', 'deer'], contrast: ['g', 'd'], position: 'initial', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' }, notes: 'deer means the animal.' },
  // Final /k/ vs /t/
  { id: 'back-bat', words: ['back', 'bat'], contrast: ['k', 't'], position: 'final', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'pick-pit', words: ['pick', 'pit'], contrast: ['k', 't'], position: 'final', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'bike-bite', words: ['bike', 'bite'], contrast: ['k', 't'], position: 'final', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'lake-late', words: ['lake', 'late'], contrast: ['k', 't'], position: 'final', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'lock-lot', words: ['lock', 'lot'], contrast: ['k', 't'], position: 'final', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'rack-rat', words: ['rack', 'rat'], contrast: ['k', 't'], position: 'final', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'buck-but', words: ['buck', 'but'], contrast: ['k', 't'], position: 'final', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' }, notes: 'but is usually unstressed (b ah t / b ax t); drafted stressed.' },
  { id: 'sick-sit', words: ['sick', 'sit'], contrast: ['k', 't'], position: 'final', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  // Final /g/ vs /d/
  { id: 'bag-bad', words: ['bag', 'bad'], contrast: ['g', 'd'], position: 'final', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' }, notes: 'Some regions raise the vowel before /g/ (b ey g), which breaks the pair.' },
  { id: 'bug-bud', words: ['bug', 'bud'], contrast: ['g', 'd'], position: 'final', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'beg-bed', words: ['beg', 'bed'], contrast: ['g', 'd'], position: 'final', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' }, notes: 'Some regions raise the vowel before /g/ (b ey g), which breaks the pair.' },
  { id: 'big-bid', words: ['big', 'bid'], contrast: ['g', 'd'], position: 'final', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'mug-mud', words: ['mug', 'mud'], contrast: ['g', 'd'], position: 'final', processes: ['fronting', 'backing'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },

  // Stopping
  // Initial /f/ vs /p/
  { id: 'fan-pan', words: ['fan', 'pan'], contrast: ['f', 'p'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'fin-pin', words: ['fin', 'pin'], contrast: ['f', 'p'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'fat-pat', words: ['fat', 'pat'], contrast: ['f', 'p'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'four-pour', words: ['four', 'pour'], contrast: ['f', 'p'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' }, notes: 'For some speakers pour sounds like poor.' },
  // Initial /s/ vs /t/
  { id: 'sea-tea', words: ['sea', 'tea'], contrast: ['s', 't'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'sip-tip', words: ['sip', 'tip'], contrast: ['s', 't'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'sick-tick', words: ['sick', 'tick'], contrast: ['s', 't'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'sell-tell', words: ['sell', 'tell'], contrast: ['s', 't'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  // Initial /sh/ vs /t/
  { id: 'shoe-two', words: ['shoe', 'two'], contrast: ['sh', 't'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'shop-top', words: ['shop', 'top'], contrast: ['sh', 't'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'ship-tip', words: ['ship', 'tip'], contrast: ['sh', 't'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'shy-tie', words: ['shy', 'tie'], contrast: ['sh', 't'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  // Initial /th/ (voiceless) vs /t/
  { id: 'thin-tin', words: ['thin', 'tin'], contrast: ['th', 't'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'thick-tick', words: ['thick', 'tick'], contrast: ['th', 't'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'thank-tank', words: ['thank', 'tank'], contrast: ['th', 't'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'thought-taught', words: ['thought', 'taught'], contrast: ['th', 't'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' }, notes: 'Drafted with /ao/; speakers with the cot-caught merger use /aa/ in both.' },
  // Initial /th/ (voiceless) vs /p/
  { id: 'thin-pin', words: ['thin', 'pin'], contrast: ['th', 'p'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'thick-pick', words: ['thick', 'pick'], contrast: ['th', 'p'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'thigh-pie', words: ['thigh', 'pie'], contrast: ['th', 'p'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'think-pink', words: ['think', 'pink'], contrast: ['th', 'p'], position: 'initial', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  // Final /f/ vs /p/
  { id: 'leaf-leap', words: ['leaf', 'leap'], contrast: ['f', 'p'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'wife-wipe', words: ['wife', 'wipe'], contrast: ['f', 'p'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'beef-beep', words: ['beef', 'beep'], contrast: ['f', 'p'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  // Final /s/ vs /t/
  { id: 'face-fate', words: ['face', 'fate'], contrast: ['s', 't'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'rice-right', words: ['rice', 'right'], contrast: ['s', 't'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'race-rate', words: ['race', 'rate'], contrast: ['s', 't'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'kiss-kit', words: ['kiss', 'kit'], contrast: ['s', 't'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'nice-night', words: ['nice', 'night'], contrast: ['s', 't'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'mice-might', words: ['mice', 'might'], contrast: ['s', 't'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  // Final /sh/ vs /t/
  { id: 'fish-fit', words: ['fish', 'fit'], contrast: ['sh', 't'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'cash-cat', words: ['cash', 'cat'], contrast: ['sh', 't'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'mash-mat', words: ['mash', 'mat'], contrast: ['sh', 't'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'push-put', words: ['push', 'put'], contrast: ['sh', 't'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  // Final /th/ (voiceless) vs /t/
  { id: 'bath-bat', words: ['bath', 'bat'], contrast: ['th', 't'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'math-mat', words: ['math', 'mat'], contrast: ['th', 't'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'path-pat', words: ['path', 'pat'], contrast: ['th', 't'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  // Final /th/ (voiceless) vs /p/. moth / mop is held back: moth is m ao th, mop is m aa p.
  { id: 'math-map', words: ['math', 'map'], contrast: ['th', 'p'], position: 'final', processes: ['stopping'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },

  // Cluster Reduction: initial s-blends only
  // st-
  { id: 'stop-top', words: ['stop', 'top'], contrast: ['st', 't'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'star-tar', words: ['star', 'tar'], contrast: ['st', 't'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'stick-tick', words: ['stick', 'tick'], contrast: ['st', 't'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'stone-tone', words: ['stone', 'tone'], contrast: ['st', 't'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'stack-tack', words: ['stack', 'tack'], contrast: ['st', 't'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'stool-tool', words: ['stool', 'tool'], contrast: ['st', 't'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  // sn-
  { id: 'snow-no', words: ['snow', 'no'], contrast: ['sn', 'n'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'snail-nail', words: ['snail', 'nail'], contrast: ['sn', 'n'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'snap-nap', words: ['snap', 'nap'], contrast: ['sn', 'n'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'snip-nip', words: ['snip', 'nip'], contrast: ['sn', 'n'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  // sm-
  { id: 'smile-mile', words: ['smile', 'mile'], contrast: ['sm', 'm'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'smock-mock', words: ['smock', 'mock'], contrast: ['sm', 'm'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'smash-mash', words: ['smash', 'mash'], contrast: ['sm', 'm'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'small-mall', words: ['small', 'mall'], contrast: ['sm', 'm'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' }, notes: 'Drafted with /ao/; speakers with the cot-caught merger use /aa/ in both.' },
  { id: 'smart-mart', words: ['smart', 'mart'], contrast: ['sm', 'm'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  // sw-
  { id: 'swing-wing', words: ['swing', 'wing'], contrast: ['sw', 'w'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'sweet-wheat', words: ['sweet', 'wheat'], contrast: ['sw', 'w'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' }, notes: 'Some speakers say wheat with /hh w/, which breaks the pair.' },
  { id: 'sweep-weep', words: ['sweep', 'weep'], contrast: ['sw', 'w'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'sweat-wet', words: ['sweat', 'wet'], contrast: ['sw', 'w'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  // sk-
  { id: 'skate-kate', words: ['skate', 'kate'], contrast: ['sk', 'k'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' }, notes: 'Kate is a name; word text must be lowercase, so it displays as kate.' },
  { id: 'skin-kin', words: ['skin', 'kin'], contrast: ['sk', 'k'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'school-cool', words: ['school', 'cool'], contrast: ['sk', 'k'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'scoop-coop', words: ['scoop', 'coop'], contrast: ['sk', 'k'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' }, notes: 'coop is also said k uh p in some regions.' },
  { id: 'scan-can', words: ['scan', 'can'], contrast: ['sk', 'k'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' }, notes: 'Drafted as can the noun (k ae n), not the weak form.' },
  { id: 'scar-car', words: ['scar', 'car'], contrast: ['sk', 'k'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  // sl-
  { id: 'slow-low', words: ['slow', 'low'], contrast: ['sl', 'l'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'slip-lip', words: ['slip', 'lip'], contrast: ['sl', 'l'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'slap-lap', words: ['slap', 'lap'], contrast: ['sl', 'l'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'sled-led', words: ['sled', 'led'], contrast: ['sl', 'l'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'slug-lug', words: ['slug', 'lug'], contrast: ['sl', 'l'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'slim-limb', words: ['slim', 'limb'], contrast: ['sl', 'l'], position: 'initial', processes: ['cluster-reduction'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },

  // Deaffrication: /ch/ vs /t/ only
  // Initial /ch/ vs /t/
  { id: 'chip-tip', words: ['chip', 'tip'], contrast: ['ch', 't'], position: 'initial', processes: ['deaffrication'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'chin-tin', words: ['chin', 'tin'], contrast: ['ch', 't'], position: 'initial', processes: ['deaffrication'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'chop-top', words: ['chop', 'top'], contrast: ['ch', 't'], position: 'initial', processes: ['deaffrication'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  // Final /ch/ vs /t/
  { id: 'beach-beet', words: ['beach', 'beet'], contrast: ['ch', 't'], position: 'final', processes: ['deaffrication'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'peach-peat', words: ['peach', 'peat'], contrast: ['ch', 't'], position: 'final', processes: ['deaffrication'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'match-mat', words: ['match', 'mat'], contrast: ['ch', 't'], position: 'final', processes: ['deaffrication'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' } },
  { id: 'catch-cat', words: ['catch', 'cat'], contrast: ['ch', 't'], position: 'final', processes: ['deaffrication'], acceptedForDevelopment: true, approval: { by: 'Nick Lancaster', on: '2026-10-14' }, notes: 'catch is also said k eh ch, which breaks the pair.' },
]
