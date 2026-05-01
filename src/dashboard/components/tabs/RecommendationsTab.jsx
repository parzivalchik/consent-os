import { getCategory, calculateRiskLevel } from '../../../shared/categories';

export default function RecommendationsTab({ services, stats, onApplyRecommendation }) {
  const highPriority = services
    .filter(s => calculateRiskLevel(s) === 'high')
    .map(s => ({
      id: s.id,
      domain: s.name || s.domain,
      reason: 'High risk tracker detected',
      category: getCategory(s.name || s.domain),
    }));

  const mediumPriority = services
    .filter(s => calculateRiskLevel(s) === 'medium')
    .map(s => ({
      id: s.id,
      domain: s.name || s.domain,
      reason: 'Analytical tracking',
      category: getCategory(s.name || s.domain),
    }));

  const completed = services
    .filter(s => s.revoked)
    .map(s => ({
      id: s.id,
      domain: s.name || s.domain,
      reason: 'Service revoked',
    }));

  const allServices = [...highPriority, ...mediumPriority];
  const hasRecommendations = allServices.length > 0;

  return (
    <div className="space-y-4">
      <div className="bg-tac-panel border border-tac-border p-4">
        <h3 className="text-sm font-bold text-tac-red font-mono mb-2">HIGH PRIORITY</h3>
        <p className="text-xs text-tac-gray font-mono mb-4">Actions that significantly improve your privacy</p>

        {highPriority.length === 0 ? (
          <div className="text-tac-gray font-mono text-sm py-4">NO HIGH PRIORITY ITEMS</div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {highPriority.map((rec, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-tac-border">
                <div>
                  <div className="text-sm font-mono text-tac-white">{rec.domain}</div>
                  <div className="text-xs font-mono text-tac-red">{rec.reason}</div>
                </div>
                <button
                  onClick={() => onApplyRecommendation(rec.id)}
                  className="px-3 py-1 border border-tac-red text-tac-red hover:bg-tac-red hover:text-tac-black text-xs font-mono transition-colors"
                >
                  REVOKE
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-tac-panel border border-tac-border p-4">
        <h3 className="text-sm font-bold text-tac-yellow font-mono mb-2">MEDIUM PRIORITY</h3>
        <p className="text-xs text-tac-gray font-mono mb-4">Actions to consider for better privacy</p>

        {mediumPriority.length === 0 ? (
          <div className="text-tac-gray font-mono text-sm py-4">NO MEDIUM PRIORITY ITEMS</div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {mediumPriority.map((rec, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-tac-border">
                <div>
                  <div className="text-sm font-mono text-tac-white">{rec.domain}</div>
                  <div className="text-xs font-mono text-tac-yellow">{rec.reason}</div>
                </div>
                <button
                  onClick={() => onApplyRecommendation(rec.id)}
                  className="px-3 py-1 border border-tac-yellow text-tac-yellow hover:bg-tac-yellow hover:text-tac-black text-xs font-mono transition-colors"
                >
                  REVOKE
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-tac-panel border border-tac-border p-4">
        <h3 className="text-sm font-bold text-tac-green font-mono mb-2">COMPLETED</h3>
        <p className="text-xs text-tac-gray font-mono mb-4">Privacy goals you've achieved</p>

        {completed.length === 0 ? (
          <div className="text-tac-gray font-mono text-sm py-4">NO COMPLETED ACTIONS</div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {completed.map((rec, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-tac-border">
                <div>
                  <div className="text-sm font-mono text-tac-white">{rec.domain}</div>
                  <div className="text-xs font-mono text-tac-green">{rec.reason}</div>
                </div>
                <span className="text-xs font-mono text-tac-green">✓ DONE</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {hasRecommendations && (
        <div className="p-4">
          <button
            onClick={() => allServices.forEach(s => onApplyRecommendation(s.id))}
            className="w-full py-3 border-2 border-tac-magenta text-tac-magenta hover:bg-tac-magenta hover:text-tac-black text-sm font-bold font-mono transition-colors"
          >
            APPLY ALL RECOMMENDATIONS
          </button>
        </div>
      )}
    </div>
  );
}