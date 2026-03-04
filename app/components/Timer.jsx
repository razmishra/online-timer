"use client";

import dynamic from "next/dynamic";
const FlipClockTimer = dynamic(() => import("./FlipClock"), { ssr: false });
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

const formatTime = (seconds) => {
  if (seconds === undefined || seconds === null || isNaN(seconds)) return "00:00";
  const absSeconds = Math.abs(seconds);
  const h = Math.floor(absSeconds / 3600);
  const m = Math.floor((absSeconds % 3600) / 60);
  const s = absSeconds % 60;
  const str = h > 0
    ? `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    : `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return (seconds < 0 ? "-" : "") + str;
};

export default function Timer({ timerState, showMessage = true, className = "", isPreview = false }) {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get("embed") === "true";
  const { remaining, message, isRunning, isFlashing, styling = {}, duration } = timerState ?? {};
  const timerView = styling?.timerView || "normal";

  const [localElapsed, setLocalElapsed] = useState(duration - remaining);
  const lastServerElapsed = useRef(duration - remaining);
  const lastIsRunning = useRef(isRunning);
  const lastTimerView = useRef(timerView);

  useEffect(() => {
    if (timerView === "countup") {
      const serverElapsed = duration - remaining;
      if (
        lastServerElapsed.current !== serverElapsed ||
        lastIsRunning.current !== isRunning ||
        lastTimerView.current !== timerView
      ) {
        setLocalElapsed(serverElapsed);
        lastServerElapsed.current = serverElapsed;
        lastIsRunning.current = isRunning;
        lastTimerView.current = timerView;
      }
    }
  }, [timerView, isRunning, duration, remaining]);

  useEffect(() => {
    if (timerView === "countup" && isRunning) {
      const interval = setInterval(() => {
        setLocalElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerView, isRunning]);

  let displayTime = remaining;
  if (timerView === "countup") {
    displayTime = isRunning ? localElapsed : duration - remaining;
    if (displayTime < 0) displayTime = 0;
  }

  if (!timerState) {
    return (
      <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
        {!isEmbed && (
          <>
            <div className="text-4xl font-light text-white/60 mb-4">⏱️</div>
            <div className="text-2xl font-medium text-white/70">No timer selected</div>
            <div className="text-sm text-white/50 mt-2">Waiting for timer to start...</div>
          </>
        )}
      </div>
    );
  }

  if (timerView === "flip") {
    return (
      <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
        <FlipClockTimer
          initialTime={60}
          showHours={true}
          showMinutes={true}
          showSeconds={true}
          flipDirection="up"
          animationDuration={600}
          flipDelay={50}
          size="medium"
          theme="dark"
          className=""
        />
        {showMessage && message && (
          <div className="mt-8 max-w-4xl break-words px-4 font-bold leading-tight" style={{ color: "var(--text-color-primary)", whiteSpace: "pre-wrap" }}>
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center w-full h-full no-scrollbar px-[2cqw] ${className}`} style={{ background: isEmbed ? "transparent" : "inherit", containerType: 'inline-size', minHeight: '100%' }}>
      <div
        className={`font-mono font-bold leading-none shrink-0 ${isFlashing ? "animate-pulse text-red-500" : ""}`}
        style={{
          fontSize: isPreview 
            ? "clamp(1rem, 20cqw, 12rem)" 
            : (showMessage && message) 
              ? "clamp(2rem, 20cqw, 18rem)" 
              : "clamp(2rem, 23cqw, 26rem)",
          color: remaining < 0 ? '#ff0000' : "var(--text-color-primary)",
          textShadow: `0 0 20px var(--timer-glow), 0 0 5px var(--accent-color)`,
          userSelect: "none",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          whiteSpace: "nowrap",
          transition: "font-size 0.4s ease",
          animation:
            isFlashing
              ? "flashTimer 1s steps(1, end) infinite"
              : isRunning
              ? "fadePulse 3s ease-in-out infinite"
              : "none",
        }}
      >
        {formatTime(displayTime)}
      </div>
      {showMessage && message && (
        <div
          className={`px-6 break-words no-scrollbar ${(typeof message === 'object' && message.styling?.uppercase) ? 'uppercase' : ''}`}
          style={{
            fontSize: 'clamp(1rem, 8cqw, 4.5rem)',
            color: typeof message === 'object' && message.styling?.color 
              ? (message.styling.color === 'red' ? '#DD524C' : message.styling.color === 'green' ? '#4ade80' : '#ffffff')
              : 'var(--text-color-primary)',
            fontWeight: (typeof message === 'object' && message.styling?.bold) ? 900 : 500,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            lineHeight: 1.1,
            textTransform: (typeof message === 'object' && message.styling?.uppercase) ? 'uppercase' : 'none',
            textShadow: 'none',
            userSelect: 'none',
            width: '100%',
            maxHeight: '40vh',
            overflowY: 'auto',
            marginTop: '1.5rem',
            marginBottom: '1rem',
            whiteSpace: 'pre-wrap',
          }}
          role="banner"
          aria-live="polite"
        >
          {typeof message === 'object' ? message.text : message}
        </div>
      )}
    </div>
  );
}