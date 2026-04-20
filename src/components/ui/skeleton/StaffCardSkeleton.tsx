
function StaffCardSkeletonItem () {
  return (
    <div className='animate-pulse w-full px-4 py-3 border-2 rounded-xl border-gray-300'>
      <div className='flex items-center gap-3 my-2'>
        <div className='w-15 aspect-square rounded-full bg-gray-200'></div>
        <div className='flex flex-col gap-2 w-full'>
          <div className='w-[40%] h-5 bg-gray-200 rounded-sm'></div>
          <div className='flex gap-2 items-center'>
            <div className='w-[10%] h-4 bg-gray-200 rounded-sm'></div>
            <div className='w-[10%] h-4 bg-gray-200 rounded-sm'></div>
          </div>
        </div>
      </div>
      <div className='w-full h-8 bg-gray-200 my-2 rounded-sm'></div>
      <div className='w-full h-8 bg-gray-200 my-2 rounded-sm'></div>
      <div className='flex gap-5 my-2'>
        <div className='w-[40%] h-5 bg-gray-200 rounded-sm'></div>
        <div className='w-[40%] h-5 bg-gray-200 rounded-sm'></div>
      </div>
      <hr className='w-full h-1 border-2 border-gray-200 bg-gray-200 my-5'/>
      <div className='flex gap-2 items-center'>
        <div className='flex-6 h-10 bg-gray-200 rounded-lg'></div>
        <div className='flex-1 h-10 bg-gray-200 rounded-lg'></div>
      </div>
    </div>
  )
}

export default function StaffCardSkeleton({ count=1 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 sm:grid-cols-3 xl:grid-cols-${count} gap-2`}>
      { Array.from({ length: count }).map((_, i) => (
        <StaffCardSkeletonItem key={i}/>
      )) }
    </div>
  )
}
