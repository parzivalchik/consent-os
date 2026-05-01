export default function ScoreBanner({ score, stats, categoryCounts, theme }) {
  const isLight = theme === 'light';
  const scoreColor = isLight
    ? (score >= 70 ? 'text-tac-light-green' : score >= 40 ? 'text-tac-light-yellow' : 'text-tac-red')
    : (score >= 70 ? 'text-tac-green' : score >= 40 ? 'text-tac-yellow' : 'text-tac-red');

  const barColor = score >= 70
    ? (isLight ? 'bg-tac-light-green' : 'bg-tac-green')
    : score >= 40
    ? (isLight ? 'bg-tac-light-yellow' : 'bg-tac-yellow')
    : 'bg-tac-red';

  const total = categoryCounts.essential + categoryCounts.analytical + categoryCounts.intrusive;
  const essentialPct = total ? (categoryCounts.essential / total) * 100 : 0;
  const analyticalPct = total ? (categoryCounts.analytical / total) * 100 : 0;
  const intrusivePct = total ? (categoryCounts.intrusive / total) * 100 : 0;

  return (
    <div className={`border-b p-4 ${isLight ? 'bg-tac-light-panel border-tac-light-border' : 'bg-tac-dark border-tac-border'}`}>
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <div className={`text-xs font-mono mb-2 ${isLight ? 'text-tac-light-dim' : 'text-tac-gray'}`}>PRIVACY SCORE</div>
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-bold font-mono ${scoreColor}`}>{score}</span>
            <span className={isLight ? 'text-tac-light-dim font-mono' : 'text-tac-gray font-mono'}>/100</span>
          </div>
          <div className={`mt-2 h-2 w-full ${isLight ? 'bg-tac-light-border' : 'bg-tac-border'}`}>
            <div
              className={`h-full transition-all ${barColor}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className={`text-center px-4 py-2 border ${isLight ? 'border-tac-light-border' : 'border-tac-border'}`}>
            <div className={`text-2xl font-bold font-mono ${isLight ? 'text-tac-light-text' : 'text-tac-white'}`}>{stats.totalCookies}</div>
            <div className={`text-[10px] font-mono ${isLight ? 'text-tac-light-dim' : 'text-tac-gray'}`}>COOKIES</div>
          </div>
          <div className={`text-center px-4 py-2 border ${isLight ? 'border-tac-light-border' : 'border-tac-border'}`}>
            <div className={`text-2xl font-bold font-mono ${isLight ? 'text-tac-light-text' : 'text-tac-white'}`}>{stats.totalDomains}</div>
            <div className={`text-[10px] font-mono ${isLight ? 'text-tac-light-dim' : 'text-tac-gray'}`}>DOMAINS</div>
          </div>
          <div className={`text-center px-4 py-2 border ${isLight ? 'border-tac-red' : 'border-tac-red'} ${isLight ? 'bg-red-50' : 'bg-tac-red bg-opacity-10'}`}>
            <div className="text-2xl font-bold text-tac-red font-mono">{stats.highRisk}</div>
            <div className="text-[10px] text-tac-red font-mono">HIGH RISK</div>
          </div>
          <div className={`text-center px-4 py-2 border ${isLight ? 'border-tac-light-yellow' : 'border-tac-yellow'} ${isLight ? 'bg-yellow-50' : 'bg-tac-yellow bg-opacity-10'}`}>
            <div className={`text-2xl font-bold font-mono ${isLight ? 'text-tac-light-yellow' : 'text-tac-yellow'}`}>{stats.mediumRisk}</div>
            <div className={`text-[10px] font-mono ${isLight ? 'text-tac-light-yellow' : 'text-tac-yellow'}`}>MED RISK</div>
          </div>
          <div className={`text-center px-4 py-2 border ${isLight ? 'border-tac-light-green' : 'border-tac-green'} ${isLight ? 'bg-green-50' : 'bg-tac-green bg-opacity-10'}`}>
            <div className={`text-2xl font-bold font-mono ${isLight ? 'text-tac-light-green' : 'text-tac-green'}`}>{stats.lowRisk}</div>
            <div className={`text-[10px] font-mono ${isLight ? 'text-tac-light-green' : 'text-tac-green'}`}>LOW RISK</div>
          </div>
        </div>

        <div className="w-32">
          <div className={`text-xs font-mono mb-2 ${isLight ? 'text-tac-light-dim' : 'text-tac-gray'}`}>BY CATEGORY</div>
          <div className="flex h-3 gap-0.5">
            {essentialPct > 0 && (
              <div className={isLight ? 'bg-tac-light-green' : 'bg-tac-green'} style={{ width: `${essentialPct}%` }} />
            )}
            {analyticalPct > 0 && (
              <div className={isLight ? 'bg-tac-light-yellow' : 'bg-tac-yellow'} style={{ width: `${analyticalPct}%` }} />
            )}
            {intrusivePct > 0 && (
              <div className="bg-tac-red" style={{ width: `${intrusivePct}%` }} />
            )}
          </div>
          <div className="flex justify-between mt-1 text-[10px] font-mono">
            <span className={isLight ? 'text-tac-light-green' : 'text-tac-green'}>{categoryCounts.essential}</span>
            <span className={isLight ? 'text-tac-light-yellow' : 'text-tac-yellow'}>{categoryCounts.analytical}</span>
            <span className="text-tac-red">{categoryCounts.intrusive}</span>
          </div>
        </div>
      </div>
    </div>
  );
}