// 'use client';

// import { useState, useEffect } from 'react';
// import { useSocket } from '../context/SocketContext';
// import Timer from '../components/Timer';
// import QRCode from 'qrcode';
// import Link from 'next/link';
// import { BRAND_NAME } from '../constants';
// import posthog from 'posthog-js';

// export default function ControllerPage() {
//   const {
//     isConnected,
//     isConnecting,
//     timerList,
//     currentTimer,
//     setCurrentTimer,
//     selectedTimerId,
//     setSelectedTimerId,
//     createTimer,
//     deleteTimer,
//     setTimer,
//     startTimer,
//     pauseTimer,
//     resetTimer,
//     adjustTimer,
//     updateMessage,
//     updateStyling,
//     clearMessage,
//     toggleFlash,
//     joinTimer,
//   } = useSocket();

//   const [createTimerInput, setCreateTimerInput] = useState('');
//   const [setTimerInput, setSetTimerInput] = useState('');
//   const [timerName, setTimerName] = useState('');
//   const [messageInput, setMessageInput] = useState('');
//   const [backgroundColor, setBackgroundColor] = useState('#1e293b');
//   const [textColor, setTextColor] = useState('#f1f5f9');
//   const [fontSize, setFontSize] = useState('text-6xl');
//   const [viewerUrl, setViewerUrl] = useState('');
//   const [copySuccess, setCopySuccess] = useState(false);
//   const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
//   const [timerView, setTimerView] = useState('normal');
//   const [timerExceedsLimit, setTimerExceedsLimit] = useState(false);
//   const useuserr = useUser();
//   console.log(useuserr,"--useuserr  ")
//   // Check if any timer is currently running
//   // Check both timerList and currentTimer to handle page refresh scenarios
//   const isAnyTimerRunning = timerList.some(timer => timer.isRunning) || (currentTimer && currentTimer.isRunning);
//   // console.log(isAnyTimerRunning," --isAnyTimerRunning")
//   // console.log(timerList," --timerList")
  
//   // Get the active timer (the one that's currently running)
//   // Prioritize currentTimer if it's running, otherwise find from timerList
//   const activeTimer = (currentTimer && currentTimer.isRunning) ? currentTimer : timerList.find(timer => timer.isRunning);
  
//   // Determine which timer ID to use for sharing and controls
//   const effectiveTimerId = isAnyTimerRunning ? (activeTimer?.id || null) : selectedTimerId;
//   // console.log({
//   //   timerListLength: timerList.length,
//   //   currentTimerRunning: currentTimer?.isRunning,
//   //   selectedTimerId,
//   //   effectiveTimerId,
//   //   isAnyTimerRunning,
//   //   activeTimerId: activeTimer?.id
//   // }, " --Timer State Debug")
//   // Set viewer URL when component mounts or effective timer selection changes
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const baseUrl = `${window.location.origin}/viewer`;
//       setViewerUrl(baseUrl);
      
//       // Generate QR code with effective timer ID
//       const qrUrl = effectiveTimerId ? `${baseUrl}?timer=${effectiveTimerId}` : baseUrl;
//       QRCode.toDataURL(qrUrl, {
//         width: 200,
//         margin: 2,
//         color: {
//           dark: '#0f172a',
//           light: '#ffffff'
//         }
//       }).then(url => {
//         setQrCodeDataUrl(url);
//       }).catch(err => {
//         console.error('Error generating QR code:', err);
//       });
//     }
//   }, [effectiveTimerId]);

//   useEffect(() => {
//     if (currentTimer && currentTimer.styling && currentTimer.styling.timerView) {
//       setTimerView(currentTimer.styling.timerView);
//     }
//   }, [currentTimer]);

//   // State for current time and date
//   const [now, setNow] = useState(new Date());

//   useEffect(() => {
//     const interval = setInterval(() => setNow(new Date()), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleCreateTimer = (e) => {
//     e.preventDefault();
//     const [minutes, seconds] = createTimerInput.split(':').map(Number);
//     const totalSeconds = (minutes || 0) * 60 + (seconds || 0);
//     if (totalSeconds > 0 && timerName.trim()) {
//       createTimer(timerName.trim(), totalSeconds, maxConnectionsAllowed, maxTimersAllowed, { timerView, backgroundColor, textColor, fontSize });
//       // PostHog event for timer creation
//       if (posthog.__initialized) {
//         posthog.capture('timer_created', {
//           name: timerName.trim(),
//           duration: totalSeconds,
//           timerView,
//           backgroundColor,
//           textColor,
//           fontSize,
//         });
//       }
//       setCreateTimerInput('');
//       setTimerName('');
//     }
//   };

