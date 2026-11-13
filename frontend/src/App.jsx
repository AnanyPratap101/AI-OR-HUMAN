import React, { useState, useRef, useEffect } from 'react';
import { SAMPLES } from './data/samples.js';
import { CHOICES, evaluateGuess } from './utils/scoring.js';
import HomeView from './components/HomeView.jsx';
import SummaryView from './components/SummaryView.jsx';
import DisclaimerBox from './components/DisclaimerBox.jsx';
import SessionPanel from './components/SessionPanel.jsx';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [roundResult, setRoundResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);

  const triggerButtonRef = useRef(null);
  const prevPanelOpenRef = useRef(panelOpen);

  // Return focus to trigger button when panel closes
  useEffect(() => {
    if (prevPanelOpenRef.current && !panelOpen) {
      triggerButtonRef.current?.focus();
    }
    prevPanelOpenRef.current = panelOpen;
  }, [panelOpen]);

  // Derived values (never state)
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

  const handleStart = () => {
    setCurrentIndex(0);
    setSelectedChoice(null);
    setRoundResult(null);
    setHistory([]);
    setScreen('game');
  };

  const handleReplay = () => {
    setCurrentIndex(0);
    setSelectedChoice(null);
    setRoundResult(null);
    setHistory([]);
    setScreen('game');
  };

  const handleHome = () => {
    setCurrentIndex(0);
    setSelectedChoice(null);
    setRoundResult(null);
    setHistory([]);
    setScreen('home');
  };

  const handleAnswer = (choice) => {
    if (roundResult !== null) return;

    const currentSample = SAMPLES[currentIndex];
    const result = evaluateGuess(choice, currentSample.truth);
    setSelectedChoice(choice);
    setRoundResult(result);
    setHistory((prev) => [
      ...prev,
      {
        id: currentSample.id,
        category: currentSample.category,
        text: currentSample.text,
        userChoice: choice,
        truth: currentSample.truth,
        points: result.points,
        status: result.status,
        badge: result.badge,
      },
    ]);
  };

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

  const handleTogglePanel = () => {
    setPanelOpen((prev) => !prev);
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
  };

  const handleClearSessions = () => {
    setSessions([]);
  };

  const currentSample = SAMPLES[currentIndex];
  const progressPercent = (history.length / SAMPLES.length) * 100;

  let feedbackColorClass = 'bg-rose-950/60 border border-rose-500/50 text-rose-100';
  if (roundResult?.points === 10) {
    feedbackColorClass = 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-100';
  } else if (roundResult?.points === 3) {
    feedbackColorClass = 'bg-amber-950/60 border border-amber-500/50 text-amber-100';
  }

  const realAnswerDisplay =
    currentSample?.truth === 'Ambiguous' ? 'Not enough evidence' : currentSample?.truth;

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 text-slate-100 py-8 px-4 flex flex-col items-center justify-center overflow-x-hidden">
      {/* Decorative blurred color blobs */}
      <div
        className="absolute top-1/4 -left-20 w-72 h-72 bg-violet-600/20 blur-3xl rounded-full pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -right-20 w-72 h-72 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Session History Trigger Button (Fixed top-right across all screens) */}
      <button
        ref={triggerButtonRef}
        onClick={handleTogglePanel}
        aria-label="Open session history"
        aria-expanded={panelOpen}
        aria-controls="session-panel"
        className="fixed top-4 right-4 z-40 w-10 h-10 rounded-full bg-slate-800/80 border border-slate-600 text-slate-200 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 flex items-center justify-center text-lg font-bold transition-all duration-150 cursor-pointer shadow-md"
      >
        ⋮
        {sessions.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 rounded-full bg-violet-600 text-xs text-white text-center flex items-center justify-center px-1 font-bold shadow">
            {sessions.length}
          </span>
        )}
      </button>

      {/* Side Panel for Session History */}
      <SessionPanel
        sessions={sessions}
        isOpen={panelOpen}
        onClose={handleClosePanel}
        onClear={handleClearSessions}
      />

      {/* Main container card */}
      <div className="w-full max-w-xl mx-auto bg-slate-900/70 backdrop-blur border border-slate-700 rounded-2xl shadow-xl shadow-violet-950/40 p-6 relative z-10">
        {screen === 'home' && <HomeView onStart={handleStart} />}

        {screen === 'summary' && (
          <SummaryView
            history={history}
            totalScore={totalScore}
            maxScore={maxScore}
            onReplay={handleReplay}
            onHome={handleHome}
          />
        )}

        {screen === 'game' && (
          <div className="space-y-6">
            {/* 1. Header row */}
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight text-white">AI or Human?</h1>
                <div className="flex items-center gap-2">
                  {streak >= 2 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 border border-amber-500/50 text-amber-300">
                      🔥 Streak: {streak}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-200">
                    Score: {totalScore}
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Round {currentIndex + 1} of {SAMPLES.length}
              </div>
            </div>

            {/* 2. Progress bar */}
            <div
              role="progressbar"
              aria-valuenow={history.length}
              aria-valuemin="0"
              aria-valuemax={SAMPLES.length}
              className="w-full h-2 rounded-full bg-slate-700 overflow-hidden"
            >
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* 3. Card */}
            <div
              key={currentIndex}
              className="animate-fade-up bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-violet-950/80 border border-violet-500/30 text-violet-300 text-xs font-medium">
                  {currentSample.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Snippet #{currentSample.id}
                </span>
              </div>
              <p className="text-lg sm:text-xl leading-relaxed text-slate-100 font-normal">
                &ldquo;{currentSample.text}&rdquo;
              </p>
            </div>

            {/* 4. Choice buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CHOICES.map((choice) => {
                const isSelected = selectedChoice === choice;
                const isDisabled = roundResult !== null;

                let buttonStyle =
                  'bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700 hover:border-violet-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer';

                if (isDisabled) {
                  if (isSelected) {
                    buttonStyle = 'bg-violet-600 border-violet-400 text-white shadow-md';
                  } else {
                    buttonStyle = 'bg-slate-800 border-slate-700 text-slate-400 opacity-50';
                  }
                }

                return (
                  <button
                    key={choice}
                    disabled={isDisabled}
                    onClick={() => handleAnswer(choice)}
                    className={`w-full min-h-[3.5rem] px-3 py-2 text-sm font-medium rounded-lg border text-center transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed ${buttonStyle}`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>

            {/* 5. Feedback box */}
            {roundResult && (
              <div
                className={`animate-pop rounded-xl p-4 sm:p-5 space-y-2.5 text-xs sm:text-sm leading-relaxed ${feedbackColorClass}`}
              >
                {/* 1. badge */}
                <div className="font-bold text-sm sm:text-base">{roundResult.badge}</div>
                {/* 2. Answer */}
                <div>
                  <strong className="font-semibold">Answer:</strong> {realAnswerDisplay}
                </div>
                {/* 3. detail */}
                <div>{roundResult.detail}</div>
                {/* 4. Cue */}
                <div>
                  <strong className="font-semibold">Cue:</strong> {currentSample.explanation}
                </div>
                {/* 5. Next button */}
                <div className="pt-2">
                  <button
                    onClick={handleNext}
                    className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 cursor-pointer shadow-lg shadow-violet-950/50"
                  >
                    {currentIndex === SAMPLES.length - 1
                      ? 'View Final Score Summary →'
                      : 'Next Snippet →'}
                  </button>
                </div>
              </div>
            )}

            {/* 6. DisclaimerBox at bottom of game screen */}
            <div className="pt-2">
              <DisclaimerBox />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
