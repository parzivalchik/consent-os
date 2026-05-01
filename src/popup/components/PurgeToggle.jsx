export default function PurgeToggle({ category, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-8 h-4 transition-colors ${checked ? 'bg-[#FF00FF]' : 'bg-base-lighter'}`}
    >
      <span
        className={`absolute top-0.5 w-3 h-3 transition-transform ${
          checked ? 'translate-x-4 bg-[#121212]' : 'translate-x-0.5 bg-[#888888]'
        }`}
      />
    </button>
  );
}