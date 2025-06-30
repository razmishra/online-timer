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
  console.log('selectedTimerId', selectedTimerId);
  // Check if we were previously authenticated
  useEffect(() => {
    const wasAuthenticated = localStorage.getItem('controllerAuthenticated') === 'true';
    if (wasAuthenticated) {
      setIsControllerAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const socketInstance = io();
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
      
      // If we were previously authenticated, re-authenticate automatically
      if (localStorage.getItem('controllerAuthenticated') === 'true') {
        console.log('Re-authenticating after reconnection...');
        const savedPassword = localStorage.getItem('controllerPassword');
        if (savedPassword) {
          socketInstance.emit('authenticate-controller', savedPassword);
        }
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('timer-list', (timers) => {
      console.log('Received timer list:', timers);
      setTimerList(timers);
    });

    socketInstance.on('timer-joined', (timerState) => {
      console.log('Timer joined event received:', timerState);
      console.log('Previous currentTimer:', currentTimer);
      setCurrentTimer(timerState);
      setSelectedTimerId(timerState.id);
      console.log('Updated currentTimer to:', timerState);
    });

    socketInstance.on('timer-update', (timerState) => {
      console.log('Timer update:', timerState);
      setCurrentTimer(timerState);
    });

    socketInstance.on('timer-created', (timerState) => {
      console.log('Timer created:', timerState);
      setCurrentTimer(timerState);
      setSelectedTimerId(timerState.id);
    });

    socketInstance.on('timer-deleted', (data) => {
      console.log('Timer deleted:', data);
      if (selectedTimerId === data.timerId) {
        setCurrentTimer(null);
        setSelectedTimerId(null);
      }
    });

    socketInstance.on('timer-full', (data) => {
      console.log('Timer is full:', data.message);
    });

    socketInstance.on('timer-not-found', (data) => {
      console.log('Timer not found:', data.timerId);
    });

    socketInstance.on('controller-authenticated', (authenticated) => {
      console.log('Controller authenticated:', authenticated);
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
  }, [selectedTimerId]);

  const authenticateController = (password) => {
    console.log('Authenticating controller with password:', password);
    localStorage.setItem('controllerPassword', password);
    socket?.emit('authenticate-controller', password);
  };

  const createTimer = (name, duration) => {
    console.log('Creating timer:', name, duration);
    socket?.emit('create-timer', { name, duration });
  };

  const deleteTimer = (timerId) => {
    console.log('Deleting timer:', timerId);
    socket?.emit('delete-timer', timerId);
  };

  const joinTimer = (timerId) => {
    console.log('Joining timer:', timerId);
    console.log('Socket state:', { socket: !!socket, isConnected, isControllerAuthenticated });
    if (socket && isConnected && isControllerAuthenticated) {
      socket.emit('join-timer', timerId);
      console.log('Emitted join-timer event');
    } else {
      console.log('Cannot join timer - socket not ready:', { socket: !!socket, isConnected, isControllerAuthenticated });
    }
  };

  const setTimer = (timerId, duration) => {
    console.log('Setting timer:', timerId, duration);
    socket?.emit('set-timer', { timerId, duration });
  };

  const startTimer = (timerId) => {
    console.log('Starting timer:', timerId);
    socket?.emit('start-timer', timerId);
  };

  const pauseTimer = (timerId) => {
    console.log('Pausing timer:', timerId);
    socket?.emit('pause-timer', timerId);
  };

  const resetTimer = (timerId) => {
    console.log('Resetting timer:', timerId);
    socket?.emit('reset-timer', timerId);
  };

  const adjustTimer = (timerId, seconds) => {
    console.log('Adjusting timer:', timerId, seconds);
    socket?.emit('adjust-timer', { timerId, seconds });
  };

  const updateMessage = (timerId, message) => {
    console.log('Updating message:', timerId, message);
    socket?.emit('update-message', { timerId, message });
  };

  const updateStyling = (timerId, styling) => {
    console.log('Updating styling:', timerId, styling);
    console.log('Socket state for styling update:', { socket: !!socket, isConnected, isControllerAuthenticated });
    if (socket && isConnected && isControllerAuthenticated) {
      socket.emit('update-styling', { timerId, styling });
      console.log('Emitted update-styling event');
    } else {
      console.log('Cannot update styling - socket not ready:', { socket: !!socket, isConnected, isControllerAuthenticated });
    }
  };

  const clearMessage = (timerId) => {
    console.log('Clearing message:', timerId);
    socket?.emit('clear-message', timerId);
  };

  const toggleFlash = (timerId, isFlashing) => {
    console.log('Toggling flash:', timerId, isFlashing);
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