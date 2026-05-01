export default function Header({ score, servicesCount }) {
  function openDashboard() {
    chrome.runtime.openOptionsPage();
  }

  return (
    <header className="flex items-center justify-between px-3 py-2 bg-base border-b border-base-border">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF00FF" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xs font-bold text-ghost font-mono tracking-wider">CONSENT-OS</h1>
          <span className="text-[9px] text-ghost-meta font-mono">2.0 TACTICAL</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={openDashboard}
          className="flex items-center gap-1 px-2 py-1 bg-base-lighter border border-base-border hover:border-ghost-dim transition-colors"
          title="Open Full Dashboard"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ghost-dim">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span className="text-[9px] text-ghost-dim font-mono">DASH</span>
        </button>
        <div className="flex flex-col items-end">
          <span className="text-lg font-bold text-ghost font-mono">{score}</span>
          <span className="text-[8px] text-ghost-meta font-mono -mt-0.5">SCORE</span>
        </div>
        <div className="relative">
          <div className="w-2 h-2 bg-[#00FF41]" />
          <div className="absolute inset-0 w-2 h-2 bg-[#00FF41] animate-pulse-green" />
        </div>
      </div>
    </header>
  );
}