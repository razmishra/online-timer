
"use client"
import React, { useCallback } from 'react';
import posthog from 'posthog-js';

const EnhancedTimerControls = React.memo(({effectiveTimerId, currentTimer, startTimer, pauseTimer, resetTimer}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 sm:space-x-3">
          <div className="w-4 sm:w-8 h-0.5 bg-gradient-to-r from-transparent to-blue-400 rounded-full"></div>
          <h3 className="text-base sm:text-lg font-bold text-slate-200">
            Timer Controls
          </h3>
          <div className="w-4 sm:w-8 h-0.5 bg-gradient-to-l from-transparent to-purple-400 rounded-full"></div>
        </div>
      </div>

      {/* Control Buttons with Enhanced Design */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        {/* Start Button */}
        <button
          onClick={() => {
            startTimer(effectiveTimerId);
            if (posthog.__initialized)
              posthog.capture("timer_started", { timerId: effectiveTimerId });
          }}
          disabled={currentTimer?.isRunning || currentTimer?.remaining <= 0}
          className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none disabled:hover:shadow-none w-full sm:w-auto"
        >
          {/* Button Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

          <span className="relative flex items-center justify-center space-x-2">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm sm:text-base">Start</span>
          </span>
        </button>

        {/* Pause Button */}
        <button
          onClick={() => {
            pauseTimer(effectiveTimerId);
            if (posthog.__initialized)
              posthog.capture("timer_paused", { timerId: effectiveTimerId });
          }}
          disabled={!currentTimer.isRunning}
          className="group relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-amber-500/30 hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none disabled:hover:shadow-none w-full sm:w-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/20 to-amber-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

          <span className="relative flex items-center justify-center space-x-2">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm sm:text-base">Pause</span>
          </span>
        </button>

        {/* Reset Button */}
        <button
          onClick={() => {
            resetTimer(effectiveTimerId);
            if (posthog.__initialized)
              posthog.capture("timer_reset", { timerId: effectiveTimerId });
          }}
          className="group relative overflow-hidden bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-500 hover:to-gray-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-slate-500/30 hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-400/0 via-slate-400/20 to-slate-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

          <span className="relative flex items-center justify-center space-x-2">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm sm:text-base">Reset</span>
          </span>
        </button>
      </div>
    </div>
  );
});

export default EnhancedTimerControls;
