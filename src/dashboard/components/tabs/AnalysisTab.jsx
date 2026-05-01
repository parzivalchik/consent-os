import { getCategory, calculateRiskLevel } from '../../../shared/categories';

export default function AnalysisTab({ services, cookies, categoryCounts }) {
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

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-tac-panel border border-tac-border p-4">
        <h3 className="text-sm font-bold text-tac-white font-mono mb-4">THIRD-PARTY TRACKERS</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {trackers.length === 0 ? (
            <div className="text-tac-gray font-mono text-sm">NO TRACKERS DETECTED</div>
          ) : (
            trackers.map((tracker, i) => {
              const cat = getCategory(tracker.name || tracker.domain);
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-tac-border">
                  <div>
                    <div className="text-sm font-mono text-tac-white">{tracker.name || tracker.domain}</div>
                    <div className="text-xs font-mono text-tac-dim">{cat.toUpperCase()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono text-tac-yellow">{tracker.cookieCount || 0}</div>
                    <div className="text-[10px] font-mono text-tac-gray">COOKIES</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="bg-tac-panel border border-tac-border p-4">
        <h3 className="text-sm font-bold text-tac-white font-mono mb-4">DATA TYPE DISTRIBUTION</h3>
        <div className="space-y-4">
          {dataTypes.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-mono text-tac-white">{item.type}</span>
                <span className="text-sm font-mono text-tac-yellow">{item.count}</span>
              </div>
              <div className="h-2 bg-tac-border">
                <div
                  className="h-full bg-tac-magenta"
                  style={{ width: `${Math.min(100, (item.count / Math.max(...dataTypes.map(d => d.count), 1)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2 bg-tac-panel border border-tac-border p-4">
        <h3 className="text-sm font-bold text-tac-white font-mono mb-4">RISK ANALYSIS</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-tac-dark border border-tac-red p-4">
            <div className="text-xs text-tac-gray font-mono mb-2">HIGH RISK SERVICES</div>
            <div className="text-3xl font-bold text-tac-red font-mono">
              {services.filter(s => calculateRiskLevel(s) === 'high').length}
            </div>
          </div>
          <div className="bg-tac-dark border border-tac-yellow p-4">
            <div className="text-xs text-tac-gray font-mono mb-2">MEDIUM RISK SERVICES</div>
            <div className="text-3xl font-bold text-tac-yellow font-mono">
              {services.filter(s => calculateRiskLevel(s) === 'medium').length}
            </div>
          </div>
          <div className="bg-tac-dark border border-tac-green p-4">
            <div className="text-xs text-tac-gray font-mono mb-2">LOW RISK SERVICES</div>
            <div className="text-3xl font-bold text-tac-green font-mono">
              {services.filter(s => calculateRiskLevel(s) === 'low').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}