export function DashboardClaimSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 border-l-4 border-l-gray-300 bg-white p-4 animate-pulse shadow-sm"
        >
          <div className="h-4 w-24 rounded bg-gray-200 mb-3" />

          <div className="h-9 w-16 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  )
}