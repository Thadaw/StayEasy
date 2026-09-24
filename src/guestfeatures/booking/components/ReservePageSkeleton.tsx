import { Skeleton } from "../../../shared/ui/Skeleton"
import { Navbar } from "../../../shared/components/Navbar"

export function ReservePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-jakarta">
      <Navbar />

      {/* Stepper (step 2) */}
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

      <div className="mx-auto grid w-full max-w-[1250px] grid-cols-1 gap-4 px-3.5 py-4 pb-10 sm:px-6 sm:py-5 lg:grid-cols-[1fr_600px] lg:gap-[26px]">
        {/* Left column: property summary + price summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {/* Property summary card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <Skeleton className="w-full h-44 sm:h-56 rounded-none" />

            <div className="p-5">
              <div className="flex items-center gap-1 mb-2">
                {[0, 1, 2, 3, 4].map(j => (
                  <Skeleton key={j} className="w-3.5 h-3.5 rounded" />
                ))}
              </div>
              <Skeleton className="h-6 w-60 mb-1.5" />
              <Skeleton className="h-3.5 w-36 mb-2" />
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

            {/* Guest details + edit */}
            <div className="border-t border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-8" />
              </div>
              <div className="space-y-2">
                {[0, 1, 2].map(k => (
                  <div key={k} className="flex gap-2">
                    <Skeleton className="h-3.5 w-16 shrink-0" />
                    <Skeleton className="h-3.5 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Cancellation */}
            <div className="border-t border-gray-200 p-5">
              <Skeleton className="h-4 w-44 mb-2" />
              <Skeleton className="h-2.5 w-full mb-1" />
              <Skeleton className="h-2.5 w-3/4" />
            </div>
          </div>

          {/* Price summary card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <Skeleton className="h-4 w-36 mb-3" />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3.5 w-16" />
              </div>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-3.5 w-14" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3.5 w-14" />
              </div>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <Skeleton className="h-6 w-44 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>

        {/* Right column: payment section + confirm button */}
        <div className="w-full lg:max-w-[600px] space-y-4">
          {/* Payment section */}
          <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-blue-50/60 p-5 sm:p-[25px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Skeleton className="h-6 w-36 rounded-full mb-2" />
                  <Skeleton className="h-6 w-64 mb-2" />
                  <Skeleton className="h-3.5 w-80 max-w-full" />
                </div>
                <Skeleton className="hidden sm:block w-11 h-11 rounded-xl shrink-0" />
              </div>

              {/* Plan options */}
              <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
                {[0, 1, 2].map(k => (
                  <div key={k} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <Skeleton className="w-9 h-9 rounded-lg" />
                      <Skeleton className="w-5 h-5 rounded-full" />
                    </div>
                    <Skeleton className="h-3.5 w-24 mt-3" />
                    <Skeleton className="h-3 w-full mt-2" />
                    <Skeleton className="h-3.5 w-20 mt-2" />
                  </div>
                ))}
              </div>

              {/* Totals strip */}
              <div className="mt-4 rounded-xl border border-blue-100 bg-white p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[0, 1, 2].map(k => (
                  <div key={k}>
                    <Skeleton className="h-2 w-20 mb-1.5" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>

              {/* Discount code section */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
                  <div>
                    <Skeleton className="h-3.5 w-40 mb-1.5" />
                    <Skeleton className="h-3 w-56 max-w-full" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Skeleton className="h-11 flex-1 rounded-xl" />
                  <Skeleton className="h-11 w-32 rounded-xl shrink-0" />
                </div>
              </div>
            </div>

            {/* Payment methods */}
            <div className="p-[21px_25px_25px]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-64 max-w-full" />
                </div>
                <Skeleton className="hidden sm:block h-4 w-28 shrink-0" />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[0, 1, 2, 3].map(k => (
                  <div key={k} className="flex min-h-20 items-center gap-3 rounded-xl border border-slate-200 p-3.5">
                    <Skeleton className="h-8 w-12 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-3.5 w-20 mb-1.5" />
                      <Skeleton className="h-3 w-32 max-w-full" />
                    </div>
                    <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Confirm button */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-3 w-48 mx-auto mt-3" />
          </div>
        </div>
      </div>
    </div>
  )
}
