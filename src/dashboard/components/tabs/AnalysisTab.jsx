import { getCategory, calculateRiskLevel } from '../../../shared/categories';

export default function AnalysisTab({ services, cookies, categoryCounts, theme }) {
  const isLight = theme === 'light';

  const trackers = services.filter(s => {
    const cat = getCategory(s.name || s.domain);
    return cat === 'intrusive' || cat === 'analytical';
  }).sort((a, b) => (b.cookieCount || 0) - (a.cookieCount || 0)).slice(0, 20);

  const dataTypes = [
    { type: 'Tracking Cookies', count: cookies.filter(c => c.name?.includes('track') || c.name?.includes('ga')).length },
    { type: 'Session Cookies', count: cookies.filter(c => !c.expirationDate).length },
    { type: 'Third-Party', count: cookies.filter(c => c.domain?.includes('.')).length },
    { type: 'Secure Cookies', count: cookies.filter(c => c.secure).length },
    { type: 'HttpOnly Cookies', count: cookies.filter(c => c.httpOnly).length },
  ];

  const panelClass = isLight ? 'bg-tac-light-panel border-tac-light-border' : 'bg-tac-panel border-tac-border';
  const textClass = isLight ? 'text-tac-light-text' : 'text-tac-white';
  const dimClass = isLight ? 'text-tac-light-dim' : 'text-tac-gray';

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className={`${panelClass} border p-4`}>
        <h3 className={`text-sm font-bold font-mono mb-4 ${textClass}`}>THIRD-PARTY TRACKERS</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {trackers.length === 0 ? (
            <div className={`font-mono text-sm ${dimClass}`}>NO TRACKERS DETECTED</div>
          ) : (
            trackers.map((tracker, i) => {
              const cat = getCategory(tracker.name || tracker.domain);
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-tac-border">
                  <div>
                    <div className={`text-sm font-mono ${textClass}`}>{tracker.name || tracker.domain}</div>
                    <div className={`text-xs font-mono ${dimClass}`}>{cat.toUpperCase()}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold font-mono ${isLight ? 'text-tac-light-yellow' : 'text-tac-yellow'}`}>{tracker.cookieCount || 0}</div>
                    <div className={`text-[10px] font-mono ${dimClass}`}>COOKIES</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className={`${panelClass} border p-4`}>
        <h3 className={`text-sm font-bold font-mono mb-4 ${textClass}`}>DATA TYPE DISTRIBUTION</h3>
        <div className="space-y-4">
          {dataTypes.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-mono ${textClass}`}>{item.type}</span>
                <span className={`text-sm font-mono ${isLight ? 'text-tac-light-yellow' : 'text-tac-yellow'}`}>{item.count}</span>
              </div>
              <div className={`h-2 ${isLight ? 'bg-tac-light-border' : 'bg-tac-border'}`}>
                <div className={`h-full ${isLight ? 'bg-tac-light-magenta' : 'bg-tac-magenta'}`} style={{ width: `${Math.min(100, (item.count / Math.max(...dataTypes.map(d => d.count), 1)) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`col-span-2 ${panelClass} border p-4`}>
        <h3 className={`text-sm font-bold font-mono mb-4 ${textClass}`}>RISK ANALYSIS</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className={`border p-4 ${isLight ? 'border-tac-red bg-red-50' : 'border-tac-red bg-tac-red bg-opacity-10'}`}>
            <div className={`text-xs font-mono mb-2 ${dimClass}`}>HIGH RISK SERVICES</div>
            <div className={`text-3xl font-bold font-mono text-tac-red`}>{services.filter(s => calculateRiskLevel(s) === 'high').length}</div>
          </div>
          <div className={`border p-4 ${isLight ? 'border-tac-light-yellow bg-yellow-50' : 'border-tac-yellow bg-tac-yellow bg-opacity-10'}`}>
            <div className={`text-xs font-mono mb-2 ${dimClass}`}>MEDIUM RISK SERVICES</div>
            <div className={`text-3xl font-bold font-mono ${isLight ? 'text-tac-light-yellow' : 'text-tac-yellow'}`}>{services.filter(s => calculateRiskLevel(s) === 'medium').length}</div>
          </div>
          <div className={`border p-4 ${isLight ? 'border-tac-light-green bg-green-50' : 'border-tac-green bg-tac-green bg-opacity-10'}`}>
            <div className={`text-xs font-mono mb-2 ${dimClass}`}>LOW RISK SERVICES</div>
            <div className={`text-3xl font-bold font-mono ${isLight ? 'text-tac-light-green' : 'text-tac-green'}`}>{services.filter(s => calculateRiskLevel(s) === 'low').length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}