"use client"
import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import posthog from 'posthog-js';
import { Check, Copy } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

const ShareTimer = React.memo(({ viewerUrl, effectiveTimerId, isAnyTimerRunning, joiningCode = null }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [joiningCodeCopied, setJoiningCodeCopied] = useState(false);
  const { isSignedIn } = useAuth()
  useEffect(() => {
    const qrUrl = effectiveTimerId ? `${viewerUrl}?timer=${effectiveTimerId}` : viewerUrl;
    QRCode.toDataURL(qrUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' }
    }).then(url => {
      setQrCodeDataUrl(url);
    }).catch(err => {
      console.error('Error generating QR code:', err);
    });
  }, [effectiveTimerId, viewerUrl]);

  const handleCopyLink = useCallback(async () => {
    try {
      const fullUrl = effectiveTimerId ? `${viewerUrl}?timer=${effectiveTimerId}` : viewerUrl;
      // console.log(viewerUrl,"--viewerUrl")
      // console.log(effectiveTimerId," --effectiveTimerId")
      await navigator.clipboard.writeText(fullUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      if (posthog.__initialized) {
        posthog.capture('timer_link_copied', { timerId: effectiveTimerId });
      }
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }, [effectiveTimerId, viewerUrl]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(joiningCode);
      setJoiningCodeCopied(true);
      setTimeout(() => setJoiningCodeCopied(false), 2000);   // reset after 2 s
    } catch (err) {
      console.error('Copy failed', err);
    }
  },[effectiveTimerId, joiningCode])

  return (
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
          <label htmlFor="joiningCode" className="text-sm text-slate-400">Joining code</label>
          <div className="space-y-1">                  {/* outer stack */}
            {/* Row 1: input + copy button */}
            <div className="relative">
              <input
                type="text"
                placeholder='Login to see a sharable code'
                value={isSignedIn ? joiningCode : ""}
                readOnly
                className="w-full pr-10 px-3 py-2 bg-slate-700/50 border border-slate-600
                          rounded-lg text-sm text-slate-300 font-mono focus:outline-0"
              />

              {/* copy icon, truly centered */}
              {isSignedIn && <button
                onClick={handleCopy}
                aria-label="Copy link"
                className="absolute inset-y-0 right-2 my-auto text-slate-400
                          hover:text-white transition-colors cursor-pointer"
              >
                {joiningCodeCopied
                  ? <Check className="w-4 h-4 text-emerald-400" />
                  : <Copy  className="w-4 h-4" />}
              </button>}
            </div>

            {/* Row 2: helper text */}
            <p className="text-xs text-slate-400">
              Give this code to others so they can join the same timer session.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={`${viewerUrl}?timer=${effectiveTimerId}`}
              readOnly
              className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-300 font-mono min-w-0 focus:outline-0"
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
            onClick={() => { if(posthog.__initialized) posthog.capture('viewer_link_opened', { timerId: effectiveTimerId }); }}
          >
            Open View Mode
          </a>
          {qrCodeDataUrl && (
            <div className="text-center">
              <div className="inline-block bg-white p-3 rounded-xl">
                <img src={qrCodeDataUrl} alt="QR Code" className="w-20 h-20" />
              </div>
              <p className="text-xs text-slate-400 mt-2">Scan to open</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-slate-400 text-sm">Select a timer to share</p>
      )}
    </div>
  );
});

export default ShareTimer;