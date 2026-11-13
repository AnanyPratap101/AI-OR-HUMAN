# Documentation Cards

---

### `DOC-01` README & Quickstart
- **Overview:** "AI or Human?" is an offline browser game with three screens (Home, Game, Results) where players evaluate 8 short text snippets to identify whether they were written by a human, an AI, or if the text is ambiguous.
- **Repository Setup:**
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
- **Key Concepts:** Runs 100% in the browser with zero external APIs, zero backend servers, zero database calls, zero local disk storage, and zero tracking.

---

### `DOC-02` Five-Test Checklist (Plus Session History Verification)
All verifications must confirm the following test cases:
1. **Test 1 — Initial Load & Navigation:** Home page loads with hero title and rules. Clicking `Start Game →` transitions directly to Round 1 of 8 with three equal choice buttons (`Human`, `AI`, `Not enough evidence`).
2. **Test 2 — Calibrated Uncertainty on Ambiguous Cards:** On an ambiguous card (e.g. Round 2 "Sounds good, see you then."), clicking "Not enough evidence" awards +10 pts (**Calibrated Uncertainty**), while guessing Human or AI awards 0 pts (**Overconfident Guess**).
3. **Test 3 — Single-Click Locking:** Clicking any choice button immediately disables all three buttons, marks the chosen button with violet styling, dims the other two, and prevents subsequent clicks until the next round.
4. **Test 4 — Summary Scoring & Breakdown:** Upon completing Round 8, the Final Score screen displays the total score out of 80 pts, status counts (`Exact`, `Calibrated`, `Cautious`), earned rank title, scoring explanation box, and the full 8-round audit list.
5. **Test 5 — Clean Replay State Reset:** Clicking `Play Again (Clean Reset)` (or returning to Home) resets the session completely: Round 1, Score 0, streak 0, empty history array, and no leftover feedback or selected state.
6. **Test 6 — Session History Panel Persistence:** Finish two games, open the panel, and see Player 1 and Player 2 with correct scores; reload the page and confirm the panel is empty.

---

### `DOC-03` User Quickstart
- **Step 1:** Open the app and read the Home page overview of the three possible answers (🧑 Human, 🤖 AI, 🤔 Not enough evidence).
- **Step 2:** Click `Start Game →` to begin Round 1.
- **Step 3:** For each snippet, evaluate the writing style:
  - Select **Human** if you notice personal shortcuts, typos, or authentic casual phrasing.
  - Select **AI** if you notice marketing buzzwords, flawless corporate templates, or dramatic poetry.
  - Select **Not enough evidence** if the text is too brief or generic to tell.
- **Step 4:** Review the feedback cue after each round, then click `Next Snippet →`.
- **Step 5:** On Round 8, click `View Final Score Summary →` to see your calibrated detective rank!
- **Step 6:** Click the three-dot button (`⋮`) in the top right at any time to inspect previous player playthroughs or compare high scores.

---

### `DOC-04` Data & Privacy Note
- **Zero Data Collection:** The application collects no telemetry, cookies, analytics, or user identifiers.
- **Client-Side & Memory-Only Isolation:** All user selections, session history, and "Player N" logs exist strictly within ephemeral React component memory and never touch disk (`localStorage`, `sessionStorage`, `IndexedDB`, or cookies). They never leave the browser and are erased the moment the tab is closed or reloaded.
- **Fictional Content:** All 8 snippets in `samples.js` are entirely fictional. They do not reference real people, emails, phone numbers, or private personal data.
- **Ethical Disclaimer:** Persistent disclaimer notices explicitly state that short-text heuristics must never be used as definitive proof to judge academic submissions, job applications, or online posts.

---

### `DOC-05` Handoff & Limitations
- **Dataset Size:** 8 fixed snippets in `samples.js` to ensure deterministic, testable gameplay.
- **Heuristic Boundaries:** Text labels and explanations represent the author's editorial choices and linguistic heuristics rather than definitive ground truth.
- **No Client-Side Routing:** The app uses local React `screen` state rather than a router; browser back/forward buttons do not switch quiz screens.
- **Ephemeral State:** No persistence via `localStorage`; page reloads reset the game and clear session history.

---

### `DOC-06` 60-Second Judge Runbook
1. **Launch:** Run `cd frontend && npm run dev` and open `http://localhost:5173`.
2. **Home Page Check:** Confirm hero title, 3 feature tiles, rules string, disclaimer box, and top-right three-dot button (`⋮`) appear.
3. **Round 1 (AI):** Click `Start Game →`. On Snippet #1, click `AI`. Confirm emerald feedback box (+10 pts Exact Match) and Score updates to 10.
4. **Round 2 (Ambiguous):** Click `Next Snippet →`. On Snippet #2, click `Not enough evidence`. Confirm emerald feedback box (+10 pts Calibrated Uncertainty), Score updates to 20, and `🔥 Streak: 2` appears.
5. **Fast-forward to End:** Click through remaining rounds to Round 8.
6. **Summary & Session History Check:** On Round 8, click `View Final Score Summary →`. Open the three-dot button (`⋮`) in the top-right corner to see "Player 1" logged with timestamp, score, and stat pills.
7. **Clean Replay:** Click `Play Again (Clean Reset)`. Verify Round 1 opens with Score 0 and streak absent, while the panel badge still indicates 1 completed game. Complete Game 2 to verify "Player 2" is logged above Player 1.
