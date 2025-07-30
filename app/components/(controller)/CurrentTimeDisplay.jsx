
"use client"
import React, { useState, useEffect } from 'react';

const CurrentTimeDisplay = React.memo(() => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group/time">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-800/60 rounded-2xl sm:rounded-3xl"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl sm:rounded-3xl"></div>
      <div className="relative p-4 sm:p-6 lg:p-8 border border-slate-600/40 rounded-2xl sm:rounded-3xl backdrop-blur-sm">
        <div className="absolute top-3 sm:top-6 right-4 sm:right-8 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-400/60 rounded-full animate-bounce"></div>
        <div className="absolute top-6 sm:top-12 right-6 sm:right-12 w-0.5 h-0.5 bg-purple-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-teal-400/60 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center space-x-2 bg-slate-700/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-slate-600/50">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-slate-300 text-xs sm:text-sm font-semibold uppercase tracking-wider">Current Time</span>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent tracking-wider">
              {(() => {
                let timeStr = now.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit', 
                  hour12: true 
                });
                timeStr = timeStr.replace(/\s?(am|pm)$/i, (match) => match.toUpperCase());
                return timeStr;
              })()}
            </div>
            <div className="text-slate-400 text-sm sm:text-base lg:text-lg font-medium">
              {now.toLocaleDateString([], { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CurrentTimeDisplay;