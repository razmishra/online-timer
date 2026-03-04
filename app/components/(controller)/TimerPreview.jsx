"use client"
import React from 'react';
import Timer from '../Timer';

const TimerPreview = React.memo(({ currentTimer, timerView, backgroundColor, textColor, fontSize }) => {
  return (
    <div className="relative group/preview">
      <style>{`
        .timer-preview-fit {
          display: flex;
          flex-direction: column;
          min-height: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          container-type: inline-size;
        }

        /* Target the Timer digits container */
        .timer-preview-fit .font-mono {
          /* 20cqw fills ~96% width for HH:MM:SS format */
          font-size: clamp(1.5rem, 20cqw, 12rem) !important;
          max-width: 100% !important;
          width: 100% !important;
          display: flex;
          justify-content: center;
          align-items: center;
          white-space: nowrap !important;
          overflow: hidden;
          line-height: 1;
        }

        .timer-preview-fit > div {
          flex: 1 1 0;
          min-height: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          padding: 0.25rem;
        }

        /* Target the message container */
        .timer-preview-fit .break-words {
          flex: 0 1 auto !important;
          min-height: 0;
          overflow-y: auto;
          font-size: clamp(0.85rem, 8cqw, 2.5rem) !important;
          line-height: 1.1;
          margin-top: 0.25rem !important;
          margin-bottom: 0.25rem !important;
          padding-left: 0.5rem !important;
          padding-right: 0.5rem !important;
          max-width: 100% !important;
          width: 100% !important;
          white-space: pre-wrap !important;
          overflow-wrap: break-word !important;
          word-break: break-word !important;

          /* Hide scrollbar */
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .timer-preview-fit .break-words::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl sm:rounded-3xl blur-lg opacity-0 group-hover/preview:opacity-100 transition-all duration-500"></div>
      <div className="relative aspect-video bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-600/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
        <div className="timer-preview-fit relative">
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