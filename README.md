# AI or Human?😄😄😄😄

An 8-round flashcard-style quiz that runs entirely in the browser, testing whether players can tell if short snippets were written by a human or an AI, while rewarding smart doubt on ambiguous text.

## Live Preview
`https://ai-or-human-eight.vercel.app/`

## Working Features
- **Home Landing Page:** An engaging introduction featuring hero typography, floating snippet cards, interactive tiles explaining each choice, rules overview, and a direct `Start Game →` button.
- **Three-Screen Architecture (No Router):** Seamless screen transitions between `home`, `game`, and `summary` using lightweight React state with zero external routing dependencies.
- **Calibrated Uncertainty Twist ("Not enough evidence"):** Knowing when you cannot tell is rewarded. On deliberately ambiguous cards, choosing "Not enough evidence" earns full points (+10), while confident Human or AI guesses earn 0.
- **Three Equal Buttons:** Every round features three choice buttons (`Human`, `AI`, `Not enough evidence`) rendered with identical height and width across desktop and mobile, ensuring balanced layout without visual bias.
- **Smooth Animated Progress Bar:** Accessible progress indicator tracking completed rounds out of 8 with smooth width transitions and full ARIA progressbar attributes.
- **Streak Counter:** A dynamic `🔥 Streak: {streak}` badge that appears whenever a player achieves 2 or more consecutive 10-point rounds.
- **Instant Locked Feedback:** Buttons lock immediately upon selection to prevent double clicks; animated feedback boxes display color-coded banners (emerald for 10 pts, amber for 3 pts, rose for 0 pts), real answer, detail rationale, and stylistic cues.
- **Session History Side Panel ("Players 1, 2, 3…"):** A fixed top-right three-dot button (`⋮`) opens an in-memory session history drawer listing all completed games as "Player 1", "Player 2", etc., with timestamps, categorical stat counts (`Exact`, `Calibrated`, `Cautious`, `Missed`), round-by-round expandable audits, best score highlight, and a "Clear all" button.
- **Animated Summary with Dynamic Rank Title:** Counts up score from 0 to total over ~800ms (respects `prefers-reduced-motion`) and awards calibrated rank titles:
  - 90%+ (72–80 pts): **Calibration Master**
  - 70%–89% (56–71 pts): **Sharp Detective**
  - 40%–69% (32–55 pts): **Curious Investigator**
  - Below 40% (<32 pts): **Rookie Reader**
- **Categorical Stat Tiles:** Instant breakdown of player decisions into `Exact`, `Calibrated`, and `Cautious` counts.
- **Complete Round-by-Round Audit:** Review all 8 rounds showing snippet text, your pick, real answer, and color-coded points earned.
- **Clean Replay:** Clicking `Play Again (Clean Reset)` or starting from Home performs a complete game state wipe (Round 1, Score 0, empty history, no streak), while preserving the in-memory session history panel.
- **Persistent Disclaimer:** Ethical authorship disclaimer displayed on all three screens (Home, Game, and Summary).
- **100% Offline & Private:** Operates entirely locally with zero external APIs, zero backend servers, zero database calls, zero browser disk storage, and zero tracking.

## How to Run Locally
No secret keys, environment variables, or configuration files are needed.

```bash
cd frontend
npm install
npm run dev
```

To build for production:
```bash
npm run build
```

## 3-Step Demo Walkthrough
1. **Start from Home:** On the landing page, review the three answer tiles and click `Start Game →` to enter Round 1.
2. **Play Round 1 & 2:**
   - Round 1: Read the snippet and submit your choice to view the instant feedback banner. Click `Next Snippet →`.
   - Round 2: Read the short snippet and evaluate whether there is enough evidence to make a call. Notice the streak pill appear on consecutive 10-point calls.
3. **Finish & Inspect History:** Complete all 8 rounds. On the Summary screen, click the three-dot button (`⋮`) in the top-right corner to open the Session History panel and see "Player 1". Click `Play Again (Clean Reset)` to start a second playthrough, complete it, and verify that "Player 2" is recorded without data loss or score inflation.

## Known Limitations
- **Memory-Only Session Log:** History lives in memory only and disappears when the page is closed or reloaded. "Player N" labels are per finished game on this page, not real accounts.
- **Fixed 8-Card Dataset:** The game contains 8 curated fictional snippets in `samples.js` to ensure deterministic offline evaluation.
- **Author Assumptions:** Labels represent the author's editorial choices and linguistic heuristics rather than definitive ground truth.
- **In-Memory State Only:** Game state is held in React memory without `localStorage` or `sessionStorage` persistence, resetting upon browser page refresh.
- **No Browser History Navigation:** Because the app intentionally uses a simple screen state switcher rather than a client-side router, the browser Back button does not navigate between screens.

## Engineering Notes
Gemini was used to plan the architecture and component structure. During early planning, storing score and streak as independent state variables introduced potential desynchronization bugs during replay resets. Computing `totalScore` and `streak` as pure derived values directly from the `history` array guaranteed perfect state consistency on every replay. Recording completed playthroughs into `sessions` directly inside `handleNext` guarantees that React StrictMode development cycles never produce duplicate session records.
