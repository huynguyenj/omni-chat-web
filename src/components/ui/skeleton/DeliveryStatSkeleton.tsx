export function DeliveryStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="p-4 rounded-xl border bg-white animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Title */}
              <div className="h-4 w-44 rounded bg-gray-200 mb-2" />

              {/* Number */}
              <div className="h-9 w-20 rounded bg-gray-300 mb-2" />

              {/* Description */}
              <div className="h-3 w-36 rounded bg-gray-200" />
            </div>

            {/* Icon */}
            <div className="h-12 w-12 rounded-full bg-gray-200 shrink-0" />
          </div>
        </div>
      ))}
    </div>
  )
}