import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-10 max-w-md w-full text-center">
        <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-slate-300 mb-6">Sorry, the page you are looking for does not exist or has been moved.<br/>But don't worry, you can always return home.</p>
        <Link href="/" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg">
          Go to Homepage
        </Link>
      </div>
      <p className="mt-8 text-slate-500 text-sm">&mdash; stagetimerapp &mdash;</p>
    </div>
  );
} 