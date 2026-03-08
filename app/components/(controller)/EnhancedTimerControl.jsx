'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import posthog from 'posthog-js';
import { ChevronDown, Minus, Plus } from 'lucide-react';

const EnhancedTimerControl = React.memo(({
  effectiveTimerId,
  currentTimer,
  startTimer,
  pauseTimer,
  resetTimer,
  adjustTimer
}) => {
  const [showSubtractDropdown, setShowSubtractDropdown] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const subtractRef = useRef(null);
  const addRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (subtractRef.current && !subtractRef.current.contains(event.target)) {
        setShowSubtractDropdown(false);
      }
      if (addRef.current && !addRef.current.contains(event.target)) {
        setShowAddDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdjustTime = useCallback((seconds) => {
    if (!effectiveTimerId || !currentTimer) return;
    if (seconds < 0 && Math.abs(seconds) > currentTimer.remaining) return;
    adjustTimer(effectiveTimerId, seconds);
    if (posthog.__initialized) {
      posthog.capture('timer_adjusted', { timerId: effectiveTimerId, seconds });
    }
    setShowSubtractDropdown(false);
    setShowAddDropdown(false);
  }, [effectiveTimerId, currentTimer, adjustTimer]);

  const timeOptions = [
    { label: '1s', value: 1 },
    { label: '10s', value: 10 },
    { label: '30s', value: 30 },
    { label: '1m', value: 60 },
    { label: '5m', value: 300 },
    { label: '10m', value: 600 },
    { label: '20m', value: 1200 },
    { label: '30m', value: 1800 },
  ];

  const btnBase =
    "group relative flex items-center justify-center h-11 " +
    "transition-all duration-300 " +
    "border border-slate-700/40 bg-slate-800/30 " +
    "hover:bg-slate-700/50 hover:border-slate-500/50 " +
    "text-slate-300 hover:text-white " +
    "disabled:opacity-20 disabled:cursor-not-allowed " +
    "overflow-hidden shadow-sm hover:shadow-md";

  const dropdownClass =
    "absolute top-full mt-2 w-36 " +
    "bg-slate-900/98 backdrop-blur-2xl " +
    "border border-slate-700/60 rounded-xl " +
    "shadow-[0_20px_50px_rgba(0,0,0,0.5)] " +
    "z-[999] py-2 " +
    "animate-in fade-in slide-in-from-top-2 duration-300";

  return (
    <div className="w-full relative z-50 flex items-stretch gap-1.5">

      {/* Subtract Group */}
      <div className="flex flex-[1.5] items-stretch" ref={subtractRef}>
        <div className="relative flex-[0.5]">
          <button
            onClick={() => setShowSubtractDropdown(!showSubtractDropdown)}
            className={`${btnBase} w-full rounded-l-xl border-r-0`}
            title="Subtract Options"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${showSubtractDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showSubtractDropdown && (
            <div className={`${dropdownClass} left-0`}>
              <div className="px-3 pb-2 pt-1 text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">Subtract Time</div>
              {timeOptions.map((opt) => (
                <button key={opt.label} onClick={() => handleAdjustTime(-opt.value)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-red-500/15 hover:text-red-400 transition-all duration-200">
                  <span>{opt.label}</span><Minus className="w-3.5 h-3.5 opacity-40" />
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => handleAdjustTime(-60)} className={`${btnBase} flex-1 rounded-r-xl font-black text-sm tracking-tighter uppercase`}>
          -1m
        </button>
      </div>

      {/* Timer Status Indicator */}
      <div className="flex-[1.2] flex items-center justify-center bg-slate-800/20 border border-slate-700/30 rounded-xl py-1 px-4 shadow-inner overflow-hidden relative group/status">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/status:opacity-100 transition-opacity duration-500" />
        <div className="flex flex-col items-center relative z-10">
          {/* <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1.5">Timer Status</span> */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${currentTimer?.isRunning ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]' : 'bg-slate-500 shadow-inner'}`} />
            <span className={`text-sm font-bold tracking-wide uppercase ${currentTimer?.isRunning ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'text-slate-400'}`}>
              {currentTimer?.isRunning ? 'Running' : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Add Group */}
      <div className="flex flex-[1.5] items-stretch" ref={addRef}>
        <button onClick={() => handleAdjustTime(60)} className={`${btnBase} flex-1 rounded-l-xl border-r-0 font-black text-sm tracking-tighter uppercase`}>
          +1m
        </button>
        <div className="relative flex-[0.5]">
          <button
            onClick={() => setShowAddDropdown(!showAddDropdown)}
            className={`${btnBase} w-full rounded-r-xl`}
            title="Add Options"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${showAddDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showAddDropdown && (
            <div className={`${dropdownClass} right-0`}>
              <div className="px-3 pb-2 pt-1 text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">Add Time</div>
              {timeOptions.map((opt) => (
                <button key={opt.label} onClick={() => handleAdjustTime(opt.value)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-emerald-500/15 hover:text-emerald-400 transition-all duration-200">
                  <span>{opt.label}</span><Plus className="w-3.5 h-3.5 opacity-40" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
});

export default EnhancedTimerControl;