//   const handleSetTimer = (e) => {
//     e.preventDefault();
//     if (!effectiveTimerId) return;
//     const [minutes, seconds] = setTimerInput.split(':').map(Number);
//     const totalSeconds = (minutes || 0) * 60 + (seconds || 0);
//     if (totalSeconds > 180000) {
//       alert('Timer duration cannot exceed 50 hours.');
//       return;
//     }
//     if (totalSeconds > 0) {
//       setTimer(effectiveTimerId, totalSeconds);
//       // PostHog event for set timer
//       if (posthog.__initialized) {
//         posthog.capture('timer_set', {
//           timerId: effectiveTimerId,
//           duration: totalSeconds,
//         });
//       }
//     }
//   };

//   const handleUpdateMessage = (e) => {
//     e.preventDefault();
//     if (!effectiveTimerId) return;
//     updateMessage(effectiveTimerId, messageInput);
//     // PostHog event for sending message
//     if (posthog.__initialized) {
//       posthog.capture('timer_message_sent', {
//         timerId: effectiveTimerId,
//         message: messageInput,
//       });
//     }
//     setMessageInput('');
//   };

//   const handleUpdateStyling = () => {
//     if (!effectiveTimerId) return;
//     updateStyling(effectiveTimerId, { backgroundColor, textColor, fontSize, timerView });
//     // PostHog event for styling change
//     if (posthog.__initialized) {
//       posthog.capture('timer_styling_changed', {
//         timerId: effectiveTimerId,
//         backgroundColor,
//         textColor,
//         fontSize,
//         timerView,
//       });
//     }
//   };

//   const handleCopyLink = async () => {
//     try {
//       const fullUrl = effectiveTimerId ? `${viewerUrl}?timer=${effectiveTimerId}` : viewerUrl;
//       await navigator.clipboard.writeText(fullUrl);
//       setCopySuccess(true);
//       setTimeout(() => setCopySuccess(false), 2000);
//       // PostHog event for copying link
//       if (posthog.__initialized) {
//         posthog.capture('timer_link_copied', { timerId: effectiveTimerId });
//       }
//     } catch (err) {
//       console.error('Failed to copy link:', err);
//     }
//   };

//   const handleToggleFlash = () => {
//     if (!effectiveTimerId || !currentTimer) return;
//     toggleFlash(effectiveTimerId, !currentTimer.isFlashing);
//     // PostHog event for flash control
//     if (posthog.__initialized) {
//       posthog.capture('timer_flash_toggled', {
//         timerId: effectiveTimerId,
//         isFlashing: !currentTimer.isFlashing,
//       });
//     }
//   };

