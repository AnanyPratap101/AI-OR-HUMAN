import React from 'react';
import { SAMPLES } from '../data/samples.js';
import DisclaimerBox from './DisclaimerBox.jsx';

export default function HomeView({ onStart }) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-up">
      {/* Hero section */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
          AI or Human?
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-normal max-w-md mx-auto leading-relaxed">
          Can you tell who wrote it? Sometimes the smartest answer is &ldquo;I can&apos;t tell.&rdquo;
        </p>
      </div>

      {/* Decorative floating cards */}
      <div className="flex flex-wrap justify-center gap-3 select-none" aria-hidden="true">
        <div className="animate-float px-3.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300 -rotate-2 shadow-md">
          &ldquo;Sounds good, see you then.&rdquo;
        </div>
        <div
          className="animate-float px-3.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300 rotate-2 shadow-md"
          style={{ animationDelay: '1.5s' }}
        >
          &ldquo;Missed the 7:40 bus again lol.&rdquo;
        </div>
      </div>

      {/* 3 Answer Feature Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3.5 hover:-translate-y-1 hover:border-violet-400 transition-all duration-150">
          <div className="text-xl mb-1.5">🧑 Human</div>
          <div className="text-xs text-slate-300 leading-snug">
            Casual phrasing, quick shortcuts, typos, or authentic personal emotion.
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3.5 hover:-translate-y-1 hover:border-violet-400 transition-all duration-150">
          <div className="text-xl mb-1.5">🤖 AI</div>
          <div className="text-xs text-slate-300 leading-snug">
            Polished marketing buzzwords, flawless corporate templates, or lofty poetry.
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3.5 hover:-translate-y-1 hover:border-violet-400 transition-all duration-150">
          <div className="text-xl mb-1.5">🤔 Not enough evidence</div>
          <div className="text-xs text-slate-300 leading-snug">
            Too brief or generic to tell — recognizing ambiguity earns maximum points!
          </div>
        </div>
      </div>

      {/* Rules line */}
      <div className="text-center">
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          {SAMPLES.length} snippets · +10 for a correct call · +3 for a cautious pass · 0 for a miss
        </p>
      </div>

      {/* Primary start button */}
      <div className="text-center pt-2">
        <button
          onClick={onStart}
          autoFocus
          className="w-full sm:w-auto px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-base shadow-lg shadow-violet-950/50 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 cursor-pointer"
        >
          Start Game →
        </button>
      </div>

      {/* Disclaimer Box */}
      <div className="pt-2">
        <DisclaimerBox />
      </div>
    </div>
  );
}
