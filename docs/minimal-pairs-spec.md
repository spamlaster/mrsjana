# Minimal Pairs Therapy Center: specification

Approved architecture for word-level minimal pairs therapy under `#/phonological`. Read this before changing anything in `src/minimal-pairs/`. Decisions marked **Approved** came from the project owner and should not be revisited without asking.

Status: built and awaiting Jana's review. 103 curated pairs (182 words) are **accepted for development** and playable in preview mode; none is clinically approved, no transcription is checked, and no recording exists yet. All seven activities, the center navigation, the shared scoring engine, and the review status page are implemented. The review package for Jana is `docs/minimal-pairs-final-review.md`.

## Purpose

Adult-led practice of one minimal pair at a time, with high repetition (10 or 20 trials), for five phonological processes:

- Fronting
- Backing
- Stopping
- Cluster Reduction (initial s-blends only)
- Deaffrication

## Clinical rules

These are requirements, not preferences.

1. **Only approved real words.** Pairs come from the therapist-curated library. Code must never generate, derive, or suggest words or pairs, including nonsense words. Agents must not add pairs either; new pairs come from the project owner.
2. **Child-appropriate vocabulary.** Familiar, picturable words only: nothing violent, frightening, slang, or obscure. Every word needs a picture that identifies it without its printed text.
3. **No speech recognition.** The child's productions are only ever scored by an adult tapping a button. Do not use browser speech recognition, pronunciation assessment, or the `VITE_SPEECH_ASSESSMENT_ENDPOINT` path from `docs/speech-practice.md`.
4. **Listening Discrimination is optional.** It is listed first but never gates anything. Every production game is reachable directly, with no unlocks or prerequisites.
5. **Reviewed audio only for listening.** Listening Discrimination is offered for a pair only when both words' recordings are marked reviewed.
6. **Content is separate from mechanics.** Games never see process names, sounds, positions, or the word library.

## Approved decisions

| # | Decision |
|---|---|
| 1 | Code lives in the feature folder `src/minimal-pairs/`. |
| 2 | The curated draft of pairs for all five processes is supplied by the project owner. Do not generate additional pairs. |
| 3 | **Cued** is its own result, kept separate from independent Correct and Incorrect in counts and in reporting. |
| 4 | Trials are balanced 50/50 between target and contrast words, with 10 or 20 trials per session. |
| 5 | Audio uses the existing OpenAI TTS setup (same model, voice, and key) through its own command, `npm run voice:minimal-pairs`. Every recording must be reviewed by Jana before it is used for Listening Discrimination. See `docs/minimal-pairs-audio.md`. |
| 6 | Listening Discrimination is listed first but optional. No production game requires it. |
| 7 | /ch/ → /t/ belongs **only** to Deaffrication, never to Stopping. |
| 8 | Keep the existing privacy approach: no student profiles, no persistent student records, nothing about a child in localStorage or sent to a server. `studentTracking` stays `false`. |
| 9 | Every production game uses the same shared trial and scoring engine. |
| 10 | Fronting and Backing use only /k/ ↔ /t/ and /g/ ↔ /d/. No /ng/ ↔ /n/. |
| 11 | Deaffrication is only /ch/ → /t/, initial and final. No /ch/ → /sh/ and no /j/. |
| 12 | The allowed s-blends are exactly `st`, `sn`, `sm`, `sw`, `sk`, `sl`. No `sp`. |
| 13 | Initial and final positions only. Cluster Reduction is initial only. Medial is not supported. |
| 14 | Clinical approval is never assigned automatically. The project owner supplies the curated list, and Jana makes every approval decision. |
| 15 | ARPAbet transcriptions may be prepared for review, but a person must check them (`phonemesReviewed`) before a pair can be approved. |
| 16 | Clinical validation and asset readiness are separate. Missing pictures or audio are reported, never a phonological validation failure. |
| 17 | Audio generation runs only with explicit approval of each run (it is a paid API). New or regenerated recordings are always unreviewed, and audio is never marked reviewed automatically: only `--mark-reviewed`, once Jana has approved it (individually or as a whole set). |

## Folder structure

