import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

function HeroJoinInput({ router }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);  

  const handleJoin = async () => {
    const trimmed = code.trim();
    if (!trimmed || loading) return;

    setLoading(true);                // show spinner
    try {
      const res = await fetch('/api/verify-joining-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joiningCode: trimmed }),
      });
      const result = await res.json();

      if (!result?.error) {
        window.open(
          `/viewer?timer=${encodeURIComponent(result.timerId)}`,
          '_blank',
          'noopener,noreferrer'
        );
      } else {
        displayError(result.message);
      }
    } catch {
      displayError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);             // hide spinner
    }
  };

  const displayError = msg => {
    setError(msg);
    setTimeout(() => setError(''), 2_000);  // 2 s later → clear
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        {/* input */}
        <input
          type="text"
          placeholder="Enter joining code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          className="
          w-full rounded-xl pl-5 pr-14 py-3
          bg-white/70 backdrop-blur border border-gray-200
          text-gray-800 placeholder-gray-500 text-sm md:text-base
          shadow-md focus:(outline-none ring-4 ring-blue-200/70)
          transition-all duration-200 focus:outline-0
        "
        />

        {/* arrow button */}
        <button
          onClick={handleJoin}
          disabled={!code.trim() || loading}
          aria-label="Join timer"
          className="absolute inset-y-0 right-4 my-auto flex items-center
                     text-gray-500 hover:text-blue-600 disabled:cursor-default
                     transition-colors duration-200"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
        </button>

        {/* subtle bottom glow */}
        <div className="pointer-events-none absolute inset-x-2 -bottom-3 h-3 bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-400/20 blur-md rounded-full" />
      </div>
      {/* error message */}
      {error && (
        <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}

export default HeroJoinInput;
