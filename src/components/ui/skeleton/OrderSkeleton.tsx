
function OrderSkeletonCardItem() {
  return (
    <div className="animate-pulse rounded-[20px] border border-gray-300 bg-white px-6 py-8">
      <div className="h-5 w-1/2 rounded-md bg-gray-200 mb-3" />
      <div className="mb-3 flex items-center justify-between">
        <div className="h-5 w-1/2 rounded-md bg-gray-200" />
        <div className="h-5 w-16 rounded-md bg-gray-200" />
      </div>
      <div className="mb-2 flex items-center justify-between">
        <div className="h-5 w-1/2 rounded-md bg-gray-200" />
        <div className="h-5 w-16 rounded-md bg-gray-200" />
      </div>
      <div className="h-4 w-1/4 rounded-md bg-gray-200" />

      <div className="h-20 w-full bg-gray-200 my-3"></div>
    </div>
  )
}

export default function OrderSkeleton({ count = 1 }: { count: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }, (_, index) => (
        <OrderSkeletonCardItem key={index} />
      ))}
    </div>
  )
}
