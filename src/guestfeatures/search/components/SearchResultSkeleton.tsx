import { Skeleton } from "../../../shared/ui/Skeleton"

export function SearchResultListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 sm:h-[200px]"
        >
          {/* image + favourite button */}
          <div className="relative w-full sm:w-[280px] h-48 sm:h-[200px] shrink-0 overflow-hidden">
            <div className="w-full h-full bg-gray-200 animate-pulse" />
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-300/70" />
          </div>

          <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between gap-3">
            {/* name, location, description, amenity chips, availability */}
            <div className="flex-1">
              <Skeleton className="h-4 w-48 mb-1.5" />
              <Skeleton className="h-3 w-64 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-3/4 mb-3" />
              <div className="flex gap-2 mb-3">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-4 w-14 rounded-full" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>

            {/* price block + "See availability" button */}
            <div className="flex flex-col items-end justify-between shrink-0 sm:pt-4">
              <div className="space-y-1.5 sm:text-right">
                <Skeleton className="h-2 w-24" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-2 w-28" />
              </div>
              <Skeleton className="h-8 w-32 rounded-lg mt-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SearchResultGridSkeleton() {
  // The page already wraps this skeleton in its own grid container
  // (grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4), so the cards are
  // rendered as a fragment — a nested grid wrapper would collapse them into a
  // single cell of the outer grid.
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-[330px]"
        >
          {/* image + favourite button (w-7 h-7, top-2 right-2) */}
          <div className="relative h-[140px] shrink-0 overflow-hidden">
            <div className="w-full h-full bg-gray-200 animate-pulse" />
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm" />
          </div>

          <div className="p-2 flex flex-col flex-1">
            {/* name (text-xs, single line) */}
            <Skeleton className="h-3.5 w-2/3 mb-1" />
            {/* location with map pin (text-[10px]) */}
            <div className="flex items-center gap-1 mb-1">
              <Skeleton className="w-2 h-2 rounded shrink-0" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
            {/* amenity chips (text-[8px], up to 3, wrap) */}
            <div className="flex gap-1 flex-wrap mb-1">
              <Skeleton className="h-3.5 w-9 rounded-full" />
              <Skeleton className="h-3.5 w-10 rounded-full" />
              <Skeleton className="h-3.5 w-8 rounded-full" />
            </div>
            {/* description (text-[9px], line-clamp-2) */}
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-2/3 mb-1" />

            {/* price block + full-width button pinned to the bottom */}
            <div className="mt-auto">
              <div className="flex flex-col items-end">
                <Skeleton className="h-2 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-2 w-24" />
              </div>
              <Skeleton className="h-6 w-full rounded-lg mt-1.5" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
