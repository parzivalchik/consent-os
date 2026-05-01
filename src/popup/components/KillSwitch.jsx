import { useState } from 'react';

export default function KillSwitch({ onActivate, active, disabled }) {
  const [confirming, setConfirming] = useState(false);

  function handleClick() {
    console.log('KillSwitch clicked, disabled:', disabled, 'confirming:', confirming);
    
    if (disabled) {
      console.log('KillSwitch blocked: isPurging is true');
      return;
    }
    
    if (!confirming) {
      console.log('Entering confirm mode');
      setConfirming(true);
      setTimeout(() => {
        console.log('Confirm timeout - resetting');
        setConfirming(false);
      }, 3000);
    } else {
      console.log('Confirm clicked - activating kill switch');
      onActivate();
      setConfirming(false);
    }
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-bold transition-all ${
          disabled
            ? 'bg-base-lighter text-ghost-meta border border-base-border cursor-not-allowed'
            : confirming
              ? 'bg-[#FF00FF] text-[#121212] border-2 border-[#FF00FF] animate-pulse'
              : active
                ? 'bg-[#FF00FF] text-[#121212] border-2 border-[#FF00FF]'
                : 'bg-[#121212] text-ghost border-2 border-[#FF00FF] hover:bg-[#FF00FF] hover:text-[#121212]'
        }`}
      >
        {disabled ? (
          <div className="w-3.5 h-3.5 border-2 border-current rounded-none animate-spin border-t-transparent" />
        ) : (
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
        )}
        <span className="uppercase">
          {disabled ? 'PURGING...' : confirming ? 'CONFIRM PURGE' : active ? 'ACTIVE' : 'KILL SWITCH'}
        </span>
      </button>

      {confirming && !disabled && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-[9px] text-ghost-meta font-mono">
            TAP AGAIN TO CONFIRM
          </span>
        </div>
      )}
    </div>
  );
}