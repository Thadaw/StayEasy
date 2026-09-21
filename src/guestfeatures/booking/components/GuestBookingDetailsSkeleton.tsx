import { Skeleton } from "../../../shared/ui/Skeleton"

export function GuestBookingDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-jakarta">
      <div className="bg-white border-b border-gray-200 sticky top-14 sm:top-15 md:top-17 z-40">
        <div className="max-w-[1250px] mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-0.5 w-16" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-0.5 w-16" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>

      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <Skeleton className="h-5 w-36 mb-4" />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-3 w-24 mb-1" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-3 w-28 mb-1" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <Skeleton className="h-5 w-32 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <Skeleton className="h-5 w-36 mb-4" />
              <Skeleton className="h-32 rounded-lg mb-4" />
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <Skeleton className="h-5 w-28 mb-4" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 flex-1 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
