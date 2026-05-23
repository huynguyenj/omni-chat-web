export function CustomerWalletSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-8">
            {/* Left */}
            <div className="flex w-full shrink-0 gap-4 lg:w-80">
              <div className="h-14 w-14 shrink-0 rounded-full bg-gray-200" />

              <div className="min-w-0 flex-1">
                <div className="h-5 w-40 rounded bg-gray-300 mb-3" />
                <div className="h-4 w-52 rounded bg-gray-200 mb-2" />
                <div className="h-4 w-32 rounded bg-gray-200" />
              </div>
            </div>

            {/* Center */}
            <div className="min-w-0 flex-1">
              <div className="rounded-xl border border-gray-100 bg-[#F8F9FA] px-4 py-3">
                <div className="h-3 w-28 rounded bg-gray-200 mb-4" />

                <div className="flex flex-wrap gap-x-8 gap-y-3">
                  <div>
                    <div className="h-5 w-20 rounded bg-gray-200 mb-2" />
                  </div>

                  <div>
                    <div className="h-5 w-28 rounded bg-gray-200 mb-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex shrink-0 items-stretch justify-center border-t border-gray-100 pt-4 lg:w-52 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <div className="h-11 w-full rounded-xl bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}