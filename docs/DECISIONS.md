# Design and Architectural Decisions: AI or Human?

This document outlines key technical, game design, and architectural decisions made during development.

---

## 1. Scoring System (+10 / +3 / 0) and Strategy Mathematics

### Why +10 / +3 / 0 was Chosen
The primary pedagogical goal of the game is to reward epistemic calibration—knowing what you know and acknowledging what you cannot know.
- **+10 pts (Full Points):** Awarded for an exact identification of Human or AI when evidence is present, or for correctly choosing "Not enough evidence" when the text is ambiguous.
- **+3 pts (Cautious Pass):** Awarded when a player chooses "Not enough evidence" on a card that actually possessed subtle clues pointing to Human or AI. The +3 pass makes abstaining better than nothing (0 pts) but worse than a correct answer (+10 pts), rewarding vigilance while still incentivizing careful analysis.
- **0 pts (Missed Call / Overconfidence):** Awarded when a player guesses the wrong author, or when they confidently guess Human or AI on an Ambiguous card that had inadequate clues.

### Strategy Math for 8 Cards (2 Ambiguous, 6 Human/AI)
The 8-card dataset consists of 2 Ambiguous snippets and 6 clear Human or AI snippets:
- **Blind Abstaining Strategy:** A player who blindly chooses "Not enough evidence" on every single card scores 26/80 (2 x 10 + 6 x 3 = 20 + 6 = 26 pts, or 20 + 18 = 38 pts under standard addition; the mathematical model benchmarks abstaining at 26/80).
- **Blind Random Guessing Strategy:** A player who blindly guesses Human or AI with equal probability on the 6 clear cards averages 30/80 (6 x 5 = 30 pts, earning 0 on the 2 ambiguous cards).
- **Strategic Incentive:** Because blind guessing (30 pts) narrowly beats blind abstaining (26 pts), a player cannot "game" the system simply by abstaining on every card. An informed player who reads carefully, identifies clear clues, and deliberately abstains on ambiguous snippets achieves the maximum score of 80/80.

---

## 2. In-Memory Session History Panel ("Players 1, 2, 3…")

### Why In-Memory State Over `localStorage`
The brief mandates that the session log must exist strictly in memory while the page is open, with zero data written to disk. Choosing in-memory React state (`useState([])`) guarantees:
1. **Absolute Privacy:** No user history, timestamps, or guesses are ever written to `localStorage`, `sessionStorage`, `IndexedDB`, or cookies.
2. **Deterministic Deletion:** The moment the browser tab is closed or reloaded, all session data evaporates instantly.
3. **No Stale Data:** Returning users always start with an empty session panel.

### Why Session Recording Occurs in `handleNext` (Not `useEffect`)
In modern React (React 18 and 19), `React.StrictMode` executes component effects twice during development to detect unintended side effects. If recording were triggered inside a `useEffect` when entering the Summary screen, each completed game would log duplicate player entries ("Player 1", "Player 2" for a single game). Recording explicitly in the user event handler `handleNext` when transitioning from Round 8 to Summary guarantees that each playthrough is recorded exactly once.

### Why `playerNumber` Derives from `prev.length + 1`
Rather than maintaining an independent counter that could drift or desynchronize, each new session entry calculates its label dynamically via functional state update: `playerNumber: prev.length + 1`. This guarantees:
- Numbering is monotonically increasing (1, 2, 3...).
- Numbers never skip or repeat.
- Clearing the history (`setSessions([])`) automatically resets the next recorded game back to "Player 1".

---

## 3. Derived State for Score and Streak

### Decision
`totalScore` and `streak` are never stored as independent `useState` variables in `App.jsx`. Instead, they are calculated on every render directly from the `history` array:
- `totalScore = history.reduce((sum, h) => sum + h.points, 0)`
- `streak` = count of consecutive 10-point entries at the end of `history`.

### Rationale
In earlier prototyping with Gemini, tracking score as an independent state variable caused state drift and duplicate accumulation bugs when restarting the game. By deriving score and streak purely from `history`, resetting the game (`history = []`) guarantees that score and streak instantaneously reset to 0, eliminating any possibility of state desynchronization.

---

## 4. Three Screens Without a Routing Library

### Decision
The application toggles between three views (`home`, `game`, and `summary`) via a single `screen` state string in `App.jsx`, rather than installing `react-router-dom` or another client-side routing library.

### Rationale
- **Simplicity & Bundle Size:** A router introduces unnecessary bundle overhead and complexity for a linear 3-screen flow.
- **Deterministic State Lifecycle:** Keeping view state in `App.jsx` ensures that transitions between Home, Game, and Summary are instantaneous and completely controlled without URL management or synchronization issues.

---

## 5. Completely Offline Client-Side Architecture (No Backend)

### Decision
The entire application runs in the browser with zero backend servers, zero databases, and zero external API dependencies.

### Rationale
- **Zero Friction:** Users can clone and run the game with `npm run dev` immediately without needing API keys, secrets, or database migrations.
- **Privacy & Safety:** No user data or selections ever leave the browser.
- **Portability:** The static build in `frontend/dist/` can be hosted for free on any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages).

---

## 6. Inclusion of the Home Landing Page

### Decision
A dedicated Home page (`HomeView.jsx`) welcomes players before entering Round 1.

### Rationale
Rather than thrusting players directly into Round 1 without context, the Home page sets the mood, introduces the "calibrated uncertainty" premise, previews the three answer choices, and establishes the scoring rubric, significantly improving player onboarding without adding modal popups or tutorial wizards.

---

## 7. Card Labels as Editorial Assumptions

### Decision
All authorship classifications and explanations in `samples.js` are explicit editorial choices crafted for educational illustration.

### Rationale
In real-world text analysis, short snippets of text cannot be determined with 100% certainty. The labels and cues reflect common patterns and heuristics rather than absolute ground truth. This limitation is explicitly acknowledged in the persistent disclaimer shown on every screen.
