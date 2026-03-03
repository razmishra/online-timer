const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = createServer(app);

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
  }
});

// Default (free) viewer limit — used to trigger single-event plan reset when exceeded
const DEFAULT_MAX_CONNECTIONS = 4;

// Global variables
const timers = new Map(); // timerId -> Timer instance
const controllerTimers = new Map(); // controllerId -> Set of timerIds
const controllerToSocket = new Map(); // controllerId -> Set of socketIds

// Room name for a timer (one Socket.IO room per timer)
function timerRoomId(timerId) {
  return "timer:" + timerId;
}

// Helper function to generate unique IDs
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Timer class for managing individual timers
class Timer {
  constructor(id, name, duration, maxConnectionsAllowed, maxTimersAllowed) {
    this.id = id;
    this.name = name;
    this.duration = duration; // in seconds
    this.originalDuration = duration; // Store the original duration for reset
    this.remaining = duration;
    this.isRunning = false;
    this.maxConnectionsAllowed = maxConnectionsAllowed ?? 4;
    this.maxTimersAllowed = maxTimersAllowed ?? 3;
    this.startTime = null;
    this.message = '';
    this.backgroundColor = '#1f2937';
    this.textColor = '#ffffff';
    this.fontSize = 'text-6xl';
    this.isFlashing = false;
    this.interval = null;
    this.controllerId = null;
    this.timerView = 'normal';
    this.joiningCode = ''; // Unique code for joining the timer
  }

  start() {
    if (!this.isRunning && this.remaining > 0) {
      this.isRunning = true;
      this.startTime = Date.now();
      this.interval = setInterval(() => this.update(), 1000);
      this.update();
    } else {
      console.log(`Timer ${this.id} start failed: isRunning=${this.isRunning}, remaining=${this.remaining}`);
    }
  }

  pause() {
    if (this.isRunning) {
      this.isRunning = false;
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.remaining = this.duration - elapsed;
      this.duration = Math.abs(this.remaining);
      
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      
      this.update();
    }
  }

  reset() {
    this.isRunning = false;
    this.duration = this.originalDuration; // Restore to original duration
    this.remaining = this.originalDuration;
    this.startTime = null;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.update();
  }

  setDuration(duration) {
    this.duration = duration;
    this.originalDuration = duration; // Update original duration on set
    this.remaining = duration;
    this.isRunning = false;
    this.startTime = null;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.update();
  }

  adjustTime(seconds) {
    const newDuration = Math.max(0, this.duration + seconds);
    if (this.isRunning) {
      // Calculate elapsed time
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      // Update duration
      this.duration = newDuration;
      // Update remaining based on new duration and elapsed
      this.remaining = Math.max(0, this.duration - elapsed);
      // If timer already finished, stop it
      if (this.remaining <= 0) {
        this.isRunning = false;
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = null;
        }
        this.startTime = null;
      }
      this.update();
    } else {
      this.setDuration(newDuration);
    }
  }

  update() {
    if (this.isRunning && this.startTime) {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.remaining = this.duration - elapsed;
    }
    const roomId = timerRoomId(this.id);
    if (io) {
      io.to(roomId).emit("timer-update", this.getState());
    }
  }

  updateMessage(message) {
    this.message = message;
    this.update();
  }

  clearMessage() {
    this.message = '';
    this.update();
  }

  updateStyling(styling) {
    this.backgroundColor = styling.backgroundColor || this.backgroundColor;
    this.textColor = styling.textColor || this.textColor;
    this.fontSize = styling.fontSize || this.fontSize;
    this.timerView = styling.timerView || this.timerView;
    this.update();
  }

  toggleFlash(isFlashing) {
    this.isFlashing = isFlashing;
    this.update();
  }

  updatejoiningCode(joiningCode) {
    this.joiningCode = joiningCode;
    this.update();
  }

  getState() {
    const roomId = timerRoomId(this.id);
    const connectedCount = io?.sockets?.adapter?.rooms?.get(roomId)?.size ?? 0;
    return {
      id: this.id,
      name: this.name,
      duration: this.duration,
      remaining: this.remaining,
      isRunning: this.isRunning,
      message: this.message,
      backgroundColor: this.backgroundColor,
      textColor: this.textColor,
      fontSize: this.fontSize,
      isFlashing: this.isFlashing,
      connectedCount,
      joiningCode: this.joiningCode,
      maxConnectionsAllowed: this.maxConnectionsAllowed,
      maxTimersAllowed: this.maxTimersAllowed,
      styling: {
        backgroundColor: this.backgroundColor,
        textColor: this.textColor,
        fontSize: this.fontSize,
        timerView: this.timerView || "normal",
      },
    };
  }
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timers: timers.size,
    connectedSockets: io.sockets.sockets?.size ?? 0,
  });
});

