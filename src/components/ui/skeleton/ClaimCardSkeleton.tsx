export function ClaimCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col justify-between h-full border-t-4 border-t-gray-300 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="h-6 w-32 rounded bg-gray-200 mb-2" />
          <div className="h-4 w-20 rounded bg-gray-200" />
        </div>

        <div className="h-6 w-24 rounded-full bg-gray-200" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Date */}
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 rounded bg-gray-200" />
          <div className="h-3 w-24 rounded bg-gray-200" />
        </div>

        {/* Description */}
        <div className="bg-[#F5F7FA] p-3 rounded-lg">
          <div className="h-3 w-16 rounded bg-gray-200 mb-2" />

          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
          </div>
        </div>

        {/* Reason */}
        <div className="bg-[#F5F7FA] p-3 rounded-lg">
          <div className="h-3 w-14 rounded bg-gray-200 mb-2" />

          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t mt-4 grid grid-cols-2 gap-2">
        <div className="h-9 rounded-lg bg-gray-200" />
        <div className="h-9 rounded-lg bg-gray-200" />
      </div>
    </div>
  )
}