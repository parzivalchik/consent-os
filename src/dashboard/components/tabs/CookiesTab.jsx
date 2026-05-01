import { useState } from 'react';

export default function CookiesTab({ cookies, services, onClear, theme }) {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const isLight = theme === 'light';

  const domains = [...new Set(services.map(s => s.name || s.domain))];

  const filteredCookies = cookies.filter(c => {
    const matchesSearch = !search || (c.name || '').toLowerCase().includes(search.toLowerCase()) || (c.domain || '').toLowerCase().includes(search.toLowerCase());
    const matchesDomain = !domainFilter || c.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  const panelClass = isLight ? 'bg-tac-light-panel border-tac-light-border' : 'bg-tac-panel border-tac-border';
  const textClass = isLight ? 'text-tac-light-text' : 'text-tac-white';
  const dimClass = isLight ? 'text-tac-light-dim' : 'text-tac-gray';
  const inputClass = isLight ? 'bg-tac-light-bg border-tac-light-border text-tac-light-text placeholder-tac-light-dim focus:border-tac-light-magenta' : 'bg-tac-black border-tac-border text-tac-white placeholder-tac-dim focus:border-tac-magenta';

  return (
    <div className="space-y-4">
      <div className={`${panelClass} border p-4`}>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 ${dimClass}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input type="text" placeholder="Search cookies..." value={search} onChange={(e) => setSearch(e.target.value)} className={`w-full pl-9 pr-3 py-2 text-sm font-mono focus:outline-none ${inputClass}`} />
          </div>
          <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} className={`px-3 py-2 text-sm font-mono focus:outline-none ${inputClass}`}>
            <option value="">All Domains</option>
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button onClick={() => cookies.forEach(c => onClear(c))} className={`px-4 py-2 border text-sm font-mono transition-colors ${isLight ? 'border-tac-light-border text-tac-light-dim hover:text-tac-red hover:border-tac-red' : 'border-tac-border text-tac-gray hover:text-tac-red hover:border-tac-red'}`}>
            CLEAR ALL
          </button>
        </div>
      </div>

      <div className={`${panelClass} border overflow-hidden`}>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className={`sticky top-0 ${isLight ? 'bg-tac-light-panel' : 'bg-tac-dark'}`}>
              <tr className={`text-left font-mono border-b ${isLight ? 'text-tac-light-dim border-tac-light-border' : 'text-tac-gray border-tac-border'}`}>
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
                <tr><td colSpan="7" className={`py-8 text-center font-mono ${dimClass}`}>NO COOKIES FOUND</td></tr>
              ) : (
                filteredCookies.slice(0, 100).map((cookie, i) => (
                  <tr key={i} className={`border-b ${isLight ? 'border-tac-light-border hover:bg-tac-light-bg' : 'border-tac-border hover:bg-tac-dark'}`}>
                    <td className={`py-2 px-3 font-mono text-xs ${textClass}`}>{cookie.domain}</td>
                    <td className={`py-2 px-3 font-mono text-xs max-w-32 truncate ${dimClass}`}>{cookie.name}</td>
                    <td className={`py-2 px-3 font-mono text-xs max-w-32 truncate ${isLight ? 'text-tac-light-dim' : 'text-tac-dim'}`}>{cookie.value?.substring(0, 20) || '(none)'}</td>
                    <td className={`py-2 px-3 font-mono text-xs ${dimClass}`}>{cookie.expirationDate ? new Date(cookie.expirationDate * 1000).toLocaleDateString() : 'Session'}</td>
                    <td className="py-2 px-3 font-mono text-xs">{cookie.secure ? <span className={isLight ? 'text-tac-light-green' : 'text-tac-green'}>YES</span> : <span className={dimClass}>NO</span>}</td>
                    <td className="py-2 px-3 font-mono text-xs">{cookie.httpOnly ? <span className={isLight ? 'text-tac-light-green' : 'text-tac-green'}>YES</span> : <span className={dimClass}>NO</span>}</td>
                    <td className="py-2 px-3">
                      <button onClick={() => onClear(cookie)} className={`text-xs font-mono ${isLight ? 'text-tac-light-magenta hover:underline' : 'text-tac-magenta hover:underline'}`}>CLEAR</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredCookies.length > 100 && (
          <div className={`p-2 text-center text-xs font-mono border-t ${isLight ? 'border-tac-light-border text-tac-light-dim' : 'border-tac-border text-tac-dim'}`}>
            Showing 100 of {filteredCookies.length} cookies
          </div>
        )}
      </div>
    </div>
  );
}