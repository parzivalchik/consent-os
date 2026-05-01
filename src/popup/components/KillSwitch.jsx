import { useState } from 'react';

export default function KillSwitch({ onActivate, active }) {
  const [confirming, setConfirming] = useState(false);

  function handleClick() {
    if (confirming) {
      onActivate();
      setConfirming(false);
    } else {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
    }
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs font-semibold transition-all ${
          confirming
            ? 'bg-red-600 text-white animate-pulse'
            : active
              ? 'bg-neon-pink text-base animate-glow-pink'
              : 'bg-base-lighter text-ghost border border-neon-pink/50 hover:border-neon-pink'
        }`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
        <span>
          {confirming ? 'CONFIRM PURGE' : active ? 'ACTIVE' : 'KILL SWITCH'}
        </span>
      </button>

      {confirming && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-[9px] text-ghost-muted font-mono">
            Tap again to confirm
          </span>
        </div>
      )}
    </div>
  );
}