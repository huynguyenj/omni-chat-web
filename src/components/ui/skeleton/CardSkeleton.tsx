type CardSkeletonProps = {
  count?: number
}

function SkeletonCardItem() {
  return (
    <div className="animate-pulse rounded-[20px] border border-gray-300 bg-white px-6 py-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-5 w-1/2 rounded-md bg-gray-200" />
        <div className="h-4 w-16 rounded-md bg-gray-200" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-full rounded-md bg-gray-200" />
        <div className="h-4 w-5/6 rounded-md bg-gray-200" />
        <div className="h-4 w-2/3 rounded-md bg-gray-200" />
      </div>

      {/* <div className="mt-4 flex gap-2">
        <div className="h-8 w-24 rounded-full bg-gray-200" />
        <div className="h-8 w-20 rounded-full bg-gray-200" />
      </div> */}
    </div>
  )
}

export default function CardSkeleton({ count = 1 }: CardSkeletonProps) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCardItem key={index} />
      ))}
    </div>
  )
}
