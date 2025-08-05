"use client"
import React, { useState, useCallback } from 'react';
import posthog from 'posthog-js';

const StylingControls = React.memo(({ effectiveTimerId, updateStyling, toggleFlash, currentTimer }) => {
  const [backgroundColor, setBackgroundColor] = useState('#1e293b');
  const [textColor, setTextColor] = useState('#f1f5f9');
  const [fontSize, setFontSize] = useState('text-6xl');
  const [timerView, setTimerView] = useState('normal');

  const handleUpdateStyling = useCallback(() => {
    if (!effectiveTimerId) return;
    updateStyling(effectiveTimerId, { backgroundColor, textColor, fontSize, timerView });
    if (posthog.__initialized) {
      posthog.capture('timer_styling_changed', {
        timerId: effectiveTimerId,
        backgroundColor,
        textColor,
        fontSize,
        timerView,
      });
    }
  }, [effectiveTimerId, backgroundColor, textColor, fontSize, timerView, updateStyling]);

  const handleToggleFlash = useCallback(() => {
    if (!effectiveTimerId || !currentTimer) return;
    toggleFlash(effectiveTimerId, !currentTimer.isFlashing);
    if (posthog.__initialized) {
      posthog.capture('timer_flash_toggled', {
        timerId: effectiveTimerId,
        isFlashing: !currentTimer.isFlashing,
      });
    }
  }, [effectiveTimerId, currentTimer, toggleFlash]);

  return (
    <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
        Styling
      </h3>
      <div className="space-y-4">
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-slate-600 cursor-pointer flex-shrink-0"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white font-mono text-xs min-w-0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-slate-600 cursor-pointer flex-shrink-0"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white font-mono text-xs min-w-0"
              />
            </div>
          </div>
        </div> */}
        {/* <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Font Size</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white"
          >
            <option value="text-4xl">Small</option>
            <option value="text-6xl">Medium</option>
            <option value="text-8xl">Large</option>
            <option value="text-9xl">Extra Large</option>
          </select>
        </div> */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Timer View</label>
          <select
            value={timerView}
            onChange={(e) => setTimerView(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white"
          >
            <option value="normal">Countdown</option>
            <option value="countup">Count Up</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleUpdateStyling}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex-1 text-sm"
          >
            Apply
          </button>
          <button
            onClick={handleToggleFlash}
            className={`font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm whitespace-nowrap ${
              currentTimer?.isFlashing 
                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white' 
                : 'bg-slate-600 hover:bg-slate-700 text-white'
            }`}
          >
            {currentTimer?.isFlashing ? 'Stop Flash' : 'Flash'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default StylingControls;