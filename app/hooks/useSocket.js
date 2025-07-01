'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isControllerAuthenticated, setIsControllerAuthenticated] = useState(false);
  const [timerList, setTimerList] = useState([]);
  const [currentTimer, setCurrentTimer] = useState(null);
  const [selectedTimerId, setSelectedTimerId] = useState(null);
  // Check if we were previously authenticated
  useEffect(() => {
    const wasAuthenticated = localStorage.getItem('controllerAuthenticated') === 'true';
    if (wasAuthenticated) {
      setIsControllerAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    // Use environment variable for server URL, fallback to localhost for development
    const serverUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001';
    const socketInstance = io(serverUrl);
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      
      // If we were previously authenticated, re-authenticate automatically
      if (localStorage.getItem('controllerAuthenticated') === 'true') {
        const savedPassword = localStorage.getItem('controllerPassword');
        if (savedPassword) {
          socketInstance.emit('authenticate-controller', savedPassword);
        }
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

    socketInstance.on('controller-authenticated', (authenticated) => {
      setIsControllerAuthenticated(authenticated);
      
      // Store authentication status
      if (authenticated) {
        localStorage.setItem('controllerAuthenticated', 'true');
      } else {
        localStorage.removeItem('controllerAuthenticated');
        localStorage.removeItem('controllerPassword');
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const authenticateController = (password) => {
    localStorage.setItem('controllerPassword', password);
    socket?.emit('authenticate-controller', password);
  };

  const createTimer = (name, duration) => {
    socket?.emit('create-timer', { name, duration });
  };

  const deleteTimer = (timerId) => {
    socket?.emit('delete-timer', timerId);
  };

  const joinTimer = (timerId) => {
    if (socket && isConnected ) {
      socket.emit('join-timer', timerId);
    }
  };

  const setTimer = (timerId, duration) => {
    socket?.emit('set-timer', { timerId, duration });
  };

  const startTimer = (timerId) => {
    socket?.emit('start-timer', timerId);
  };

  const pauseTimer = (timerId) => {
    socket?.emit('pause-timer', timerId);
  };

  const resetTimer = (timerId) => {
    socket?.emit('reset-timer', timerId);
  };

  const adjustTimer = (timerId, seconds) => {
    socket?.emit('adjust-timer', { timerId, seconds });
  };

  const updateMessage = (timerId, message) => {
    socket?.emit('update-message', { timerId, message });
  };

  const updateStyling = (timerId, styling) => {
    if (socket && isConnected && isControllerAuthenticated) {
      socket.emit('update-styling', { timerId, styling });
    }
  };

  const clearMessage = (timerId) => {
    socket?.emit('clear-message', timerId);
  };

  const toggleFlash = (timerId, isFlashing) => {
    socket?.emit('toggle-flash', { timerId, isFlashing });
  };

  return {
    isConnected,
    isControllerAuthenticated,
    timerList,
    currentTimer,
    selectedTimerId,
    setSelectedTimerId,
    authenticateController,
    createTimer,
    deleteTimer,
    joinTimer,
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