
function StatisticCardSkeletonItem () {
  return (
    <div className="animate-pulse flex items-center gap-3 bg-white border border-border-primary rounded-2xl px-5 py-10 min-w-30">
      <div className="w-17 h-15 rounded-sm bg-gray-200"></div>
      <div className="flex w-full flex-col gap-2">
        <div className="w-full h-8 bg-gray-200 rounded-sm"></div>
        <div className="w-[50%] h-5 bg-gray-200 rounded-sm"></div>
      </div>
    </div>
  )
}

export default function StatisticCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className={`grid min-w-60 w-full grid-cols-1 lg:grid-cols-${count} align-middle justify-between items-center gap-4`}>
      { Array.from({ length: count }, (_, index) => (
        <StatisticCardSkeletonItem key={index}/>
      )) }
    </div>
  )
}
