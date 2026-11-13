# Guidelines for AI Coding Agents

When working on this repository, all AI coding assistants must strictly adhere to the following rules:

1. **No External APIs or Network Calls:**
   - The game is 100% offline and browser-native.
   - Never add API routes, fetch/axios requests, databases, backend servers, analytics, CDN fonts, or external scripts.

2. **No Environment Variables or Secrets:**
   - Do not create `.env`, `.env.local`, or any environment configuration files.
   - Do not introduce secret keys, tokens, or credentials.

3. **No Additional Dependencies:**
   - Keep dependencies strictly limited to React, Vite, `@vitejs/plugin-react`, Tailwind CSS v4, and `@tailwindcss/vite`.
   - Do not install client-side routers, animation libraries, state managers, or icon packs (use native CSS animations and unicode emoji).

4. **Never Edit `samples.js`:**
   - Do not add, modify, reorder, or remove any card in `frontend/src/data/samples.js`.
   - Never hardcode the number 8 or 80 in logic; always derive sample length dynamically using `SAMPLES.length` and `SAMPLES.length * 10`.

5. **Ensure Clean Replay State:**
   - When restarting or replaying the game, reset all state variables cleanly (`currentIndex = 0`, `selectedChoice = null`, `roundResult = null`, `history = []`).
   - No past session data, feedback, or selections may leak into subsequent playthroughs.

6. **Compute Score and Streak as Derived Values:**
   - Never create dedicated `score` or `streak` `useState` hooks.
   - Always derive `totalScore` via `history.reduce((sum, h) => sum + h.points, 0)` and streak by counting consecutive 10-point rounds from the end of `history`.

7. **Maintain Three Equal Buttons:**
   - The three answer choice buttons (`Human`, `AI`, `Not enough evidence`) must maintain identical width and height across mobile and desktop.
   - Use `grid grid-cols-1 sm:grid-cols-3 gap-3` with `w-full min-h-[3.5rem] px-3 py-2 text-sm font-medium rounded-lg border text-center`. Allow long labels to wrap without changing button dimensions.

8. **Verify Production Build:**
   - Always run `npm run build` inside `frontend/` before completing any task and verify zero errors or warnings.