//   const handleAdjustTime = (seconds) => {
//     if (!effectiveTimerId || !currentTimer) return;
//     // Only block if subtracting more than remaining
//     if (seconds < 0 && Math.abs(seconds) > currentTimer.remaining) return;
//     adjustTimer(effectiveTimerId, seconds);
//     // PostHog event for adjust time
//     if (posthog.__initialized) {
//       posthog.capture('timer_adjusted', {
//         timerId: effectiveTimerId,
//         seconds,
//       });
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleDeleteTimer = (timerId) => {
//     deleteTimer(timerId);
//     if (selectedTimerId === timerId) {
//       setSelectedTimerId(null);
//       setCurrentTimer(null);
//     }
//     // PostHog event for timer deletion
//     if (posthog.__initialized) {
//       posthog.capture('timer_deleted', {
//         timerId,
//       });
//     }
//   };

//   const handleTimerSelect = (timerId) => {
//     if (!isConnected) return;
    
//     // If any timer is running, don't allow switching
//     if (isAnyTimerRunning) {
//       return;
//     }
    
//     setSelectedTimerId(timerId);
//     setTimeout(() => {
//       joinTimer(timerId);
//     }, 0);
//   };

//   // Helper function to calculate total seconds
// const calculateTotalSeconds = (inputValue) => {
//   if (!inputValue) return 0;
  
//   if (inputValue.includes(':')) {
//     const [mins, secs] = inputValue.split(':');
//     return (parseInt(mins) || 0) * 60 + (parseInt(secs) || 0);
//   } else {
//     return (parseInt(inputValue) || 0) * 60;
//   }
// };

// // onKeyDown - Prevents invalid input before it appears
// const handleTimerKeyDown = (e) => {
//   const key = e.key;
  
//   // Allow control keys
//   if ([
//     'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
//     'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'
//   ].includes(key) || e.ctrlKey || e.metaKey) {
//     return;
//   }
  
//   // Only allow digits and colon
//   if (!/[\d:]/.test(key)) {
//     e.preventDefault();
//     return;
//   }
  
//   const currentValue = createTimerInput;
  
//   // Colon restrictions
//   if (key === ':') {
//     if (currentValue.includes(':') || currentValue === '') {
//       e.preventDefault();
//       return;
//     }
//   }
  
//   // Digit restrictions after colon (max 2 digits)
//   if (/\d/.test(key) && currentValue.includes(':')) {
//     const afterColon = currentValue.split(':')[1] || '';
//     const selectionStart = e.target.selectionStart;
//     const selectionEnd = e.target.selectionEnd;
    
//     if (afterColon.length >= 2 && selectionStart === selectionEnd) {
//       e.preventDefault();
//       return;
//     }
//   }
  
//   // Check if new value would exceed limit
//   const selectionStart = e.target.selectionStart;
//   const selectionEnd = e.target.selectionEnd;
//   const newValue = currentValue.slice(0, selectionStart) + key + currentValue.slice(selectionEnd);
  
//   if (calculateTotalSeconds(newValue) > 180000) {
//     e.preventDefault();
//     setTimerExceedsLimit(true);
//     return;
//   }
// };

// // onChange - Cleans up and validates final input
// const handleTimerInputChange = (e) => {
//   let value = e.target.value;
  
//   // Clean input: only digits and colon
//   value = value.replace(/[^\d:]/g, '');
  
//   // Remove extra colons
//   if ((value.match(/:/g) || []).length > 1) {
//     const firstColonIndex = value.indexOf(':');
//     value = value.slice(0, firstColonIndex + 1) + value.slice(firstColonIndex + 1).replace(/:/g, '');
//   }
  
//   // Format and validate MM:SS
//   if (value.includes(':')) {
//     const [minutes, seconds] = value.split(':');
//     let limitedSeconds = (seconds || '').slice(0, 2); // Max 2 digits
    
//     // Cap seconds at 59
//     if (limitedSeconds && parseInt(limitedSeconds) > 59) {
//       limitedSeconds = '59';
//     }
    
//     value = minutes + ':' + limitedSeconds;
//   }
  
//   // Check time limit
//   const totalSeconds = calculateTotalSeconds(value);
//   if (totalSeconds > 180000) {
//     setTimerExceedsLimit(true);
//     return; // Don't update if exceeds limit
//   } else {
//     setTimerExceedsLimit(false);
//   }
  
//   setCreateTimerInput(value);
// };

// const sanitizeInput = (input) => {
//   return input.replace(/<[^>]*>/g, ''); // Removes all HTML tags
// };

// const handleTimerNameChange = (e) => {
//   setTimerName(sanitizeInput(e.target.value));
// };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       {/* Header */}
//       <header className="bg-slate-800/90 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
//         <div className="max-w-full px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <svg className="w-5 h-5 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <Link href="/" className="focus:outline-none rounded-xl">
//                 <h1 className="text-xl font-bold text-white cursor-pointer">{BRAND_NAME}</h1>
//               </Link>
//             </div>
//             <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
//               isConnecting
//                 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
//                 : isConnected 
//                   ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
//                   : 'bg-red-500/20 text-red-400 border border-red-500/30'
//             }`}>
//               {isConnecting ? (
//                 <>
//                   <svg className="w-3 h-3 animate-spin mr-1 text-blue-400" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
//                   </svg>
//                   <span>Connecting...</span>
//                 </>
//               ) : (
//                 <>
//                   <div className={`w-2 h-2 rounded-full ${
//                     isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
//                   }`}></div>
//                   <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-full">
//           {/* Timer Preview - Takes full width on mobile, 5 columns on desktop */}
//           <div className="lg:col-span-5 w-full">
//           {/* Main Container with Enhanced Styling */}
//           <div className="relative group w-full">
//             {/* Animated Background Glow */}
//             <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl sm:rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
            
//             {/* Main Panel */}
//             <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden h-full w-full">
//               {/* Decorative Top Border */}
//               <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 opacity-80"></div>
              
//               {/* Header Section with Enhanced Design */}
//               <div className="relative p-4 sm:p-6 lg:p-8 border-b border-slate-700/40">
//                 {/* Background Pattern */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-teal-500/5"></div>
//                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                
//                 <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                   <div className="flex items-center space-x-3 sm:space-x-4">
//                     {/* Enhanced Icon with Glow Effect */}
//                     <div className="relative">
//                       <div className="absolute inset-0 bg-blue-400/30 rounded-xl sm:rounded-2xl blur-md"></div>
//                       <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl border border-blue-400/30">
//                         <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                         </svg>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
//                         Live Preview
//                       </h2>
//                       <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Real-time timer visualization</p>
//                     </div>
//                   </div>
                  
//                   {/* Status Indicator */}
//                   <div className="flex items-center space-x-2 self-start sm:self-auto">
//                     <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
//                     <span className="text-emerald-400 text-xs sm:text-sm font-semibold">LIVE</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Content Section */}
//               <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
//                 {/* Timer Preview with Enhanced Container */}
//                 <div className="relative group/preview">
//                   {/* Floating Glow Effect */}
//                   <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl sm:rounded-3xl blur-lg opacity-0 group-hover/preview:opacity-100 transition-all duration-500"></div>
                  
//                   {/* Preview Container */}
//                   <div className="relative">
//                     {/* Glass Morphism Effect */}
//                     <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-xl sm:rounded-2xl"></div>
//                     <div className="relative aspect-video bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-600/50 shadow-2xl">
//                       {/* Inner Glow */}
//                       <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
                      
//                       {/* Timer Component */}
//                       <div className="relative h-full w-full">
//                         <Timer 
//                           timerState={currentTimer ? {
//                             ...currentTimer,
//                             styling: {
//                               ...currentTimer.styling,
//                               timerView,
//                               backgroundColor,
//                               textColor,
//                               fontSize,
//                             },
//                           } : null}
//                           showMessage={true}
//                           className="h-full w-full"
//                           isPreview={true}
//                         />
//                       </div>
                      
//                       {/* Corner Decorations */}
//                       <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400/60 rounded-full animate-ping"></div>
//                       <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-400/60 rounded-full animate-pulse"></div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Enhanced Timer Controls */}
//                 {effectiveTimerId && currentTimer && (
//                   <div className="space-y-4 sm:space-y-6">
//                     {/* Section Header */}
//                     <div className="text-center">
//                       <div className="inline-flex items-center space-x-2 sm:space-x-3">
//                         <div className="w-4 sm:w-8 h-0.5 bg-gradient-to-r from-transparent to-blue-400 rounded-full"></div>
//                         <h3 className="text-base sm:text-lg font-bold text-slate-200">Timer Controls</h3>
//                         <div className="w-4 sm:w-8 h-0.5 bg-gradient-to-l from-transparent to-purple-400 rounded-full"></div>
//                       </div>
//                     </div>
                    
//                     {/* Control Buttons with Enhanced Design */}
//                     <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
//                       {/* Start Button */}
//                       <button
//                         onClick={() => { startTimer(effectiveTimerId); if (posthog.__initialized) posthog.capture('timer_started', { timerId: effectiveTimerId }); }}
//                         disabled={currentTimer.isRunning || currentTimer.remaining <= 0}
//                         className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none disabled:hover:shadow-none w-full sm:w-auto"
//                       >
//                         {/* Button Glow Effect */}
//                         <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
//                         {/* Animated Background */}
//                         <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        
//                         <span className="relative flex items-center justify-center space-x-2">
//                           <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
//                           </svg>
//                           <span className="text-sm sm:text-base">Start</span>
//                         </span>
//                       </button>
                      
//                       {/* Pause Button */}
//                       <button
//                         onClick={() => { pauseTimer(effectiveTimerId); if (posthog.__initialized) posthog.capture('timer_paused', { timerId: effectiveTimerId }); }}
//                         disabled={!currentTimer.isRunning}
//                         className="group relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-amber-500/30 hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none disabled:hover:shadow-none w-full sm:w-auto"
//                       >
//                         <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                         <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/20 to-amber-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        
//                         <span className="relative flex items-center justify-center space-x-2">
//                           <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//                           </svg>
//                           <span className="text-sm sm:text-base">Pause</span>
//                         </span>
//                       </button>
                      
//                       {/* Reset Button */}
//                       <button
//                         onClick={() => { resetTimer(effectiveTimerId); if (posthog.__initialized) posthog.capture('timer_reset', { timerId: effectiveTimerId }); }}
//                         className="group relative overflow-hidden bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-500 hover:to-gray-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-slate-500/30 hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto"
//                       >
//                         <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                         <div className="absolute inset-0 bg-gradient-to-r from-slate-400/0 via-slate-400/20 to-slate-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        
//                         <span className="relative flex items-center justify-center space-x-2">
//                           <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
//                           </svg>
//                           <span className="text-sm sm:text-base">Reset</span>
//                         </span>
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Enhanced Current Time Display */}
//                 <div className="relative group/time">
//                   {/* Background with Glass Effect */}
//                   <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-800/60 rounded-2xl sm:rounded-3xl"></div>
//                   <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl sm:rounded-3xl"></div>
                  
