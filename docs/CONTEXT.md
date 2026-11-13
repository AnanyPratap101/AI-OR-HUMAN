# Project Context: AI or Human?

## 1. Current Status
The project is fully implemented, verified, and ready for production build.
- Phase A (Scaffolding): Completed.
- Phase B (Implementation): Completed across all components and styling.
- Phase C (Verification): All 9 scoring combinations verified, full game simulation passed, and production build succeeds with zero errors.
- Phase D (Documentation): Completed.

## 2. Technology Stack
- **Framework:** React 19
- **Bundler / Dev Server:** Vite 6
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Language / Standards:** Modern ECMAScript (ES2022+), JSX
- **Typography:** System font stack (`font-sans`)
- **State Management:** Native React state in `App.jsx` with derived computations

## 3. How to Run Locally
Ensure Node.js (v18+) and npm are installed.

```bash
# Navigate to the frontend directory
cd frontend

# Install project dependencies
npm install

# Start the local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

To verify production build output:
```bash
npm run build
```

## 4. What a New Contributor Should Read First
1. **`README.md` (root):** High-level project summary, live demo placeholder, feature list, and walkthrough.
2. **`AGENTS.md` (root):** Golden rules and constraints for making code contributions (offline only, no external APIs, derived state rules).
3. **`docs/PRD.md`:** Comprehensive product requirements and user journey through the three screens.
4. **`docs/ARCHITECTURE.md`:** State ownership in `App.jsx`, data flow during a round, and component relationships.
5. **`docs/DECISIONS.md`:** Architectural rationales, scoring math (+10 / +3 / 0), and why score is derived rather than stored.
6. **`frontend/src/data/samples.js`:** The immutable 8-card dataset.
