# Product Requirements Document (PRD): AI or Human?

## 1. Problem Statement
With the widespread adoption of generative AI tools, distinguishing between AI-generated text and human-authored prose has become a common topic of debate. Many users assume that automated or intuitive heuristics can reliably identify machine writing. In reality, short pieces of everyday writing (chat messages, calendar entries, quick updates) frequently share identical patterns regardless of author.

"AI or Human?" addresses this misconception through an engaging, educational browser game. Instead of promoting false overconfidence in authorship detection, the game actively trains epistemic humility and rewards "calibrated uncertainty"—the ability to recognize when evidence is insufficient to make a definitive call.

## 2. Target Player
- **Casual Web Users:** Curious individuals interested in AI culture and linguistic nuances.
- **Students and Educators:** Learners exploring how generative models write compared to humans and why short text cannot be judged definitively.
- **Product Managers & Developers:** Anyone seeking an intuitive demonstration of calibrated scoring and uncertainty principles.

## 3. Goals and Non-Goals

### Goals
- **Offline & Zero Setup:** The entire app runs locally in the browser with zero external network requests, zero backend infrastructure, and zero authentication.
- **Three-Screen Flow:** Seamless transition between Home, Game, and Summary screens using pure React state.
- **Calibrated Uncertainty:** Full points (+10) awarded for recognizing ambiguity; zero points for overconfident guessing on text with inadequate clues.
- **Tactile, Polished Interface:** Dark gradient visual theme with glowing accents, smooth micro-interactions, responsive equal-sized buttons, accessible progress indicators, and instant locked feedback.
- **Robust Clean Replay:** Deterministic reset mechanism ensuring no state leakage across playthroughs.

### Non-Goals
- **No Real-Time AI Generation:** Cards are fixed and curated to ensure deterministic evaluation without API latency, cost, or drift.
- **No Persistent User Accounts or Leaderboards:** No backend database or local storage tracking.
- **No Definitive Forensics Tool:** The game does not claim to be a forensic text detector; it is an educational game demonstrating the limits of short-text classification.

## 4. Core Game Loop Across Three Screens

```
[ Home Screen ]
  │
  │  Click "Start Game →"
  ▼
[ Game Screen (Rounds 1–8) ] ◄────────┐
  │                                   │
  │  1. Read Snippet Card             │ Next Snippet (Rounds 1–7)
  │  2. Choose: Human / AI / Ambiguous│
  │  3. Immediate Locked Feedback     │
  │                                   │
  └───────────────────────────────────┘
  │
  │  Click "View Final Score Summary →" (Round 8)
  ▼
[ Summary Screen ]
  │
  ├── Animated Score Count-up (0 -> total / 80 pts)
  ├── Rank Title (Calibration Master, Sharp Detective, etc.)
  ├── Status Tile Breakdown (Exact, Calibrated, Cautious)
  ├── Explanation of Uncertainty Scoring Rubric
  ├── Complete 8-Round Audit Trail
  │
  ├── "Play Again (Clean Reset)" ──► Resets to Game Screen (Round 1)
  └── "Back to Home" ─────────────► Resets to Home Screen
```

### Screen Details
1. **Home Screen (`home`):**
   - Welcomes player with hero title and tagline.
   - Showcases floating sample snippet badges.
   - Explains the three options (🧑 Human, 🤖 AI, 🤔 Not enough evidence) via interactive feature tiles.
   - States scoring rules (+10, +3, 0) and snippet count dynamically.
   - Provides primary `Start Game →` button.
   - Displays required ethical disclaimer.

2. **Game Screen (`game`):**
   - Displays header with Score pill, Round indicator ("Round X of 8"), and streak badge (`🔥 Streak: X` when streak ≥ 2).
   - Shows animated progress bar with ARIA attributes.
   - Renders current snippet card (category tag, ID, and text).
   - Renders three choice buttons of equal dimensions.
   - Upon clicking, locks all buttons, highlights selected choice, and reveals animated feedback box (badge, real answer, rationale, linguistic cue, and next button).
   - Displays required ethical disclaimer.

3. **Summary Screen (`summary`):**
   - Displays final score with animated count-up (0 to final score / 80 pts).
   - Displays earned rank title and personalized feedback message based on performance threshold.
   - Shows category breakdown tiles (`Exact`, `Calibrated`, `Cautious`).
   - Outlines rubric rationale in "How Uncertainty Was Scored" card.
   - Displays full round-by-round history audit.
   - Provides `Play Again (Clean Reset)` and `Back to Home` action buttons.
   - Displays required ethical disclaimer.
