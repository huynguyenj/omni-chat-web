import Card from '../card/Card'

export function ChangeTaskClaimCardSkeleton() {
  return (
    <div className="animate-pulse">
      <Card className="p-4 flex flex-col justify-between h-full border-t-2 border-t-gray-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0 flex-1">
            <div className="h-6 w-40 rounded bg-gray-200 mb-2" />
            <div className="h-4 w-28 rounded bg-gray-200 mb-3" />

            <div className="h-3 w-24 rounded bg-gray-200 mb-2" />

            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-20 rounded-full bg-gray-200" />
              <div className="h-6 w-24 rounded-full bg-gray-200" />
              <div className="h-6 w-16 rounded-full bg-gray-200" />
            </div>
          </div>

          {/* Status badge */}
          <div className="h-6 w-20 rounded-full bg-gray-200 shrink-0" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Submit date */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-gray-200" />
            <div className="h-3 w-28 rounded bg-gray-200" />
          </div>

          {/* Description */}
          <div className="bg-[#F5F7FA] p-3 rounded-lg">
            <div className="h-3 w-16 rounded bg-gray-200 mb-2" />
            <div className="space-y-2">
              <div className="h-10 w-full rounded bg-gray-200" />
            </div>
          </div>

          {/* Reason */}
          <div className="bg-[#F5F7FA] p-3 rounded-lg">
            <div className="h-3 w-12 rounded bg-gray-200 mb-2" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Footer button */}
        <div className="pt-3 border-t mt-4">
          <div className="h-9 w-full rounded-md bg-gray-200" />
        </div>
      </Card>
    </div>
  )
}