```
src/minimal-pairs/
  content/                    therapy content only, no React
    types.ts                  content types
    processes.ts              phoneme inventory, approved s-blends, the five processes and their rules
    lexicon.ts                curated words
    pairs.ts                  curated pairs (references lexicon ids)
    selectors.ts              rolesFor, pairsFor, soundsFor, positionsFor, playableProcesses, isUsable, pairStatus
    validate.ts               validateLibrary(): structural and clinical checks
    readiness.ts              assetReadiness(), pairListeningReady(): missing pictures and audio, reported separately
    picture-audit.ts          existing pictures rejected for this library, and pictures to double-check
    labels.ts                 display text for sounds, positions, statuses, and processes
    audio.ts                  audioFile, isAudioReviewed, hasRecording, canPlayRecording
    illustrations.ts          illustrationFile, hasIllustration, pictureSource: custom PNGs first
    illustration-records.ts   written by scripts/minimal-pairs-images.mjs: each linked PNG's hash and size
    audio-records.ts          recording hashes, provenance, and reviews; written only by the audio script
  preview.ts                  previewMode: on in `npm run dev` or with VITE_MINIMAL_PAIRS_PREVIEW=true
  route.ts                    parseCenterRoute, centerPath: #/phonological routes, validated against content
  playback.ts                 playWordRecording(): recordings only, never browser text-to-speech
  session/                    scoring engines, no React
    trialSession.ts           pure reducer: build trials, mark, undo, restart, summarize
    listeningSession.ts       pure reducer for Listening Discrimination (automatic, receptive)
    result.ts                 SessionResult (travels in history.state) and the copyable summary text
  activities/                 game mechanics only; never imports content/
    catalog.ts                activity ids, names, and descriptions (no React); Listening first
    types.ts                  ActivityWord, ActivityProps
    registry.tsx              production game components by id
    ListeningDiscrimination.tsx
    SayTheWord.tsx
    BubblePop.tsx
    FeedTheMonster.tsx
    SpinAndSay.tsx
    TreasureReveal.tsx
    SoundTrain.tsx
    activities.css
  components/
    CenterPickers.tsx         process, sound, position, pair, activity
    TurnsOption.tsx           20 trials by default, or 10
    PlaySession.tsx           shell for every production game: trials, prompt, scoring bar
    ListeningSession.tsx      shell for Listening Discrimination
    TrialPrompt.tsx           picture, word, and listen button for the current trial
    AdultScoringBar.tsx       Correct / Incorrect / Cued / Undo, with keyboard shortcuts
    SessionSummary.tsx        results, copy summary, next steps
    ReviewStatus.tsx          grown-up review status page (preview only)
    PairPicture.tsx           custom illustration, WordPicture, emoji, or placeholder
    activityWords.tsx         lexicon word → ActivityWord
    center.css
  MinimalPairsCenter.tsx      chooses the screen from the route
scripts/minimal-pairs.test.mjs           content, preview vs approval, picture audit, readiness
scripts/minimal-pairs-session.test.mjs   trial engine, listening session, summaries
scripts/minimal-pairs-ui.test.mjs        server-renders every screen and game
scripts/minimal-pairs-images.test.mjs    illustration naming, PNG checks, records, priority
scripts/minimal-pairs-audio.test.mjs     audio planning and review tracking (fetch stubbed)
scripts/lib/load-ts.mjs                  test helper: imports app TypeScript/TSX in Node
```

Files in `content/` and `session/` must not import React or anything from `activities/`. Files in `activities/` must not import from `content/`.

## Data model

Defined in `src/minimal-pairs/content/types.ts`.

```ts
type ProcessId = 'fronting' | 'backing' | 'stopping' | 'cluster-reduction' | 'deaffrication'
type Position = 'initial' | 'final'  // medial is not supported

// One rule means "the child says `error` in place of `target`". Sounds are phoneme sequences so s-blends fit.
interface ProcessRule { target: string[]; error: string[]; positions: Position[] }

interface PhonologicalProcess { id: ProcessId; name: string; rules: ProcessRule[]; grownUpNote: string }

interface LexiconWord {
  id: string            // unique; homographs get distinct ids
  text: string          // lowercase
  phonemes: string[]    // lowercase ARPAbet; only used to validate the curated list, never to generate words
  phonemesReviewed: boolean  // a person has checked the transcription; required before approval
  imageAlt: string
  picture?: string      // key into the WordPicture SVG/emoji maps, only if it identifies the word (picture-audit.ts)
  emoji?: string        // a standard emoji that identifies the word, when WordPicture has no accurate picture
  pictureRequirement?: string  // what an illustration must or must not show, e.g. 'never a person'
  audio?: string        // only to reuse an articulation recording, e.g. 'words/sun.mp3'; default minimal-pairs/<id>.mp3
  pronunciationHint?: string  // required before generating a word with more than one pronunciation or meaning
}

interface MinimalPair {
  id: string
  words: [string, string]       // lexicon ids, unordered
  contrast: [string, string]    // sound ids, unordered, e.g. ['k', 't'] or ['sn', 'n']
  position: Position
  processes: ProcessId[]        // every process the pair serves, e.g. ['fronting', 'backing']
  approval?: { by: string; on: string }  // Jana's sign-off, YYYY-MM-DD; added by hand only
  acceptedForDevelopment?: boolean       // usable in preview mode only; never clinical approval
  notes?: string
}

type PairStatus = 'approved' | 'accepted-for-development' | 'draft'
```

