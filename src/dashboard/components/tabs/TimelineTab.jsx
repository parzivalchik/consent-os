import { useState } from 'react';

export default function TimelineTab({ events, theme }) {
  const [typeFilter, setTypeFilter] = useState('');
  const [rangeFilter, setRangeFilter] = useState('30');
  const isLight = theme === 'light';

  const filteredEvents = events.filter(e => {
    if (typeFilter && e.type !== typeFilter) return false;
    return true;
  });

  const panelClass = isLight ? 'bg-tac-light-panel border-tac-light-border' : 'bg-tac-panel border-tac-border';
  const textClass = isLight ? 'text-tac-light-text' : 'text-tac-white';
  const dimClass = isLight ? 'text-tac-light-dim' : 'text-tac-gray';
  const inputClass = isLight ? 'bg-tac-light-bg border-tac-light-border text-tac-light-text focus:border-tac-light-magenta' : 'bg-tac-black border-tac-border text-tac-white focus:border-tac-magenta';

  const eventTypeColors = {
    domain_added: isLight ? 'text-tac-light-green' : 'text-tac-green',
    cookie_created: isLight ? 'text-tac-light-yellow' : 'text-tac-yellow',
    cookie_deleted: 'text-tac-red',
    revoke: isLight ? 'text-tac-light-magenta' : 'text-tac-magenta',
    cleared: dimClass,
  };

  const eventTypeLabels = {
    domain_added: 'DOMAIN ADDED',
    cookie_created: 'COOKIE CREATED',
    cookie_deleted: 'COOKIE DELETED',
    revoke: 'ACCESS REVOKED',
    cleared: 'CLEARED',
  };

  return (
    <div className="space-y-4">
      <div className={`${panelClass} border p-4`}>
        <div className="flex items-center gap-4">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={`px-3 py-2 text-sm font-mono focus:outline-none ${inputClass}`}>
            <option value="">All Events</option>
            <option value="domain_added">Domain Added</option>
            <option value="cookie_created">Cookie Created</option>
            <option value="cookie_deleted">Cookie Deleted</option>
            <option value="revoke">Access Revoked</option>
            <option value="cleared">Cookies Cleared</option>
          </select>
          <select value={rangeFilter} onChange={(e) => setRangeFilter(e.target.value)} className={`px-3 py-2 text-sm font-mono focus:outline-none ${inputClass}`}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      <div className={`${panelClass} border p-4`}>
        {filteredEvents.length === 0 ? (
          <div className={`text-center font-mono py-8 ${dimClass}`}>NO TIMELINE EVENTS</div>
        ) : (
          <div className="relative max-h-[400px] overflow-y-auto">
            <div className={`absolute left-3 top-0 bottom-0 w-0.5 ${isLight ? 'bg-tac-light-yellow' : 'bg-tac-yellow'}`} />
            <div className="space-y-6 pb-2">
              {filteredEvents.map((event, i) => (
                <div key={i} className="relative pl-10">
                  <div className={`absolute left-1.5 w-3 h-3 ${isLight ? 'bg-tac-light-yellow' : 'bg-tac-yellow'} border-2 ${isLight ? 'border-tac-light-bg' : 'border-tac-black'}`} />
                  <div className={`border p-3 ${isLight ? 'border-tac-light-border bg-tac-light-bg' : 'border-tac-border bg-tac-dark'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold font-mono ${eventTypeColors[event.type] || textClass}`}>
                        {eventTypeLabels[event.type] || event.type?.toUpperCase() || 'EVENT'}
                      </span>
                      <span className={`text-xs font-mono ${dimClass}`}>
                        {event.timestamp ? new Date(event.timestamp).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <div className={`text-sm font-mono ${textClass}`}>
                      {event.domain || event.serviceName || 'System'}
                    </div>
                    {event.details?.cookieCount && (
                      <div className={`text-xs font-mono mt-1 ${dimClass}`}>
                        {event.details.cookieCount} cookies affected
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}