//                   {/* Content */}
//                   <div className="relative p-4 sm:p-6 lg:p-8 border border-slate-600/40 rounded-2xl sm:rounded-3xl backdrop-blur-sm">
//                     {/* Floating Particles */}
//                     <div className="absolute top-3 sm:top-6 right-4 sm:right-8 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-400/60 rounded-full animate-bounce"></div>
//                     <div className="absolute top-6 sm:top-12 right-6 sm:right-12 w-0.5 h-0.5 bg-purple-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
//                     <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-teal-400/60 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                    
//                     <div className="text-center space-y-3 sm:space-y-4">
//                       {/* Time Label */}
//                       <div className="inline-flex items-center space-x-2 bg-slate-700/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-slate-600/50">
//                         <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         <span className="text-slate-300 text-xs sm:text-sm font-semibold uppercase tracking-wider">Current Time</span>
//                       </div>
                      
//                       {/* Time Display */}
//                       <div className="space-y-1 sm:space-y-2">
//                         <div className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent tracking-wider">
//                           {(() => {
//                             let timeStr = now.toLocaleTimeString([], { 
//                               hour: '2-digit', 
//                               minute: '2-digit', 
//                               second: '2-digit', 
//                               hour12: true 
//                             });
//                             timeStr = timeStr.replace(/\s?(am|pm)$/i, (match) => match.toUpperCase());
//                             return timeStr;
//                           })()}
//                         </div>
                        
