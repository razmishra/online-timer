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
          <div className="mt-8 max-w-4xl break-words px-4 font-bold leading-tight" style={{ color: "var(--text-color-primary)" }}>
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`} style={{ background: isEmbed ? "transparent" : "inherit" }}>
      <div
        className={`font-mono font-bold leading-none ${isFlashing ? "animate-pulse text-red-500" : ""}`}
        style={{
          fontSize: ((showMessage && message) || (isPreview)) ? "min(10vw, 7rem)" : "min(19vw, 17rem)",
          color: remaining < 0 ? '#ff4d4f' : "var(--text-color-primary)",
          textShadow: `0 0 15px var(--timer-glow), 0 0 5px var(--accent-color)`,
          userSelect: "none",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          maxWidth: "90vw",
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
          className="mb-10 max-w-4xl px-6 break-words"
          style={{
            fontSize: 'min(8vw, 4.5rem)',
            color: 'var(--text-color-primary)',
            fontWeight: 700,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            lineHeight: 1.1,
            textTransform: 'none',
            textShadow: 'none',
            userSelect: 'none',
            maxWidth: '90vw',
            marginBottom: '2rem',
          }}
          role="banner"
          aria-live="polite"
        >
          {message}
        </div>
      )}
    </div>
  );
}