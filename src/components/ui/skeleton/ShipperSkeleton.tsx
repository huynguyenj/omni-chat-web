export function ShipperCardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white animate-pulse flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Avatar */}
          <div className="h-12 w-12 shrink-0 rounded-full bg-gray-200" />

          <div className="min-w-0 flex-1">
            {/* Name */}
            <div className="h-5 w-36 rounded bg-gray-300 mb-2" />

            {/* Status tag */}
            <div className="h-5 w-20 rounded-full bg-gray-200 mb-2" />

            {/* Phone */}
            <div className="h-3 w-28 rounded bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="h-3 w-16 rounded bg-gray-200 mb-2" />
          <div className="h-6 w-10 rounded bg-gray-300" />
        </div>

        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="h-3 w-16 rounded bg-gray-200 mb-2" />
          <div className="h-6 w-10 rounded bg-gray-300" />
        </div>
      </div>
    </div>
  )
}