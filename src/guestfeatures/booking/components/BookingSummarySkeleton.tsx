import { Skeleton } from "../../../shared/ui/Skeleton"
import { Navbar } from "../../../shared/components/Navbar"

export function BookingSummarySkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-jakarta">
      <Navbar />

      {/* Sticky page header: Back | Booking Details */}
      <div className="bg-white border-b border-gray-200 sticky top-[56px] sm:top-[60px] md:top-[68px] z-40">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 py-3 sm:py-4 grid grid-cols-3 items-center">
          <div className="flex items-center gap-2 justify-self-start">
            <Skeleton className="w-[18px] h-[18px] rounded" />
            <Skeleton className="h-3.5 w-10" />
          </div>
          <Skeleton className="h-4 w-36 mx-auto" />
          <span />
        </div>
      </div>

      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Booking header card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-4 p-5">
                <Skeleton className="w-full sm:w-40 h-32 rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-16 rounded-full shrink-0" />
                  </div>
                  <Skeleton className="h-3.5 w-32 mb-2" />
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="sm:border-l sm:border-gray-200 sm:pl-4 shrink-0 space-y-3 sm:text-right">
                  <div>
                    <Skeleton className="h-2 w-16 mb-1.5 sm:ml-auto" />
                    <Skeleton className="h-3.5 w-28 sm:ml-auto" />
                  </div>
                  <div>
                    <Skeleton className="h-2 w-16 mb-1.5 sm:ml-auto" />
                    <Skeleton className="h-3.5 w-24 sm:ml-auto" />
                  </div>
                  <div>
                    <Skeleton className="h-2 w-16 mb-1.5 sm:ml-auto" />
                    <Skeleton className="h-5 w-20 sm:ml-auto" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stay information: 5 detail fields in a 2-col grid */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-2.5 w-16 mb-1.5" />
                  <Skeleton className="h-3.5 w-28 mb-1" />
                  <Skeleton className="h-2.5 w-14" />
                </div>
                <div>
                  <Skeleton className="h-2.5 w-16 mb-1.5" />
                  <Skeleton className="h-3.5 w-28 mb-1" />
                  <Skeleton className="h-2.5 w-14" />
                </div>
                <div>
                  <Skeleton className="h-2.5 w-16 mb-1.5" />
                  <Skeleton className="h-3.5 w-20" />
                </div>
                <div>
                  <Skeleton className="h-2.5 w-14 mb-1.5" />
                  <Skeleton className="h-3.5 w-24" />
                </div>
                <div>
                  <Skeleton className="h-2.5 w-12 mb-1.5" />
                  <Skeleton className="h-3.5 w-32" />
                </div>
              </div>
            </div>

            {/* Room details: bordered room block with image + field grid */}
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

            {/* Cancellation policy: bullet list */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <Skeleton className="h-4 w-40 mb-3" />
              <div className="space-y-3">
                {[0, 1, 2, 3].map(k => (
                  <div key={k} className="flex items-start gap-2">
                    <Skeleton className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" />
                    <Skeleton className="h-3.5 w-72 max-w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column (sticky) */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
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

            {/* Copy / Share / Receipt pills */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>

            {/* Reservation QR */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="w-[18px] h-[18px] rounded" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <Skeleton className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] mx-auto rounded-lg" />
                <Skeleton className="h-3 w-48 mx-auto mt-3" />
              </div>
            </div>

            {/* Done button */}
            <Skeleton className="w-full h-12 rounded-xl" />

            {/* Book again */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-3 w-36 mb-3" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
