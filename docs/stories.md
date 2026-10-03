# Adding practice stories

Stories are defined in `src/data/stories.ts`. The library groups them by `soundId`, using the sound IDs from `src/data/speeches.ts` (`r`, `s`, `l`, `th`, `sh`, `ch`). Story availability is independent of game availability, so a story can be added before a sound has game word lists.

Each story needs a unique `id`, `title`, `soundId`, `targetLetters`, `description`, `emoji`, and at least one page. Each page contains `text`, `practiceWords`, and an `emoji`. Keep pages short for beginning readers. The reader highlights the exact `targetLetters` spelling, ignoring case, and displays the page’s practice words separately. Highlighting letters does not identify phonetic sounds automatically; review the practice words for the intended sound.

The current R story is original sample content. Add Mrs. Jana’s supplied story as its own entry when the files arrive. Preserve its wording and page order, and confirm its intended letters/sounds before assigning `soundId` and practice words. The reader currently supports text and emoji illustrations; supplied artwork or audio will need to be integrated separately.

To expand games for a sound, add categories and word lists in `src/data/speeches.ts`, then remove `comingSoon` for that sound. All three games use those shared lists.
