
function AwaitedChatSkeletonItem () {
  return (
    <div className="animate-pulse flex items-center gap-3 bg-white border border-border-primary px-5 py-8 min-w-30">
      <div className="w-18 h-15 rounded-full bg-gray-200"></div>
      <div className="flex w-full flex-col gap-2">
        <div className="w-full h-8 bg-gray-200 rounded-sm"></div>
        <div className="w-[50%] h-5 bg-gray-200 rounded-sm"></div>
      </div>
    </div>
  )
}


export default function AwaitedChatSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className=' align-middle justify-between items-center gap-4 w-full'>
      { Array.from({ length: count }, (_, index) => (
        <AwaitedChatSkeletonItem key={index}/>
      )) }
    </div>
  )
}
