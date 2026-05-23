export function ShippingOrderCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-full border-t-4 border-t-gray-300 animate-pulse">
      <div className="p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="h-6 w-32 rounded bg-gray-300" />
          <div className="h-6 w-20 rounded-full bg-gray-200" />
        </div>

        {/* Customer */}
        <div className="h-3 w-20 rounded bg-gray-200 mb-1" />
        <div className="h-5 w-40 rounded bg-gray-300 mb-4" />

        {/* Order Items */}
        <div className="rounded-lg bg-[#F8FAFC] p-3 mb-4 flex-1">
          <div className="h-3 w-20 rounded bg-gray-200 mb-3" />

          <div className="space-y-3">
            {Array.from({ length: 1 }).map((_, idx) => (
              <div
                key={idx}
                className="flex justify-between gap-2 items-center"
              >
                <div className="space-y-1 flex-1">
                  <div className="h-3 w-32 rounded bg-gray-200" />
                  <div className="h-3 w-20 rounded bg-gray-100" />
                </div>

                <div className="h-4 w-16 rounded bg-gray-300 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Date + Total */}
        <div className="flex items-end justify-between gap-2 mb-4">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-28 rounded bg-gray-200" />
            <div className="h-3 w-24 rounded bg-gray-200" />
          </div>

          <div className="h-6 w-24 rounded bg-gray-300" />
        </div>

        {/* Footer */}
        <div className="pt-3 mt-auto border-t border-gray-100 space-y-2">
          {/* View button */}
          <div className="h-10 w-full rounded-lg bg-gray-200" />

          {/* Select */}
          <div className="h-10 w-full rounded-md bg-gray-100 border border-gray-200" />

          {/* Assign button */}
          <div className="h-10 w-full rounded-lg bg-gray-300" />
        </div>
      </div>
    </div>
  )
}