**Phonemes** use lowercase ARPAbet (`k`, `th`, `sh`, `ch`, `jh`, `ng`, `iy`, `ow`, ...). The inventory is in `processes.ts`; unknown symbols fail validation. A **sound id** is the rule target joined without separators: `k`, `th`, `sn`.

### Process rules

Defined in `src/minimal-pairs/content/processes.ts`.

| Process | Rules (target → error) | Positions |
|---|---|---|
| Fronting | /k/ → /t/, /g/ → /d/ | initial, final |
| Backing | /t/ → /k/, /d/ → /g/ (Fronting reversed, derived in code) | initial, final |
| Stopping | /f/ → /p/, /s/ → /t/, /sh/ → /t/, /th/ → /t/, /th/ → /p/ | initial, final |
| Cluster Reduction | /st/ → /t/, /sn/ → /n/, /sm/ → /m/, /sw/ → /w/, /sk/ → /k/, /sl/ → /l/ | initial only |
| Deaffrication | /ch/ → /t/ | initial, final |

- /ch/ → /t/ is Deaffrication only. Validation rejects any affricate rule under Stopping.
- The approved s-blends are listed in `approvedSBlends`. Validation rejects any other blend.
- A contrast in the middle of a word matches no position, so medial pairs fail validation.

### Shared pairs and role reversal

A pair does not store which word is the target. `rolesFor(pair, process, sound)` finds the process rule for that sound that turns one word into the other at the pair's position and returns `{ target, contrast }`. One record therefore serves both Fronting and Backing:

- Fronting, sound `k`: the /k/ word is the target, the /t/ word the contrast.
- Backing, sound `t`: the /t/ word is the target, the /k/ word the contrast.

A pair must list every process its contrast fits, so a /k/–/t/ pair lists both `fronting` and `backing`.

### Selectors

In `src/minimal-pairs/content/selectors.ts`. Each takes an optional library argument (default: the real library) so tests can pass fixtures.

- `pairsFor(process, sound, position, lib, preview)`: usable pairs only. Activities must get pairs from here.
- `soundsFor`, `positionsFor`, `playableProcesses`, `pairsForProcess`: only choices that lead to at least one usable pair. All take `preview` last, default `false`.
- `rolesFor(pair, process, sound)`: target and contrast words. Ignores approval.
- `isPlayable(pair)`: clinically approved, with a named approver and a date. Validation also requires both words' transcriptions to be checked before a pair is approved.
- `isUsable(pair, preview)`: approved, or accepted for development while `preview` is true. Drafts are never usable.
- `pairStatus(pair)`: `approved`, `accepted-for-development`, or `draft`.
- `errorSoundsFor(process, sound)`: e.g. Stopping /th/ → `['t', 'p']`.

### Preview mode and clinical approval

Two separate states, never merged:

- **Accepted for development** (`acceptedForDevelopment: true`): the project owner chose the pair as working content, so the activities can be built and tried. All 103 curated pairs have it.
- **Clinically approved** (`approval`): Jana's sign-off, added by hand with her name and the date of her decision, only after she approves it. No pair has it yet.

`previewMode` (`src/minimal-pairs/preview.ts`) is true in `npm run dev`, or in a build made with `VITE_MINIMAL_PAIRS_PREVIEW=true`. A normal `npm run build` never enables it. In preview mode, accepted pairs are offered alongside approved ones and the center is labeled throughout: a banner on every setup screen, a status badge on each pair, a chip on the play screen, and a line in the session summary and copied text. The review status page (`#/phonological/review`) exists only in preview mode. Outside preview mode only approved pairs exist as far as the center is concerned; with none approved, every process shows "Coming soon" and deep links fall back to the process list. As of 2026-10-14 every pair is marked approved (and every transcription checked) for manual testing.

## Trial and scoring engine

`session/trialSession.ts` is a pure reducer, tested in Node like `src/games/keyHouseState.ts`.

