import { Skeleton } from "../../../shared/ui/Skeleton"

export function BookingsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-brand-card-border overflow-hidden">
          <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
            <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              {/* property name + status pill */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16 rounded-full shrink-0" />
              </div>
              {/* stay dates */}
              <Skeleton className="h-3 w-36 mb-1" />
              {/* booked on */}
              <Skeleton className="h-2.5 w-44" />
              {/* price + action buttons */}
              <div className="flex items-center justify-between mt-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-7 w-16 rounded-lg" />
                  <Skeleton className="h-7 w-24 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
