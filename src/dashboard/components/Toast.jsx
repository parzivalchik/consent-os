export default function Toast({ message, type }) {
  const borderColor = type === 'error' ? 'border-tac-red' : 'border-tac-magenta';
  const textColor = type === 'error' ? 'text-tac-red' : 'text-tac-magenta';

  return (
    <div className={`fixed bottom-20 right-4 z-50 px-4 py-2 border ${borderColor} bg-tac-black ${textColor} font-mono text-sm`}>
      {message}
    </div>
  );
}