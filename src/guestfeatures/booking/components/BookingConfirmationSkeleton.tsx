import { Skeleton } from "../../../shared/ui/Skeleton"
import { Navbar } from "../../../shared/components/Navbar"

function StepperSkeleton() {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-14 sm:top-15 md:top-17 z-40">
      <div className="max-w-275 mx-auto px-4 sm:px-6 py-4 sm:py-5 relative">
        <Skeleton className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full" />
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
            <Skeleton className="hidden sm:block h-3.5 w-24" />
          </div>
          <Skeleton className="flex-1 h-0.5 mx-2 sm:mx-4 min-w-8 sm:min-w-15 max-w-16 sm:max-w-30" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
            <Skeleton className="hidden sm:block h-3.5 w-24" />
          </div>
          <Skeleton className="flex-1 h-0.5 mx-2 sm:mx-4 min-w-8 sm:min-w-15 max-w-16 sm:max-w-30" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
            <Skeleton className="hidden sm:block h-3.5 w-28" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function BookingConfirmationSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-jakarta">
      <Navbar />

      <StepperSkeleton />

      <div className="mx-auto grid w-full max-w-[1250px] grid-cols-1 gap-4 px-3.5 py-4 pb-10 sm:px-6 sm:py-5 lg:grid-cols-[1fr_600px] lg:gap-[26px]">
        {/* Left column */}
        <div className="space-y-5">
          {/* Confirmation banner */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <Skeleton className="h-7 w-36 rounded-full mb-4" />
              <Skeleton className="h-7 w-72 mb-2" />
              <Skeleton className="h-3.5 w-80 mb-5" />
              <div className="flex justify-center">
                <div className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-center w-full max-w-64">
                  <Skeleton className="h-2.5 w-32 mx-auto mb-2" />
                  <Skeleton className="h-5 w-40 mx-auto" />
                </div>
              </div>
            </div>
            <Skeleton className="w-full h-44 sm:h-56 rounded-none" />
            <div className="p-5">
              <div className="flex items-center gap-1 mb-2">
                {[0, 1, 2, 3, 4].map(j => (
                  <Skeleton key={j} className="w-3.5 h-3.5 rounded" />
                ))}
                <Skeleton className="h-3.5 w-8 ml-1" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-3.5 w-32 mb-3" />
              <div className="flex flex-wrap gap-3 mb-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>

          {/* Room details */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
              <Skeleton className="w-full sm:w-32 h-40 sm:h-24 rounded-lg shrink-0" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 flex-1">
                {[0, 1, 2, 3, 4, 5].map(k => (
                  <div key={k}>
                    <Skeleton className="h-2.5 w-16 mb-1.5" />
                    <Skeleton className="h-3.5 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Guest details */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map(k => (
                <div key={k}>
                  <Skeleton className="h-2.5 w-16 mb-1.5" />
                  <Skeleton className="h-3.5 w-28" />
                </div>
              ))}
            </div>
          </div>

          {/* Important info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-11/12" />
              <Skeleton className="h-3.5 w-10/12" />
              <Skeleton className="h-3.5 w-11/12" />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full lg:max-w-[600px] space-y-6">
          {/* Payment summary */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-16" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3.5 w-14" />
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <Skeleton className="h-2.5 w-24 mb-1.5" />
                  <Skeleton className="h-3.5 w-16" />
                </div>
                <div>
                  <Skeleton className="h-2.5 w-20 mb-1.5" />
                  <Skeleton className="h-3.5 w-28" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions + QR + Done */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
            <div className="p-5">
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <Skeleton className="h-36 w-36 rounded-xl" />
                  <Skeleton className="h-3 w-48 mt-3" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-lg mt-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
