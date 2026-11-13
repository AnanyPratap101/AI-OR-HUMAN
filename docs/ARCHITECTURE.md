# System Architecture: AI or Human?

## 1. Architectural Overview

"AI or Human?" is a client-side single-page application built with React, Vite, and Tailwind CSS v4. The application has zero external runtime network dependencies and requires no routing library, database, or backend infrastructure. All component state and business logic are managed directly in the top-level `App` component.

```
                    ┌───────────────────────────┐
                    │      src/main.jsx         │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │       src/App.jsx         │
                    │   (Root & State Manager)  │
                    └───┬───────┬───────┬───────┤
                        │       │       │       │
       ┌────────────────┘       │       │       └────────────────┐
       ▼                        ▼       ▼                        ▼
┌──────────────┐         ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  HomeView    │         │  Game Screen │ │ SummaryView  │ │ SessionPanel │
│ (Screen:     │         │ (Screen:     │ │ (Screen:     │ │ (Slide-in    │
│   'home')    │         │   'game')    │ │  'summary')  │ │   Drawer)    │
└──────┬───────┘         └──────┬───────┘ └──────┬───────┘ └──────────────┘
       │                        │                │
       ▼                        ▼                ▼
┌────────────────────────────────────────────────────────┐
│                   DisclaimerBox                        │
└────────────────────────────────────────────────────────┘

Data & Logic Support:
├── src/data/samples.js       (Immutable dataset of 8 snippets)
└── src/utils/scoring.js      (Pure scoring evaluation function)
```

## 2. Component Hierarchy and Interactions

- **`App.jsx` (Root & Orchestrator):**
  - Manages application-level state (`screen`, `currentIndex`, `selectedChoice`, `roundResult`, `history`, `sessions`, `panelOpen`).
  - Computes derived values (`totalScore`, `maxScore`, `streak`) to avoid synchronization issues.
  - Controls conditional view rendering based on the `screen` state variable.
  - Houses the game screen layout (Header, Progress Bar, Card, Choice Buttons, Feedback Box).
  - Renders the floating three-dot trigger button (`⋮`) and the `SessionPanel` drawer across all screens.

- **`components/SessionPanel.jsx` (Session History Drawer):**
  - Receives props: `sessions`, `isOpen`, `onClose`, `onClear`.
  - Accessible dialog (`role="dialog"`, `aria-label="Session history"`, `inert` when closed).
  - Handles Escape key listener and backdrop click closures.
  - Traps focus to its close button on open, returning focus to the trigger button on close.
  - Renders list of finished playthroughs ("Player 1", "Player 2", etc., newest first), finish times, stat counts (`Exact`, `Calibrated`, `Cautious`, `Missed`), best score banner, and expandable round breakdown.

- **`components/HomeView.jsx` (Landing Screen):**
  - Displays hero messaging, floating snippet previews, interactive answer tiles, and rules summary.
  - Contains primary `Start Game →` button with `autoFocus`.
  - Embeds `DisclaimerBox`.

- **`components/SummaryView.jsx` (Results Screen):**
  - Receives props: `history`, `totalScore`, `maxScore`, `onReplay`, and `onHome`.
  - Executes cosmetic count-up animation for score over ~800ms (bypassed if `prefers-reduced-motion` is active).
  - Determines rank title (`Calibration Master`, `Sharp Detective`, `Curious Investigator`, `Rookie Reader`).
  - Renders categorical stat counts (`Exact`, `Calibrated`, `Cautious`).
  - Details rubric explanation and round audit cards.
  - Embeds `DisclaimerBox`.

- **`components/DisclaimerBox.jsx` (Persistent Ethical Notice):**
  - Standalone presentation component rendered across all three screens.

- **`data/samples.js` & `utils/scoring.js`:**
  - Self-contained snippet dataset and pure scoring logic.

## 3. State Management and Screen Transitions

All mutable state lives inside `App.jsx` using exactly seven `useState` declarations:

```javascript
const [screen, setScreen] = useState('home');                 // 'home' | 'game' | 'summary'
const [currentIndex, setCurrentIndex] = useState(0);          // 0 to SAMPLES.length - 1
const [selectedChoice, setSelectedChoice] = useState(null);   // string | null
const [roundResult, setRoundResult] = useState(null);         // object | null
const [history, setHistory] = useState([]);                   // Array of current round records
const [sessions, setSessions] = useState([]);                 // Array of finished playthrough records
const [panelOpen, setPanelOpen] = useState(false);             // boolean
```

### Derived Values (Never State)
```javascript
const totalScore = history.reduce((sum, h) => sum + h.points, 0);
const maxScore = SAMPLES.length * 10;

let streak = 0;
for (let i = history.length - 1; i >= 0; i--) {
  if (history[i].points === 10) {
    streak++;
  } else {
    break;
  }
}
```

### Recording Sessions
A game is recorded into `sessions` **exactly once**, inside the `handleNext` handler when completing the 8th round:
```javascript
const handleNext = () => {
  if (currentIndex < SAMPLES.length - 1) {
    setCurrentIndex((prev) => prev + 1);
    setSelectedChoice(null);
    setRoundResult(null);
  } else {
    setSessions((prev) => [
      ...prev,
      {
        playerNumber: prev.length + 1,
        totalScore,
        maxScore,
        finishedAt: Date.now(),
        rounds: [...history],
      },
    ]);
    setScreen('summary');
  }
};
```
- **Handler vs Effect:** Recording directly inside `handleNext` guarantees that React 18/19 StrictMode double-invocations in development never create duplicate session entries.
- **Replay / Reset Isolation:** `handleStart`, `handleReplay`, and `handleHome` cleanly reset the active game state (`currentIndex = 0`, `selectedChoice = null`, `roundResult = null`, `history = []`), but deliberately **never** touch `sessions`. Only a browser page reload or the panel's "Clear all" button empties `sessions`.

## 4. Shape of the `sessions` Entry

```typescript
interface SessionEntry {
  playerNumber: number; // 1, 2, 3... derived strictly from prev.length + 1
  totalScore: number;   // Total points earned in that game
  maxScore: number;     // SAMPLES.length * 10 (80)
  finishedAt: number;   // Timestamp (Date.now())
  rounds: Array<{
    id: number;
    category: string;
    text: string;
    userChoice: string;
    truth: string;
    points: number;
    status: string;
    badge: string;
  }>;
}
```
