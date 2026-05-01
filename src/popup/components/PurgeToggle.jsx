export default function PurgeToggle({ category, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-8 h-4 rounded-full transition-colors ${
        checked
          ? 'bg-neon-pink'
          : 'bg-base-lighter'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform ${
          checked
            ? 'translate-x-4 bg-base'
            : 'bg-ghost-dim'
        }`}
      />
    </button>
  );
}