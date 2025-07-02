'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

// Helper to generate UUID
function generateUUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [timerList, setTimerList] = useState([]);
  const [currentTimer, setCurrentTimer] = useState(null);
  const [selectedTimerId, setSelectedTimerId] = useState(null);

  // Controller ID logic
  let controllerId = null;
  if (typeof window !== 'undefined') {
    controllerId = Cookies.get('controllerId');
    if (!controllerId) {
      controllerId = generateUUID();
      Cookies.set('controllerId', controllerId, { expires: 365 });
    }
  }

  useEffect(() => {
    // Use environment variable for server URL, fallback to localhost for development
    const serverUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001';
    const socketInstance = io(serverUrl);
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      // Request timers for this controllerId on connect/reconnect
      if (controllerId) {
        socketInstance.emit('get-timers', { controllerId });
      }
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('timer-list', (timers) => {
      setTimerList(timers);
    });

    socketInstance.on('timer-joined', (timerState) => {
      setCurrentTimer(timerState);
      setSelectedTimerId(timerState.id);
    });

    socketInstance.on('timer-update', (timerState) => {
      setCurrentTimer(timerState);
    });

    socketInstance.on('timer-created', (timerState) => {
      setCurrentTimer(timerState);
      setSelectedTimerId(timerState.id);
    });

    socketInstance.on('timer-deleted', (data) => {
      if (selectedTimerId === data.timerId) {
        setCurrentTimer(null);
        setSelectedTimerId(null);
      }
    });

    socketInstance.on('timer-full', (data) => {
      // No-op for production
    });

    socketInstance.on('timer-not-found', (data) => {
      // No-op for production
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const createTimer = (name, duration, styling = {}) => {
    socket?.emit('create-timer', { name, duration, controllerId, styling });
  };

  const deleteTimer = (timerId) => {
    socket?.emit('delete-timer', { timerId, controllerId });
  };

  const joinTimer = (timerId) => {
    if (socket && isConnected) {
      socket.emit('join-timer', { timerId, controllerId });
    }
  };

  const viewTimer = (timerId) => {
    if (socket && isConnected) {
      socket.emit('view-timer', { timerId, controllerId });
    }
  };

  const setTimer = (timerId, duration) => {
    socket?.emit('set-timer', { timerId, duration, controllerId });
  };

  const startTimer = (timerId) => {
    socket?.emit('start-timer', { timerId, controllerId });
  };

  const pauseTimer = (timerId) => {
    socket?.emit('pause-timer', { timerId, controllerId });
  };

  const resetTimer = (timerId) => {
    socket?.emit('reset-timer', { timerId, controllerId });
  };

  const adjustTimer = (timerId, seconds) => {
    socket?.emit('adjust-timer', { timerId, seconds, controllerId });
  };

  const updateMessage = (timerId, message) => {
    socket?.emit('update-message', { timerId, message, controllerId });
  };

  const updateStyling = (timerId, styling) => {
    if (socket && isConnected) {
      socket.emit('update-styling', { timerId, styling, controllerId });
    }
  };

  const clearMessage = (timerId) => {
    socket?.emit('clear-message', { timerId, controllerId });
  };

  const toggleFlash = (timerId, isFlashing) => {
    socket?.emit('toggle-flash', { timerId, isFlashing, controllerId });
  };

  return {
    isConnected,
    timerList,
    currentTimer,
    selectedTimerId,
    setSelectedTimerId,
    createTimer,
    deleteTimer,
    joinTimer,
    viewTimer,
    setTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    adjustTimer,
    updateMessage,
    updateStyling,
    clearMessage,
    toggleFlash,
    setCurrentTimer,
  };
};