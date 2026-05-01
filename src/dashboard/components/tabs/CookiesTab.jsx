import { useState } from 'react';

export default function CookiesTab({ cookies, services, onClear }) {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [selectedCookie, setSelectedCookie] = useState(null);

  const domains = [...new Set(services.map(s => s.name || s.domain))];

  const filteredCookies = cookies.filter(c => {
    const matchesSearch = !search || (c.name || '').toLowerCase().includes(search.toLowerCase()) || (c.domain || '').toLowerCase().includes(search.toLowerCase());
    const matchesDomain = !domainFilter || c.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="space-y-4">
      <div className="bg-tac-panel border border-tac-border p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search cookies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-tac-black border border-tac-border pl-9 pr-3 py-2 text-sm font-mono text-tac-white placeholder-tac-dim focus:outline-none focus:border-tac-magenta"
            />
          </div>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="bg-tac-black border border-tac-border px-3 py-2 text-sm font-mono text-tac-white focus:outline-none focus:border-tac-magenta"
          >
            <option value="">All Domains</option>
            {domains.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button
            onClick={() => cookies.forEach(c => onClear(c))}
            className="px-4 py-2 border border-tac-border text-tac-gray hover:text-tac-red hover:border-tac-red text-sm font-mono transition-colors"
          >
            CLEAR ALL
          </button>
        </div>
      </div>

      <div className="bg-tac-panel border border-tac-border overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-tac-dark sticky top-0">
              <tr className="text-left font-mono text-tac-gray border-b border-tac-border">
                <th className="py-2 px-3">DOMAIN</th>
                <th className="py-2 px-3">NAME</th>
                <th className="py-2 px-3">VALUE</th>
                <th className="py-2 px-3">EXPIRES</th>
                <th className="py-2 px-3">SECURE</th>
                <th className="py-2 px-3">HTTP</th>
                <th className="py-2 px-3">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredCookies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-tac-gray font-mono">NO COOKIES FOUND</td>
                </tr>
              ) : (
                filteredCookies.slice(0, 100).map((cookie, i) => (
                  <tr key={i} className="border-b border-tac-border hover:bg-tac-dark">
                    <td className="py-2 px-3 font-mono text-tac-white text-xs">{cookie.domain}</td>
                    <td className="py-2 px-3 font-mono text-tac-gray text-xs max-w-32 truncate">{cookie.name}</td>
                    <td className="py-2 px-3 font-mono text-tac-dim text-xs max-w-32 truncate">{cookie.value?.substring(0, 20) || '(none)'}</td>
                    <td className="py-2 px-3 font-mono text-tac-gray text-xs">{cookie.expirationDate ? new Date(cookie.expirationDate * 1000).toLocaleDateString() : 'Session'}</td>
                    <td className="py-2 px-3 font-mono text-xs">{cookie.secure ? <span className="text-tac-green">YES</span> : <span className="text-tac-dim">NO</span>}</td>
                    <td className="py-2 px-3 font-mono text-xs">{cookie.httpOnly ? <span className="text-tac-green">YES</span> : <span className="text-tac-dim">NO</span>}</td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => onClear(cookie)}
                        className="text-xs font-mono text-tac-magenta hover:underline"
                      >
                        CLEAR
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredCookies.length > 100 && (
          <div className="p-2 text-center text-tac-dim text-xs font-mono border-t border-tac-border">
            Showing 100 of {filteredCookies.length} cookies
          </div>
        )}
      </div>
    </div>
  );
}