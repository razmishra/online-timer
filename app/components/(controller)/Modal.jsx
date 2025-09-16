'use client';

import React, { useCallback, useEffect } from 'react';

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmButton="Delete" }) => {
  const handleBackdropClick = useCallback((e) => {
    // Close modal only if the click is on the backdrop (not the content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Add keyboard support for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 rounded-2xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()} // Prevent clicks on content from closing modal
      >
        {/* Decorative Elements */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400/60 rounded-full animate-ping"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-purple-400/60 rounded-full animate-pulse"></div>

        {/* Modal Content */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-slate-400 text-sm sm:text-base mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 font-semibold py-2 px-4 rounded-lg transition-all duration-200 border border-slate-600/50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
          >
            {confirmButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;