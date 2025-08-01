'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuth, useUser } from '@clerk/nextjs';
import useUserPlanStore from '@/stores/userPlanStore';

// Helper to generate UUID
function generateUUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export const useSocket = (setFailedSocketIds = null) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [timerList, setTimerList] = useState([]);
  const [currentTimer, setCurrentTimer] = useState(null);
  const [selectedTimerId, setSelectedTimerId] = useState(null);
  const [timerFullMessage, setTimerFullMessage] = useState(null);
  const [socketId, setSocketId] = useState(null);
  const autoReconnectDone = useRef(false);

  const currentActivePlan = useUserPlanStore(state=>state.plan)
  const {maxConnectionsAllowed, maxTimersAllowed} = currentActivePlan;
  // console.log(maxConnectionsAllowed, maxTimersAllowed, " data in the useSocket")
  // Get the last selected timer ID from localStorage
  const getLastSelectedTimerId = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastSelectedTimerId');
    }
    return null;
  }, []);

  // Save the selected timer ID to localStorage
  const saveSelectedTimerId = useCallback((timerId) => {
    if (typeof window !== 'undefined' && timerId) {
      localStorage.setItem('lastSelectedTimerId', timerId);
    }
  }, []);

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
      // console.log('connected to socket', socketInstance.id);
      setIsConnected(true);
      setIsConnecting(false);
      setSocketId(socketInstance.id);
      // Request timers for this controllerId on connect/reconnect
      if (controllerId) {
        socketInstance.emit('get-timers', { controllerId });
      }
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      setIsConnecting(false);
    });

    socketInstance.on('timer-list', (timers) => {
      setTimerList(timers);
      
      // Only run auto-reconnect once after initial load
      if (!autoReconnectDone.current && timers.length > 0 && !currentTimer) {
        const lastSelectedId = getLastSelectedTimerId();
        const runningTimer = timers.find(timer => timer.isRunning);
        // Priority: running timer first, then last selected timer
        const timerToJoin = runningTimer || timers.find(timer => timer.id === lastSelectedId);
        if (timerToJoin) {
          // console.log('Auto-reconnecting to timer:', timerToJoin.id, 'isRunning:', timerToJoin.isRunning);
          socketInstance.emit('join-timer', { timerId: timerToJoin.id, controllerId });
        }
        autoReconnectDone.current = true;
      }
    });

    socketInstance.on('timer-joined', (timerState) => {
      setCurrentTimer(timerState);
      setSelectedTimerId(timerState.id);
      saveSelectedTimerId(timerState.id);
    });

    socketInstance.on('timer-update', (timerState) => {
      setCurrentTimer(timerState);
      if (timerState.connectedCount < maxConnectionsAllowed) {
        setTimerFullMessage(null);
        // Clear failed socket IDs when timer is no longer full
        if (setFailedSocketIds) {
          // console.log('Clearing failed socket IDs - timer no longer full');
          setFailedSocketIds(new Set());
        }
      }
    });

    socketInstance.on('timer-created', (timerState) => {
      setCurrentTimer(timerState);
      setSelectedTimerId(timerState.id);
      saveSelectedTimerId(timerState.id);
    });

    socketInstance.on('timer-deleted', (data) => {
      if (selectedTimerId === data.timerId) {
        setCurrentTimer(null);
        setSelectedTimerId(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('lastSelectedTimerId');
        }
      }
    });

    socketInstance.on('timer-full', ({ timerId, failedSocketId }) => {
      // console.log('timer-full received for timer', timerId, 'failedSocketId', failedSocketId);
      if (socketInstance.id === failedSocketId) {
        setTimerFullMessage('This timer is full. Maximum viewers allowed have already connected.');
        // Add the failed socket ID to the context's failed list
        if (setFailedSocketIds) {
          setFailedSocketIds(prev => {
            const newSet = new Set([...prev, failedSocketId]);
            return newSet;
          });
        }
      }
    });

    socketInstance.on('limit-exceeded', ({ type, message }) => {
      // console.log(type," --type")
      // console.log(message," --message")
      // setLimitExceededMsg(message);
      // if(type==="timers") setTimerLimitExceeded(true)
      // if(type==="viewers") setViewerLimitExceeded(true)
      useUserPlanStore.getState().showPopup(type, message);
    });

    socketInstance.on('timer-not-found', (data) => {
      // No-op for production
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const createTimer = useCallback((name, duration, maxConnectionsAllowed, maxTimersAllowed, styling = {}) => {
    socket?.emit('create-timer', { name, duration, controllerId, maxConnectionsAllowed, maxTimersAllowed, styling });
  }, [socket, controllerId]);

  const deleteTimer = useCallback((timerId) => {
    socket?.emit('delete-timer', { timerId, controllerId });
  }, [socket, controllerId]);

  const joinTimer = useCallback((timerId) => {
    if (socket && isConnected) {
      socket.emit('join-timer', { timerId, controllerId, maxConnectionsAllowed });
    }
  }, [socket, isConnected, controllerId]);

  const viewTimer = useCallback((timerId) => {
    if (socket && isConnected) {
      console.log("before sending view-timer", maxConnectionsAllowed)
      socket.emit('view-timer', { timerId, controllerId, maxConnectionsAllowed });
    }
  }, [socket, isConnected, controllerId]);

  const setTimer = useCallback((timerId, duration) => {
    socket?.emit('set-timer', { timerId, duration, controllerId });
  }, [socket, controllerId]);

  const startTimer = useCallback((timerId) => {
    socket?.emit('start-timer', { timerId, controllerId });
  }, [socket, controllerId]);

  const pauseTimer = useCallback((timerId) => {
    socket?.emit('pause-timer', { timerId, controllerId });
  }, [socket, controllerId]);

  const resetTimer = useCallback((timerId) => {
    socket?.emit('reset-timer', { timerId, controllerId });
  }, [socket, controllerId]);

  const adjustTimer = useCallback((timerId, seconds) => {
    socket?.emit('adjust-timer', { timerId, seconds, controllerId });
  }, [socket, controllerId]);

  const updateMessage = useCallback((timerId, message) => {
    socket?.emit('update-message', { timerId, message, controllerId });
  }, [socket, controllerId]);

  const updateStyling = useCallback((timerId, styling) => {
    if (socket && isConnected) {
      socket.emit('update-styling', { timerId, styling, controllerId });
    }
  }, [socket, isConnected, controllerId]);

  const clearMessage = useCallback((timerId) => {
    socket?.emit('clear-message', { timerId, controllerId });
  }, [socket, controllerId]);

  const toggleFlash = useCallback((timerId, isFlashing) => {
    socket?.emit('toggle-flash', { timerId, isFlashing, controllerId });
  }, [socket, controllerId]);

  const setSelectedTimerIdWithStorage = useCallback((timerId) => {
    setSelectedTimerId(timerId);
    saveSelectedTimerId(timerId);
  }, [saveSelectedTimerId]);

  return useMemo(() => ({
    isConnected,
    isConnecting,
    timerList,
    currentTimer,
    selectedTimerId,
    setSelectedTimerId: setSelectedTimerIdWithStorage,
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
    timerFullMessage,
    socketId,
  }), [
    isConnected,
    isConnecting,
    timerList,
    currentTimer,
    selectedTimerId,
    setSelectedTimerIdWithStorage,
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
    timerFullMessage,
    socketId,
  ]);
};