import { Skeleton } from "../../../shared/ui/Skeleton"
import { Navbar } from "../../../shared/components/Navbar"

// Mirrors PropertyDetailPage's real section order:
// back link → header → gallery → quick facts → contact → host →
// description/amenities + location → choose your room → reviews → things to know
export function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background font-jakarta">
      <Navbar />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Back link */}
        <Skeleton className="h-4 w-20 mb-4" />

        {/* Hotel header: title + badges left, Share/Save right */}
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex-1">
            <Skeleton className="h-8 w-80 max-w-full mb-3" />
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-44" />
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>

        {/* Image gallery: single big image on mobile, 3-up grid (400px) on desktop */}
        <div className="relative mb-8 rounded-2xl overflow-hidden bg-muted">
          <div className="hidden md:grid grid-cols-3 gap-2 h-[400px]">
            <Skeleton className="col-span-2 row-span-2 h-full rounded-none" />
            <Skeleton className="h-full rounded-none" />
            <Skeleton className="h-full rounded-none" />
          </div>
          <div className="md:hidden aspect-[4/3]">
            <Skeleton className="w-full h-full rounded-none" />
          </div>
          <Skeleton className="absolute bottom-4 right-4 h-9 w-32 rounded-xl" />
        </div>

        {/* Quick facts: rooms / floors / built / guests */}
        <div className="flex flex-wrap gap-4 pb-6 border-b border-border mb-6">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>

        {/* Contact: phone / email / currency */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 pb-6 border-b border-border mb-6">
          <div className="flex items-center gap-2"><Skeleton className="w-4 h-4 rounded" /><Skeleton className="h-3.5 w-24" /></div>
          <div className="flex items-center gap-2"><Skeleton className="w-4 h-4 rounded" /><Skeleton className="h-3.5 w-40" /></div>
          <div className="flex items-center gap-2"><Skeleton className="w-4 h-4 rounded" /><Skeleton className="h-3.5 w-16" /></div>
        </div>

        {/* Host info: avatar + name/summary + superhost pill */}
        <div className="flex items-center gap-4 pb-6 border-b border-border mb-6">
          <Skeleton className="w-14 h-14 rounded-full shrink-0" />
          <div>
            <Skeleton className="h-4 w-44 mb-2" />
            <Skeleton className="h-3.5 w-56" />
          </div>
          <Skeleton className="ml-auto h-6 w-24 rounded-full shrink-0" />
        </div>

        {/* Description + amenities (2fr) | location map (1fr) */}
        <div className="md:grid md:grid-cols-[2fr_1fr] md:gap-8 pb-6 border-b border-border mb-6">
          <div className="space-y-6">
            <div>
              <Skeleton className="h-5 w-56 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
            </div>
            <div>
              <Skeleton className="h-5 w-52 mb-4" />
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 py-1">
                    <Skeleton className="w-4 h-4 rounded shrink-0" />
                    <Skeleton className="h-3.5 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Skeleton className="h-5 w-28 mb-4" />
            <Skeleton className="h-3.5 w-full mb-3" />
            <Skeleton className="h-[250px] w-full rounded-xl" />
          </div>
        </div>

        {/* Choose your room: search bar + room list (2/3) + summary aside (1/3) */}
        <div className="p-4 sm:p-6 bg-white mb-10">
          <Skeleton className="h-5 w-48 mb-5" />

          <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3">
              {[0, 1].map(i => (
                <div key={i} className="h-14 flex items-center gap-2 px-5 border-b sm:border-b-0 sm:border-r border-gray-100">
                  <Skeleton className="w-4 h-4 rounded shrink-0" />
                  <div className="space-y-1">
                    <Skeleton className="h-2 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
              <div className="h-14 flex items-center p-2">
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Room rows */}
            <div className="md:w-2/3 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col md:flex-row items-stretch gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-100">
                  <div className="flex flex-col md:flex-row gap-3 flex-1 min-w-0">
                    <Skeleton className="w-full md:w-36 h-48 md:h-36 rounded-lg shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-3 w-40 mb-1.5" />
                      <Skeleton className="h-3 w-28 mb-1.5" />
                      <Skeleton className="h-3 w-44 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between gap-3 md:gap-4 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
                    <Skeleton className="h-3.5 w-20" />
                    <div className="flex items-center gap-3">
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-16" />
                        <Skeleton className="h-2.5 w-10" />
                      </div>
                      <Skeleton className="h-9 w-28 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky summary aside */}
            <aside className="w-full md:w-1/3 self-start md:sticky md:top-32 md:mt-30">
              <div className="mb-4 space-y-2">
                <div className="flex justify-between"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-24" /></div>
                <div className="flex justify-between"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-24" /></div>
              </div>
              <Skeleton className="h-4 w-32 mb-3" />
              <div className="space-y-2">
                <div className="flex justify-between"><Skeleton className="h-3 w-32" /><Skeleton className="h-3 w-14" /></div>
                <div className="flex justify-between"><Skeleton className="h-3 w-28" /><Skeleton className="h-3 w-12" /></div>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-border">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-12 w-full rounded-xl mt-4" />
            </aside>
          </div>
        </div>

        {/* Reviews: header + card grid */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-3.5 w-3.5 rounded" />
                  ))}
                </div>
                <Skeleton className="h-3.5 w-full mb-2" />
                <Skeleton className="h-3.5 w-3/4 mb-4" />
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
        </div>

        {/* Things to know: heading + 3 columns (icon, title, lines, learn more) */}
        <div className="border-t border-border pt-10">
          <Skeleton className="h-7 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex flex-col">
                <Skeleton className="w-10 h-10 rounded-xl mb-4" />
                <Skeleton className="h-4 w-32 mb-2" />
                <div className="space-y-2 mb-3">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-2/3" />
                </div>
                <Skeleton className="h-3 w-20 mt-auto self-start" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
