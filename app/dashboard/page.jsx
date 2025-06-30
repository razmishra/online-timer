'use client';

import { useSocket } from '../hooks/useSocket';
import Timer from '../components/Timer';
import Link from 'next/link';

export default function DashboardPage() {
  const { timerState } = useSocket();

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timer Display */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <Timer 
                timerState={timerState} 
                showMessage={true}
                className="h-96"
              />
            </div>
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Timer Status</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-semibold ${timerState.isRunning ? 'text-green-400' : 'text-red-400'}`}>
                    {timerState.isRunning ? 'Running' : 'Stopped'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-mono">{formatTime(timerState.duration)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Remaining:</span>
                  <span className="font-mono">{formatTime(timerState.remaining)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Progress:</span>
                  <span className="font-semibold">
                    {timerState.duration > 0 ? 
                      Math.round(((timerState.duration - timerState.remaining) / timerState.duration) * 100) : 0}%
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: timerState.duration > 0 ? 
                        `${((timerState.duration - timerState.remaining) / timerState.duration) * 100}%` : '0%'
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Current Message */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Current Message</h2>
              <div className="bg-gray-700 p-4 rounded-lg min-h-[100px] flex items-center justify-center">
                {timerState.message ? (
                  <p className="text-center break-words">{timerState.message}</p>
                ) : (
                  <p className="text-gray-400 italic">No message set</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link 
                  href="/viewer" 
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center transition-colors"
                >
                  Open Viewer
                </Link>
                <Link 
                  href="/controller" 
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-center transition-colors"
                >
                  Open Controller
                </Link>
                <Link 
                  href="/" 
                  className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>

            {/* Styling Info */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Current Styling</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Background:</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded border border-gray-600"
                      style={{ backgroundColor: timerState.backgroundColor }}
                    ></div>
                    <span className="font-mono text-xs">{timerState.backgroundColor}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Text Color:</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded border border-gray-600"
                      style={{ backgroundColor: timerState.textColor }}
                    ></div>
                    <span className="font-mono text-xs">{timerState.textColor}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Font Size:</span>
                  <span className="font-mono text-xs">{timerState.fontSize}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}