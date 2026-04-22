
function ProductCardSkeletonItem() {
  return (
    <div className='animate-pulse w-full px-7 py-5 border-2 rounded-xl border-gray-300'>
      <div className='w-full h-60 bg-gray-200 rounded-sm'></div>
      <div className='w-1/3 h-8 bg-gray-200 my-2 rounded-sm'></div>
      <div className="flex gap-3 items-center justify-between w-full">
        <div className='w-1/2 h-8 bg-gray-200 my-2 rounded-sm'></div>
        <div className='w-1/2 h-8 bg-gray-200 my-2 rounded-sm'></div>
      </div>
      <div className='w-full h-20 bg-gray-200 my-2 rounded-sm'></div>
      <div className='w-[30%] h-10 bg-gray-200 rounded-sm my-2'></div>
      <div className="flex items-center gap-2 w-full">
        <div className='w-full flex-2 h-10 bg-gray-200 rounded-lg'></div>
        <div className='w-full flex-2 h-10 bg-gray-200 rounded-lg'></div>
      </div>
    </div>
  )
}

export default function ProductGuestCardSkeleton({ count=1 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 sm:grid-cols-3 xl:grid-cols-${count} gap-2`}>
      { Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeletonItem key={i}/>
      )) }
    </div>
  )
}
