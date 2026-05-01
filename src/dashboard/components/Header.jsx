import { useState } from 'react';

export default function Header({ score, onRefresh, onExport }) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="bg-tac-panel border-b border-tac-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF00FF" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <div>
          <h1 className="text-lg font-bold text-tac-white font-mono tracking-wide">CONSENT-OS 2.0 TACTICAL</h1>
          <span className="text-xs text-tac-gray font-mono">Privacy Command Center</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-3 py-1.5 border border-tac-border text-tac-gray hover:text-tac-white hover:border-tac-gray text-sm font-mono transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
          REFRESH
        </button>

        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-3 py-1.5 bg-tac-magenta text-tac-black font-mono text-sm font-bold hover:bg-opacity-90 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            EXPORT
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {showExportMenu && (
            <div className="absolute right-0 top-full mt-1 bg-tac-panel border border-tac-border z-50">
              <button
                onClick={() => { onExport('json'); setShowExportMenu(false); }}
                className="block w-full px-4 py-2 text-left text-sm text-tac-white hover:bg-tac-dark font-mono"
              >
                Export as JSON
              </button>
              <button
                onClick={() => { onExport('csv'); setShowExportMenu(false); }}
                className="block w-full px-4 py-2 text-left text-sm text-tac-white hover:bg-tac-dark font-mono"
              >
                Export as CSV
              </button>
              <button
                onClick={() => { onExport('pdf'); setShowExportMenu(false); }}
                className="block w-full px-4 py-2 text-left text-sm text-tac-gray hover:bg-tac-dark font-mono"
              >
                Export as PDF Report
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-l border-tac-border pl-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-tac-green font-mono">{score}</div>
            <div className="text-[10px] text-tac-gray font-mono">SCORE</div>
          </div>
          <div className="w-3 h-3 relative">
            <div className="w-3 h-3 bg-tac-green absolute" />
            <div className="w-3 h-3 bg-tac-green absolute animate-ping" />
          </div>
        </div>
      </div>
    </header>
  );
}