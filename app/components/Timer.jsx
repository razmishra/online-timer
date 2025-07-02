'use client';

import dynamic from 'next/dynamic';
const FlipClockTimer = dynamic(() => import('./FlipClock'), { ssr: false });

const formatTime = (seconds) => {
  // Safety check for invalid values
  if (seconds === null || seconds === undefined || isNaN(seconds)) {
    return '00:00';
  }
  
  const isNegative = seconds < 0;
  const absSeconds = Math.abs(seconds);
  
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const secs = absSeconds % 60;
  
  let timeString = '';
  if (hours > 0) {
    timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    timeString = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return isNegative ? `-${timeString}` : timeString;
};

export default function Timer({ timerState, showMessage = true, className = '', isPreview = false }) {
  if(!timerState){
    return (
      <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      <div className="text-4xl font-light text-white/60 mb-4">⏱️</div>
      <div className="text-2xl font-medium text-white/70">No timer selected</div>
      <div className="text-sm text-white/50 mt-2">Waiting for timer to start...</div>
    </div>
    );
  }
  const { remaining, message, backgroundColor, textColor, fontSize, isRunning, isFlashing, styling = {} } = timerState;
  const isNegative = remaining < 0;
  const timerView = styling.timerView || 'normal';
  console.log(styling,"styling")
  // Enhanced flash animation for negative time
  const flashClass = isFlashing 
    ? isNegative 
      ? 'animate-pulse bg-red-900' 
      : 'animate-pulse' 
    : '';
  
  if (timerView === 'flip') {
    // Calculate target time for countdown
    const now = Date.now();
    const absRemaining = Math.max(0, Math.abs(remaining));
    const targetTime = now + absRemaining * 1000;
    console.log("showing flip clock");
    return (
      <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}
        style={{ backgroundColor, color: textColor }}>
        <FlipClockTimer initialTime={60} showHours={true} showMinutes={true} showSeconds={true} flipDirection="up" animationDuration={600} flipDelay={50} size="medium" theme="dark" customColors={null} showSeparators={true} separatorChar=":" separatorStyle={null} cardBorderRadius={8} cardShadow={true} cardPadding={null} className={""} style={null} disabled={false} pauseOnHover={false} isRunning={null} onToggle={null} onComplete={null} onTick={null} />
        {/* Message Display */}
        {showMessage && message && (
          <div className="mt-8 max-w-4xl break-words px-4" style={{ color: textColor, fontWeight: 'bold', lineHeight: '1.2' }}>{message}</div>
        )}
      </div>
    );
  }
  return (
    <div 
      className={`flex flex-col items-center justify-center text-center p-8 ${className} ${flashClass}`}
      style={{ 
        backgroundColor: isNegative && isFlashing ? '#7f1d1d' : backgroundColor, 
        color: textColor
      }}
    >
      <div 
        className={`timer-display ${fontSize} font-mono ${isRunning ? 'animate-pulse' : ''} ${
          isNegative ? 'text-red-400 font-bold' : ''
        }`}
        style={{ 
          color: isNegative ? '#f87171' : textColor,
          textShadow: isNegative ? '0 0 20px rgba(248, 113, 113, 0.5)' : 'none',
          fontSize: !isPreview ? (showMessage && message ? '12vw' : '20vw') : ''
        }}
      >
        {formatTime(remaining)}
      </div>
      
      {/* Message Display */}
      {showMessage && message && (
        <div 
          className="mt-8 max-w-4xl break-words px-4"
          style={{ 
            color: textColor,
            fontSize: !isPreview ? (message.length > 50 ? '6vw' : '10vw') : '',
            fontWeight: 'bold',
            lineHeight: '1.2',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {message}
        </div>
      )}
      
      {isRunning && isPreview && (
        <div className="mt-4 flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-lg opacity-75">LIVE</span>
        </div>
      )}
      
      {isNegative && (
        <div className="mt-4 flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
          <span className="text-lg text-red-400 font-bold animate-pulse">OVERTIME</span>
        </div>
      )}
    </div>
  );
}