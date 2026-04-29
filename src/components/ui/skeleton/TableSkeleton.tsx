type Props = {
  numberOfRow?: number
  numberOfColumn?: number
}

export function TableSkeleton({
  numberOfRow = 5,
  numberOfColumn = 4
}: Props) {
  return (
    <div className="w-full border border-gray-200 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="flex bg-gray-100 p-3 gap-3">
        {Array.from({ length: numberOfColumn }).map((_, i) => (
          <div key={i} className="flex-1">
            <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Body */}
      {Array.from({ length: numberOfRow }).map((_, i) => (
        <div key={i} className="flex p-3 gap-3">
          {Array.from({ length: numberOfColumn }).map((_, j) => (
            <div key={j} className="flex-1">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}