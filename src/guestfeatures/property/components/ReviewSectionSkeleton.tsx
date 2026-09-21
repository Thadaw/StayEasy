import { Skeleton } from "../../../shared/ui/Skeleton"

export function ReviewSectionSkeleton() {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 w-36" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-3.5 w-3.5 rounded" />
              ))}
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
