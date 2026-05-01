import { useState } from 'react';

export default function TimelineTab({ events }) {
  const [typeFilter, setTypeFilter] = useState('');
  const [rangeFilter, setRangeFilter] = useState('30');

  const filteredEvents = events.filter(e => {
    if (typeFilter && e.type !== typeFilter) return false;
    return true;
  }).slice(0, 50);

  const eventTypeColors = {
    domain_added: 'text-tac-green',
    cookie_created: 'text-tac-yellow',
    cookie_deleted: 'text-tac-red',
    revoke: 'text-tac-magenta',
    cleared: 'text-tac-gray',
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
      <div className="bg-tac-panel border border-tac-border p-4">
        <div className="flex items-center gap-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-tac-black border border-tac-border px-3 py-2 text-sm font-mono text-tac-white focus:outline-none focus:border-tac-magenta"
          >
            <option value="">All Events</option>
            <option value="domain_added">Domain Added</option>
            <option value="cookie_created">Cookie Created</option>
            <option value="cookie_deleted">Cookie Deleted</option>
            <option value="revoke">Access Revoked</option>
            <option value="cleared">Cookies Cleared</option>
          </select>
          <select
            value={rangeFilter}
            onChange={(e) => setRangeFilter(e.target.value)}
            className="bg-tac-black border border-tac-border px-3 py-2 text-sm font-mono text-tac-white focus:outline-none focus:border-tac-magenta"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      <div className="bg-tac-panel border border-tac-border p-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center text-tac-gray font-mono py-8">NO TIMELINE EVENTS</div>
        ) : (
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-tac-yellow" />

            <div className="space-y-6">
              {filteredEvents.map((event, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-1.5 w-3 h-3 bg-tac-yellow border-2 border-tac-black" />

                  <div className="bg-tac-dark border border-tac-border p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold font-mono ${eventTypeColors[event.type] || 'text-tac-white'}`}>
                        {eventTypeLabels[event.type] || event.type?.toUpperCase() || 'EVENT'}
                      </span>
                      <span className="text-xs font-mono text-tac-dim">
                        {event.timestamp || new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm font-mono text-tac-white">
                      {event.domain || event.service || 'System'}
                    </div>
                    {event.cookieCount && (
                      <div className="text-xs font-mono text-tac-gray mt-1">
                        {event.cookieCount} cookies affected
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