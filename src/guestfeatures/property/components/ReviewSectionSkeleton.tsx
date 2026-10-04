import { Skeleton } from "../../../shared/ui/Skeleton"

// Note: the real ReviewSection keeps its header (star + rating · count) visible
// while loading, so this skeleton only mirrors the review card grid below it.
export function ReviewSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-5">
          {/* star rating */}
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-3.5 w-3.5 rounded" />
            ))}
          </div>
          {/* comment */}
          <Skeleton className="h-3.5 w-full mb-2" />
          <Skeleton className="h-3.5 w-3/4 mb-4" />
          {/* author avatar + name + date */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div>
              <Skeleton className="h-3.5 w-24 mb-1.5" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
