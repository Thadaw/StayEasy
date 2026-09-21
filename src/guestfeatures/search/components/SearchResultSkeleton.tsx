import { Skeleton } from "../../../shared/ui/Skeleton"

export function SearchResultListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 sm:h-[200px]"
        >
          <Skeleton className="w-full sm:w-[280px] h-48 sm:h-[200px] shrink-0" />
          <div className="flex-1 p-4 sm:p-5 flex sm:justify-between gap-3">
            <div className="flex-1">
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-3 w-64 mb-2" />
              <Skeleton className="h-3 w-40 mb-3" />
              <div className="flex gap-2 mb-3">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex flex-col items-end justify-between shrink-0">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SearchResultGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <Skeleton className="h-40 w-full" />
          <div className="p-3">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2 mb-2" />
            <Skeleton className="h-3 w-2/3 mb-3" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
