'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuth } from '@clerk/nextjs';
import useUserPlanStore from '@/stores/userPlanStore';

// Helper to generate UUID
function generateUUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export const useSocket = (setFailedSocketIds = null) => {
  const router = useRouter();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [timerList, setTimerList] = useState([]);
  const [currentTimer, setCurrentTimer] = useState(null);
  const [selectedTimerId, setSelectedTimerId] = useState(null);
  const [timerFullMessage, setTimerFullMessage] = useState(null);
  const [socketId, setSocketId] = useState(null);
  const [joiningCode, setJoiningCode] = useState(null)
  const autoReconnectDone = useRef(false);

  const currentActivePlan = useUserPlanStore(state=>state.plan)
  const isLoading = useUserPlanStore(state=>state.isLoading)
  const {maxConnectionsAllowed} = currentActivePlan;
  const { userId, isLoaded: isAuthLoaded } = useAuth();

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

  // Anonymous controller ID (cookie) — only used when user is not logged in
  const anonymousControllerId = useMemo(() => {
    if (typeof window === 'undefined') return null;
    let id = Cookies.get('controllerId');
    if (!id) {
      id = generateUUID();
      Cookies.set('controllerId', id, { expires: 365 });
    }
    return id;
  }, []);

  // Effective owner ID: logged-in users use Clerk userId (cross-device); others use cookie-based id
  const controllerId = isAuthLoaded && userId ? userId : anonymousControllerId;
  const controllerIdRef = useRef(controllerId);
  controllerIdRef.current = controllerId;
  const userIdRef = useRef(userId);
  userIdRef.current = userId;

  // When controllerId changes: fetch timers from DB → hydrate on server → get-timers
  useEffect(() => {
    if (!socket || !isConnected || !controllerId) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/timers?ownerId=${encodeURIComponent(controllerId)}`);
        const data = res.ok ? await res.json() : [];
        if (cancelled || !Array.isArray(data)) return;
        const timersToHydrate = data.map((t) => ({
          id: t.id,
          name: t.name,
          duration: t.duration,
          originalDuration: t.originalDuration ?? t.duration,
          maxConnectionsAllowed: t.maxConnectionsAllowed,
          maxTimersAllowed: t.maxTimersAllowed,
          message: t.message,
          joiningCode: t.joiningCode,
          styling: t.styling,
        }));
        socket.emit('hydrate-timers', { controllerId, timers: timersToHydrate });
        socket.emit('get-timers', { controllerId });
      } catch {
        socket.emit('get-timers', { controllerId });
      }
    })();
    return () => { cancelled = true; };
  }, [socket, isConnected, controllerId]);

  useEffect(() => {
    if(isLoading) return
    // Use environment variable for server URL, fallback to localhost for development
    const serverUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001';
    const socketInstance = io(serverUrl);
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      // console.log('connected to socket', socketInstance.id);
      setIsConnected(true);
      setIsConnecting(false);
      setSocketId(socketInstance.id);
      // Request timers on connect — identity (controllerId) is resolved in the effect above when it changes
      // Note: initial request uses whatever controllerId is at connect time (anonymous or userId)
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      setIsConnecting(false);
    });

    socketInstance.on('timer-list', (timers) => {
      setTimerList(timers);
      const effectiveId = controllerIdRef.current;
      // Only run auto-reconnect once after initial load
      if (!autoReconnectDone.current && timers.length > 0 && !currentTimer) {
        const lastSelectedId = getLastSelectedTimerId();
        const runningTimer = timers.find(timer => timer.isRunning);
        // Priority: running timer first, then last selected timer
        const timerToJoin = runningTimer || timers.find(timer => timer.id === lastSelectedId);
        if (timerToJoin && effectiveId) {
          socketInstance.emit('join-timer', { timerId: timerToJoin.id, controllerId: effectiveId });
        }
        autoReconnectDone.current = true;
      }
    });

    socketInstance.on('timer-joined', async (timerState) => {
      setCurrentTimer(timerState);
      setSelectedTimerId(timerState.id);
      saveSelectedTimerId(timerState.id);
      const ownerId = controllerIdRef.current;
      if (timerState?.joiningCode) {
        setJoiningCode(timerState.joiningCode);
        return;
      }
      try {
        const response = await fetch("/api/create-joining-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ timerId: timerState.id }),
        });
        const result = await response.json();
        const code = result?.joiningCode;
        if (code) {
          socketInstance.emit("update-joining-code", { timerId: timerState.id, joiningCode: code, controllerId: ownerId });
          setJoiningCode(code);
          await fetch(`/api/timers/${timerState.id}?ownerId=${encodeURIComponent(ownerId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ joiningCode: code }),
          }).catch(() => {});
        }
      } catch (error) {
        console.log("error creating joining code in frontend");
      }
    });

    socketInstance.on('timer-update', (timerState) => {
      setCurrentTimer(timerState);
      const limit = timerState.maxConnectionsAllowed ?? maxConnectionsAllowed;
      if (timerState.connectedCount < limit) {
        setTimerFullMessage(null);
        if (setFailedSocketIds) {
          setFailedSocketIds(new Set());
        }
      }
    });

    socketInstance.on('timer-created', async (timerState) => {
      setCurrentTimer(timerState);
      setSelectedTimerId(timerState.id);
      saveSelectedTimerId(timerState.id);
      const ownerId = controllerIdRef.current;
      try {
        await fetch('/api/timers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: timerState.id,
            ownerId,
            name: timerState.name,
            duration: timerState.duration,
            originalDuration: timerState.duration,
            maxConnectionsAllowed: timerState.maxConnectionsAllowed,
            maxTimersAllowed: timerState.maxTimersAllowed,
            styling: timerState.styling,
            joiningCode: '',
            message: timerState.message || '',
          }),
        });
      } catch (err) {
        console.error('Failed to persist timer', err);
      }
      try {
        const response = await fetch("/api/create-joining-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ timerId: timerState.id }),
        });
        const result = await response.json();
        const code = result?.joiningCode;
        if (code) {
          socketInstance.emit("update-joining-code", { timerId: timerState.id, joiningCode: code, controllerId: ownerId });
          setJoiningCode(code);
          await fetch(`/api/timers/${timerState.id}?ownerId=${encodeURIComponent(ownerId)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ joiningCode: code }),
          }).catch(() => {});
        }
      } catch (error) {
        console.log("error creating joining code in frontend");
      }
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
        setCurrentTimer(null); // Don't show timer state when rejected — show only the error
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

    socketInstance.on('limit-exceeded', async ({ type, message, timerId, reason }) => {
      if (type === 'viewers') {
        if (reason === 'plan_used') {
          const plan = useUserPlanStore.getState().plan;
          if (plan.planId !== 'free') {
            try {
              await fetch('/api/user-plan/reset-single-event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timerId: timerId ?? undefined }),
              });
              const uid = userIdRef.current;
              if (uid) {
                console.log(uid, " calling the reset API")
                const res = await fetch(`/api/user-plan?userId=${encodeURIComponent(uid)}`);
                if (res.ok) {
                  const { plan: nextPlan } = await res.json();
                  useUserPlanStore.getState().setPlan(nextPlan);
                }
              }
            } catch (err) {
              console.error('Failed to reset single-event plan', err);
            }
          }
        } else {
          useUserPlanStore.getState().showPopup(type, message);
        }
      } else {
        useUserPlanStore.getState().showPopup(type, message);
      }
    });

    socketInstance.on('timer-not-found', () => {
      router.replace('/404');
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [isLoading, router]);

  const createTimer = useCallback((name, duration, maxConnectionsAllowed, maxTimersAllowed, styling = {}) => {
    socket?.emit('create-timer', {
      name,
      duration,
      controllerId,
      maxConnectionsAllowed,
      maxTimersAllowed,
      styling,
    });
  }, [socket, controllerId]);

  const deleteTimer = useCallback((timerId) => {
    if (!socket || !controllerId) return;
    socket.emit('delete-timer', { timerId, controllerId });
    fetch(`/api/timers/${timerId}?ownerId=${encodeURIComponent(controllerId)}`, { method: 'DELETE' }).catch((err) =>
      console.error('Failed to delete timer from DB', err)
    );
  }, [socket, controllerId]);

  const joinTimer = useCallback((timerId) => {
    if (socket && isConnected && !isLoading) {
      socket.emit('join-timer', { timerId, controllerId, maxConnectionsAllowed, isLoading });
    }
  }, [socket, isConnected, controllerId, maxConnectionsAllowed, isLoading]);

  const viewTimer = useCallback((timerId) => {
    if (socket && isConnected && !isLoading) {
      socket.emit('view-timer', { timerId, controllerId });
    }
  }, [socket, isConnected, controllerId, maxConnectionsAllowed, isLoading]);

  const setTimer = useCallback((timerId, duration) => {
    socket?.emit('set-timer', { timerId, duration, controllerId });
  }, [socket, controllerId]);

  const startTimer = useCallback((timerId) => {
    socket?.emit('start-timer', { timerId, controllerId, maxConnectionsAllowed });
  }, [socket, controllerId, maxConnectionsAllowed]);

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
    joiningCode,
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
    joiningCode,
  ]);
};