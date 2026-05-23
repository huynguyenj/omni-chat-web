export function OrderCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-full border-t-4 border-t-[#3366CC] animate-pulse">
      <div className="p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="h-7 w-32 rounded bg-gray-200" />
          <div className="h-6 w-20 rounded-full bg-gray-200" />
        </div>

        {/* Customer */}
        <div className="h-3 w-24 rounded bg-gray-200 mb-2" />
        <div className="h-5 w-40 rounded bg-gray-200 mb-4" />

        {/* Order items */}
        <div className="rounded-lg bg-[#F8FAFC] p-3 mb-4 flex-1">
          <div className="h-3 w-20 rounded bg-gray-200 mb-3" />

          <div className="space-y-3">
            {Array.from({ length: 1 }).map((_, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center gap-2"
              >
                <div className="h-4 w-2/3 rounded bg-gray-200" />
                <div className="h-4 w-16 rounded bg-gray-200 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-end justify-between gap-2 mb-4">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-28 rounded bg-gray-200" />
          </div>

          <div className="h-7 w-24 rounded bg-gray-200" />
        </div>

        {/* Button */}
        <div className="pt-3 mt-auto border-t border-gray-100">
          <div className="h-10 w-full rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  )
}