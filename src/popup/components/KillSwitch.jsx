import { useState } from 'react';

export default function KillSwitch({ onActivate, active, disabled, theme }) {
  const [confirming, setConfirming] = useState(false);
  const isLight = theme === 'light';

  function handleClick() {
    if (disabled) return;
    
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
    } else {
      onActivate();
      setConfirming(false);
    }
  }

  const buttonClass = disabled
    ? (isLight ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-gray-600 text-gray-400 cursor-not-allowed')
    : confirming
      ? 'bg-red-600 text-white animate-pulse'
      : active
        ? (isLight ? 'bg-tac-light-magenta text-white animate-glow-pink' : 'bg-neon-pink text-base animate-glow-pink')
        : (isLight ? 'bg-tac-light-border text-tac-light-text border border-tac-light-magenta/50 hover:border-tac-light-magenta' : 'bg-base-lighter text-ghost border border-neon-pink/50 hover:border-neon-pink');

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs font-semibold transition-all ${buttonClass}`}
      >
        {disabled ? (
          <div className="w-3.5 h-3.5 border-2 border-current rounded-full animate-spin border-t-transparent" />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        )}
        <span>
          {disabled ? 'PURGING...' : confirming ? 'CONFIRM PURGE' : active ? 'ACTIVE' : 'KILL SWITCH'}
        </span>
      </button>

      {confirming && !disabled && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className={`text-[9px] font-mono ${isLight ? 'text-tac-light-dim' : 'text-ghost-muted'}`}>
            Tap again to confirm
          </span>
        </div>
      )}
    </div>
  );
}