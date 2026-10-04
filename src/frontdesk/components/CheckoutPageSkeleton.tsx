import { Skeleton } from "../../shared/ui/Skeleton"

export function CheckoutPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 py-6">
        <Skeleton className="h-8 w-32 mb-6" />

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <Skeleton className="h-5 w-36 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <Skeleton className="h-5 w-28 mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between py-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
          </div>

          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
