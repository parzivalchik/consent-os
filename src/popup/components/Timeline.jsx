export default function Timeline({ services }) {
  const sortedServices = [...services]
    .filter(s => s.lastSeen)
    .sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen))
    .slice(0, 12);

  function formatTimeAgo(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  }

  if (sortedServices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-ghost-dim">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2 opacity-50">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span className="text-xs font-mono">NO ACTIVE TRACKERS</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-2 top-0 bottom-0 w-px bg-[#FFD700]" />

      <div className="space-y-1">
        {sortedServices.map((service, index) => (
          <div key={service.id || index} className="flex items-center gap-2 relative pl-5">
            <div className="absolute left-1 w-1.5 h-1.5 bg-[#FFD700]" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ghost font-mono">
                  {service.displayName || service.name}
                </span>
                <span className="text-[9px] text-ghost-meta font-mono">
                  {formatTimeAgo(service.lastSeen)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] text-ghost-meta font-mono">
                  {service.cookieCount || 0} cookies
                </span>
                <span className="text-[8px] text-ghost-meta">
                  •
                </span>
                <span className={`text-[9px] font-mono font-bold ${
                  service.riskLevel === 'high' ? 'text-red-500' :
                  service.riskLevel === 'medium' ? 'text-[#FFD700]' :
                  'text-[#00FF41]'
                }`}>
                  {service.riskLevel?.toUpperCase() || 'LOW'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length > 12 && (
        <div className="text-center pt-2">
          <span className="text-[9px] text-ghost-meta font-mono">
            +{services.length - 12} MORE
          </span>
        </div>
      )}
    </div>
  );
}