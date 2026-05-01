import { getCategory, calculateRiskLevel } from '../../../shared/categories';

export default function RecommendationsTab({ services, stats, onApplyRecommendation, theme }) {
  const isLight = theme === 'light';

  const highPriority = services
    .filter(s => calculateRiskLevel(s) === 'high')
    .map(s => ({ id: s.id, domain: s.name || s.domain, reason: 'High risk tracker detected', category: getCategory(s.name || s.domain) }));

  const mediumPriority = services
    .filter(s => calculateRiskLevel(s) === 'medium')
    .map(s => ({ id: s.id, domain: s.name || s.domain, reason: 'Analytical tracking', category: getCategory(s.name || s.domain) }));

  const completed = services.filter(s => s.revoked).map(s => ({ id: s.id, domain: s.name || s.domain, reason: 'Service revoked' }));

  const allServices = [...highPriority, ...mediumPriority];
  const hasRecommendations = allServices.length > 0;

  const panelClass = isLight ? 'bg-tac-light-panel border-tac-light-border' : 'bg-tac-panel border-tac-border';
  const textClass = isLight ? 'text-tac-light-text' : 'text-tac-white';
  const dimClass = isLight ? 'text-tac-light-dim' : 'text-tac-gray';

  return (
    <div className="space-y-4">
      <div className={`${panelClass} border p-4`}>
        <h3 className="text-sm font-bold text-tac-red font-mono mb-2">HIGH PRIORITY</h3>
        <p className={`text-xs font-mono mb-4 ${dimClass}`}>Actions that significantly improve your privacy</p>
        {highPriority.length === 0 ? (
          <div className={`font-mono text-sm py-4 ${dimClass}`}>NO HIGH PRIORITY ITEMS</div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {highPriority.map((rec, i) => (
              <div key={i} className={`flex items-center justify-between py-2 border-b ${isLight ? 'border-tac-light-border' : 'border-tac-border'}`}>
                <div>
                  <div className={`text-sm font-mono ${textClass}`}>{rec.domain}</div>
                  <div className="text-xs font-mono text-tac-red">{rec.reason}</div>
                </div>
                <button onClick={() => onApplyRecommendation(rec.id)} className="px-3 py-1 border border-tac-red text-tac-red hover:bg-tac-red hover:text-tac-black text-xs font-mono transition-colors">
                  REVOKE
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`${panelClass} border p-4`}>
        <h3 className={`text-sm font-bold font-mono mb-2 ${isLight ? 'text-tac-light-yellow' : 'text-tac-yellow'}`}>MEDIUM PRIORITY</h3>
        <p className={`text-xs font-mono mb-4 ${dimClass}`}>Actions to consider for better privacy</p>
        {mediumPriority.length === 0 ? (
          <div className={`font-mono text-sm py-4 ${dimClass}`}>NO MEDIUM PRIORITY ITEMS</div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {mediumPriority.map((rec, i) => (
              <div key={i} className={`flex items-center justify-between py-2 border-b ${isLight ? 'border-tac-light-border' : 'border-tac-border'}`}>
                <div>
                  <div className={`text-sm font-mono ${textClass}`}>{rec.domain}</div>
                  <div className={`text-xs font-mono ${isLight ? 'text-tac-light-yellow' : 'text-tac-yellow'}`}>{rec.reason}</div>
                </div>
                <button onClick={() => onApplyRecommendation(rec.id)} className={`px-3 py-1 border text-xs font-mono transition-colors ${isLight ? 'border-tac-light-yellow text-tac-light-yellow hover:bg-tac-light-yellow hover:text-white' : 'border-tac-yellow text-tac-yellow hover:bg-tac-yellow hover:text-tac-black'}`}>
                  REVOKE
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`${panelClass} border p-4`}>
        <h3 className={`text-sm font-bold font-mono mb-2 ${isLight ? 'text-tac-light-green' : 'text-tac-green'}`}>COMPLETED</h3>
        <p className={`text-xs font-mono mb-4 ${dimClass}`}>Privacy goals you've achieved</p>
        {completed.length === 0 ? (
          <div className={`font-mono text-sm py-4 ${dimClass}`}>NO COMPLETED ACTIONS</div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {completed.map((rec, i) => (
              <div key={i} className={`flex items-center justify-between py-2 border-b ${isLight ? 'border-tac-light-border' : 'border-tac-border'}`}>
                <div>
                  <div className={`text-sm font-mono ${textClass}`}>{rec.domain}</div>
                  <div className={`text-xs font-mono ${isLight ? 'text-tac-light-green' : 'text-tac-green'}`}>{rec.reason}</div>
                </div>
                <span className={`text-xs font-mono ${isLight ? 'text-tac-light-green' : 'text-tac-green'}`}>✓ DONE</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {hasRecommendations && (
        <div className="p-4">
          <button onClick={() => allServices.forEach(s => onApplyRecommendation(s.id))} className={`w-full py-3 border-2 text-sm font-bold font-mono transition-colors ${isLight ? 'border-tac-light-magenta text-tac-light-magenta hover:bg-tac-light-magenta hover:text-white' : 'border-tac-magenta text-tac-magenta hover:bg-tac-magenta hover:text-tac-black'}`}>
            APPLY ALL RECOMMENDATIONS
          </button>
        </div>
      )}
    </div>
  );
}