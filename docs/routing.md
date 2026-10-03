# Navigation

The app uses hash routes so direct links and refreshes work on the existing static host without server rewrite rules.

- `#/`: Home
- `#/sounds`: Sound selection
- `#/sounds/r`: Category selection
- `#/sounds/r/r-initial`: Game selection
- `#/sounds/r/r-initial/memory-match`: Game
- `#/sounds/r/r-initial/memory-match/complete`: Results
- `#/stories?sound=r`: Story library filtered by sound
- `#/stories/rabbit-rainbow/1`: Story page (one-based page number)

Each navigation adds a history entry. Browser Back/Forward and the app’s Back buttons restore the previous route and its selections. Home remains a separate explicit destination. On a direct entry without in-app history, Back uses a sensible parent screen. Game results are stored in the history entry. Returning to a game restarts that game; unfinished game progress is not saved. Old game completion callbacks are ignored after route changes.

Run `npm run test:routing` to check route parsing, invalid route fallbacks, history navigation, story pages and filters, and results restoration. These checks use a simulated browser history; they do not replace a visual browser check.
