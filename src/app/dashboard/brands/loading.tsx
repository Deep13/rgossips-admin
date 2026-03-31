export default function BrandsLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-4 w-56 bg-gray-100 dark:bg-gray-800/50 rounded mt-2" />
        </div>
      </div>

      {/* Button placeholder */}
      <div className="h-10 w-36 bg-gray-200 dark:bg-gray-800 rounded-xl mb-6" />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 w-fit">
        <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-9 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>

      {/* Table skeleton */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 px-6 py-3.5 flex gap-8">
          {[120, 100, 80, 100, 80].map((w, i) => (
            <div key={i} className="h-3 rounded bg-gray-200 dark:bg-gray-700" style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-8 px-6 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-5 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
            <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-7 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
