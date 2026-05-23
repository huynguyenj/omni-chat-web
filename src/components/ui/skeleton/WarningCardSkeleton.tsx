export function WarningCardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between h-full border-t-4 border-t-gray-300 animate-pulse">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="h-4 w-4 rounded bg-gray-200 shrink-0" />
            <div className="h-4 w-40 rounded bg-gray-200" />
          </div>

          <div className="h-5 w-16 rounded-full bg-gray-200" />
        </div>

        {/* Content */}
        <div className="space-y-3 mb-4">
          {/* Staff + Customer */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col gap-1">
              <div className="h-3 w-16 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="h-3 w-20 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
            </div>
          </div>

          {/* Detail */}
          <div className="p-2 bg-white rounded border border-gray-100 min-h-[4rem] space-y-2">
            <div className="h-15 w-full rounded bg-gray-200" />
          </div>

          {/* Time tag */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-40 rounded-full bg-gray-200" />
          </div>

          {/* Status */}
          <div className="flex items-center justify-end pt-2">
            <div className="h-5 w-20 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Footer button */}
      <div className="pt-3 border-t">
        <div className="h-9 w-full rounded-md bg-gray-200" />
      </div>
    </div>
  )
}