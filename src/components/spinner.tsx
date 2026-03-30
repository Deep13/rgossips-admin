export function Spinner({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function FullPageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 dark:bg-gray-950/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
          <span className="text-xs font-bold text-white">RG</span>
        </div>
        <Spinner className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}

export function ButtonSpinner() {
  return <Spinner className="w-3.5 h-3.5" />;
}
