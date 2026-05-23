export function PostSaleRequestCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-full border-t-4 border-t-gray-300 animate-pulse">
      <div className="p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-3 min-w-0">
          <div className="h-6 w-40 rounded bg-gray-200" />

          <div className="mt-2 flex gap-2">
            <div className="h-5 w-20 rounded-full bg-gray-200" />
            <div className="h-5 w-24 rounded-full bg-gray-200" />
          </div>
        </div>

        {/* Product */}
        <div className="mb-4">
          <div className="h-3 w-20 rounded bg-gray-200 mb-2" />

          <div className="space-y-2">
            <div className="h-10 w-full rounded bg-gray-200" />
          </div>
        </div>

        {/* Customer + Staff */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="h-3 w-16 rounded bg-gray-200 mb-2" />
            <div className="h-4 w-24 rounded bg-gray-200" />
          </div>

          <div>
            <div className="h-3 w-16 rounded bg-gray-200 mb-2" />
            <div className="h-4 w-24 rounded bg-gray-200" />
          </div>
        </div>

        {/* Reason */}
        <div className="mb-4 flex-1">
          <div className="h-3 w-14 rounded bg-gray-200 mb-2" />

          <div className="rounded-lg bg-gray-100 px-3 py-3 border border-gray-200 space-y-2">
            <div className="h-4 w-full rounded bg-gray-200" />
          </div>
        </div>

        {/* Quantity + Refund */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="h-3 w-16 rounded bg-gray-200 mb-2" />
            <div className="h-5 w-20 rounded bg-gray-200" />
          </div>

          <div className="flex flex-col items-end">
            <div className="h-3 w-20 rounded bg-gray-200 mb-2" />
            <div className="h-5 w-24 rounded bg-gray-200" />
          </div>
        </div>

        {/* Date */}
        <div className="mb-4">
          <div className="h-3 w-32 rounded bg-gray-200" />
        </div>

        {/* Actions */}
        {/* <div className="pt-3 mt-auto border-t border-gray-100 space-y-2">
          <div className="h-10 w-full rounded-lg bg-gray-200" />

          <div className="grid grid-cols-2 gap-2">
            <div className="h-9 rounded-lg bg-gray-200" />
            <div className="h-9 rounded-lg bg-gray-200" />
          </div>
        </div> */}
      </div>
    </div>
  )
}