import { Skeleton } from "../../../shared/ui/Skeleton"
import { Navbar } from "../../../shared/components/Navbar"

export function GuestBookingDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-jakarta">
      <Navbar />

      {/* Stepper bar: back button + 3 steps */}
      <div className="bg-white border-b border-gray-200 sticky top-14 sm:top-15 md:top-17 z-40">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 py-4 sm:py-5 relative">
          <Skeleton className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full" />
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
              <Skeleton className="hidden sm:block h-3.5 w-24" />
            </div>
            <Skeleton className="flex-1 h-0.5 mx-2 sm:mx-4 min-w-8 sm:min-w-15 max-w-16 sm:max-w-30" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
              <Skeleton className="hidden sm:block h-3.5 w-28" />
            </div>
            <Skeleton className="flex-1 h-0.5 mx-2 sm:mx-4 min-w-8 sm:min-w-15 max-w-16 sm:max-w-30" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
              <Skeleton className="hidden sm:block h-3.5 w-40" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1250px] px-3 sm:px-3.5 py-4 pb-10 sm:px-6 sm:py-5">
        {/* "Great choice!" banner */}
        <div className="bg-[#E8F6EF] border border-[#A9DFBF] rounded-lg px-5 py-3 mb-6 flex justify-center">
          <Skeleton className="h-3.5 w-64" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_600px] lg:gap-[26px] items-start">
          {/* Left: property + booking details card */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <Skeleton className="w-full h-44 sm:h-56 rounded-none" />

              {/* Property summary */}
              <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                  {[0, 1, 2, 3, 4].map(j => (
                    <Skeleton key={j} className="w-3.5 h-3.5 rounded" />
                  ))}
                </div>
                <Skeleton className="h-6 w-60 mb-1.5" />
                <Skeleton className="h-3.5 w-40 mb-2" />
                <div className="flex flex-wrap gap-3 mb-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="h-6 w-10 rounded" />
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3.5 w-24" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>

              {/* Your booking details */}
              <div className="border-t border-gray-200 p-5">
                <Skeleton className="h-4 w-44 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-2.5 w-14 mb-1.5" />
                    <Skeleton className="h-3.5 w-28 mb-1" />
                    <Skeleton className="h-2.5 w-16" />
                  </div>
                  <div>
                    <Skeleton className="h-2.5 w-16 mb-1.5" />
                    <Skeleton className="h-3.5 w-28 mb-1" />
                    <Skeleton className="h-2.5 w-16" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <Skeleton className="h-2.5 w-14 mb-1.5" />
                    <Skeleton className="h-3.5 w-24" />
                  </div>
                  <div>
                    <Skeleton className="h-2.5 w-12 mb-1.5" />
                    <Skeleton className="h-3.5 w-20" />
                  </div>
                </div>
              </div>

              {/* Room details */}
              <div className="border-t border-gray-200 p-5">
                <Skeleton className="h-4 w-32 mb-3" />
                <div className="space-y-3">
                  {[0, 1].map(k => (
                    <div key={k} className="flex items-start gap-3">
                      <Skeleton className="w-14 h-14 rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-3.5 w-32 mb-1.5" />
                        <Skeleton className="h-3 w-28 mb-1" />
                        <Skeleton className="h-3 w-24 mb-1" />
                        <Skeleton className="h-2.5 w-20" />
                      </div>
                      <Skeleton className="h-3.5 w-16 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Price summary */}
              <div className="border-t border-gray-200 p-5">
                <Skeleton className="h-4 w-36 mb-3" />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-14" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-2.5 w-28 mt-1.5" />
              </div>
            </div>
          </div>

          {/* Right: guest form + special requests + next button (sticky) */}
          <div className="w-full lg:max-w-[600px] lg:sticky lg:top-6 lg:self-start">
            {/* Guest information form */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <Skeleton className="h-3.5 w-72 mb-5" />
              <div className="mb-4">
                <Skeleton className="h-2.5 w-20 mb-1.5" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="mb-4">
                <Skeleton className="h-2.5 w-24 mb-1.5" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="mb-5">
                <Skeleton className="h-2.5 w-44 mb-1.5" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-[120px] rounded-lg shrink-0" />
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                </div>
              </div>
              <div>
                <Skeleton className="h-2.5 w-20 mb-1.5" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>

            {/* Special requests */}
            <div className="mt-5 bg-white rounded-xl border border-gray-200 p-5">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-2/3 mb-3" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>

            {/* Next button + reassurance caption */}
            <Skeleton className="h-12 w-full rounded-xl mt-5" />
            <Skeleton className="h-3 w-56 mx-auto mt-2" />
          </div>
        </div>
      </div>
    </div>
  )
}
