export default function TabNav({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="bg-tac-dark border-b border-tac-border px-4 flex gap-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 text-sm font-mono transition-colors border-b-2 -mb-px ${
            activeTab === tab.id
              ? 'text-tac-magenta border-tac-magenta bg-tac-black'
              : 'text-tac-gray border-transparent hover:text-tac-white hover:border-tac-border'
          }`}
        >
          {tab.label.toUpperCase()}
        </button>
      ))}
    </nav>
  );
}