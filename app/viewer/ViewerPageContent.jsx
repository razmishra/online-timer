"use client";

import { useEffect, useState, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import Timer from '../components/Timer';
import { useSearchParams } from 'next/navigation';

export default function ViewerPageContent() {
  const { 
    isConnected, 
    currentTimer, 
    timerList, 
    joinTimer,
    viewTimer,
    selectedTimerId 
  } = useSocket();
  const searchParams = useSearchParams();
  
  // Get timer ID from URL parameter
  const timerIdFromUrl = searchParams.get('timer');

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

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

  // Dynamic styles for timer container
  const timerContainerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center w-screen h-screen'
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

  // Dynamic font size for timer
  const timerFontSize = isFullscreen
    ? 'text-[13vw] md:text-[11vw] lg:text-[8vw] xl:text-[6vw]'
    : 'text-[15vw] md:text-[8vw] lg:text-[7vw] xl:text-[6vw]';

  return (
    <div ref={containerRef} className="viewer-fullscreen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      {/* Fullscreen Toggle Button */}
      <div className="absolute top-6 left-6 z-20 flex gap-2">
        <button
          className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 bg-white/20 text-white hover:bg-blue-600/80`}
          onClick={() => setIsFullscreen((f) => !f)}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            // Portrait icon (exit fullscreen)
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <rect x="7" y="3" width="10" height="18" rx="2" className="fill-none stroke-current" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6M9 16h6" />
            </svg>
          ) : (
            // Landscape icon (enter fullscreen)
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <rect x="3" y="7" width="18" height="10" rx="2" className="fill-none stroke-current" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8M8 15h8" />
            </svg>
          )}
          <span className="hidden md:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </button>
      </div>
      {/* Exit Fullscreen Button (top-right, only in fullscreen) */}
      {isFullscreen && (
        <button
          className="fixed top-6 right-6 z-50 bg-white/20 hover:bg-red-600/80 text-white rounded-full p-3 shadow-lg transition-all duration-200"
          onClick={() => setIsFullscreen(false)}
          aria-label="Exit Fullscreen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      {/* Connection status indicator */}
      <div className="absolute top-6 right-6 flex items-center space-x-2 z-20">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
        <span className="text-white/70 text-sm font-medium">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      {/* Full screen timer container */}
      <div className={timerContainerClass} style={rotatedStyle}>
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
    </div>
  );
} 