import PurgeToggle from './PurgeToggle';

const CATEGORY_CONFIG = {
  essential: {
    label: 'Essential',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    description: 'Services needed for core functionality',
  },
  analytical: {
    label: 'Analytical',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
      </svg>
    ),
    description: 'CDN, fonts, basic analytics',
  },
  intrusive: {
    label: 'Intrusive',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <path d="M12 9v4m0 4h.01" />
      </svg>
    ),
    description: 'Ad tech, social tracking, high-risk',
  },
};

export default function CategorySection({
  groupedServices,
  categoryCounts,
  expandedCategory,
  setExpandedCategory,
  purgedCategories,
  onPurgeToggle,
}) {
  const categories = ['essential', 'analytical', 'intrusive'];

  return (
    <div className="border-t border-base-lighter bg-base-light">
      {categories.map((category) => {
        const config = CATEGORY_CONFIG[category];
        const count = categoryCounts[category];
        const isExpanded = expandedCategory === category;
        const isPurged = purgedCategories[category];

        return (
          <div key={category} className="border-b border-base-lighter last:border-b-0">
            <button
              type="button"
              onClick={() => setExpandedCategory(isExpanded ? null : category)}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-base-lighter/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={category === 'intrusive' ? 'text-neon-pink' : 'text-ghost-dim'}>
                  {config.icon}
                </span>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-ghost font-mono">
                      {config.label}
                    </span>
                    <span className="text-[10px] px-1 py-0.5 rounded bg-base-lighter text-ghost-muted font-mono">
                      {count}
                    </span>
                  </div>
                  <span className="text-[9px] text-ghost-muted font-mono">
                    {config.description}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <PurgeToggle
                  category={category}
                  checked={isPurged}
                  onChange={() => onPurgeToggle(category)}
                />
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`text-ghost-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </button>

            {isExpanded && (
              <div className="px-3 pb-2">
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {groupedServices[category].slice(0, 6).map((service, index) => (
                    <div
                      key={service.id || index}
                      className="flex items-center justify-between px-2 py-1 rounded bg-base/50 text-[10px] font-mono"
                    >
                      <span className="text-ghost-dim truncate">
                        {service.displayName || service.name}
                      </span>
                      <span className="text-ghost-muted">
                        {service.cookieCount || 0}
                      </span>
                    </div>
                  ))}
                  {groupedServices[category].length > 6 && (
                    <div className="text-[9px] text-ghost-muted text-center py-1">
                      +{groupedServices[category].length - 6} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}