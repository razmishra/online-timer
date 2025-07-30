"use client"
import React, { useState, useCallback } from 'react';
import posthog from 'posthog-js';
import useUserPlanStore from '@/stores/userPlanStore';

const CreateTimer = React.memo(({ createTimer, timerView, backgroundColor, textColor, fontSize }) => {
  const [createTimerInput, setCreateTimerInput] = useState('');
  const [timerName, setTimerName] = useState('');
  const [timerExceedsLimit, setTimerExceedsLimit] = useState(false);

  const userCurrentPlan = useUserPlanStore(state => state.plan)
  const { maxConnectionsAllowed, maxTimersAllowed } = userCurrentPlan

  const calculateTotalSeconds = useCallback((inputValue) => {
    if (!inputValue) return 0;
    if (inputValue.includes(':')) {
      const [mins, secs] = inputValue.split(':');
      return (parseInt(mins) || 0) * 60 + (parseInt(secs) || 0);
    } else {
      return (parseInt(inputValue) || 0) * 60;
    }
  }, []);

  const handleTimerKeyDown = useCallback((e) => {
    const key = e.key;
    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key) || e.ctrlKey || e.metaKey) {
      return;
    }
    if (!/[\d:]/.test(key)) {
      e.preventDefault();
      return;
    }
    const currentValue = createTimerInput;
    if (key === ':') {
      if (currentValue.includes(':') || currentValue === '') {
        e.preventDefault();
        return;
      }
    }
    if (/\d/.test(key) && currentValue.includes(':')) {
      const afterColon = currentValue.split(':')[1] || '';
      const selectionStart = e.target.selectionStart;
      const selectionEnd = e.target.selectionEnd;
      if (afterColon.length >= 2 && selectionStart === selectionEnd) {
        e.preventDefault();
        return;
      }
    }
    const selectionStart = e.target.selectionStart;
    const selectionEnd = e.target.selectionEnd;
    const newValue = currentValue.slice(0, selectionStart) + key + currentValue.slice(selectionEnd);
    if (calculateTotalSeconds(newValue) > 180000) {
      e.preventDefault();
      setTimerExceedsLimit(true);
    }
  }, [createTimerInput, calculateTotalSeconds]);

  const handleTimerInputChange = useCallback((e) => {
    let value = e.target.value.replace(/[^\d:]/g, '');
    if ((value.match(/:/g) || []).length > 1) {
      const firstColonIndex = value.indexOf(':');
      value = value.slice(0, firstColonIndex + 1) + value.slice(firstColonIndex + 1).replace(/:/g, '');
    }
    if (value.includes(':')) {
      const [minutes, seconds] = value.split(':');
      let limitedSeconds = (seconds || '').slice(0, 2);
      if (limitedSeconds && parseInt(limitedSeconds) > 59) {
        limitedSeconds = '59';
      }
      value = minutes + ':' + limitedSeconds;
    }
    const totalSeconds = calculateTotalSeconds(value);
    setTimerExceedsLimit(totalSeconds > 180000);
    if (!timerExceedsLimit) {
      setCreateTimerInput(value);
    }
  }, [calculateTotalSeconds]);

  const sanitizeInput = useCallback((input) => {
    return input.replace(/<[^>]*>/g, '');
  }, []);

  const handleTimerNameChange = useCallback((e) => {
    setTimerName(sanitizeInput(e.target.value));
  }, [sanitizeInput]);

  const handleCreateTimer = useCallback((e) => {
    e.preventDefault();
    const [minutes, seconds] = createTimerInput.split(':').map(Number);
    const totalSeconds = (minutes || 0) * 60 + (seconds || 0);
    if (totalSeconds > 0 && timerName.trim()) {
      createTimer(timerName.trim(), totalSeconds, maxConnectionsAllowed, maxTimersAllowed, { timerView, backgroundColor, textColor, fontSize });
      if (posthog.__initialized) {
        posthog.capture('timer_created', {
          name: timerName.trim(),
          duration: totalSeconds,
          timerView,
          backgroundColor,
          textColor,
          fontSize,
        });
      }
      setCreateTimerInput('');
      setTimerName('');
    }
  }, [createTimerInput, timerName, createTimer, maxConnectionsAllowed, maxTimersAllowed, timerView, backgroundColor, textColor, fontSize]);

  return (
    <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Create Timer
      </h3>
      <form onSubmit={handleCreateTimer} className="space-y-4">
        <input
          type="text"
          value={timerName}
          onChange={handleTimerNameChange}
          placeholder="Timer name"
          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400"
          required
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={createTimerInput}
            onChange={handleTimerInputChange}
            onKeyDown={handleTimerKeyDown}
            placeholder="MM:SS"
            className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg whitespace-nowrap"
          >
            Create
          </button>
        </div>
      </form>
      {timerExceedsLimit ? (
        <div className="text-sm text-red-400 mt-2">
          <p><span className="font-semibold">Note:</span> Timer duration cannot exceed 50 hours.</p>
        </div>
      ) : (
        <div className="text-sm text-slate-400 mt-2">
          <p><span className="font-semibold">Tip:</span> Enter time as <span className="font-mono bg-slate-700/50 px-1 rounded">MM:SS</span> or just <span className="font-mono bg-slate-700/50 px-1 rounded">MM</span> (e.g., <span className="font-mono bg-slate-700/50 px-1 rounded">5</span> for 5 minutes, <span className="font-mono bg-slate-700/50 px-1 rounded">5:30</span> for 5 minutes 30 seconds).</p>
        </div>
      )}
    </div>
  );
});

export default CreateTimer;