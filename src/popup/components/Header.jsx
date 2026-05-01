export default function Header({ score, servicesCount, theme, onToggleTheme }) {
  const isLight = theme === 'light';

  function openDashboard() {
    chrome.runtime.openOptionsPage();
  }

  return (
    <header className={`flex items-center justify-between px-3 py-2 border-b ${isLight ? 'bg-tac-light-panel border-tac-light-border' : 'bg-base-light border-base-lighter'}`}>
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 flex items-center justify-center ${isLight ? 'bg-tac-light-magenta' : 'bg-neon-pink'}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isLight ? '#FFFFFF' : '#121212'} strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <h1 className={`text-xs font-semibold font-mono tracking-wide ${isLight ? 'text-tac-light-text' : 'text-ghost'}`}>CONSENT-OS</h1>
          <span className={`text-[9px] font-mono ${isLight ? 'text-tac-light-dim' : 'text-ghost-muted'}`}>2.0 TACTICAL</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          className={`p-1.5 border ${isLight ? 'border-tac-light-border text-tac-light-text' : 'border-base-lighter text-ghost-dim'} hover:border-tac-magenta transition-colors`}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {isLight ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={openDashboard}
          className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${isLight ? 'bg-tac-light-border hover:bg-tac-light-dim text-tac-light-dim' : 'bg-base-lighter hover:bg-base-lighter/70 text-ghost-dim'}`}
          title="Open Full Dashboard"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isLight ? 'text-tac-light-dim' : 'text-ghost-dim'}>
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span className={`text-[9px] font-mono ${isLight ? 'text-tac-light-dim' : 'text-ghost-dim'}`}>DASH</span>
        </button>

        <div className="flex flex-col items-end">
          <span className={`text-lg font-bold font-mono ${isLight ? 'text-tac-light-text' : 'text-ghost'}`}>{score}</span>
          <span className={`text-[8px] font-mono -mt-0.5 ${isLight ? 'text-tac-light-dim' : 'text-ghost-muted'}`}>SCORE</span>
        </div>
        <div className="relative">
          <div className={`w-2 h-2 rounded-full ${isLight ? 'bg-tac-light-green' : 'bg-green-500'}`} />
          <div className={`absolute inset-0 w-2 h-2 rounded-full animate-pulse-green ${isLight ? 'bg-tac-light-green' : 'bg-green-500'}`} />
        </div>
      </div>
    </header>
  );
}