//                         {/* Date Display */}
//                         <div className="text-slate-400 text-sm sm:text-base lg:text-lg font-medium">
//                           {now.toLocaleDateString([], { 
//                             weekday: 'long',
//                             year: 'numeric', 
//                             month: 'long', 
//                             day: 'numeric' 
//                           })}
//                         </div>
//                       </div>
                      
//                       {/* Timezone Info */}
//                       {/* <div className="text-slate-500 text-xs sm:text-sm">
//                         {Intl.DateTimeFormat().resolvedOptions().timeZone}
//                       </div> */}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Bottom Accent with Animation */}
//               <div className="relative h-1.5 sm:h-2 overflow-hidden">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 opacity-60"></div>
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
//               </div>
//             </div>
//           </div>
//         </div>

//           {/* Main Controls - Takes full width on mobile, 7 columns on desktop */}
//           <div className="lg:col-span-7">
//             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
              
//               {/* Left Column - Timer Management */}
//               <div className="space-y-6">
//                 {/* Create Timer */}
//                 <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
//                   <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
//                     <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                     </svg>
//                     Create Timer
//                   </h3>
//                   <form onSubmit={handleCreateTimer} className="space-y-4">
//                     <input
//                       type="text"
//                       value={timerName}
//                       onChange={handleTimerNameChange}
//                       placeholder="Timer name"
//                       className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400"
//                       required
//                     />
//                     <div className="flex flex-col sm:flex-row gap-3">
//                       <input
//                         type="text"
//                         value={createTimerInput}
//                         onChange={handleTimerInputChange}
//                         onKeyDown={handleTimerKeyDown}
//                         placeholder="MM:SS"
//                         className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400"
//                         required
//                       />
//                       <button
//                         type="submit"
//                         className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg whitespace-nowrap"
//                       >
//                         Create
//                       </button>
//                     </div>
//                   </form>
//                   {timerExceedsLimit ? <div className="text-sm text-red-400 mt-2">
//                     <p>
//                       <span className="font-semibold">Note:</span> Timer duration cannot exceed 50 hours.
//                     </p>
//                   </div> : <div className="text-sm text-slate-400 mt-2">
//                     <p>
//                       <span className="font-semibold">Tip:</span> Enter time as <span className="font-mono bg-slate-700/50 px-1 rounded">MM:SS</span> or just minutes (e.g., <span className="font-mono bg-slate-700/50 px-1 rounded">5</span> for 5 minutes, <span className="font-mono bg-slate-700/50 px-1 rounded">5:30</span> for 5 minutes 30 seconds).
//                     </p>
//                   </div>
//                   }
//                 </div>

//                 {/* Timer List */}
//                 <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
//                   <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
//                     <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                     </svg>
//                     Your Timers
//                   </h3>
//                   {timerList.length === 0 ? (
//                     <div className="text-center py-8 text-slate-400">
//                       <svg className="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <p className="text-sm">No timers created yet</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-3 max-h-64 overflow-y-auto overflow-x-hidden">
//                       {timerList.map((timer) => (
//                         <div
//                           key={timer.id}
//                           onClick={() => handleTimerSelect(timer.id)}
//                           className={`p-4 rounded-xl transition-all duration-200 transform ${
//                             isAnyTimerRunning 
//                               ? 'cursor-not-allowed opacity-60' 
//                               : 'cursor-pointer hover:scale-[1.02]'
//                           } ${
//                             effectiveTimerId === timer.id
//                               ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 shadow-lg'
//                               : 'bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50'
//                           }`}
//                         >
//                           <div className="flex justify-between items-center">
//                             <div className="flex-1 min-w-0">
//                               <h4 className="font-semibold text-white truncate">{timer.name}</h4>
//                               <p className="text-xs text-slate-500 font-mono mt-1">ID: {timer.id}</p>
//                             </div>
//                             <div className="flex items-center space-x-2 ml-2">
//                               {timer.isRunning && (
//                                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
//                               )}
//                               <span className="text-xs font-medium text-slate-400 bg-slate-600/50 px-2 py-1 rounded-lg whitespace-nowrap">
//                                 {timer.connectedCount}/3
//                               </span>
//                             </div>
//                           </div>
//                           <p className="text-sm text-slate-400 mt-1">
//                             Duration: {formatTime(timer.duration)}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   )}
                  
