export default function CampaignsLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-36 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-4 w-56 bg-gray-100 dark:bg-gray-800/50 rounded mt-2" />
        </div>
        <div className="h-10 w-36 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex gap-3">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-6 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-5 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
            <div className="h-4 w-12 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-7 w-20 bg-gray-100 dark:bg-gray-800 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
