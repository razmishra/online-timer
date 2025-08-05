// utils/themes.js

export const themes = {
  default: {
    name: "Default",
    gradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    backgroundColor: "#1e293b",  // dark blue-gray
    borderColor: "#3b82f6",      // blue-500
    barColor: "#3b82f6",
    textColorPrimary: "#f1f5f9", // slate-100
    textColorSecondary: "#94a3b8", // slate-400
    accent: "#2563eb",           // blue-600
    fontFamily: "'Inter', sans-serif",
    animation: "slowRotate 30s linear infinite",
    timerGlow: "0 0 30px #3b82f699"
  },
  calm: {
    name: "Calm",
    gradient: "linear-gradient(135deg, #a3c4f3 0%, #d1e8ff 100%)",
    backgroundColor: "#a3c4f3",
    borderColor: "#799ed2",
    barColor: "#799ed2",
    textColorPrimary: "#1e293b",
    textColorSecondary: "#475569",
    accent: "#4f83cc",
    fontFamily: "'Merriweather', serif",
    animation: "slowRotate 30s linear infinite",
    timerGlow: "0 0 30px #4f83cc99",
  },
  energetic: {
    name: "Energetic",
    gradient: "linear-gradient(135deg, #ff784f 0%, #ffb199 100%)",
    backgroundColor: "#ff784f",
    borderColor: "#ff5a36",
    barColor: "#ff5a36",
    textColorPrimary: "#fff7f3",
    textColorSecondary: "#ffe0d6",
    accent: "#ff7e55",
    fontFamily: "'Montserrat', sans-serif",
    animation: "slowRotateReverse 40s linear infinite",
    timerGlow: "0 0 40px #ff7e5588",
  },
  retro: {
    name: "Retro",
    gradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    backgroundColor: "#0f0c29",
    borderColor: "#ff0080",
    barColor: "#00ffea",
    textColorPrimary: "#f72585",
    textColorSecondary: "#720026",
    accent: "#00ffea",
    fontFamily: "'Press Start 2P', cursive, monospace",
    animation: "pixelBlink 8s steps(5) infinite",
    timerGlow: "0 0 33px #00ffeaaa",
  },
  night: {
    name: "Night",
    gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    backgroundColor: "#0f2027",
    borderColor: "#1c92d2",
    barColor: "#1c92d2",
    textColorPrimary: "#a0aec0",
    textColorSecondary: "#718096",
    accent: "#63b3ed",
    fontFamily: "'Inter', sans-serif",
    animation: "slowGlow 7s ease-in-out infinite",
    timerGlow: "0 0 28px #63b3edaa",
  },
  forest: {
    name: "Forest",
    gradient: "linear-gradient(135deg, #61733a 0%, #8ba870 100%)",
    backgroundColor: "#61733a",
    borderColor: "#a5b580",
    barColor: "#a5b580",
    textColorPrimary: "#f0ead2",
    textColorSecondary: "#cdd3b2",
    accent: "#e0e3c9",
    fontFamily: "'Roboto Slab', serif",
    animation: "swaySlow 12s ease-in-out infinite",
    timerGlow: "0 0 30px #a5b580aa",
  },
  sunset: {
    name: "Sunset",
    gradient: "linear-gradient(135deg, #fbb034 0%, #ff7046 50%, #f85f73 100%)",
    backgroundColor: "#fbb034",
    borderColor: "#ff6600",
    barColor: "#ff6600",
    textColorPrimary: "#4a1c00",
    textColorSecondary: "#662e00",
    accent: "#ff9900",
    fontFamily: "'Dancing Script', cursive",
    animation: "flowSunset 15s ease-in-out infinite",
    timerGlow: "0 0 40px #ff990088",
  },
  luxeMidnight: {
    name: "Luxe Midnight",
    gradient: "linear-gradient(135deg, #0d0d22 0%, #1a1a40 100%)",
    backgroundColor: "#0d0d22",
    borderColor: "#d4af37",           // Gold
    barColor: "#c9b037",
    textColorPrimary: "#f0e6c8",      // Light goldish
    textColorSecondary: "#b3a34f",
    accent: "#d4af37",
    fontFamily: "'Playfair Display', serif",
    animation: "slowGlow 10s ease-in-out infinite",
    timerGlow: "0 0 30px #d4af3799",
  },

  swissModern: {
    name: "Swiss Modern",
    gradient: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
    backgroundColor: "#ffffff",
    borderColor: "#333333",
    barColor: "#007aff",
    textColorPrimary: "#111111",
    textColorSecondary: "#555555",
    accent: "#007aff",
    fontFamily: "'Inter', sans-serif",
    animation: "pulse-calm 5s ease-in-out infinite",
    timerGlow: "0 0 30px #007aff99",
  },

  nordicFrost: {
    name: "Nordic Frost",
    gradient: "linear-gradient(135deg, #e2ecf4 0%, #c9d8e8 100%)",
    backgroundColor: "#e2ecf4",
    borderColor: "#a6bed4",
    barColor: "#8ca6c8",
    textColorPrimary: "#37475e",
    textColorSecondary: "#5c759e",
    accent: "#5c759e",
    fontFamily: "'Poppins', sans-serif",
    animation: "slowRotateReverse 40s linear infinite",
    timerGlow: "0 0 30px #5c759e88",
  },

  editorsMonochrome: {
    name: "Editor’s Monochrome",
    gradient: "linear-gradient(135deg, #000000 0%, #333333 100%)",
    backgroundColor: "#000000",
    borderColor: "#d72631",        // Accent red
    barColor: "#d72631",
    textColorPrimary: "#fafafa",
    textColorSecondary: "#adadad",
    accent: "#d72631",
    fontFamily: "'Didot', serif",
    animation: "pixelBlink 8s steps(5) infinite",
    timerGlow: "0 0 40px #d7263199",
  },

  techOpulence: {
    name: "Tech Opulence",
    gradient: "linear-gradient(135deg, #121212 0%, #0a0a0a 100%)",
    backgroundColor: "#121212",
    borderColor: "#00ffea",        // Jade green
    barColor: "#00ffea",
    textColorPrimary: "#08f7fe",
    textColorSecondary: "#04c7c7",
    accent: "#08f7fe",
    fontFamily: "'IBM Plex Sans', sans-serif",
    animation: "slowGlow 12s ease-in-out infinite",
    timerGlow: "0 0 40px #08f7feaa",
  },

  roseGoldStatement: {
    name: "Rose Gold Statement",
    gradient: "linear-gradient(135deg, #f7cac9 0%, #f0b8a6 100%)",
    backgroundColor: "#f7cac9",
    borderColor: "#d97c7c",
    barColor: "#d97c7c",
    textColorPrimary: "#392f2f",
    textColorSecondary: "#5a4545",
    accent: "#d97c7c",
    fontFamily: "'Recoleta', serif",
    animation: "flowSunset 15s ease-in-out infinite",
    timerGlow: "0 0 45px #d97c7c99",
  },

  deepEmerald: {
    name: "Deep Emerald",
    gradient: "linear-gradient(135deg, #0b3d0b 0%, #256625 100%)",
    backgroundColor: "#0b3d0b",
    borderColor: "#cdd4a2",
    barColor: "#cdd4a2",
    textColorPrimary: "#e6f1d7",
    textColorSecondary: "#b9caa7",
    accent: "#cdd4a2",
    fontFamily: "'Cormorant Garamond', serif",
    animation: "swaySlow 18s ease-in-out infinite",
    timerGlow: "0 0 40px #cdd4a299",
  },
};

export const themeAnimations = `
@keyframes slowRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes slowRotateReverse {
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}

@keyframes fadePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

@keyframes pixelBlink {
  0%, 30%, 60%, 100% { opacity: 1; }
  15%, 45%, 75% { opacity: 0.5; }
}

@keyframes slowGlow {
  0%, 100% { text-shadow: 0 0 10px #63b3ed88; }
  50% { text-shadow: 0 0 20px #63b3edcc; }
}

@keyframes swaySlow {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(3deg); }
}

@keyframes flowSunset {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;
