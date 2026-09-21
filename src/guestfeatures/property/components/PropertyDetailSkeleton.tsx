import { Skeleton } from "../../../shared/ui/Skeleton"

export function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background font-jakarta">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <Skeleton className="h-4 w-24 mb-4" />

        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex-1">
            <Skeleton className="h-8 w-80 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-20 rounded-xl" />
            <Skeleton className="h-10 w-20 rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <Skeleton className="h-48 md:h-64 rounded-xl col-span-2" />
          <Skeleton className="h-48 md:h-64 rounded-xl" />
          <Skeleton className="h-48 md:h-64 rounded-xl" />
        </div>

        <div className="flex flex-wrap gap-4 pb-6 border-b border-border mb-6">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-32" />
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 pb-6 border-b border-border mb-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-16" />
        </div>

        <div className="flex items-start gap-4 pb-6 border-b border-border mb-6">
          <Skeleton className="h-12 w-12 rounded-full shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="pb-6 border-b border-border mb-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="pb-6 border-b border-border mb-6">
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
            <div>
              <Skeleton className="h-40 rounded-xl mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
          </div>
        </div>

        <div>
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-5 w-5 rounded shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
