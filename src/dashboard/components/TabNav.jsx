export default function TabNav({ tabs, activeTab, onTabChange, theme }) {
  const isLight = theme === 'light';

  return (
    <nav className={`px-4 flex gap-0 border-b ${isLight ? 'bg-tac-light-panel border-tac-light-border' : 'bg-tac-dark border-tac-border'}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 text-sm font-mono transition-colors border-b-2 -mb-px ${
            activeTab === tab.id
              ? (isLight ? 'text-tac-light-magenta border-tac-light-magenta bg-tac-light-bg' : 'text-tac-magenta border-tac-magenta bg-tac-black')
              : (isLight ? 'text-tac-light-dim border-transparent hover:text-tac-light-text hover:border-tac-light-border' : 'text-tac-gray border-transparent hover:text-tac-white hover:border-tac-border')
          }`}
        >
          {tab.label.toUpperCase()}
        </button>
      ))}
    </nav>
  );
}