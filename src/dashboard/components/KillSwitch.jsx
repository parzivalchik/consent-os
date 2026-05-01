import { useState } from 'react';

export default function KillSwitch({ onActivate, disabled, serviceCount }) {
  const [confirming, setConfirming] = useState(false);

  function handleClick() {
    if (disabled) return;

    if (confirming) {
      onActivate();
      setConfirming(false);
    } else {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
    }
  }

  return (
    <div className="border-t border-tac-border p-4 bg-tac-dark">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`w-full py-4 text-lg font-bold font-mono flex items-center justify-center gap-2 border-2 transition-all ${
          confirming
            ? 'bg-tac-magenta border-tac-magenta text-tac-black'
            : disabled
            ? 'bg-tac-panel border-tac-border text-tac-dim cursor-not-allowed'
            : 'bg-tac-black border-tac-magenta text-tac-magenta hover:bg-tac-magenta hover:text-tac-black'
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        {confirming ? 'CONFIRM PURGE' : disabled ? 'PURGING...' : `KILL SWITCH (${serviceCount} SERVICES)`}
      </button>
      {confirming && (
        <div className="text-center text-xs text-tac-yellow font-mono mt-2 animate-pulse">
          CLICK AGAIN TO CONFIRM - CANCEL IN {3} SECONDS
        </div>
      )}
    </div>
  );
}