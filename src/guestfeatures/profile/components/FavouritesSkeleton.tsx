import { Skeleton } from "../../../shared/ui/Skeleton"

export function FavouritesSkeleton() {
  return (
    <div className="max-w-4xl">
      <Skeleton className="h-6 w-40 mb-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-brand-card-border overflow-hidden shadow-sm">
            <Skeleton className="h-[140px] w-full" />
            <div className="p-3">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-2" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
