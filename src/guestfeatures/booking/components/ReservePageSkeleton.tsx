import { Skeleton } from "../../../shared/ui/Skeleton"

export function ReservePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-jakarta">
      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24 ml-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <Skeleton className="h-48 rounded-lg mb-4" />
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <Skeleton className="h-6 w-36 mb-4" />
              <Skeleton className="h-12 rounded-lg mb-3" />
              <Skeleton className="h-12 rounded-lg mb-3" />
              <Skeleton className="h-12 rounded-lg mb-4" />
              <Skeleton className="h-10 rounded-lg" />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <Skeleton className="h-5 w-28 mb-3" />
              <div className="space-y-3">
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
