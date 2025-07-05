'use client';
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useSocket as useSocketHook } from '../hooks/useSocket';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [failedSocketIds, setFailedSocketIds] = useState(new Set());
  const socketValue = useSocketHook(setFailedSocketIds);

  // Memoize the isCurrentSocketFailed function
  const isCurrentSocketFailed = useCallback(() => {
    return socketValue.socketId ? failedSocketIds.has(socketValue.socketId) : false;
  }, [socketValue.socketId, failedSocketIds]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...socketValue,
    failedSocketIds,
    setFailedSocketIds,
    isCurrentSocketFailed,
  }), [socketValue, failedSocketIds, setFailedSocketIds, isCurrentSocketFailed]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
} 