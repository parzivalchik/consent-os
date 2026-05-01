export default function ScoreBanner({ score, stats, categoryCounts }) {
  const scoreColor = score >= 70 ? 'text-tac-green' : score >= 40 ? 'text-tac-yellow' : 'text-tac-red';

  const total = categoryCounts.essential + categoryCounts.analytical + categoryCounts.intrusive;
  const essentialPct = total ? (categoryCounts.essential / total) * 100 : 0;
  const analyticalPct = total ? (categoryCounts.analytical / total) * 100 : 0;
  const intrusivePct = total ? (categoryCounts.intrusive / total) * 100 : 0;

  return (
    <div className="bg-tac-dark border-b border-tac-border p-4">
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <div className="text-xs text-tac-gray font-mono mb-2">PRIVACY SCORE</div>
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-bold font-mono ${scoreColor}`}>{score}</span>
            <span className="text-tac-gray font-mono">/100</span>
          </div>
          <div className="mt-2 h-2 bg-tac-border w-full">
            <div
              className={`h-full transition-all ${score >= 70 ? 'bg-tac-green' : score >= 40 ? 'bg-tac-yellow' : 'bg-tac-red'}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="text-center px-4 py-2 border border-tac-border">
            <div className="text-2xl font-bold text-tac-white font-mono">{stats.totalCookies}</div>
            <div className="text-[10px] text-tac-gray font-mono">COOKIES</div>
          </div>
          <div className="text-center px-4 py-2 border border-tac-border">
            <div className="text-2xl font-bold text-tac-white font-mono">{stats.totalDomains}</div>
            <div className="text-[10px] text-tac-gray font-mono">DOMAINS</div>
          </div>
          <div className="text-center px-4 py-2 border border-tac-red bg-tac-red bg-opacity-10">
            <div className="text-2xl font-bold text-tac-red font-mono">{stats.highRisk}</div>
            <div className="text-[10px] text-tac-red font-mono">HIGH RISK</div>
          </div>
          <div className="text-center px-4 py-2 border border-tac-yellow bg-tac-yellow bg-opacity-10">
            <div className="text-2xl font-bold text-tac-yellow font-mono">{stats.mediumRisk}</div>
            <div className="text-[10px] text-tac-yellow font-mono">MED RISK</div>
          </div>
          <div className="text-center px-4 py-2 border border-tac-green bg-tac-green bg-opacity-10">
            <div className="text-2xl font-bold text-tac-green font-mono">{stats.lowRisk}</div>
            <div className="text-[10px] text-tac-green font-mono">LOW RISK</div>
          </div>
        </div>

        <div className="w-32">
          <div className="text-xs text-tac-gray font-mono mb-2">BY CATEGORY</div>
          <div className="flex h-3 gap-0.5">
            {essentialPct > 0 && (
              <div className="bg-tac-green" style={{ width: `${essentialPct}%` }} />
            )}
            {analyticalPct > 0 && (
              <div className="bg-tac-yellow" style={{ width: `${analyticalPct}%` }} />
            )}
            {intrusivePct > 0 && (
              <div className="bg-tac-red" style={{ width: `${intrusivePct}%` }} />
            )}
          </div>
          <div className="flex justify-between mt-1 text-[10px] font-mono">
            <span className="text-tac-green">{categoryCounts.essential}</span>
            <span className="text-tac-yellow">{categoryCounts.analytical}</span>
            <span className="text-tac-red">{categoryCounts.intrusive}</span>
          </div>
        </div>
      </div>
    </div>
  );
}