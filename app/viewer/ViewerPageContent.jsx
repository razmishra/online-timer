"use client";

import { useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import Timer from '../components/Timer';
import { useSearchParams } from 'next/navigation';

export default function ViewerPageContent() {
  const { 
    isConnected, 
    currentTimer, 
    timerList, 
    joinTimer,
    selectedTimerId 
  } = useSocket();
  const searchParams = useSearchParams();
  
  // Get timer ID from URL parameter
  const timerIdFromUrl = searchParams.get('timer');

  useEffect(() => {
    if (timerIdFromUrl && isConnected) {
      joinTimer(timerIdFromUrl);
    } else if (!timerIdFromUrl && isConnected && timerList.length > 0) {
      // No timer in URL, showing timer selection
    } else if (!timerIdFromUrl && isConnected && timerList.length === 0) {
      // No timer in URL and no timers available
    }
  }, [timerIdFromUrl, isConnected, joinTimer, timerList]);

  return (
    <div className="viewer-fullscreen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Connection status indicator */}
      <div className="absolute top-6 right-6 flex items-center space-x-2 z-20">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
        <span className="text-white/70 text-sm font-medium">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Full screen timer container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <Timer timerState={currentTimer} showMessage={true} className="w-full h-full" />
      </div>

      {/* Timer selection menu (if no timer in URL) */}
      {!timerIdFromUrl && timerList.length > 0 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 z-20">
          <h3 className="text-white/90 text-lg font-semibold mb-4 text-center">Select a Timer</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {timerList.map((timer) => (
              <button
                key={timer.id}
                onClick={() => joinTimer(timer.id)}
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