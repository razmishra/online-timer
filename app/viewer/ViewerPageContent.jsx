"use client";

import { useEffect, useState, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import Timer from '../components/Timer';
import { useSearchParams } from 'next/navigation';
import { Expand, Shrink } from 'lucide-react';
import { BRAND_NAME } from '../constants';

export default function ViewerPageContent() {
  const { 
    isConnected, 
    currentTimer, 
    timerList, 
    viewTimer,
    timerFullMessage,
    isCurrentSocketFailed
  } = useSocket();
  const searchParams = useSearchParams();
  
  // Get timer ID from URL parameter
  const timerIdFromUrl = searchParams.get('timer');

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Add local state for progress bar
  const [progressBar, setProgressBar] = useState(1); // 1 = 100%
  const prevTimerId = useRef(null);
  const prevDuration = useRef(null);

  useEffect(() => {
    if (timerIdFromUrl && isConnected) {
      viewTimer(timerIdFromUrl);
    } else if (!timerIdFromUrl && isConnected && timerList.length > 0) {
      // No timer in URL, showing timer selection
    } else if (!timerIdFromUrl && isConnected && timerList.length === 0) {
      // No timer in URL and no timers available
    }
  }, [timerIdFromUrl, isConnected, viewTimer, timerList]);

  // Handle Fullscreen API
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (isFullscreen) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  // Listen for exiting fullscreen via ESC or browser
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Update progress bar only when timer is running or timer resets
  useEffect(() => {
    if (!currentTimer || !currentTimer.duration) return;
    // If timer changed or reset, reset progress
    if (currentTimer.id !== prevTimerId.current || currentTimer.duration !== prevDuration.current) {
      setProgressBar(1);
      prevTimerId.current = currentTimer.id;
      prevDuration.current = currentTimer.duration;
      return;
    }
    let progress = 0;
    if (currentTimer.styling?.timerView === 'countup') {
      progress = (currentTimer.duration - currentTimer.remaining) / currentTimer.duration;
    } else {
      progress = (currentTimer.duration - currentTimer.remaining) / currentTimer.duration;
    }
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;
    // Only update if running
    if (currentTimer.isRunning) {
      setProgressBar(progress);
    }
  }, [currentTimer]);

  // Dynamic styles for timer container
  const timerContainerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center w-screen h-screen pt-20'
    : 'relative z-10 w-full h-full flex items-center justify-center py-12 px-4';

  // Remove rotation style for fullscreen
  const rotatedStyle = isFullscreen
    ? {
      width: '100vw',
      height: '100vh',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
    : {};

  // Dynamic font size for timer with better typography
  const timerFontSize = isFullscreen
    ? 'text-[19vw] md:text-[14vw] lg:text-[10vw] xl:text-[8vw] font-bold tracking-tight'
    : 'text-[19vw] md:text-[14vw] lg:text-[10vw] xl:text-[8vw] font-bold tracking-tight';

  // Check if current socket is in the failed list
  const shouldShowTimerFullMessage = timerFullMessage && isCurrentSocketFailed();

  return (
    <div ref={containerRef} className="viewer-fullscreen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden min-h-screen">
      {/* Timer Full Message - Only show if current socket is in failed list */}
      {shouldShowTimerFullMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>{timerFullMessage}</span>
        </div>
      )}
      
      {/* Show timer UI only if current socket is not in failed list */}
      {!isCurrentSocketFailed() ? (
        <>
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          {/* Header Bar - Always visible, even in fullscreen */}
          <div className="absolute top-0 left-0 right-0 z-30 viewer-header">
            <div className="flex items-center justify-between px-6 py-4">
              {/* Company Branding - Top Left */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 company-logo rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-white font-bold text-lg">{BRAND_NAME}</h1>
                  <p className="text-white/70 text-xs">Professional Timer Solutions</p>
                </div>
              </div>

              {/* Timer Name - Top Center */}
              <div className="flex-1 text-center px-4">
                {currentTimer?.name ? (
                  <div className="max-w-md mx-auto">
                    <h2 className="text-white timer-name text-lg md:text-xl truncate">
                      {currentTimer.name}
                    </h2>
                    {currentTimer?.id && (
                      <p className="text-white/60 text-xs font-mono mt-1">
                        ID: {currentTimer.id}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-white/60 text-sm">
                    {timerIdFromUrl ? 'Loading timer...' : 'Select a timer'}
                  </div>
                )}
              </div>

              {/* Fullscreen Toggle - Top Right */}
              <div className="flex items-center space-x-3">
                {/* Connection status indicator */}
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full connection-indicator ${isConnected ? 'bg-green-400 animate-pulse connected' : 'bg-red-400 disconnected'}`}></div>
                  <span className="text-white/70 text-xs font-medium hidden sm:inline">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                
                {/* Fullscreen Toggle Button */}
                <button
                  className="header-button px-3 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 text-white"
                  onClick={() => setIsFullscreen((f) => !f)}
                  aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? (
                    <Shrink className="w-5 h-5" />
                  ) : (
                    <Expand className="w-5 h-5" />
                  )}
                  <span className="hidden md:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Full screen timer container */}
          <div className={timerContainerClass + ' min-h-screen min-w-full flex items-center justify-center'} style={{...rotatedStyle, minHeight: '100vh', minWidth: '100vw'}}>
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Timer 
                timerState={currentTimer || {
                  remaining: 0,
                  duration: 0,
                  isRunning: false,
                  isFlashing: false,
                  message: '',
                  backgroundColor: '#1e293b',
                  textColor: '#f1f5f9',
                  fontSize: 'text-6xl',
                  styling: { timerView: 'normal' },
                }}
                showMessage={true}
                className={timerFontSize + ' w-full h-full flex-1'}
              />
              {/* Progress Bar (attached, not floating) */}
              {currentTimer && currentTimer.duration > 0 && timerIdFromUrl && (
                (() => {
                  // Use timer background color
                  const barBg = currentTimer.backgroundColor || '#1e293b';
                  return (
                    <div className="w-full" style={{ background: barBg }}>
                      <div className="relative w-full h-3">
                        <div
                          className="absolute right-0 top-0 h-full"
                          style={{
                            width: `${(1 - progressBar) * 100}%`,
                            background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                            transition: currentTimer.isRunning ? 'width 0.5s linear' : 'none',
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>

          {/* Timer selection menu (if no timer in URL) */}
          {!timerIdFromUrl && timerList.length > 0 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 z-20">
              <h3 className="text-white/90 text-lg font-semibold mb-4 text-center">Select a Timer</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {timerList.map((timer) => (
                  <button
                    key={timer.id}
                    onClick={() => viewTimer(timer.id)}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105"
                  >
                    {timer.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* No timers available message */}
          {!timerIdFromUrl && timerList.length === 0 && isConnected && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 z-20">
              <p className="text-white/70 text-center">No timers available</p>
            </div>
          )}
        </>
      ) : (
        // Show a simple message when socket is in failed list
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-white text-2xl font-bold mb-2">Timer Full</h1>
            <p className="text-white/70">This timer has reached its maximum capacity.</p>
          </div>
        </div>
      )}
    </div>
  );
} 