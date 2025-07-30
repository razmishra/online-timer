"use client"
import React, { useEffect, useState } from 'react';
import Timer from '../Timer';

const TimerPreview = React.memo(({ currentTimer, timerView, backgroundColor, textColor, fontSize }) => {
  return (
    <div className="relative group/preview">
      <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl sm:rounded-3xl blur-lg opacity-0 group-hover/preview:opacity-100 transition-all duration-500"></div>
      <div className="relative aspect-video bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-600/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
        <div className="relative h-full w-full">
          <Timer
            timerState={currentTimer ? {
              ...currentTimer,
              styling: {
                ...currentTimer.styling,
                timerView,
                backgroundColor,
                textColor,
                fontSize,
              },
            } : null}
            showMessage={true}
            className="h-full w-full"
            isPreview={true}
          />
        </div>
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400/60 rounded-full animate-ping"></div>
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-400/60 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
});

export default TimerPreview;