```ts
type Mark = 'correct' | 'incorrect' | 'cued'
interface Trial { index: number; wordId: string; role: 'target' | 'contrast'; mark?: Mark }
type SessionAction = { type: 'mark'; mark: Mark } | { type: 'undo' } | { type: 'restart'; trials: Trial[] }

interface RoleSummary { correct: number; incorrect: number; cued: number; total: number }
interface SessionSummary { target: RoleSummary; contrast: RoleSummary }
```

- **Trial order** is built once at session start: exactly half target and half contrast, shuffled, with no more than three of the same word in a row.
- **Mark** scores the current trial and advances to the next.
- **Undo** clears the most recent mark and steps back one trial. It can be repeated back to the first trial.
- **Summary** reports target and contrast separately. Cued is counted on its own and is never folded into correct or incorrect.
- The adult scoring bar is the only thing that dispatches `mark` and `undo`. It also supports keyboard shortcuts for teletherapy (1 Correct, 2 Incorrect, 3 Cued, Backspace Undo) and sits in a visually distinct adult area.

## Activity contract

Every production game receives only:

```ts
interface ActivityWord { id: string; text: string; picture: ReactNode; canListen: boolean }

interface ActivityProps {
  total: number                         // 10 or 20
  completed: number                     // trials marked so far
  current: { word: ActivityWord } | null
  done: ActivityWord[]                  // words of the scored trials, in order
  words: ActivityWord[]                 // both words, in an order that says nothing about roles
  markId: number                        // changes on every mark, undo, or restart; use it to trigger animation
  lastAction: 'start' | 'mark' | 'undo'
  revealed: boolean                     // Spin & Say: the word is hidden until the spinner lands
  onReveal: () => void
}
```

Games get an `ActivityWord` (text and a rendered picture) rather than a `LexiconWord`, so `activities/` never imports `content/`.

- Games do not score, keep their own progress counters, or know which word is the target.
- Game visuals are derived from `completed`, so Undo rewinds every game without game-specific code.
- The shell renders `TrialPrompt` and `AdultScoringBar` around the game.
- Games advance their reward on every mark, so the child is never penalized by the game. Feedback on accuracy comes from the adult.
- A game may give the child something to do (pop the bubble, feed the monster, spin the wheel), but that is local to the current mark and never scores or advances.
- When every trial is scored the shell shows "All done" with See how it went, Play again, and a still-working Undo.

Production games: Say the Word, Bubble Pop, Feed the Monster, Spin & Say, Treasure Reveal, Sound Train.

### Listening Discrimination

A separate activity with its own small reducer. It plays one word of the pair and the child taps one of the two pictures. Because this is receptive, the tap can be scored automatically. Its results are reported separately from production accuracy and never affect it. It appears only when both words have a picture and a reviewed recording (`pairListeningReady()`), in every mode, including preview. Each word plays by itself (at the start, and after each right answer); the pictures unlock only after it has played, and a Hear it again button replays it. A wrong picture shakes, a voice says "Oops, try again!", and the word plays again; the child stays on that word until they tap the right picture. Only the first tap on each word is scored.

## Routing

Hash routes nested under the existing `#/phonological` page, validated against the content data the same way `parseRoute` validates the articulation routes. Invalid segments fall back to the nearest valid parent screen.

```
#/phonological                                        choose a process
#/phonological/review                                 review status (preview mode only)
#/phonological/fronting                               choose a target sound
#/phonological/fronting/k                             choose beginning or end of word
#/phonological/fronting/k/initial                     choose a pair
#/phonological/fronting/k/initial/key-tea             choose an activity
#/phonological/fronting/k/initial/key-tea/bubble-pop  play 20 turns
#/phonological/fronting/k/initial/key-tea/bubble-pop?trials=10
#/phonological/fronting/k/initial/key-tea/bubble-pop/complete
```

Games default to 20 turns. Before the first turn, a "Fewer turns: 5 of each word" checkbox above the game ("Fewer bubbles" in Bubble Pop) switches to `?trials=10` and starts a fresh session. `trials` accepts only `10` or `20`; any other value plays 20. A sound with only one position (every s-blend) links straight to its pairs. The session summary travels in `history.state`, like existing game results, and is lost on refresh by design. A "copy summary" button can let the adult take notes without the app storing anything.

## Audio and pictures

