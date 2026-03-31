export default function AdminsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-36 bg-gray-200 dark:bg-gray-800 rounded-lg mb-2" />
      <div className="h-4 w-56 bg-gray-100 dark:bg-gray-800/50 rounded mb-8" />
      <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6" />
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-8 px-6 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-40 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-5 w-20 bg-gray-100 dark:bg-gray-800 rounded-full" />
            <div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