//                   {/* Note about timer switching */}
//                   {isAnyTimerRunning && (
//                     <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
//                       <div className="flex items-start space-x-2">
//                         <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                         </svg>
//                         <p className="text-xs text-amber-400">
//                           <span className="font-semibold">Timer is running:</span> Stop or reset the active timer to switch to another timer.
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Share Section */}
//                 <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
//                   <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
//                     <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
//                     </svg>
//                     Share Timer
//                   </h3>
//                   {effectiveTimerId ? (
//                     <div className="space-y-4">
//                       {isAnyTimerRunning && (
//                         <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
//                           <p className="text-xs text-emerald-400 text-center">
//                             <span className="font-semibold">Active Timer:</span> Sharing the currently running timer
//                           </p>
//                         </div>
//                       )}
//                       <div className="flex flex-col sm:flex-row gap-2">
//                         <input
//                           type="text"
//                           value={`${viewerUrl}?timer=${effectiveTimerId}`}
//                           readOnly
//                           className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-300 font-mono min-w-0"
//                         />
//                         <button
//                           onClick={handleCopyLink}
//                           className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm whitespace-nowrap"
//                         >
//                           {copySuccess ? 'Copied!' : 'Copy'}
//                         </button>
//                       </div>
//                       <a
//                         href={`${viewerUrl}?timer=${effectiveTimerId}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="block w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-center text-sm"
//                         onClick={() => { if(posthog.__initialized){posthog.capture('viewer_link_opened', { timerId: effectiveTimerId }); } }}
//                       >
//                         Open View Mode
//                       </a>
//                       {qrCodeDataUrl && (
//                         <div className="text-center">
//                           <div className="inline-block bg-white p-3 rounded-xl">
//                             <img 
//                               src={qrCodeDataUrl} 
//                               alt="QR Code" 
//                               className="w-20 h-20"
//                             />
//                           </div>
//                           <p className="text-xs text-slate-400 mt-2">Scan to open</p>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <p className="text-slate-400 text-sm">Select a timer to share</p>
//                   )}
//                 </div>
//               </div>

//               {/* Right Column - Controls & Customization */}
//               <div className="space-y-6">
//                 {/* Timer Controls */}
//                 {effectiveTimerId && currentTimer && (
//                   <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
//                     <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
//                       <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
//                       </svg>
//                       Controls
//                     </h3>
                    
//                     {/* Set Timer */}
//                     <form onSubmit={handleSetTimer} className="mb-4">
//                       <div className="flex flex-col sm:flex-row gap-2">
//                         <input
//                           type="text"
//                           value={setTimerInput}
//                           onChange={(e) => setSetTimerInput(e.target.value)}
//                           onKeyDown={handleTimerKeyDown}
//                           placeholder="MM:SS"
//                           className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400 text-sm"
//                         />
//                         <button
//                           type="submit"
//                           className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm whitespace-nowrap"
//                         >
//                           Set
//                         </button>
//                       </div>
//                     </form>

//                     {/* Quick Adjust */}
//                     <div className="mb-4">
//                       <div className="text-xs text-slate-400 mb-2 font-medium">Quick Adjust:</div>
//                       <div className="grid grid-cols-3 gap-2">
//                         {[
//                           { label: '-1m', value: -60, color: 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' },
//                           { label: '-10s', value: -10, color: 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' },
//                           { label: '+10s', value: 10, color: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' },
//                           { label: '+1m', value: 60, color: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' },
//                           { label: '+5m', value: 300, color: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' },
//                           { label: '+10m', value: 600, color: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' }
//                         ].map((btn) => (
//                           <button
//                             key={btn.label}
//                             onClick={() => handleAdjustTime(btn.value)}
//                             className={`bg-gradient-to-r ${btn.color} text-white font-semibold py-2 px-2 rounded-lg transition-all duration-200 transform hover:scale-105 text-xs`}
//                           >
//                             {btn.label}
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Control Buttons */}
//                     <div className="grid grid-cols-3 gap-2 mb-4">
//                       <button
//                         onClick={() => { startTimer(effectiveTimerId); if (posthog.__initialized) posthog.capture('timer_started', { timerId: effectiveTimerId }); }}
//                         disabled={currentTimer.isRunning || currentTimer.remaining <= 0}
//                         className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 text-white font-semibold py-3 px-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none text-sm"
//                       >
//                         Start
//                       </button>
//                       <button
//                         onClick={() => { pauseTimer(effectiveTimerId); if (posthog.__initialized) posthog.capture('timer_paused', { timerId: effectiveTimerId }); }}
//                         disabled={!currentTimer.isRunning}
//                         className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 text-white font-semibold py-3 px-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none text-sm"
//                       >
//                         Pause
//                       </button>
//                       <button
//                         onClick={() => { resetTimer(effectiveTimerId); if (posthog.__initialized) posthog.capture('timer_reset', { timerId: effectiveTimerId }); }}
//                         className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white font-semibold py-3 px-2 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
//                       >
//                         Reset
//                       </button>
//                     </div>

//                     {/* Status */}
//                     <div className="bg-slate-700/30 rounded-lg p-3">
//                       <div className="grid grid-cols-3 gap-4 text-center">
//                         <div>
//                           <p className="text-xs font-medium text-slate-400 mb-1">Duration</p>
//                           <p className="font-semibold text-white text-sm">{formatTime(currentTimer.duration)}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs font-medium text-slate-400 mb-1">Status</p>
//                           <p className={`font-semibold text-sm ${currentTimer.isRunning ? 'text-emerald-400' : 'text-slate-400'}`}>
//                             {currentTimer.isRunning ? 'Running' : 'Stopped'}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-xs font-medium text-slate-400 mb-1">Connected</p>
//                           <p className="font-semibold text-white text-sm">{currentTimer.connectedCount}/3</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Delete Timer */}
//                     <button
//                       onClick={() => handleDeleteTimer(effectiveTimerId)}
//                       className="w-full mt-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold py-2 px-4 rounded-lg transition-all duration-200 border border-red-600/30 text-sm"
//                     >
//                       Delete Timer
//                     </button>
//                   </div>
//                 )}

