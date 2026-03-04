"use client"
/**
 * MESSAGE CONTROL ARCHITECTURE:
 * 1. DRAFTING LOGIC: Uses a "Gatekeeper" in the sync useEffect. It ignores empty server updates 
 *    (sent during 'hide/unsend') to preserve the owner's typed text in the textarea for future use.
 * 
 * 2. ECHO PREVENTION (isDirty): Uses a Ref flag to track if changes came from a HUMAN or the SERVER.
 *    - Human types/clicks -> isDirty = true -> Debounce sends to server.
 *    - Server updates (from another tab) -> isDirty remains false -> Tab stays quiet.
 *    This prevents infinite loops/flickering when multiple controller tabs are open.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import posthog from 'posthog-js';

const MessageControl = React.memo(({ effectiveTimerId, updateMessage, clearMessage, currentTimer }) => {
  const isMessageActive = !!currentTimer?.message;
  const activeMessageText = typeof currentTimer?.message === 'object' ? currentTimer.message.text : currentTimer?.message;
  const activeMessageStyling = typeof currentTimer?.message === 'object' ? currentTimer.message.styling : null;

  const [messageInput, setMessageInput] = useState(activeMessageText || '');
  const [messageStyling, setMessageStyling] = useState({
    color: activeMessageStyling?.color || 'white',
    bold: activeMessageStyling?.bold || false,
    uppercase: activeMessageStyling?.uppercase || false
  });
  const textareaRef = useRef(null);
  const isDirty = useRef(false);

  // Sync with server message whenever it changes, unless we are actively typing/editing
  useEffect(() => {
    // Only sync if the user isn't currently focused on this input
    if (document.activeElement !== textareaRef.current) {
      // GATEKEEPER: Only update local state if server has a non-empty message.
      // This allows the textarea to act as a "Draft Area"—when a message is hidden (unsend),
      // the server sends an empty string, which we ignore here to preserve your typed text.
      if (activeMessageText) {
        setMessageInput(activeMessageText);
      }
      if (activeMessageStyling) {
        setMessageStyling({
          color: activeMessageStyling.color || 'white',
          bold: activeMessageStyling.bold || false,
          uppercase: activeMessageStyling.uppercase || false
        });
      }
      isDirty.current = false; // We are now in sync
    }
  }, [activeMessageText, activeMessageStyling]);

  // Auto-resize textarea on content change (including mount/refresh)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [messageInput]);

  // Debounced update when active
  useEffect(() => {
    if (!isMessageActive || !effectiveTimerId || !isDirty.current) return;

    // Check if what we have is truly different from what's on the server
    const hasTextChanged = messageInput !== activeMessageText;
    const hasStylingChanged = JSON.stringify(messageStyling) !== JSON.stringify(activeMessageStyling);

    if (!hasTextChanged && !hasStylingChanged) return;

    const handler = setTimeout(() => {
      updateMessage(effectiveTimerId, {
        text: messageInput,
        styling: messageStyling
      });
      isDirty.current = false;
    }, 700);

    return () => clearTimeout(handler);
  }, [messageInput, messageStyling, isMessageActive, effectiveTimerId, updateMessage, activeMessageText, activeMessageStyling]);

  const handleToggleMessage = useCallback((e) => {
    if (e) e.preventDefault();
    if (!effectiveTimerId) return;

    if (isMessageActive) {
      clearMessage(effectiveTimerId);
      isDirty.current = false;
      if (posthog.__initialized) {
        posthog.capture('timer_message_cleared', { timerId: effectiveTimerId });
      }
    } else {
      if (!messageInput.trim()) return;
      updateMessage(effectiveTimerId, {
        text: messageInput,
        styling: messageStyling
      });
      isDirty.current = false;
      if (posthog.__initialized) {
        posthog.capture('timer_message_sent', { 
          timerId: effectiveTimerId, 
          message: messageInput,
          styling: messageStyling
        });
      }
    }
  }, [effectiveTimerId, isMessageActive, messageInput, messageStyling, updateMessage, clearMessage]);

  const handleChange = (e) => {
    setMessageInput(e.target.value);
    isDirty.current = true; // Mark that the user has changed the text
  };

  const toggleStyle = (key) => {
    setMessageStyling(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    isDirty.current = true;
  };

  const setStyleColor = (color) => {
    setMessageStyling(prev => ({
      ...prev,
      color
    }));
    isDirty.current = true;
  };

  const placeholderText = messageStyling.uppercase ? "ENTER MESSAGE ..." : "Enter message ...";

  return (
    <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center shrink-0">
        <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Message
      </h3>
      
      <div className="w-full">
        <form onSubmit={handleToggleMessage}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={messageInput}
            onChange={handleChange}
            placeholder={placeholderText}
            className={`w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg resize-none overflow-hidden transition-all duration-200 ${messageStyling.bold ? 'font-black' : 'font-medium'} ${messageStyling.uppercase ? 'uppercase' : ''} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent block mb-4 text-white placeholder-slate-400 text-sm`}
            style={{ 
              color: messageStyling.color === 'red' ? '#DD524C' : messageStyling.color === 'green' ? '#4ade80' : '#ffffff',
              minHeight: '40px'
            }}
          />
        </form>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[
              { id: 'white', color: '#ffffff', title: 'White Text' },
              { id: 'green', color: '#4ade80', title: 'Green Text' },
              { id: 'red', color: '#DD524C', title: 'Red Text' }
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setStyleColor(c.id)}
                title={c.title}
                className={`flex flex-col items-center justify-center p-1 transition-all duration-200 group/btn cursor-pointer`}
              >
                <span className="text-sm font-bold" style={{ color: c.color }}>A</span>
                <div className={`h-0.5 w-3 mt-0.5 rounded-full transition-opacity ${messageStyling.color === c.id ? 'bg-white' : 'opacity-0 group-hover/btn:opacity-40'}`} style={{ backgroundColor: c.color }}></div>
              </button>
            ))}

            <div className="w-px h-4 bg-slate-700 mx-1"></div>

            <button
              type="button"
              onClick={() => toggleStyle('bold')}
              title="Bold Text"
              className={`flex flex-col items-center justify-center p-1 transition-all duration-200 group/btn cursor-pointer`}
            >
              <span className="text-sm font-extrabold text-white">B</span>
              <div className={`h-0.5 w-3 mt-0.5 rounded-full bg-white transition-opacity ${messageStyling.bold ? 'opacity-100' : 'opacity-0 group-hover/btn:opacity-40'}`}></div>
            </button>
            
            <button
              type="button"
              onClick={() => toggleStyle('uppercase')}
              title="Uppercase Text"
              className={`flex flex-col items-center justify-center p-1 transition-all duration-200 group/btn cursor-pointer`}
            >
              <span className="text-xs font-bold text-white uppercase">TT</span>
              <div className={`h-0.5 w-3 mt-0.5 rounded-full bg-white transition-opacity ${messageStyling.uppercase ? 'opacity-100' : 'opacity-0 group-hover/btn:opacity-40'}`}></div>
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggleMessage}
            title={isMessageActive ? "Hide Message" : "Show Message"}
            className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
              isMessageActive 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            {/* <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isMessageActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></div> */}
            <svg 
              className="w-3.5 h-3.5" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-sm">Show</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default MessageControl;