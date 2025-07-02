import React, { useState, useEffect, useRef } from "react";

const FlipClock = ({
  // Time configuration
  initialTime = 3600, // seconds
  autoStart = true,
  onComplete = () => {},
  onTick = () => {},

  // Display configuration
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  show24Hours = false,

  // Animation configuration
  flipDirection = "auto", // 'up', 'down', 'auto'
  animationDuration = 600,
  flipDelay = 50,

  // Styling
  size = "medium", // 'small', 'medium', 'large', 'custom'
  customSize = null,
  theme = "dark", // 'dark', 'light', 'neon', 'retro'
  customColors = null,

  // Separators
  showSeparators = true,
  separatorChar = ":",
  separatorStyle = {},

  // Card styling
  cardBorderRadius = 8,
  cardShadow = true,
  cardPadding = null,

  // Advanced
  className = "",
  style = {},
  disabled = false,
  pauseOnHover = false,

  // Control props
  isRunning: controlledRunning = null,
  onToggle = null,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart && !disabled);
  const [displayTime, setDisplayTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [flipStates, setFlipStates] = useState({});
  const [previousValues, setPreviousValues] = useState({});
  const intervalRef = useRef(null);
  const lastTimeRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Theme configurations
  const themes = {
    dark: {
      background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
      color: "#ffffff",
      shadowColor: "rgba(0, 0, 0, 0.3)",
      borderColor: "#444",
    },
    light: {
      background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
      color: "#333333",
      shadowColor: "rgba(0, 0, 0, 0.1)",
      borderColor: "#ddd",
    },
    neon: {
      background: "linear-gradient(145deg, #0a0a0a, #1a0a1a)",
      color: "#00ff88",
      shadowColor: "rgba(0, 255, 136, 0.3)",
      borderColor: "#00ff88",
    },
    retro: {
      background: "linear-gradient(145deg, #8B4513, #654321)",
      color: "#FFD700",
      shadowColor: "rgba(255, 215, 0, 0.3)",
      borderColor: "#CD853F",
    },
  };

  // Size configurations
  const sizes = {
    small: { fontSize: 24, cardWidth: 40, cardHeight: 60 },
    medium: { fontSize: 36, cardWidth: 60, cardHeight: 80 },
    large: { fontSize: 48, cardWidth: 80, cardHeight: 100 },
    custom: customSize || { fontSize: 36, cardWidth: 60, cardHeight: 80 },
  };

  const currentTheme = customColors || themes[theme];
  const currentSize = sizes[size];

  // Convert seconds to time object
  const convertToTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return { hours: h, minutes: m, seconds: s };
  };

  // Update display time and handle flips
  useEffect(() => {
    const newTime = convertToTime(timeLeft);
    const oldTime = lastTimeRef.current || newTime;

    // Determine flip direction
    const getFlipDirection = (oldVal, newVal) => {
      if (flipDirection === "up") return "up";
      if (flipDirection === "down") return "down";
      return newVal > oldVal ? "up" : "down";
    };

    // Update flip states and store previous values
    const newFlipStates = {};
    const newPreviousValues = {};

    if (showHours && newTime.hours !== oldTime.hours) {
      newFlipStates.hours = getFlipDirection(oldTime.hours, newTime.hours);
      newPreviousValues.hours = oldTime.hours;
    }
    if (showMinutes && newTime.minutes !== oldTime.minutes) {
      newFlipStates.minutes = getFlipDirection(
        oldTime.minutes,
        newTime.minutes
      );
      newPreviousValues.minutes = oldTime.minutes;
    }
    if (showSeconds && newTime.seconds !== oldTime.seconds) {
      newFlipStates.seconds = getFlipDirection(
        oldTime.seconds,
        newTime.seconds
      );
      newPreviousValues.seconds = oldTime.seconds;
    }

    if (Object.keys(newFlipStates).length > 0) {
      setPreviousValues(newPreviousValues);
      setFlipStates(newFlipStates);
      setTimeout(() => {
        setFlipStates({});
        setPreviousValues({});
      }, animationDuration);
    }

    setDisplayTime(newTime);
    lastTimeRef.current = newTime;
  }, [
    timeLeft,
    showHours,
    showMinutes,
    showSeconds,
    flipDirection,
    animationDuration,
  ]);

  // Timer logic
  useEffect(() => {
    const running = controlledRunning !== null ? controlledRunning : isRunning;

    if (running && !disabled && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = Math.max(0, prev - 1);
          onTick(newTime);
          if (newTime === 0) {
            onComplete();
            if (controlledRunning === null) {
              setIsRunning(false);
            }
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    controlledRunning !== null ? controlledRunning : isRunning,
    disabled,
    isPaused,
    timeLeft,
    onTick,
    onComplete,
  ]);

  // Toggle function
  const toggle = () => {
    if (controlledRunning === null) {
      setIsRunning((prev) => !prev);
    }
    onToggle && onToggle();
  };

  // Pause on hover
  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) setIsPaused(false);
  };

  // Flip card component with enhanced animation
  const FlipCard = ({ value, unit, isFlipping, flipDir, previousValue }) => {
    const displayValue = String(value).padStart(2, "0");
    const prevDisplayValue = String(previousValue || value).padStart(2, "0");

    const cardStyle = {
      background: currentTheme.background,
      color: currentTheme.color,
      borderRadius: cardBorderRadius,
      border: `1px solid ${currentTheme.borderColor}`,
      boxShadow: cardShadow ? `0 6px 12px ${currentTheme.shadowColor}` : "none",
      fontSize: currentSize.fontSize,
      fontWeight: "bold",
      fontFamily: "monospace",
      padding: cardPadding || "0.2em",
    };

    return (
      <div
        className={`flip-card ${isFlipping ? `flipping-${flipDir}` : ""}`}
        style={{
          width: currentSize.cardWidth,
          height: currentSize.cardHeight,
          position: "relative",
          perspective: "1000px",
        }}
      >
        {/* Static background card */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...cardStyle,
            zIndex: 1,
          }}
        >
          {displayValue}
        </div>

        {/* Animated flip cards - only visible during flip */}
        {isFlipping && (
          <>
            {/* Top half - shows current value, flips away */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "50%",
                top: 0,
                overflow: "hidden",
                transformOrigin: "bottom",
                transform:
                  flipDir === "down"
                    ? `rotateX(${
                        (-90 * (Date.now() % animationDuration)) /
                        animationDuration
                      }deg)`
                    : "rotateX(0deg)",
                transition: `transform ${animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                animation:
                  flipDir === "down"
                    ? `flipTopDown ${animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`
                    : "none",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: currentSize.cardHeight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...cardStyle,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                {prevDisplayValue}
              </div>
            </div>

            {/* Bottom half - shows next value, flips in */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "50%",
                bottom: 0,
                overflow: "hidden",
                transformOrigin: "top",
                transform:
                  flipDir === "down" ? "rotateX(90deg)" : "rotateX(0deg)",
                animation:
                  flipDir === "down"
                    ? `flipBottomUp ${animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`
                    : "none",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: currentSize.cardHeight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...cardStyle,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  transform: "translateY(-50%)",
                }}
              >
                {displayValue}
              </div>
            </div>

            {/* For upward flip */}
            {flipDir === "up" && (
              <>
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "50%",
                    bottom: 0,
                    overflow: "hidden",
                    transformOrigin: "top",
                    animation: `flipBottomDown ${animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                    zIndex: 3,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: currentSize.cardHeight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...cardStyle,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      transform: "translateY(-50%)",
                    }}
                  >
                    {prevDisplayValue}
                  </div>
                </div>

                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "50%",
                    top: 0,
                    overflow: "hidden",
                    transformOrigin: "bottom",
                    transform: "rotateX(-90deg)",
                    animation: `flipTopUp ${animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: currentSize.cardHeight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...cardStyle,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  >
                    {displayValue}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* CSS Animations */}
        <style>
          {`
            @keyframes flipTopDown {
              0% { transform: rotateX(0deg); }
              100% { transform: rotateX(-90deg); }
            }
            @keyframes flipBottomUp {
              0% { transform: rotateX(90deg); }
              100% { transform: rotateX(0deg); }
            }
            @keyframes flipBottomDown {
              0% { transform: rotateX(0deg); }
              100% { transform: rotateX(90deg); }
            }
            @keyframes flipTopUp {
              0% { transform: rotateX(-90deg); }
              100% { transform: rotateX(0deg); }
            }
          `}
        </style>
      </div>
    );
  };

  // Separator component
  const Separator = () =>
    showSeparators ? (
      <div
        style={{
          fontSize: currentSize.fontSize * 0.8,
          color: currentTheme.color,
          fontWeight: "bold",
          fontFamily: "monospace",
          display: "flex",
          alignItems: "center",
          margin: "0 8px",
          textShadow:
            theme === "neon" ? `0 0 10px ${currentTheme.color}` : "none",
          ...separatorStyle,
        }}
      >
        {separatorChar}
      </div>
    ) : null;

  return (
    <div
      className={`flip-clock ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        userSelect: "none",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "default",
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={!disabled ? toggle : undefined}
    >
      {showHours && (
        <>
          <FlipCard
            value={displayTime.hours}
            previousValue={previousValues.hours}
            unit="hours"
            isFlipping={flipStates.hours}
            flipDir={flipStates.hours}
          />
          <Separator />
        </>
      )}

      {showMinutes && (
        <>
          <FlipCard
            value={displayTime.minutes}
            previousValue={previousValues.minutes}
            unit="minutes"
            isFlipping={flipStates.minutes}
            flipDir={flipStates.minutes}
          />
          {showSeconds && <Separator />}
        </>
      )}

      {showSeconds && (
        <FlipCard
          value={displayTime.seconds}
          previousValue={previousValues.seconds}
          unit="seconds"
          isFlipping={flipStates.seconds}
          flipDir={flipStates.seconds}
        />
      )}
    </div>
  );
};

// Demo component
const FlipClockTimer = (props) => {
  const {
    initialTime,
    showHours,
    showMinutes,
    showSeconds,
    flipDirection,
    animationDuration,
    flipDelay,
    size,
    theme,
    customColors,
    showSeparators,
    separatorChar,
    separatorStyle,
    cardBorderRadius,
    cardShadow,
    cardPadding,
    className,
    style,
    disabled,
    pauseOnHover,
    // isRunning,
    onToggle,
    onComplete,
    onTick,
  } = props;
  const [config, setConfig] = useState({
    initialTime: initialTime,
    theme: "dark",
    size: size,
    showHours: showHours,
    showMinutes: true,
    showSeconds: true,
    flipDirection: "auto",
    animationDuration: 600,
    autoStart: true,
  });

  const [isRunning, setIsRunning] = useState(null);

  return (
    <div style={{ padding: "2rem", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ color: "#333", marginBottom: "1rem" }}>
          Modern Flip Clock
        </h1>

        <FlipClock
          {...config}
          isRunning={isRunning}
          onToggle={() =>
            setIsRunning((prev) => (prev === null ? false : !prev))
          }
          onComplete={() => alert("Timer completed!")}
          onTick={(timeLeft) => console.log("Time left:", timeLeft)}
          pauseOnHover={true}
        />
      </div>

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#333", marginBottom: "1rem" }}>Configuration</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Initial Time (seconds):
            </label>
            <input
              type="number"
              value={config.initialTime}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  initialTime: parseInt(e.target.value) || 0,
                }))
              }
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Theme:
            </label>
            <select
              value={config.theme}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, theme: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="neon">Neon</option>
              <option value="retro">Retro</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Size:
            </label>
            <select
              value={config.size}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, size: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Flip Direction:
            </label>
            <select
              value={config.flipDirection}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  flipDirection: e.target.value,
                }))
              }
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <option value="auto">Auto</option>
              <option value="up">Up</option>
              <option value="down">Down</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Animation Duration (ms):
            </label>
            <input
              type="number"
              value={config.animationDuration}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  animationDuration: parseInt(e.target.value) || 600,
                }))
              }
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <label
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <input
              type="checkbox"
              checked={config.showHours}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, showHours: e.target.checked }))
              }
            />
            Show Hours
          </label>
          <label
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <input
              type="checkbox"
              checked={config.showMinutes}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  showMinutes: e.target.checked,
                }))
              }
            />
            Show Minutes
          </label>
          <label
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <input
              type="checkbox"
              checked={config.showSeconds}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  showSeconds: e.target.checked,
                }))
              }
            />
            Show Seconds
          </label>
          <label
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <input
              type="checkbox"
              checked={config.autoStart}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, autoStart: e.target.checked }))
              }
            />
            Auto Start
          </label>
        </div>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() =>
              setIsRunning((prev) => (prev === null ? false : !prev))
            }
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            {isRunning === false ? "Start" : "Pause"}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setConfig((prev) => ({ ...prev, initialTime: prev.initialTime }));
            }}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div
        style={{
          maxWidth: "800px",
          margin: "2rem auto",
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#333", marginBottom: "1rem" }}>Features</h2>
        <ul style={{ color: "#666", lineHeight: "1.6" }}>
          <li>🕐 Countdown timer with customizable initial time</li>
          <li>🎯 Dynamic flip animations (up, down, or auto)</li>
          <li>👀 Configurable visibility (hours, minutes, seconds)</li>
          <li>🎨 Multiple themes (dark, light, neon, retro)</li>
          <li>📏 Multiple sizes (small, medium, large, custom)</li>
          <li>⏯️ Controllable start/pause/reset functionality</li>
          <li>🎨 Extensive customization options</li>
          <li>🖱️ Pause on hover functionality</li>
          <li>🔔 Completion and tick callbacks</li>
          <li>💫 Smooth 3D flip animations</li>
        </ul>
      </div>
    </div>
  );
};

export default FlipClockTimer;