//                 {/* Message Control */}
//                 {effectiveTimerId && (
//                   <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
//                     <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
//                       <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                       </svg>
//                       Message
//                     </h3>
//                     <form onSubmit={handleUpdateMessage} className="mb-3">
//                       <input
//                         type="text"
//                         value={messageInput}
//                         onChange={(e) => setMessageInput(e.target.value)}
//                         placeholder="Enter message to display..."
//                         className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-400"
//                       />
//                     </form>
//                     <div className="flex flex-col sm:flex-row gap-2">
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault();
//                           if (messageInput.trim()) {
//                             updateMessage(effectiveTimerId, messageInput);
//                             setMessageInput('');
//                             if (posthog.__initialized) {
//                               posthog.capture('timer_message_cleared', { timerId: effectiveTimerId });
//                             }
//                           }
//                         }}
//                         className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex-1 text-sm"
//                       >
//                         Send
//                       </button>
//                       <button
//                         onClick={() => { clearMessage(effectiveTimerId); if (posthog.__initialized) posthog.capture('timer_message_cleared', { timerId: effectiveTimerId }); }}
//                         className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
//                       >
//                         Clear
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Styling Controls */}
//                 {effectiveTimerId && (
//                   <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 p-6">
//                     <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
//                       <svg className="w-5 h-5 mr-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
//                       </svg>
//                       Styling
//                     </h3>
                    
//                     <div className="space-y-4">
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-slate-300 mb-2">Background</label>
//                           <div className="flex items-center gap-2">
//                             <input
//                               type="color"
//                               value={backgroundColor}
//                               onChange={(e) => setBackgroundColor(e.target.value)}
//                               className="w-10 h-10 rounded-lg border border-slate-600 cursor-pointer flex-shrink-0"
//                             />
//                             <input
//                               type="text"
//                               value={backgroundColor}
//                               onChange={(e) => setBackgroundColor(e.target.value)}
//                               className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white font-mono text-xs min-w-0"
//                             />
//                           </div>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-slate-300 mb-2">Text Color</label>
//                           <div className="flex items-center gap-2">
//                             <input
//                               type="color"
//                               value={textColor}
//                               onChange={(e) => setTextColor(e.target.value)}
//                               className="w-10 h-10 rounded-lg border border-slate-600 cursor-pointer flex-shrink-0"
//                             />
//                             <input
//                               type="text"
//                               value={textColor}
//                               onChange={(e) => setTextColor(e.target.value)}
//                               className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white font-mono text-xs min-w-0"
//                             />
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-slate-300 mb-2">Font Size</label>
//                         <select
//                           value={fontSize}
//                           onChange={(e) => setFontSize(e.target.value)}
//                           className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white"
//                         >
//                           <option value="text-4xl">Small</option>
//                           <option value="text-6xl">Medium</option>
//                           <option value="text-8xl">Large</option>
//                           <option value="text-9xl">Extra Large</option>
//                         </select>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-slate-300 mb-2">Timer View</label>
//                         <select
//                           value={timerView}
//                           onChange={e => {
//                             setTimerView(e.target.value);
//                             updateStyling(effectiveTimerId, {
//                               backgroundColor,
//                               textColor,
//                               fontSize,
//                               timerView: e.target.value,
//                             });
//                           }}
//                           className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white"
//                         >
//                           <option value="normal">Countdown</option>
//                           {/* <option value="flip">Flip Clock</option> */}
//                           <option value="countup">Count Up</option>
//                         </select>
//                       </div>
                      
//                       <div className="flex flex-col sm:flex-row gap-2">
//                         <button
//                           onClick={handleUpdateStyling}
//                           className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex-1 text-sm"
//                         >
//                           Apply
//                         </button>
//                         <button
//                           onClick={handleToggleFlash}
//                           className={`font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm whitespace-nowrap ${
//                             currentTimer?.isFlashing 
//                               ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white' 
//                               : 'bg-slate-600 hover:bg-slate-700 text-white'
//                           }`}
//                         >
//                           {currentTimer?.isFlashing ? 'Stop Flash' : 'Flash'}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSocket } from '../context/SocketContext';
import StylingControls from '../components/(controller)/StylingControls';
import MessageControl from '../components/(controller)/MessageControl';
import TimerControls from '../components/(controller)/TimerControls';
const ShareTimer = dynamic(()=>import("../components/(controller)/ShareTimer"),{
  ssr:false
})
import TimerList from '../components/(controller)/TimerList';
import CreateTimer from '../components/(controller)/CreateTimer';
import Header from '../components/(controller)/Header';
import TimerPreview from '../components/(controller)/TimerPreview';
import EnhancedTimerControls from '../components/(controller)/EnhancedTimerControls';
import LimitExceededPopup from '../components/LimitExceededPopup';
const CurrentTimeDisplay = dynamic(() => import('../components/(controller)/CurrentTimeDisplay'), {
  ssr: false,
});

