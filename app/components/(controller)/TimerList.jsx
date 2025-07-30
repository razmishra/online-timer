'use client';

import React, { useState, useCallback } from 'react';
import posthog from 'posthog-js';
import Modal from './Modal';

const TimerList = React.memo(({ timerList, isAnyTimerRunning, effectiveTimerId, setSelectedTimerId, setCurrentTimer, joinTimer, deleteTimer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timerIdToDelete, setTimerIdToDelete] = useState(null);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleTimerSelect = useCallback((timerId) => {
    if (!isAnyTimerRunning) {
      setSelectedTimerId(timerId);
      setTimeout(() => joinTimer(timerId), 0);
    }
  }, [isAnyTimerRunning, setSelectedTimerId, joinTimer]);

  const handleDeleteTimer = useCallback((timerId) => {
    setTimerIdToDelete(timerId);
    setIsModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (timerIdToDelete) {
      deleteTimer(timerIdToDelete);
      if (effectiveTimerId === timerIdToDelete) {
        setSelectedTimerId(null);
        setCurrentTimer(null);
        if (timerList.length > 1) {
          const remainingTimers = timerList.filter(timer => timer.id !== timerIdToDelete);
          if (remainingTimers.length > 0 && !isAnyTimerRunning) {
            const nextTimer = remainingTimers[0];
            setSelectedTimerId(nextTimer.id);
            setTimeout(() => joinTimer(nextTimer.id), 0);
          }
        }
      }
      if (posthog.__initialized) {
        posthog.capture('timer_deleted', { timerId: timerIdToDelete });
      }
    }
    setIsModalOpen(false);
    setTimerIdToDelete(null);
  }, [timerIdToDelete, deleteTimer, effectiveTimerId, setSelectedTimerId, setCurrentTimer, timerList, isAnyTimerRunning, joinTimer]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimerIdToDelete(null);
  }, []);

  return (
    <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Your Timers
      </h3>
      {timerList.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">No timers created yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto overflow-x-hidden">
          {timerList.map((timer) => (
            <div
              key={timer.id}
              onClick={() => handleTimerSelect(timer.id)}
              className={`p-4 rounded-xl transition-all duration-200 transform ${
                isAnyTimerRunning 
                  ? 'cursor-not-allowed opacity-60' 
                  : 'cursor-pointer hover:scale-[1.02]'
              } ${
                effectiveTimerId === timer.id
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 shadow-lg'
                  : 'bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate">{timer.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-1">ID: {timer.id}</p>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  {timer.isRunning && (
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  )}
                  <span className="text-xs font-medium text-slate-400 bg-slate-600/50 px-2 py-1 rounded-lg whitespace-nowrap">
                    {timer.connectedCount}/3
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTimer(timer.id);
                    }}
                    className="text-red-400 hover:text-red-300 hover:cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Duration: {formatTime(timer.duration)}
              </p>
            </div>
          ))}
        </div>
      )}
      {isAnyTimerRunning && (
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs text-amber-400">
              <span className="font-semibold">Timer is running:</span> Stop or reset the active timer to switch to another timer.
            </p>
          </div>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this timer? This action cannot be undone."
      />
    </div>
  );
});

export default TimerList;