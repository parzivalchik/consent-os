import { useState } from 'react';

export default function KillSwitch({ onActivate, disabled, serviceCount, theme }) {
  const [confirming, setConfirming] = useState(false);
  const isLight = theme === 'light';

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

  const buttonClass = confirming
    ? isLight ? 'bg-tac-light-magenta border-tac-light-magenta text-white' : 'bg-tac-magenta border-tac-magenta text-tac-black'
    : disabled
    ? isLight ? 'bg-tac-light-panel border-tac-light-border text-tac-light-dim cursor-not-allowed' : 'bg-tac-panel border-tac-border text-tac-dim cursor-not-allowed'
    : isLight ? 'bg-tac-light-bg border-tac-light-magenta text-tac-light-magenta hover:bg-tac-light-magenta hover:text-white' : 'bg-tac-black border-tac-magenta text-tac-magenta hover:bg-tac-magenta hover:text-tac-black';

  return (
    <div className={`border-t p-4 ${isLight ? 'border-tac-light-border bg-tac-light-panel' : 'border-tac-border bg-tac-dark'}`}>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`w-full py-4 text-lg font-bold font-mono flex items-center justify-center gap-2 border-2 transition-all ${buttonClass}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        {confirming ? 'CONFIRM PURGE' : disabled ? 'PURGING...' : `KILL SWITCH (${serviceCount} SERVICES)`}
      </button>
      {confirming && (
        <div className={`text-center text-xs font-mono mt-2 ${isLight ? 'text-tac-light-yellow' : 'text-tac-yellow'}`}>
          CLICK AGAIN TO CONFIRM - CANCEL IN 3 SECONDS
        </div>
      )}
    </div>
  );
}