- Recordings and their review workflow are documented in `docs/minimal-pairs-audio.md`.
- `scripts/minimal-pairs-audio.mjs` reads `lexicon.ts` and makes one recording per word, `public/audio/minimal-pairs/<word id>.mp3`, with the articulation recordings' model and voice. It never writes `public/audio/words/`.
- Review state lives in `content/audio-records.ts`, tied to each file's SHA-256 hash, so replacing a file clears its review. Only `--mark-reviewed --by=<name>` (a list of ids, or `all`) marks a recording reviewed, once Jana has approved it; an agent runs it only when the project owner asks.
- Inside the center, play recordings with `playWordRecording()` from `src/minimal-pairs/playback.ts`. It never falls back to browser text-to-speech; it resolves `false` and the word is shown without audio.
- Custom illustrations and how to add them are documented in `docs/minimal-pairs-images.md`: `public/images/minimal-pairs/<word id>.png`, square PNG, 512 px recommended, linked by `npm run images:minimal-pairs` into `content/illustration-records.ts`. Only a recorded file is used, never one assumed from its name; the test suite fails if a PNG in the folder has no record or a record no longer matches its file.
- Pictures come from `PairPicture`: a recorded custom illustration, else a linked `WordPicture` entry, else the word's standard `emoji`, else a placeholder (dashed frame, crayon, "Picture coming soon"). A `WordPicture` entry is linked only if a child would name it with the target word; rejected ones are listed with reasons in `picture-audit.ts`, and the test fails if one is linked again. `pictureRequirement` records constraints every illustration must meet.
- Production games play reviewed recordings only; preview mode also plays unreviewed ones so they can be checked, and the scoring bar says when a word has no recording.
- `assetReadiness()` in `content/readiness.ts` lists, per pair and word, `no-picture`, `no-audio`, or `audio-not-reviewed`, for approved and unapproved pairs alike. `npm run test:minimal-pairs` prints this report but does not fail on it. `listeningReady()` is true only when a pair has no outstanding items.
- Production games work with missing assets: placeholders for pictures, no listen button for missing recordings. Only Listening Discrimination waits for assets.

## Validation

Run `npm run test:minimal-pairs`. It runs `scripts/minimal-pairs-session.test.mjs` (trial balance, randomization, scoring, undo, summaries, listening), `scripts/minimal-pairs-ui.test.mjs` (server-renders every screen and game in preview and production mode), `scripts/minimal-pairs-audio.test.mjs` (audio planning, review tracking, and the command end to end with `fetch` stubbed; it never calls OpenAI) and `scripts/minimal-pairs.test.mjs`, which runs `validateLibrary()` on the real library and checks that:

1. word and pair ids are unique, and no two pairs use the same two words;
2. every pair references two existing, different lexicon words with known phonemes;
3. the two words differ only by the declared contrast, at the declared initial or final position;
4. each declared process has a rule for that contrast and position, and every process the contrast fits is declared;
5. Fronting is exactly /k/→/t/ and /g/→/d/, Backing is exactly Fronting reversed, and roles reverse correctly;
6. Stopping has exactly its five approved rules and no affricate, and /ch/–/t/ pairs cannot be listed under Stopping;
7. Deaffrication is exactly /ch/ → /t/, initial and final;
8. Cluster Reduction uses only `st`, `sn`, `sm`, `sw`, `sk`, `sl`, initial only;
9. unapproved pairs never come back from the playable selectors, and an approved pair needs a name, a date, and checked transcriptions;
10. asset readiness detects missing pictures, missing or malformed audio, and unreviewed audio, and none of these fail clinical validation;
11. every reviewed record in `audio-records.ts` still matches its file's hash.

Missing assets in the real library are printed as a readiness report, not a failure.

The negative cases use test-only fixtures with placeholder words; they are not content. Passing validation is never approval: only Jana's decision adds `approval`.

`scripts/routing.test.mjs` covers every center route, fallbacks for invalid segments, production safety for unapproved pairs, and the summary in `history.state`.

## Implementation phases

1. **Content layer:** done. 103 pairs, 182 words, accepted for development.
2. **Session engine:** done.
3. **Center shell and navigation:** done, including the review status page.
4. **Production games:** done: Say the Word, Bubble Pop, Feed the Monster, Spin & Say, Treasure Reveal, Sound Train.
5. **Listening Discrimination:** done; unavailable until pictures and reviewed recordings exist.
6. **Assets:** picture audit and placeholders done. Audio generation needs an approved paid run; then Jana reviews recordings. The folder and linking for custom illustrations are ready; the illustrations themselves are still to do.
7. **Clinical review:** Jana's review using `docs/minimal-pairs-final-review.md`; approvals are then added by hand.
