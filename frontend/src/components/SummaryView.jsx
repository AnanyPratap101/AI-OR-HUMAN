import React, { useState, useEffect } from 'react';
import DisclaimerBox from './DisclaimerBox.jsx';

export default function SummaryView({ history, totalScore, maxScore, onReplay, onHome }) {
  const [displayScore, setDisplayScore] = useState(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return totalScore;
    }
    return 0;
  });

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplayScore(totalScore);
      return;
    }

    if (totalScore === 0) {
      setDisplayScore(0);
      return;
    }

    const duration = 800; // ~800ms
    const startTime = performance.now();
    let animationFrameId;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentVal = Math.round(progress * totalScore);
      setDisplayScore(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [totalScore]);

  // Rank determination
  const ratio = maxScore > 0 ? totalScore / maxScore : 0;
  let rankTitle = 'Rookie Reader';
  let rankMessage = "Subtle clues can be deceptive. Remember that saying 'Not enough evidence' is often the winning play.";

  if (ratio >= 0.9) {
    rankTitle = 'Calibration Master';
    rankMessage = 'Flawless calibration! You know exactly when to trust the clues and when to hold back.';
  } else if (ratio >= 0.7) {
    rankTitle = 'Sharp Detective';
    rankMessage = 'Impressive instincts! You caught key stylistic signals and handled uncertainty well.';
  } else if (ratio >= 0.4) {
    rankTitle = 'Curious Investigator';
    rankMessage = 'Good effort! Distinguishing AI prose from human quirks gets easier with practice.';
  }

  // Stat tile counts
  const exactCount = history.filter((h) => h.status === 'exact').length;
  const calibratedCount = history.filter((h) => h.status === 'calibrated').length;
  const cautiousCount = history.filter((h) => h.status === 'cautious').length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-up">
      {/* 1. Heading */}
      <div className="text-center space-y-1">
        <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-violet-400">
          Session Complete
        </h2>
        {/* 2. Score */}
        <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white pt-1">
          {displayScore} <span className="text-xl sm:text-2xl font-normal text-slate-400">/ {maxScore} pts</span>
        </div>
        {/* 3. Rank title & message */}
        <div className="pt-2">
          <div className="inline-block px-3 py-1 bg-violet-950/80 border border-violet-500/40 rounded-full text-violet-300 font-semibold text-sm sm:text-base">
            🏆 {rankTitle}
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
            {rankMessage}
          </p>
        </div>
      </div>

      {/* 4. Counts by status (Exact, Calibrated, Cautious) */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
          <div className="text-2xl font-bold text-emerald-400">{exactCount}</div>
          <div className="text-xs text-slate-300 font-medium mt-0.5">Exact</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
          <div className="text-2xl font-bold text-violet-400">{calibratedCount}</div>
          <div className="text-xs text-slate-300 font-medium mt-0.5">Calibrated</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
          <div className="text-2xl font-bold text-amber-400">{cautiousCount}</div>
          <div className="text-xs text-slate-300 font-medium mt-0.5">Cautious</div>
        </div>
      </div>

      {/* 5. Highlighted scoring explanation box */}
      <div className="bg-indigo-950/60 border border-indigo-500/50 rounded-xl p-4 text-xs text-slate-200 leading-relaxed space-y-1.5">
        <h3 className="font-semibold text-indigo-300 text-sm">How Uncertainty Was Scored</h3>
        <p>
          <strong className="text-emerald-300">+10 pts for the right call</strong>, including correctly saying &ldquo;Not enough evidence&rdquo; on a card with too few clues.
        </p>
        <p>
          <strong className="text-amber-300">+3 pts for choosing &ldquo;Not enough evidence&rdquo;</strong> when clear clues did exist (a cautious pass).
        </p>
        <p>
          <strong className="text-rose-300">0 pts for a wrong guess</strong>, or for confidently guessing Human or AI on a card that had too little evidence.
        </p>
      </div>

      {/* 6. Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onReplay}
          className="flex-1 py-3 px-5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 cursor-pointer shadow-lg shadow-violet-950/50"
        >
          Play Again (Clean Reset)
        </button>
        <button
          onClick={onHome}
          className="flex-1 py-3 px-5 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold rounded-xl text-sm transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 cursor-pointer"
        >
          Back to Home
        </button>
      </div>

      {/* 7. List of all rounds */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Round Breakdown
        </h3>
        <div className="space-y-2.5">
          {history.map((item, idx) => {
            const displayRealAnswer = item.truth === 'Ambiguous' ? 'Not enough evidence' : item.truth;
            const isFull = item.points === 10;
            const isCautious = item.points === 3;
            const badgeClass = isFull
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
              : isCautious
              ? 'bg-amber-950/70 border-amber-500/50 text-amber-300'
              : 'bg-rose-950/70 border-rose-500/50 text-rose-300';
            const dotClass = isFull
              ? 'bg-emerald-400'
              : isCautious
              ? 'bg-amber-400'
              : 'bg-rose-400';

            return (
              <div
                key={idx}
                className="bg-slate-800/50 border border-slate-700/80 rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-200">
                    Round {idx + 1} · {item.category}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${badgeClass}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
                    +{item.points} pts
                  </span>
                </div>
                <p className="text-slate-300 italic leading-relaxed">
                  &ldquo;{item.text}&rdquo;
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-[11px]">
                  <span>
                    Your pick: <strong className="text-slate-200">{item.userChoice}</strong>
                  </span>
                  <span>
                    Real answer: <strong className="text-slate-200">{displayRealAnswer}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. DisclaimerBox */}
      <div className="pt-2">
        <DisclaimerBox />
      </div>
    </div>
  );
}
