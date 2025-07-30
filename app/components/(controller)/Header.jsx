"use client"
import React from 'react';
import Link from 'next/link';
import { BRAND_NAME } from '@/app/constants';

const Header = React.memo(({ isConnected, isConnecting }) => {
  return (
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
              <h1 className="text-xl font-bold text-white cursor-pointer">{BRAND_NAME}</h1>
            </Link>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            isConnecting
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : isConnected 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {isConnecting ? (
              <>
                <svg className="w-3 h-3 animate-spin mr-1 text-blue-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;