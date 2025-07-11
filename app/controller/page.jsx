'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import Timer from '../components/Timer';
import QRCode from 'qrcode';
import Link from 'next/link';

export default function ControllerPage() {
  const {
    isConnected,
    timerList,
    currentTimer,
    setCurrentTimer,
    selectedTimerId,
    setSelectedTimerId,
    createTimer,
    deleteTimer,
    setTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    adjustTimer,
    updateMessage,
    updateStyling,
    clearMessage,
    toggleFlash,
    joinTimer,
  } = useSocket();

  const [createTimerInput, setCreateTimerInput] = useState('');
  const [setTimerInput, setSetTimerInput] = useState('');
  const [timerName, setTimerName] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#1e293b');
  const [textColor, setTextColor] = useState('#f1f5f9');
  const [fontSize, setFontSize] = useState('text-6xl');
  const [viewerUrl, setViewerUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [timerView, setTimerView] = useState('normal');
  const [timerExceedsLimit, setTimerExceedsLimit] = useState(false);
  
  // Check if any timer is currently running
  // Check both timerList and currentTimer to handle page refresh scenarios
  const isAnyTimerRunning = timerList.some(timer => timer.isRunning) || (currentTimer && currentTimer.isRunning);
  console.log(isAnyTimerRunning," --isAnyTimerRunning")
  console.log(timerList," --timerList")
  
  // Get the active timer (the one that's currently running)
  // Prioritize currentTimer if it's running, otherwise find from timerList
  const activeTimer = (currentTimer && currentTimer.isRunning) ? currentTimer : timerList.find(timer => timer.isRunning);
  
  // Determine which timer ID to use for sharing and controls
  const effectiveTimerId = isAnyTimerRunning ? (activeTimer?.id || null) : selectedTimerId;
  console.log({
    timerListLength: timerList.length,
    currentTimerRunning: currentTimer?.isRunning,
    selectedTimerId,
    effectiveTimerId,
    isAnyTimerRunning,
    activeTimerId: activeTimer?.id
  }, " --Timer State Debug")
  // Set viewer URL when component mounts or effective timer selection changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseUrl = `${window.location.origin}/viewer`;
      setViewerUrl(baseUrl);
      
      // Generate QR code with effective timer ID
      const qrUrl = effectiveTimerId ? `${baseUrl}?timer=${effectiveTimerId}` : baseUrl;
      QRCode.toDataURL(qrUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      }).then(url => {
        setQrCodeDataUrl(url);
      }).catch(err => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [effectiveTimerId]);

  useEffect(() => {
    if (currentTimer && currentTimer.styling && currentTimer.styling.timerView) {
      setTimerView(currentTimer.styling.timerView);
    }
  }, [currentTimer]);

  const handleCreateTimer = (e) => {
    e.preventDefault();
    const [minutes, seconds] = createTimerInput.split(':').map(Number);
    const totalSeconds = (minutes || 0) * 60 + (seconds || 0);
    if (totalSeconds > 0 && timerName.trim()) {
      createTimer(timerName.trim(), totalSeconds, { timerView, backgroundColor, textColor, fontSize });
      setCreateTimerInput('');
      setTimerName('');
    }
  };

  const handleSetTimer = (e) => {
    e.preventDefault();
    if (!effectiveTimerId) return;
    const [minutes, seconds] = setTimerInput.split(':').map(Number);
    const totalSeconds = (minutes || 0) * 60 + (seconds || 0);
    if (totalSeconds > 180000) {
      alert('Timer duration cannot exceed 50 hours.');
      return;
    }
    if (totalSeconds > 0) {
      setTimer(effectiveTimerId, totalSeconds);
    }
  };

  const handleUpdateMessage = (e) => {
    e.preventDefault();
    if (!effectiveTimerId) return;
    updateMessage(effectiveTimerId, messageInput);
    setMessageInput('');
  };

  const handleUpdateStyling = () => {
    if (!effectiveTimerId) return;
    updateStyling(effectiveTimerId, { backgroundColor, textColor, fontSize, timerView });
  };

  const handleCopyLink = async () => {
    try {
      const fullUrl = effectiveTimerId ? `${viewerUrl}?timer=${effectiveTimerId}` : viewerUrl;
      await navigator.clipboard.writeText(fullUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleToggleFlash = () => {
    if (!effectiveTimerId || !currentTimer) return;
    toggleFlash(effectiveTimerId, !currentTimer.isFlashing);
  };

  const handleAdjustTime = (seconds) => {
    if (!effectiveTimerId || !currentTimer) return;
    // Only block if subtracting more than remaining
    if (seconds < 0 && Math.abs(seconds) > currentTimer.remaining) return;
    adjustTimer(effectiveTimerId, seconds);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDeleteTimer = (timerId) => {
    deleteTimer(timerId);
    if (selectedTimerId === timerId) {
      setSelectedTimerId(null);
      setCurrentTimer(null);
    }
  };

  const handleTimerSelect = (timerId) => {
    if (!isConnected) return;
    
    // If any timer is running, don't allow switching
    if (isAnyTimerRunning) {
      return;
    }
    
    setSelectedTimerId(timerId);
    setTimeout(() => {
      joinTimer(timerId);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/90 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <Link href="/" className="focus:outline-none rounded-xl">
                <h1 className="text-xl font-bold text-white cursor-pointer">Shared Timer Controller</h1>
              </Link>
            </div>
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              isConnected 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-full">
          {/* Timer Preview - Takes full width on mobile, 5 columns on desktop */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden h-full">
              <div className="p-6 border-b border-slate-700/50">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Live Preview
                </h2>
              </div>
              <div className="p-6">
                <div className="aspect-video bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700/50">
                  <Timer 
                    timerState={currentTimer ? {
                      ...currentTimer,
                      styling: {
                        ...currentTimer.styling,
                        timerView,
                        backgroundColor,
                        textColor,
                        fontSize,
                      },
                    } : null}
                    showMessage={true}
                    className="h-full w-full"
                    isPreview={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Controls - Takes full width on mobile, 7 columns on desktop */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
              
              {/* Left Column - Timer Management */}
              <div className="space-y-6">
                {/* Create Timer */}
                <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Timer
                  </h3>
                  <form onSubmit={handleCreateTimer} className="space-y-4">
                    <input
                      type="text"
                      value={timerName}
                      onChange={(e) => setTimerName(e.target.value)}
                      placeholder="Timer name"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400"
                      required
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={createTimerInput}
                        onChange={(e) => {
                          setCreateTimerInput(e.target.value);
                          const [minutes, seconds] = e.target.value.split(':').map(Number);
                          const totalSeconds = (minutes || 0) * 60 + (seconds || 0);
                          if (totalSeconds > 180000) {
                            setTimerExceedsLimit(true);
                            return;
                          } else {
                            setTimerExceedsLimit(false);
                            // return;
                          }
                        }}
                        placeholder="MM:SS"
                        className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg whitespace-nowrap"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                  {timerExceedsLimit ? <div className="text-sm text-red-400 mt-2">
                    <p>
                      <span className="font-semibold">Note:</span> Timer duration cannot exceed 50 hours.
                    </p>
                  </div> : <div className="text-sm text-slate-400 mt-2">
                    <p>
                      <span className="font-semibold">Tip:</span> Enter time as <span className="font-mono bg-slate-700/50 px-1 rounded">MM:SS</span> or just minutes (e.g., <span className="font-mono bg-slate-700/50 px-1 rounded">5</span> for 5 minutes, <span className="font-mono bg-slate-700/50 px-1 rounded">5:30</span> for 5 minutes 30 seconds).
                    </p>
                  </div>
                  }
                </div>

                {/* Timer List */}
                <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Your Timers
                  </h3>
                  {timerList.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <svg className="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm">No timers created yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto overflow-x-hidden">
                      {timerList.map((timer) => (
                        <div
                          key={timer.id}
                          onClick={() => handleTimerSelect(timer.id)}
                          className={`p-4 rounded-xl transition-all duration-200 transform ${
                            isAnyTimerRunning 
                              ? 'cursor-not-allowed opacity-60' 
                              : 'cursor-pointer hover:scale-[1.02]'
                          } ${
                            effectiveTimerId === timer.id
                              ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 shadow-lg'
                              : 'bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white truncate">{timer.name}</h4>
                              <p className="text-xs text-slate-500 font-mono mt-1">ID: {timer.id}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-2">
                              {timer.isRunning && (
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                              )}
                              <span className="text-xs font-medium text-slate-400 bg-slate-600/50 px-2 py-1 rounded-lg whitespace-nowrap">
                                {timer.connectedCount}/3
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 mt-1">
                            Duration: {formatTime(timer.duration)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Note about timer switching */}
                  {isAnyTimerRunning && (
                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-xs text-amber-400">
                          <span className="font-semibold">Timer is running:</span> Stop or reset the active timer to switch to another timer.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Share Section */}
                <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share Timer
                  </h3>
                  {effectiveTimerId ? (
                    <div className="space-y-4">
                      {isAnyTimerRunning && (
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                          <p className="text-xs text-emerald-400 text-center">
                            <span className="font-semibold">Active Timer:</span> Sharing the currently running timer
                          </p>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={`${viewerUrl}?timer=${effectiveTimerId}`}
                          readOnly
                          className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-300 font-mono min-w-0"
                        />
                        <button
                          onClick={handleCopyLink}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm whitespace-nowrap"
                        >
                          {copySuccess ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <a
                        href={`${viewerUrl}?timer=${effectiveTimerId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-center text-sm"
                      >
                        Open Viewer
                      </a>
                      {qrCodeDataUrl && (
                        <div className="text-center">
                          <div className="inline-block bg-white p-3 rounded-xl">
                            <img 
                              src={qrCodeDataUrl} 
                              alt="QR Code" 
                              className="w-20 h-20"
                            />
                          </div>
                          <p className="text-xs text-slate-400 mt-2">Scan to open</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">Select a timer to share</p>
                  )}
                </div>
              </div>

              {/* Right Column - Controls & Customization */}
              <div className="space-y-6">
                {/* Timer Controls */}
                {effectiveTimerId && currentTimer && (
                  <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
                      </svg>
                      Controls
                    </h3>
                    
                    {/* Set Timer */}
                    <form onSubmit={handleSetTimer} className="mb-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={setTimerInput}
                          onChange={(e) => setSetTimerInput(e.target.value)}
                          placeholder="MM:SS"
                          className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400 text-sm"
                        />
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm whitespace-nowrap"
                        >
                          Set
                        </button>
                      </div>
                    </form>

                    {/* Quick Adjust */}
                    <div className="mb-4">
                      <div className="text-xs text-slate-400 mb-2 font-medium">Quick Adjust:</div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: '-1m', value: -60, color: 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' },
                          { label: '-10s', value: -10, color: 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' },
                          { label: '+10s', value: 10, color: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' },
                          { label: '+1m', value: 60, color: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' },
                          { label: '+5m', value: 300, color: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' },
                          { label: '+10m', value: 600, color: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' }
                        ].map((btn) => (
                          <button
                            key={btn.label}
                            onClick={() => handleAdjustTime(btn.value)}
                            className={`bg-gradient-to-r ${btn.color} text-white font-semibold py-2 px-2 rounded-lg transition-all duration-200 transform hover:scale-105 text-xs`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <button
                        onClick={() => startTimer(effectiveTimerId)}
                        disabled={currentTimer.isRunning || currentTimer.remaining <= 0}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 text-white font-semibold py-3 px-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none text-sm"
                      >
                        Start
                      </button>
                      <button
                        onClick={() => pauseTimer(effectiveTimerId)}
                        disabled={!currentTimer.isRunning}
                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 text-white font-semibold py-3 px-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none text-sm"
                      >
                        Pause
                      </button>
                      <button
                        onClick={() => resetTimer(effectiveTimerId)}
                        className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white font-semibold py-3 px-2 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
                      >
                        Reset
                      </button>
                    </div>

                    {/* Status */}
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs font-medium text-slate-400 mb-1">Duration</p>
                          <p className="font-semibold text-white text-sm">{formatTime(currentTimer.duration)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-400 mb-1">Status</p>
                          <p className={`font-semibold text-sm ${currentTimer.isRunning ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {currentTimer.isRunning ? 'Running' : 'Stopped'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-400 mb-1">Connected</p>
                          <p className="font-semibold text-white text-sm">{currentTimer.connectedCount}/3</p>
                        </div>
                      </div>
                    </div>

                    {/* Delete Timer */}
                    <button
                      onClick={() => handleDeleteTimer(effectiveTimerId)}
                      className="w-full mt-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold py-2 px-4 rounded-lg transition-all duration-200 border border-red-600/30 text-sm"
                    >
                      Delete Timer
                    </button>
                  </div>
                )}

                {/* Message Control */}
                {effectiveTimerId && (
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
                        placeholder="Enter message to display..."
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400"
                      />
                    </form>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (messageInput.trim()) {
                            updateMessage(effectiveTimerId, messageInput);
                            setMessageInput('');
                          }
                        }}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex-1 text-sm"
                      >
                        Send
                      </button>
                      <button
                        onClick={() => clearMessage(effectiveTimerId)}
                        className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}

                {/* Styling Controls */}
                {effectiveTimerId && (
                  <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                      Styling
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Background</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="w-10 h-10 rounded-lg border border-slate-600 cursor-pointer flex-shrink-0"
                            />
                            <input
                              type="text"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white font-mono text-xs min-w-0"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Text Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="w-10 h-10 rounded-lg border border-slate-600 cursor-pointer flex-shrink-0"
                            />
                            <input
                              type="text"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white font-mono text-xs min-w-0"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Font Size</label>
                        <select
                          value={fontSize}
                          onChange={(e) => setFontSize(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white"
                        >
                          <option value="text-4xl">Small</option>
                          <option value="text-6xl">Medium</option>
                          <option value="text-8xl">Large</option>
                          <option value="text-9xl">Extra Large</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Timer View</label>
                        <select
                          value={timerView}
                          onChange={e => {
                            setTimerView(e.target.value);
                            handleUpdateStyling();
                          }}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white"
                        >
                          <option value="normal">Countdown</option>
                          {/* <option value="flip">Flip Clock</option> */}
                          <option value="countup">Count Up</option>
                        </select>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={handleUpdateStyling}
                          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex-1 text-sm"
                        >
                          Apply
                        </button>
                        <button
                          onClick={handleToggleFlash}
                          className={`font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm whitespace-nowrap ${
                            currentTimer?.isFlashing 
                              ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white' 
                              : 'bg-slate-600 hover:bg-slate-700 text-white'
                          }`}
                        >
                          {currentTimer?.isFlashing ? 'Stop Flash' : 'Flash'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}