// Helper: get timers for a controller (connectedCount from room size)
function getTimersForController(controllerId) {
  const timerIds = controllerTimers.get(controllerId) || new Set();
  return Array.from(timerIds)
    .map((id) => {
      const timer = timers.get(id);
      if (!timer) return null;
      const roomId = timerRoomId(id);
      const connectedCount = io?.sockets?.adapter?.rooms?.get(roomId)?.size ?? 0;
      return {
        id: timer.id,
        name: timer.name,
        duration: timer.duration,
        connectedCount,
        joiningCode: timer.joiningCode || "",
        maxConnectionsAllowed: timer.maxConnectionsAllowed,
        maxTimersAllowed: timer.maxTimersAllowed,
        isRunning: timer.isRunning,
      };
    })
    .filter(Boolean);
}

// Helper: emit timer-list only for the requesting controller
function emitTimerListForController(socket, controllerId) {
  socket.emit('timer-list', getTimersForController(controllerId));
}

// Socket.IO connection handling
io.on('connection', (socket) => {

    // --- JOIN TIMER (room-based) ---
  socket.on("join-timer", ({ timerId, controllerId }) => {
    if (!controllerId) return;
    const timer = timers.get(timerId);
    if (!timer) {
      socket.emit("timer-not-found", { timerId });
      return;
    }
    const roomId = timerRoomId(timerId);
    socket.join(roomId);
    const roomSize = io.sockets.adapter.rooms.get(roomId)?.size ?? 0;
    if (roomSize >= timer.maxConnectionsAllowed) {
      socket.leave(roomId);
      socket.emit("timer-full", { timerId, failedSocketId: socket.id });
      const controllerSocketIds =
        controllerToSocket.get(timer.controllerId) || new Set();
      controllerSocketIds.forEach((controllerSocketId) => {
        const controllerSocket = io.sockets.sockets.get(controllerSocketId);
        if (controllerSocket) {
          controllerSocket.emit("limit-exceeded", {
            timerId,
            type: "viewers",
            reason: "timer_full",
            message: `You've reached the maximum number of viewers (${timer.maxConnectionsAllowed-1}) for your plan. Upgrade to allow more viewers.`,
          });
        }
      });
      return;
    }
    if (!controllerToSocket.has(controllerId)) {
      controllerToSocket.set(controllerId, new Set());
    }
    controllerToSocket.get(controllerId).add(socket.id);
    socket.emit("timer-joined", timer.getState());
    timer.update(); // broadcast new connectedCount to everyone in room
    if (roomSize > DEFAULT_MAX_CONNECTIONS) {
      const controllerSocketIds =
        controllerToSocket.get(timer.controllerId) || new Set();
      const firstControllerSocketId = controllerSocketIds.values().next().value;
      if (firstControllerSocketId) {
        const controllerSocket = io.sockets.sockets.get(firstControllerSocketId);
        if (controllerSocket) {
          controllerSocket.emit("limit-exceeded", {
            timerId,
            type: "viewers",
            reason: "plan_used",
            message: "Viewer count exceeded default limit. Your single-event plan has been used.",
          });
        }
      }
    }
    if (timer.controllerId === controllerId) {
      emitTimerListForController(socket, controllerId);
    }
  });

  // --- VIEW TIMER (room-based) ---
  socket.on("view-timer", ({ timerId, controllerId }) => {
    if (!controllerId) return;
    const timer = timers.get(timerId);
    if (!timer) {
      socket.emit("timer-not-found", { timerId });
      return;
    }
    const roomId = timerRoomId(timerId);
    socket.join(roomId);
    const roomSize = io.sockets.adapter.rooms.get(roomId)?.size ?? 0;
    if (roomSize >= timer.maxConnectionsAllowed) {
      socket.leave(roomId);
      socket.emit("timer-full", { timerId, failedSocketId: socket.id });
      const controllerSocketIds =
        controllerToSocket.get(timer.controllerId) || new Set();
      controllerSocketIds.forEach((controllerSocketId) => {
        const controllerSocket = io.sockets.sockets.get(controllerSocketId);
        if (controllerSocket) {
          controllerSocket.emit("limit-exceeded", {
            timerId,
            type: "viewers",
            reason: "timer_full",
            message: `You've reached the maximum number of viewers (${timer.maxConnectionsAllowed-1}) for your plan. Upgrade to allow more viewers.`,
          });
        }
      });
      return;
    }
    if (!controllerToSocket.has(controllerId)) {
      controllerToSocket.set(controllerId, new Set());
    }
    controllerToSocket.get(controllerId).add(socket.id);
    socket.emit("timer-joined", timer.getState());
    timer.update(); // broadcast new connectedCount to everyone in room
    if (roomSize > DEFAULT_MAX_CONNECTIONS) {
      const controllerSocketIds =
        controllerToSocket.get(timer.controllerId) || new Set();
      const firstControllerSocketId = controllerSocketIds.values().next().value;
      if (firstControllerSocketId) {
        const controllerSocket = io.sockets.sockets.get(firstControllerSocketId);
        if (controllerSocket) {
          controllerSocket.emit("limit-exceeded", {
            timerId,
            type: "viewers",
            reason: "plan_used",
            message: "Viewer count exceeded default limit. Your single-event plan has been used.",
          });
        }
      }
    }
  });

  // --- CREATE TIMER (room-based) ---
  socket.on("create-timer", ({ name, duration, maxConnectionsAllowed = 4, maxTimersAllowed = 3, controllerId, styling }) => {
    if (!controllerId) return;
    const currentTimers = controllerTimers.get(controllerId) || new Set();
    if (currentTimers.size >= maxTimersAllowed) {
      socket.emit("limit-exceeded", {
        type: "timers",
        message: `You've reached the maximum number of timers (${maxTimersAllowed}) for your plan. Upgrade to create more timers.`,
      });
      return;
    }
    const timerId = generateId();
    const timer = new Timer(timerId, name, duration, maxConnectionsAllowed, maxTimersAllowed);
    timer.controllerId = controllerId;
    if (styling) {
      timer.backgroundColor = styling.backgroundColor || timer.backgroundColor;
      timer.textColor = styling.textColor || timer.textColor;
      timer.fontSize = styling.fontSize || timer.fontSize;
      timer.timerView = styling.timerView || "normal";
    }
    timers.set(timerId, timer);
    if (!controllerTimers.has(controllerId))
      controllerTimers.set(controllerId, new Set());
    controllerTimers.get(controllerId).add(timerId);
    socket.join(timerRoomId(timerId));
    if (!controllerToSocket.has(controllerId)) {
      controllerToSocket.set(controllerId, new Set());
    }
    controllerToSocket.get(controllerId).add(socket.id);
    emitTimerListForController(socket, controllerId);
    socket.emit("timer-created", timer.getState());
  });

  // --- LIST TIMERS FOR CONTROLLER ---
  socket.on('get-timers', ({ controllerId }) => {
    if (!controllerId) return;
    emitTimerListForController(socket, controllerId);
  });

  // --- HYDRATE TIMERS (client sends persisted timers from DB to restore server memory) ---
  socket.on("hydrate-timers", ({ controllerId, timers: timerList }) => {
    if (!controllerId || !Array.isArray(timerList)) return;
    timerList.forEach((t) => {
      const id = t.id;
      if (!id || timers.has(id)) return;
      const name = t.name ?? "";
      const duration = t.duration ?? 0;
      const maxConnectionsAllowed = t.maxConnectionsAllowed ?? DEFAULT_MAX_CONNECTIONS;
      const maxTimersAllowed = t.maxTimersAllowed ?? 3;
      const timer = new Timer(id, name, duration, maxConnectionsAllowed, maxTimersAllowed);
      timer.controllerId = controllerId;
      if (t.message != null) timer.message = t.message;
      if (t.joiningCode != null) timer.joiningCode = t.joiningCode;
      const styling = t.styling || t;
      if (styling.backgroundColor) timer.backgroundColor = styling.backgroundColor;
      if (styling.textColor) timer.textColor = styling.textColor;
      if (styling.fontSize) timer.fontSize = styling.fontSize;
      if (styling.timerView) timer.timerView = styling.timerView;
      timers.set(id, timer);
      if (!controllerTimers.has(controllerId)) {
        controllerTimers.set(controllerId, new Set());
      }
      controllerTimers.get(controllerId).add(id);
    });
  });

    // --- LEAVE TIMER (client emits when switching timers or navigating away) ---
  socket.on("leave-timer", ({ timerId }) => {
    if (!timerId) return;
    const timer = timers.get(timerId);
    if (timer) {
      socket.leave(timerRoomId(timerId));
      timer.update();
    }
  });

  // --- DELETE TIMER (room-based broadcast) ---
  socket.on("delete-timer", ({ timerId, controllerId }) => {
    if (!controllerId) return;
    const timer = timers.get(timerId);
    if (timer && timer.controllerId === controllerId) {
      io.to(timerRoomId(timerId)).emit("timer-deleted", { timerId });
      if (timer.interval) clearInterval(timer.interval);
      timers.delete(timerId);
      if (controllerTimers.has(controllerId))
        controllerTimers.get(controllerId).delete(timerId);
      emitTimerListForController(socket, controllerId);
    }
  });

  // --- TIMER CONTROLS (all require controllerId) ---
  socket.on('set-timer', ({ timerId, duration, controllerId }) => {
    if (!controllerId) return;
    const timer = timers.get(timerId);
    if (timer && timer.controllerId === controllerId) {
      timer.setDuration(duration);
      emitTimerListForController(socket, controllerId);
    }
  });

  socket.on('start-timer', ({ timerId, controllerId }) => {
    if (!controllerId) return;
    const timer = timers.get(timerId);
    if (timer && timer.controllerId === controllerId) {
      timer.start();
      emitTimerListForController(socket, controllerId);
    }
  });

  socket.on("pause-timer", ({ timerId, controllerId }) => {
    if (!controllerId) return;
    const timer = timers.get(timerId);
    if (timer && timer.controllerId === controllerId) {
      timer.pause();
      emitTimerListForController(socket, controllerId);
    }
  });

  socket.on("reset-timer", ({ timerId, controllerId }) => {
    if (!controllerId) return;
    const timer = timers.get(timerId);
    if (timer && timer.controllerId === controllerId) {
      timer.reset();
      emitTimerListForController(socket, controllerId);
    }
  });

  socket.on("adjust-timer", ({ timerId, seconds, controllerId }) => {
    if (!controllerId) return;
    const timer = timers.get(timerId);
    if (timer && timer.controllerId === controllerId) {
      timer.adjustTime(seconds);
      emitTimerListForController(socket, controllerId);
    }
  });

  socket.on("update-message", ({ timerId, message, controllerId }) => {
    if (!controllerId) return;
    const timer = timers.get(timerId);
    if (timer && timer.controllerId === controllerId) {
      timer.updateMessage(message);
      emitTimerListForController(socket, controllerId);
    }
  });

  socket.on("clear-message", ({ timerId, controllerId }) => {
    if (!controllerId) return;
    const timer = timers.get(timerId);
    if (timer && timer.controllerId === controllerId) {
      timer.clearMessage();
      emitTimerListForController(socket, controllerId);
    }
  });

  socket.on("update-styling", ({ timerId, styling, controllerId }) => {
    if (!controllerId) return;
    const timer = timers.get(timerId);
    if (timer && timer.controllerId === controllerId) {
      timer.updateStyling(styling);
      emitTimerListForController(socket, controllerId);
    }
  });

  socket.on("toggle-flash", ({ timerId, isFlashing, controllerId }) => {
    if (!controllerId) return;
    const timer = timers.get(timerId);
    if (timer && timer.controllerId === controllerId) {
      timer.toggleFlash(isFlashing);
      emitTimerListForController(socket, controllerId);
    }
  });

  socket.on("update-joining-code", ({ timerId, joiningCode, controllerId }) => {
    if (!controllerId) return;
    const timer = timers.get(timerId);
    if (timer && timer.controllerId === controllerId) {
      timer.updatejoiningCode(joiningCode);
      emitTimerListForController(socket, controllerId);
    }
  });

  // --- DISCONNECTING: capture timer rooms (socket.rooms is empty by the time "disconnect" fires) ---
  socket.on("disconnecting", () => {
    socket._timerRoomIds = Array.from(socket.rooms || []).filter((r) => r.startsWith("timer:")).map((r) => r.slice(6));
  });

  // --- DISCONNECT: broadcast new connectedCount to remaining clients (after socket has left rooms) ---
  socket.on("disconnect", () => {
    const timerIds = socket._timerRoomIds || [];
    socket._timerRoomIds = undefined;
    setImmediate(() => {
      timerIds.forEach((timerId) => {
        const timer = timers.get(timerId);
        if (timer) timer.update();
      });
    });
    controllerToSocket.forEach((socketIds, controllerId) => {
      if (socketIds.has(socket.id)) {
        socketIds.delete(socket.id);
        if (socketIds.size === 0) {
          controllerToSocket.delete(controllerId);
        }
      }
    });
  });

});

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`> Socket.IO Server ready on port ${port}`);
  console.log(`> Health check available at http://localhost:${port}/health`);
});