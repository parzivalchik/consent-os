import { useState } from 'react';
import { getCategory, calculateRiskLevel } from '../../../shared/categories';

export default function OverviewTab({ services, cookies, categoryCounts, timeline, onRevoke }) {
  const [search, setSearch] = useState('');

  const filteredServices = services.filter(s =>
    (s.name || s.domain || '').toLowerCase().includes(search.toLowerCase())
  );

  const total = categoryCounts.essential + categoryCounts.analytical + categoryCounts.intrusive;
  const essentialAngle = total ? (categoryCounts.essential / total) * 360 : 0;
  const analyticalAngle = total ? (categoryCounts.analytical / total) * 360 : 0;

  const recentActivity = timeline.slice(0, 10);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-tac-panel border border-tac-border p-4">
        <h3 className="text-sm font-bold text-tac-white font-mono mb-4">CATEGORY DISTRIBUTION</h3>
        <div className="flex items-center gap-8">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#333" strokeWidth="20" />
              {total > 0 && (
                <>
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="#00FF41"
                    strokeWidth="20"
                    strokeDasharray={`${(categoryCounts.essential / total) * 251.2} 251.2`}
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="20"
                    strokeDasharray={`${(categoryCounts.analytical / total) * 251.2} 251.2`}
                    strokeDashoffset={`-${(categoryCounts.essential / total) * 251.2}`}
                  />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="#FF4444"
                    strokeWidth="20"
                    strokeDasharray={`${(categoryCounts.intrusive / total) * 251.2} 251.2`}
                    strokeDashoffset={`-${((categoryCounts.essential + categoryCounts.analytical) / total) * 251.2}`}
                  />
                </>
              )}
            </svg>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-tac-green" />
              <span className="text-sm font-mono text-tac-white">ESSENTIAL: {categoryCounts.essential}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-tac-yellow" />
              <span className="text-sm font-mono text-tac-white">ANALYTICAL: {categoryCounts.analytical}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-tac-red" />
              <span className="text-sm font-mono text-tac-white">INTRUSIVE: {categoryCounts.intrusive}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-tac-panel border border-tac-border p-4">
        <h3 className="text-sm font-bold text-tac-white font-mono mb-4">RECENT ACTIVITY</h3>
        {recentActivity.length === 0 ? (
          <div className="text-tac-gray font-mono text-sm">NO RECENT ACTIVITY</div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((event, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-tac-yellow rounded-full" />
                <span className="text-xs font-mono text-tac-gray">{event.type || 'EVENT'}</span>
                <span className="text-xs font-mono text-tac-white truncate flex-1">{event.domain || event.service}</span>
                <span className="text-xs font-mono text-tac-dim">{event.timestamp || ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="col-span-2 bg-tac-panel border border-tac-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-tac-white font-mono">ALL DOMAINS ({filteredServices.length})</h3>
          <input
            type="text"
            placeholder="Search domains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-tac-black border border-tac-border px-3 py-1 text-sm font-mono text-tac-white placeholder-tac-dim focus:outline-none focus:border-tac-magenta"
          />
        </div>

        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-tac-dark sticky top-0">
              <tr className="text-left font-mono text-tac-gray border-b border-tac-border">
                <th className="py-2 px-2">DOMAIN</th>
                <th className="py-2 px-2">CATEGORY</th>
                <th className="py-2 px-2">COOKIES</th>
                <th className="py-2 px-2">RISK</th>
                <th className="py-2 px-2">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => {
                const category = getCategory(service.name || service.domain);
                const risk = calculateRiskLevel(service);
                const riskColors = { high: 'text-tac-red', medium: 'text-tac-yellow', low: 'text-tac-green' };
                const categoryColors = { essential: 'text-tac-green', analytical: 'text-tac-yellow', intrusive: 'text-tac-red' };

                return (
                  <tr key={service.id} className="border-b border-tac-border hover:bg-tac-dark">
                    <td className="py-2 px-2 font-mono text-tac-white">{service.name || service.domain}</td>
                    <td className={`py-2 px-2 font-mono ${categoryColors[category]}`}>{category.toUpperCase()}</td>
                    <td className="py-2 px-2 font-mono text-tac-gray">{service.cookieCount || 0}</td>
                    <td className={`py-2 px-2 font-mono ${riskColors[risk]}`}>{risk.toUpperCase()}</td>
                    <td className="py-2 px-2">
                      <button
                        onClick={() => onRevoke(service.id)}
                        className="text-xs font-mono text-tac-magenta hover:underline"
                      >
                        REVOKE
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}