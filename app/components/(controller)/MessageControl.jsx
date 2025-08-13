"use client"
import React, { useState, useCallback } from 'react';
import posthog from 'posthog-js';

const MessageControl = React.memo(({ effectiveTimerId, updateMessage, clearMessage }) => {
  const [messageInput, setMessageInput] = useState('');

  const handleUpdateMessage = useCallback((e) => {
    e.preventDefault();
    if (!effectiveTimerId || !messageInput.trim()) return;
    updateMessage(effectiveTimerId, messageInput);
    if (posthog.__initialized) {
      posthog.capture('timer_message_sent', { timerId: effectiveTimerId, message: messageInput });
    }
    // setMessageInput('');
  }, [effectiveTimerId, messageInput, updateMessage]);

  return (
    <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Message
      </h3>
      <form onSubmit={handleUpdateMessage} className="mb-3">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Send message to everyone..."
          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400"
        />
      </form>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleUpdateMessage}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex-1 text-sm"
        >
          Send
        </button>
        <button
          onClick={() => { clearMessage(effectiveTimerId); if (posthog.__initialized) posthog.capture('timer_message_cleared', { timerId: effectiveTimerId }); setMessageInput('') }}
          className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
        >
          Unsend
        </button>
      </div>
    </div>
  );
});

export default MessageControl;