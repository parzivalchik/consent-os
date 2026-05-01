export default function PurgeToggle({ category, checked, onChange, theme }) {
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-8 h-4 rounded-full transition-colors ${
        checked
          ? (isLight ? 'bg-tac-light-magenta' : 'bg-neon-pink')
          : (isLight ? 'bg-tac-light-border' : 'bg-base-lighter')
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform ${
          checked
            ? (isLight ? 'translate-x-4 bg-white' : 'translate-x-4 bg-base')
            : (isLight ? 'bg-tac-light-dim' : 'bg-ghost-dim')
        }`}
      />
    </button>
  );
}