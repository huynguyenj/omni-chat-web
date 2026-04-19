
export default function CustomerInfoSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div>
      <div className="animate-pulse bg-white px-6 py-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-5 w-1/2 rounded-md bg-gray-200" />
          <div className="h-4 w-16 rounded-md bg-gray-200" />
        </div>
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="h-15 w-full bg-gray-200 rounded-md my-3"></div>
        ))}
      </div>
    </div>
  )
}
