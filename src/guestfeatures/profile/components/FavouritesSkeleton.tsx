import { Skeleton } from "../../../shared/ui/Skeleton"

export function FavouritesSkeleton() {
  return (
    <div className="max-w-4xl">
      <Skeleton className="h-5 w-48 mb-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-brand-card-border overflow-hidden shadow-sm animate-pulse">
            {/* image with type badge + favourite button */}
            <div className="relative h-[140px] bg-gray-200">
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/70 rounded-full h-3.5 w-10" />
              <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/70" />
            </div>
            <div className="p-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1.5" />
              <div className="h-2.5 bg-gray-200 rounded w-1/2 mb-2" />
              {/* "USD 120 / night" — left aligned */}
              <div className="flex items-center gap-1">
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-2.5 bg-gray-200 rounded w-10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
