
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSocket } from '../context/SocketContext';
import StylingControls from '../components/(controller)/StylingControls';
import MessageControl from '../components/(controller)/MessageControl';
import TimerControls from '../components/(controller)/TimerControls';
const ShareTimer = dynamic(()=>import("../components/(controller)/ShareTimer"),{
  ssr:false
})
import TimerList from '../components/(controller)/TimerList';
import CreateTimer from '../components/(controller)/CreateTimer';
import Header from '../components/(controller)/Header';
import TimerPreview from '../components/(controller)/TimerPreview';
import EnhancedTimerControls from '../components/(controller)/EnhancedTimerControls';
import LimitExceededPopup from '../components/LimitExceededPopup';
const CurrentTimeDisplay = dynamic(() => import('../components/(controller)/CurrentTimeDisplay'), {
  ssr: false,
});

export default function ControllerPageContent() {
  const {
    isConnected,
    isConnecting,
    timerList,
    currentTimer,
    setCurrentTimer,
    selectedTimerId,
    setSelectedTimerId,
    createTimer,
    deleteTimer,
    setTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    adjustTimer,
    updateMessage,
    updateStyling,
    clearMessage,
    toggleFlash,
    joinTimer,
    joiningCode,
  } = useSocket();

  const [viewerUrl, setViewerUrl] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#1e293b');
  const [textColor, setTextColor] = useState('#f1f5f9');
  const [fontSize, setFontSize] = useState('text-6xl');
  const [timerView, setTimerView] = useState('normal');

  const isAnyTimerRunning = timerList.some(timer => timer.isRunning) || (currentTimer && currentTimer.isRunning);
  const activeTimer = (currentTimer && currentTimer.isRunning) ? currentTimer : timerList.find(timer => timer.isRunning);
  const effectiveTimerId = isAnyTimerRunning ? (activeTimer?.id || null) : selectedTimerId;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setViewerUrl(`${window.location.origin}/viewer`);
    }
  }, []);

  useEffect(() => {
    if (currentTimer && currentTimer.styling && currentTimer.styling.timerView) {
      setTimerView(currentTimer.styling.timerView);
    }
  }, [currentTimer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header isConnected={isConnected} isConnecting={isConnecting} />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-full">
          <div className="lg:col-span-5 w-full">
            <div className="relative group w-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl sm:rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden h-full w-full">
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 opacity-80"></div>
                <div className="relative p-4 sm:p-6 lg:p-8 border-b border-slate-700/40">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-teal-500/5"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-400/30 rounded-xl sm:rounded-2xl blur-md"></div>
                        <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl border border-blue-400/30">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                          Live Preview
                        </h2>
                        <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Real-time timer visualization</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                      <span className="text-emerald-400 text-xs sm:text-sm font-semibold">LIVE</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                  <TimerPreview
                    currentTimer={currentTimer}
                    timerView={timerView}
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                    fontSize={fontSize}
                  />
                  {timerList?.length>0 && effectiveTimerId && currentTimer && (
                    <EnhancedTimerControls
                    effectiveTimerId={effectiveTimerId}
                    currentTimer={currentTimer}
                    startTimer={startTimer}
                    pauseTimer={pauseTimer}
                    resetTimer={resetTimer}
                    />
                  )}
                  <CurrentTimeDisplay />
                </div>
                <div className="relative h-1.5 sm:h-2 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 opacity-60"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
              <div className="space-y-6">
                <CreateTimer
                  createTimer={createTimer}
                  maxConnectionsAllowed={3}
                  maxTimersAllowed={10}
                  timerView={timerView}
                  backgroundColor={backgroundColor}
                  textColor={textColor}
                  fontSize={fontSize}
                  />
                {timerList?.length>0 && effectiveTimerId && currentTimer && (
                  <>
                  <TimerList
                    timerList={timerList}
                    isAnyTimerRunning={isAnyTimerRunning}
                    effectiveTimerId={effectiveTimerId}
                    setSelectedTimerId={setSelectedTimerId}
                    setCurrentTimer={setCurrentTimer}
                    joinTimer={joinTimer}
                    deleteTimer={deleteTimer}
                    />
                    <ShareTimer
                    viewerUrl={viewerUrl}
                    effectiveTimerId={effectiveTimerId}
                    isAnyTimerRunning={isAnyTimerRunning}
                    joiningCode={joiningCode}
                    />
                    </>
                  )}
              </div>
              <div className="space-y-6">
                {timerList?.length>0 && effectiveTimerId && currentTimer && (
                  <>
                    <MessageControl
                      effectiveTimerId={effectiveTimerId}
                      updateMessage={updateMessage}
                      clearMessage={clearMessage}
                    />
                    <TimerControls
                      effectiveTimerId={effectiveTimerId}
                      currentTimer={currentTimer}
                      startTimer={startTimer}
                      pauseTimer={pauseTimer}
                      resetTimer={resetTimer}
                      adjustTimer={adjustTimer}
                      setTimer={setTimer}
                      setSelectedTimerId={setSelectedTimerId}
                      setCurrentTimer={setCurrentTimer}
                      timerList={timerList}
                      isAnyTimerRunning={isAnyTimerRunning}
                      deleteTimer={deleteTimer}
                      joinTimer={joinTimer}
                      // maxTimersAllowed={maxTimersAllowed}
                      // maxConnectionsAllowed={maxConnectionsAllowed}
                    />
                    <StylingControls
                      effectiveTimerId={effectiveTimerId}
                      updateStyling={updateStyling}
                      toggleFlash={toggleFlash}
                      currentTimer={currentTimer}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* a modal if limits exceeds */}
        <LimitExceededPopup/>
      </div>
    </div>
  );
}