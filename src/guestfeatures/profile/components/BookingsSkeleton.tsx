import { Skeleton } from "../../../shared/ui/Skeleton"

export function BookingsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-brand-card-border overflow-hidden">
          <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
            <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-40 mb-1.5" />
                  <Skeleton className="h-3 w-32 mb-2" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full shrink-0" />
              </div>
              <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs text-brand-text-secondary">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex items-center justify-between mt-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
