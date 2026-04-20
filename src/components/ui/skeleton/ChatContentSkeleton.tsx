
function ChatContentSkeletonItem () {
  return (
    <div className='animate-pulse bg-red'>
      <div className='flex items-start w-full h-20'>
        <div className='flex flex-col gap-2 items-center justify-center bg-gray-200 w-[40%] h-20 rounded-2xl py-2 px-3'>
          <div className="bg-gray-300 h-3 w-full rounded-xl"></div>
          <div className="bg-gray-300 h-3 w-full rounded-xl"></div>
          <div className="bg-gray-300 h-3 w-full rounded-xl"></div>
        </div>
      </div>
      <div className='flex justify-end items-end w-full h-20'>
        <div className='flex flex-col gap-2 items-center justify-center bg-gray-200 w-[40%] h-20 rounded-2xl py-2 px-3'>
          <div className="bg-gray-300 h-3 w-full rounded-xl"></div>
          <div className="bg-gray-300 h-3 w-full rounded-xl"></div>
          <div className="bg-gray-300 h-3 w-full rounded-xl"></div>
        </div>
      </div>
    </div>
  )
}

export default function ChatContentSkeleton({ count = 1 }: {count?: number}) {
  return (
    <div className=' align-middle justify-between items-center gap-4 w-full h-full '>
      { Array.from({ length: count }, (_, index) => (
        <ChatContentSkeletonItem key={index}/>
      )) }
    </div>
  )
}