export default function ControllerPage() {
  const {
    isConnected,
    isConnecting,
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
    joiningCode,
  } = useSocket();

  const [viewerUrl, setViewerUrl] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#1e293b');
  const [textColor, setTextColor] = useState('#f1f5f9');
  const [fontSize, setFontSize] = useState('text-6xl');
  const [timerView, setTimerView] = useState('normal');

  const isAnyTimerRunning = timerList.some(timer => timer.isRunning) || (currentTimer && currentTimer.isRunning);
  const activeTimer = (currentTimer && currentTimer.isRunning) ? currentTimer : timerList.find(timer => timer.isRunning);
  const effectiveTimerId = isAnyTimerRunning ? (activeTimer?.id || null) : selectedTimerId;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setViewerUrl(`${window.location.origin}/viewer`);
    }
  }, []);

  useEffect(() => {
    if (currentTimer && currentTimer.styling && currentTimer.styling.timerView) {
      setTimerView(currentTimer.styling.timerView);
    }
  }, [currentTimer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header isConnected={isConnected} isConnecting={isConnecting} />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-full">
          <div className="lg:col-span-5 w-full">
            <div className="relative group w-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl sm:rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden h-full w-full">
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 opacity-80"></div>
                <div className="relative p-4 sm:p-6 lg:p-8 border-b border-slate-700/40">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-teal-500/5"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-400/30 rounded-xl sm:rounded-2xl blur-md"></div>
                        <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl border border-blue-400/30">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                          Live Preview
                        </h2>
                        <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Real-time timer visualization</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                      <span className="text-emerald-400 text-xs sm:text-sm font-semibold">LIVE</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                  <TimerPreview
                    currentTimer={currentTimer}
                    timerView={timerView}
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                    fontSize={fontSize}
                  />
                  {timerList?.length>0 && effectiveTimerId && currentTimer && (
                    <EnhancedTimerControls
                    effectiveTimerId={effectiveTimerId}
                    currentTimer={currentTimer}
                    startTimer={startTimer}
                    pauseTimer={pauseTimer}
                    resetTimer={resetTimer}
                    />
                  )}
                  <CurrentTimeDisplay />
                </div>
                <div className="relative h-1.5 sm:h-2 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 opacity-60"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
              <div className="space-y-6">
                <CreateTimer
                  createTimer={createTimer}
                  maxConnectionsAllowed={3}
                  maxTimersAllowed={10}
                  timerView={timerView}
                  backgroundColor={backgroundColor}
                  textColor={textColor}
                  fontSize={fontSize}
                  />
                {timerList?.length>0 && effectiveTimerId && currentTimer && (
                  <>
                  <TimerList
                    timerList={timerList}
                    isAnyTimerRunning={isAnyTimerRunning}
                    effectiveTimerId={effectiveTimerId}
                    setSelectedTimerId={setSelectedTimerId}
                    setCurrentTimer={setCurrentTimer}
                    joinTimer={joinTimer}
                    deleteTimer={deleteTimer}
                    />
                    <ShareTimer
                    viewerUrl={viewerUrl}
                    effectiveTimerId={effectiveTimerId}
                    isAnyTimerRunning={isAnyTimerRunning}
                    joiningCode={joiningCode}
                    />
                    </>
                  )}
              </div>
              <div className="space-y-6">
                {timerList?.length>0 && effectiveTimerId && currentTimer && (
                  <>
                    <TimerControls
                      effectiveTimerId={effectiveTimerId}
                      currentTimer={currentTimer}
                      startTimer={startTimer}
                      pauseTimer={pauseTimer}
                      resetTimer={resetTimer}
                      adjustTimer={adjustTimer}
                      setTimer={setTimer}
                      setSelectedTimerId={setSelectedTimerId}
                      setCurrentTimer={setCurrentTimer}
                      timerList={timerList}
                      isAnyTimerRunning={isAnyTimerRunning}
                      deleteTimer={deleteTimer}
                      joinTimer={joinTimer}
                      // maxTimersAllowed={maxTimersAllowed}
                      // maxConnectionsAllowed={maxConnectionsAllowed}
                    />
                    <MessageControl
                      effectiveTimerId={effectiveTimerId}
                      updateMessage={updateMessage}
                      clearMessage={clearMessage}
                    />
                    <StylingControls
                      effectiveTimerId={effectiveTimerId}
                      updateStyling={updateStyling}
                      toggleFlash={toggleFlash}
                      currentTimer={currentTimer}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* a modal if limits exceeds */}
        <LimitExceededPopup/>
      </div>
    </div>
  );
}