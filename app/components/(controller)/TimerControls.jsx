'use client';

import React, { useState, useCallback, useEffect } from 'react';
import posthog from 'posthog-js';
import Modal from './Modal';
import useUserPlanStore from '@/stores/userPlanStore';

const TimerControls = React.memo(({ effectiveTimerId, currentTimer, startTimer, pauseTimer, resetTimer, adjustTimer, setTimer, setSelectedTimerId, setCurrentTimer, timerList, isAnyTimerRunning, joinTimer, deleteTimer}) => {
  const [setTimerInput, setSetTimerInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // For delete confirmation
  const [isSetTimerModalOpen, setIsSetTimerModalOpen] = useState(false); // For set timer confirmation
  const [pendingTimerDuration, setPendingTimerDuration] = useState(null); // Store duration for confirmation
  const [inputError, setInputError] = useState('');
  const [timerExceedsLimit, setTimerExceedsLimit] = useState(false);
  
  const currentActivePlan = useUserPlanStore(store => store.plan)
  const { maxConnectionsAllowed } = currentActivePlan

  const calculateTotalSeconds = useCallback((inputValue) => {
    if (!inputValue) return 0;
    if (inputValue.includes(':')) {
      const [mins, secs] = inputValue.split(':');
      return (parseInt(mins) || 0) * 60 + (parseInt(secs) || 0);
    } else {
      return (parseInt(inputValue) || 0) * 60;
    }
  }, []);


  const handleTimerInputChange = useCallback((e) => {
    let value = e.target.value.replace(/[^\d:]/g, '');
    console.log(value," --value")
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
        setSetTimerInput(value);
    }
  }, [calculateTotalSeconds]);

const handleTimerKeyDown = useCallback((e) => {
    const key = e.key;
    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key) || e.ctrlKey || e.metaKey) {
      return;
    }
    if (!/[\d:]/.test(key)) {
      e.preventDefault();
      return;
    }
    const currentValue = setTimerInput;
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
  }, [setTimerInput, calculateTotalSeconds]);

  const handleSetTimer = useCallback((e) => {
    e.preventDefault();
    if (!effectiveTimerId) {
      setInputError('No timer selected');
      return;
    }
    const [minutes, seconds] = setTimerInput?.split(':')?.map(Number);
    const totalSeconds = (minutes || 0) * 60 + (seconds || 0);

    // Store duration and show confirmation modal
    setPendingTimerDuration(totalSeconds);
    setIsSetTimerModalOpen(true);
  }, [effectiveTimerId, setTimerInput]);

  const confirmSetTimer = useCallback(() => {
    if (!effectiveTimerId || pendingTimerDuration === null) return;
    setTimer(effectiveTimerId, pendingTimerDuration);
    setInputError('');
    setSetTimerInput('');
    if (posthog.__initialized) {
      posthog.capture('timer_set', { timerId: effectiveTimerId, duration: pendingTimerDuration });
    }
    setIsSetTimerModalOpen(false);
    setPendingTimerDuration(null);
  }, [effectiveTimerId, pendingTimerDuration, setTimer]);

  const closeSetTimerModal = useCallback(() => {
    setIsSetTimerModalOpen(false);
    setPendingTimerDuration(null);
  }, []);

  const handleAdjustTime = useCallback((seconds) => {
    if (!effectiveTimerId || !currentTimer) return;
    if (seconds < 0 && Math.abs(seconds) > currentTimer.remaining) return;
    adjustTimer(effectiveTimerId, seconds);
    if (posthog.__initialized) {
      posthog.capture('timer_adjusted', { timerId: effectiveTimerId, seconds });
    }
  }, [effectiveTimerId, currentTimer, adjustTimer]);

  const handleDeleteTimer = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!effectiveTimerId) return;
    deleteTimer(effectiveTimerId);
    setSelectedTimerId(null);
    setCurrentTimer(null);
    if (timerList.length > 1) {
      const remainingTimers = timerList.filter(timer => timer.id !== effectiveTimerId);
      if (remainingTimers.length > 0 && !isAnyTimerRunning) {
        const nextTimer = remainingTimers[0];
        setSelectedTimerId(nextTimer.id);
        setTimeout(() => joinTimer(nextTimer.id), 0);
      }
    }
    if (posthog.__initialized) {
      posthog.capture('timer_deleted', { timerId: effectiveTimerId });
    }
    setIsModalOpen(false);
  }, [effectiveTimerId, deleteTimer, setSelectedTimerId, setCurrentTimer, timerList, isAnyTimerRunning, joinTimer]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Section Header */}
        <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
            </svg>
            Controls
        </h3>
        </div>

        {/* Set Timer Input */}
        <form onSubmit={handleSetTimer} className="mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={setTimerInput}
                onChange={handleTimerInputChange}
                onKeyDown={handleTimerKeyDown}
                placeholder="MM or MM:SS"
                className={`w-full px-3 py-2 bg-slate-700/50 border ${
                  inputError ? 'border-red-500' : 'border-slate-600'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400 text-sm`}
                aria-invalid={inputError ? 'true' : 'false'}
                aria-describedby={inputError ? 'timer-input-error' : undefined}
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm whitespace-nowrap"
            >
              Set
            </button>
          </div>
        </form>
        {
            timerExceedsLimit && (
                <div className="text-sm text-red-400 mt-2">
                    <p><span className="font-semibold">Note:</span> Timer duration cannot exceed 50 hours.</p>
                </div>
            )
        }

        {/* Quick Adjust Buttons */}
        <div className="mb-4">
          <div className="text-xs text-slate-400 mb-2 font-medium">Quick Adjust:</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '-1m', value: -60, color: 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' },
              { label: '-10s', value: -10, color: 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' },
              { label: '+10s', value: 10, color: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' },
              { label: '+1m', value: 60, color: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' },
              { label: '+5m', value: 300, color: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' },
              { label: '+10m', value: 600, color: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' }
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => handleAdjustTime(btn.value)}
                className={`bg-gradient-to-r ${btn.color} text-white font-semibold py-2 px-2 rounded-lg transition-all duration-200 transform hover:scale-105 text-xs`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Original Control Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => {
              startTimer(effectiveTimerId);
              if (posthog.__initialized) posthog.capture('timer_started', { timerId: effectiveTimerId });
            }}
            disabled={currentTimer?.isRunning || currentTimer?.remaining <= 0}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 text-white font-semibold py-3 px-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none text-sm"
          >
            Start
          </button>
          <button
            onClick={() => {
              pauseTimer(effectiveTimerId);
              if (posthog.__initialized) posthog.capture('timer_paused', { timerId: effectiveTimerId });
            }}
            disabled={!currentTimer?.isRunning}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 text-white font-semibold py-3 px-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none text-sm"
          >
            Pause
          </button>
          <button
            onClick={() => {
              resetTimer(effectiveTimerId);
              if (posthog.__initialized) posthog.capture('timer_reset', { timerId: effectiveTimerId });
            }}
            className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white font-semibold py-3 px-2 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
          >
            Reset
          </button>
        </div>

        {/* Timer Status */}
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Duration</p>
              <p className="font-semibold text-white text-sm">{formatTime(currentTimer?.duration)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Status</p>
              <p className={`font-semibold text-sm ${currentTimer?.isRunning ? 'text-emerald-400' : 'text-slate-400'}`}>
                {currentTimer?.isRunning ? 'Running' : 'Stopped'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Connected</p>
              <p className="font-semibold text-white text-sm">{currentTimer?.connectedCount}/{maxConnectionsAllowed-1}</p>
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDeleteTimer}
          className="w-full mt-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold py-2 px-4 rounded-lg transition-all duration-200 border border-red-600/30 text-sm"
        >
          Delete Timer
        </button>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={confirmDelete}
          title="Confirm Delete"
          message="Are you sure you want to delete this timer? This action cannot be undone."
        />

        {/* Set Timer Confirmation Modal */}
        <Modal
          isOpen={isSetTimerModalOpen}
          onClose={closeSetTimerModal}
          onConfirm={confirmSetTimer}
          title="Confirm Timer Update"
          confirmButton={"Update"}
          message={`Are you sure you want to update the timer to ${formatTime(pendingTimerDuration)}?`}
        />
      </div>
    </div>
  );
});

export default TimerControls;