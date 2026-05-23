export function InvoiceStatisticSkeletonSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="h-3 w-24 rounded bg-gray-200 mb-3" />
              <div className="h-8 w-32 rounded bg-gray-300" />
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}