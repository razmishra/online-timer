import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold mb-8">Multi-Timer App</h1>
        
        <div className="space-y-4">
          <div>
            <Link 
              href="/viewer" 
              className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
            >
              📺 Viewer Mode
            </Link>
            <p className="text-gray-400 mt-2">Full-screen timer display with timer selection</p>
          </div>
          
          <div>
            <Link 
              href="/controller" 
              className="block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
            >
              🎮 Controller Mode
            </Link>
            <p className="text-gray-400 mt-2">Create and manage multiple timers</p>
          </div>
          
          <div>
            <Link 
              href="/dashboard" 
              className="block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
            >
              📊 Dashboard
            </Link>
            <p className="text-gray-400 mt-2">View timer with controls visible</p>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-gray-800 rounded-lg max-w-2xl">
          <h2 className="text-xl font-semibold mb-3">New Features:</h2>
          <ul className="text-left space-y-2 text-gray-300">
            <li>• <strong>Multiple Timers:</strong> Create and manage multiple independent timers</li>
            <li>• <strong>Individual Sharing:</strong> Share specific timers with unique URLs</li>
            <li>• <strong>Device Limits:</strong> Maximum 3 devices per timer</li>
            <li>• <strong>Quick Adjust:</strong> Add/subtract time with one-click buttons</li>
            <li>• <strong>Timer Flash:</strong> Flash only the timer text, not the whole screen</li>
            <li>• <strong>Real-time Sync:</strong> All changes reflect instantly across devices</li>
            <li>• <strong>QR Code Sharing:</strong> Easy mobile sharing with QR codes</li>
          </ul>
        </div>

        <div className="mt-8 p-6 bg-gray-800 rounded-lg max-w-md">
          <h2 className="text-xl font-semibold mb-3">How it works:</h2>
          <ul className="text-left space-y-2 text-gray-300">
            <li>• <strong>Controller:</strong> Create timers, control them, and share links</li>
            <li>• <strong>Viewer:</strong> Watch specific timers in full-screen mode</li>
            <li>• <strong>Dashboard:</strong> Combined view for monitoring</li>
          </ul>
        </div>
      </div>
    </div>
  );
}