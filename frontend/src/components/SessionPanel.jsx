import React, { useState, useEffect, useRef } from 'react';
import { SAMPLES } from '../data/samples.js';

export default function SessionPanel({ sessions, isOpen, onClose, onClear }) {
  const [expandedPlayers, setExpandedPlayers] = useState({});
  const closeButtonRef = useRef(null);

  // Focus close button on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleExpand = (playerNumber) => {
    setExpandedPlayers((prev) => ({
      ...prev,
      [playerNumber]: !prev[playerNumber],
    }));
  };

  // Best score calculation when sessions.length >= 2
  let bestSession = null;
  if (sessions.length >= 2) {
    bestSession = sessions.reduce((best, s) => {
      if (!best) return s;
      return s.totalScore > best.totalScore ? s : best;
    }, null);
  }

  const reversedSessions = [...sessions].reverse();

  return (
    <>
      {/* Dimmed backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Side panel */}
      <aside
        id="session-panel"
        role="dialog"
        aria-label="Session history"
        aria-hidden={!isOpen}
        inert={!isOpen ? '' : undefined}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-slate-900 border-l border-slate-700 shadow-2xl overflow-y-auto flex flex-col justify-between p-5 text-slate-100 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full invisible pointer-events-none'
        }`}
      >
        <div className="space-y-4">
          {/* 1. Header row */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white tracking-tight">Session History</h2>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close session history"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* 2. One-line note */}
          <p className="text-xs text-slate-400 leading-relaxed">
            Saved only while this page is open. Closing or reloading clears everything.
          </p>

          {/* 6. Best score so far (when sessions.length >= 2) */}
          {bestSession && (
            <div className="bg-violet-950/60 border border-violet-500/40 rounded-xl p-3 text-xs text-violet-200 text-center font-medium shadow-sm">
              👑 <strong>Best:</strong> Player {bestSession.playerNumber} · {bestSession.totalScore} / {bestSession.maxScore} pts
            </div>
          )}

          {/* 3. Empty state */}
          {sessions.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="text-3xl select-none" aria-hidden="true">📜</div>
              <p className="text-xs text-slate-400 max-w-[220px] mx-auto leading-relaxed">
                No finished games yet. Finish a round of {SAMPLES.length} to see Player 1 here.
              </p>
            </div>
          ) : (
            /* 4. List of players (newest first) */
            <div className="space-y-3 pt-1">
              {reversedSessions.map((session) => {
                const isExpanded = !!expandedPlayers[session.playerNumber];
                const exactCount = session.rounds.filter((r) => r.status === 'exact').length;
                const calibratedCount = session.rounds.filter((r) => r.status === 'calibrated').length;
                const cautiousCount = session.rounds.filter((r) => r.status === 'cautious').length;
                const missedCount = session.rounds.filter(
                  (r) => r.points === 0 || r.status === 'incorrect' || r.status === 'overconfident'
                ).length;

                return (
                  <div
                    key={session.playerNumber}
                    className="bg-slate-800/60 border border-slate-700 rounded-xl p-3.5 space-y-2.5 text-xs text-slate-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">
                        Player {session.playerNumber}
                      </span>
                      <span className="font-extrabold text-violet-300">
                        {session.totalScore} / {session.maxScore} pts
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Finished at {new Date(session.finishedAt).toLocaleTimeString()}
                    </div>

                    {/* Stat counts row */}
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-semibold">
                        Exact: {exactCount}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-violet-950/70 border border-violet-500/40 text-violet-300 font-semibold">
                        Calibrated: {calibratedCount}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-950/70 border border-amber-500/40 text-amber-300 font-semibold">
                        Cautious: {cautiousCount}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-950/70 border border-rose-500/40 text-rose-300 font-semibold">
                        Missed: {missedCount}
                      </span>
                    </div>

                    {/* Toggle show/hide rounds */}
                    <div>
                      <button
                        onClick={() => toggleExpand(session.playerNumber)}
                        className="text-xs text-violet-400 hover:text-violet-300 font-medium underline underline-offset-2 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
                      >
                        {isExpanded ? 'Hide rounds ▲' : 'Show rounds ▼'}
                      </button>
                    </div>

                    {/* Expanded rounds */}
                    {isExpanded && (
                      <div className="space-y-2 pt-2 border-t border-slate-700/60">
                        {session.rounds.map((r, rIdx) => {
                          const displayReal = r.truth === 'Ambiguous' ? 'Not enough evidence' : r.truth;
                          const isFull = r.points === 10;
                          const isCautious = r.points === 3;
                          const badgeClass = isFull
                            ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                            : isCautious
                            ? 'bg-amber-950/70 border-amber-500/40 text-amber-300'
                            : 'bg-rose-950/70 border-rose-500/40 text-rose-300';

                          return (
                            <div
                              key={rIdx}
                              className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 space-y-1 text-[11px]"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-semibold text-slate-300">
                                  #{rIdx + 1} · {r.category}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${badgeClass}`}>
                                  +{r.points}
                                </span>
                              </div>
                              <p className="truncate text-slate-400 italic">
                                &ldquo;{r.text}&rdquo;
                              </p>
                              <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-2">
                                <span>Pick: <strong className="text-slate-200">{r.userChoice}</strong></span>
                                <span>Answer: <strong className="text-slate-200">{displayReal}</strong></span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Clear all button at the bottom */}
        {sessions.length > 0 && (
          <div className="pt-4 border-t border-slate-800 mt-4">
            <button
              onClick={onClear}
              className="w-full py-2 px-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
