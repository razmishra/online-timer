"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import Timer from "../components/Timer";
import { useSearchParams } from "next/navigation";
import { Expand, Shrink, Settings } from "lucide-react";
import { BRAND_NAME } from "../constants";
import posthog from "posthog-js";
import useUserPlanStore from "@/stores/userPlanStore";
import { themes, themeAnimations } from "@/utils/themes";
import Link from "next/link";

export default function ViewerPageContent() {
  const { isConnected, currentTimer, timerList, viewTimer, timerFullMessage, isCurrentSocketFailed } = useSocket();
  const searchParams = useSearchParams();
  const plan = useUserPlanStore(state => state.plan);
  const isLoading = useUserPlanStore(state => state.isLoading);
  const timerIdFromUrl = searchParams.get("timer");
  const isEmbed = searchParams.get("embed") === "true";

  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const [progressBar, setProgressBar] = useState(1);
  const prevTimerId = useRef(null);
  const prevDuration = useRef(null);
  const hasInitializedRef = useRef(false);
  const lastTimerIdRef = useRef(null);
  const lastConnectionStatusRef = useRef(false);

  // Theme state with default
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  // Initialize timer when plan and connection ready
  useEffect(() => {
    if (isLoading) return;
    if (!isConnected) return;

    const timerIdChanged = lastTimerIdRef.current !== timerIdFromUrl;
    const connectionChanged = lastConnectionStatusRef.current !== isConnected;

    if (timerIdChanged || connectionChanged) {
      hasInitializedRef.current = false;
      lastTimerIdRef.current = timerIdFromUrl;
      lastConnectionStatusRef.current = isConnected;
    }

    if (hasInitializedRef.current) return;

    if (timerIdFromUrl) {
      viewTimer(timerIdFromUrl, plan.maxConnectionsAllowed);
      hasInitializedRef.current = true;
    } else if (timerList.length >= 0) {
      hasInitializedRef.current = true;
    }
  }, [timerIdFromUrl, isConnected, isLoading, plan.maxConnectionsAllowed, timerList.length, viewTimer]);

  // Fullscreen API handling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isFullscreen) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();

      if (posthog.__initialized) posthog.capture("viewer_fullscreen_entered");
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        if (posthog.__initialized) posthog.capture("viewer_fullscreen_exited");
      }
    }
  }, [isFullscreen]);

  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Update progress bar when timer updates
  useEffect(() => {
    if (!currentTimer || !currentTimer.duration) return;

    if (currentTimer.id !== prevTimerId.current || currentTimer.duration !== prevDuration.current) {
      setProgressBar(1);
      prevTimerId.current = currentTimer.id;
      prevDuration.current = currentTimer.duration;
      return;
    }

    let progress;
    if (currentTimer.styling?.timerView === "countup") {
      progress = (currentTimer.duration - currentTimer.remaining) / currentTimer.duration;
    } else {
      progress = currentTimer.remaining / currentTimer.duration;
    }
    progress = Math.max(0, Math.min(progress, 1));
    if (currentTimer.isRunning) {
      setProgressBar(progress);
    }
  }, [currentTimer]);

  // Outside click handler for settings popover
  useEffect(() => {
    if (!showSettings) return; // only attach when open

    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettings]);

  // Handle timer selection manually
  const handleTimerSelection = (timerId) => {
    viewTimer(timerId, plan.maxConnectionsAllowed);
    setShowSettings(false);
  };

  // Toggle settings popover
  const toggleSettings = () => setShowSettings(v => !v);

  // Handle theme change
  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    if (posthog.__initialized) {
      posthog.capture("viewer_theme_changed", { theme, timerId: timerIdFromUrl });
    }
  };

  // Current theme config & CSS variables
  const theme = themes[selectedTheme] || themes.calm;
  const cssVars = {
    "--theme-gradient": theme.gradient,
    "--background-color": theme.backgroundColor,
    "--border-color": theme.borderColor,
    "--bar-color": theme.barColor,
    "--text-color-primary": theme.textColorPrimary,
    "--text-color-secondary": theme.textColorSecondary,
    "--accent-color": theme.accent,
    "--font-family": theme.fontFamily,
    "--timer-glow": theme.timerGlow,
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          background: isEmbed ? "transparent" : theme.gradient,
          fontFamily: theme.fontFamily,
          color: theme.textColorPrimary,
        }}
      >
        <style>{themeAnimations}</style>
        {!isEmbed && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto mb-6" />
            <h1 className="text-2xl font-semibold mb-2">Loading Timer Settings...</h1>
            <p>Please wait while we fetch your plan details.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <style>{themeAnimations}</style>
      <div
        ref={containerRef}
        className="flex flex-col min-h-screen relative select-none"
        style={{
          background: isEmbed ? "transparent" : cssVars["--theme-gradient"],
          color: cssVars["--text-color-primary"],
          fontFamily: cssVars["--font-family"],
          overflow: "hidden",
        }}
      >
        {/* Background rotating blobs */}
        {!isEmbed && (
          <>
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-220px",
                left: "-220px",
                width: "600px",
                height: "600px",
                borderRadius: "50%",
                backgroundColor: cssVars["--accent-color"],
                opacity: 0.15,
                animation: "slowRotate 35s linear infinite",
                zIndex: 0,
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: "-220px",
                right: "-220px",
                width: "600px",
                height: "600px",
                borderRadius: "50%",
                backgroundColor: cssVars["--bar-color"],
                opacity: 0.12,
                animation: "slowRotateReverse 40s linear infinite",
                zIndex: 0,
              }}
            />
          </>
        )}

        {/* Header */}
        {!isEmbed && (
          <header
            className="flex items-center justify-between px-6 py-4 sticky top-0 backdrop-blur-sm bg-white/10 z-30 border-b border-solid"
            style={{ borderColor: cssVars["--border-color"] }}
          >
            <Link href="/" className="flex items-center space-x-3" aria-label="Go to homepage">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/30"
                aria-hidden="true"
              >
                {/* Your SVG logo */}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke={cssVars["--text-color-primary"]}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-lg font-bold tracking-wider cursor-pointer" style={{ color: cssVars["--text-color-primary"] }}>
                {BRAND_NAME}
              </div>
            </Link>
            <div className="flex-1 text-center text-lg font-semibold max-w-lg truncate">
              {currentTimer?.name || (timerIdFromUrl ? "Loading timer..." : "Select a timer")}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? "bg-green-400 animate-pulse" : "bg-red-500"
                  }`}
                  aria-label={isConnected ? "Connected" : "Disconnected"}
                />
                <span className="hidden sm:inline text-sm opacity-70">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ color: cssVars["--text-color-primary"] }}
              >
                {isFullscreen ? <Shrink size={20} /> : <Expand size={20} />}
              </button>

              <button
                onClick={toggleSettings}
                aria-label="Open Settings"
                className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ color: cssVars["--text-color-primary"] }}
              >
                <Settings size={20} />
              </button>
            </div>
          </header>
        )}

        {/* Settings popover */}
        {!isEmbed && showSettings && (
          <div
            ref={settingsRef}
            className="absolute top-16 right-6 z-50 rounded-2xl border shadow-lg backdrop-blur-xl"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              borderColor: "rgba(100, 100, 100, 0.3)",
              width: 280,
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            <div className="p-5 space-y-4">
              <h2 className="font-bold text-lg text-gray-900">Select Theme</h2>
              <div className="flex flex-col gap-2">
                {Object.keys(themes).map((key) => {
                  const t = themes[key];
                  const selected = selectedTheme === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleThemeChange(key)}
                      className={`flex items-center justify-between px-4 py-2 rounded-lg focus:outline-none transition-shadow ${
                        selected
                          ? "shadow-lg bg-blue-500 text-white"
                          : "hover:bg-gray-200 text-gray-900"
                      }`}
                      aria-pressed={selected}
                    >
                      <span style={{ fontFamily: t.fontFamily }}>{t.name}</span>
                      <span
                        aria-hidden="true"
                        style={{
                          backgroundColor: t.accent,
                          width: 24,
                          height: 24,
                          borderRadius: "9999px",
                          border: selected ? "2px solid white" : "none",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Main Timer Container */}
        <main className="flex flex-col items-center justify-center flex-grow px-4 py-12 relative z-10">
          <div className="max-w-4xl w-full flex flex-col items-center gap-10">
            <Timer
              timerState={
                currentTimer ?? {
                  remaining: 0,
                  duration: 0,
                  isRunning: false,
                  isFlashing: false,
                  message: "",
                  styling: { timerView: "normal" },
                  textColor: cssVars["--text-color-primary"],
                }
              }
              showMessage={true}
              className="w-full max-w-4xl"
              style={{
                color: cssVars["--text-color-primary"],
                "--timer-glow": cssVars["--timer-glow"],
                "--accent": cssVars["--accent-color"],
              }}
            />

            {/* Progress bar fixed at bottom */}
            {!isEmbed && currentTimer && currentTimer.duration > 0 && timerIdFromUrl && (
              <div
                className="fixed bottom-0 left-0 right-0 h-4 w-full z-50 rounded-t-lg shadow-inner"
                style={{
                  background: "rgba(0, 0, 0, 0.1)",
                  borderTop: `2px solid ${theme.borderColor}`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="h-full rounded-t-lg transition-all duration-500 ease-linear"
                  style={{
                    width: `${progressBar * 100}%`,
                    backgroundColor: theme.barColor,
                    boxShadow: `0 0 10px ${theme.accent}88`,
                  }}
                />
              </div>
            )}
          </div>
        </main>

        {/* Timer selection overlay */}
        {!isEmbed && !timerIdFromUrl && timerList.length > 0 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 z-20 max-w-lg w-full mx-4">
            <h3 className="text-center text-white text-lg font-semibold mb-4">Select a Timer</h3>
            <div className="flex flex-wrap justify-center gap-3 max-h-52 overflow-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300">
              {timerList.map((timer) => (
                <button
                  key={timer.id}
                  onClick={() => handleTimerSelection(timer.id)}
                  className="py-2 px-5 rounded-xl bg-white/30 hover:bg-white/50 text-white font-semibold transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1"
                  style={{ fontFamily: theme.fontFamily }}
                >
                  {timer.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No timer available */}
        {!isEmbed && !timerIdFromUrl && timerList.length === 0 && isConnected && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 z-20 max-w-xs w-full mx-5 text-center">
            <p className="text-white text-lg">No timers available</p>
          </div>
        )}

        {/* Timer full message */}
        {!isEmbed && timerFullMessage && isCurrentSocketFailed() && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3 max-w-md font-semibold">
            <svg
              className="w-6 h-6 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 9v2m0 4h.01M6.938 20h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4a2.23 2.23 0 00-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>{timerFullMessage}</span>
          </div>
        )}
      </div>
    </>
  );
}