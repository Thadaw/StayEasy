import { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { LayoutList, LayoutGrid } from "lucide-react"
import { Navbar } from "../../../shared/components/Navbar"
import { SearchBar } from "../../../shared/components/SearchBar"
import { StickySearchHeader } from "../../../shared/components/StickySearchHeader"
import { Footer } from "../../../shared/components/Footer"
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner"
import { useFavorites } from "../../../context/FavoritesContext"
import { useSearchResults, PAGE_SIZE } from "../hooks/useSearchResults"
import { parseSearchParams, buildFilterQueryString } from "../schemas/searchParams"

import { FilterSidebar } from "../components/FilterSidebar"
import { SearchResultCard } from "../components/SearchResultCard"
import { SearchResultGridCard } from "../components/SearchResultGridCard"
import { Pagination } from "../components/Pagination"
import { EmptySearch } from "../components/EmptySearch"

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const { isFavorite, toggleFavorite } = useFavorites()

  const parsed = useMemo(() => parseSearchParams(searchParams), [searchParams])

  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const guests = parsed.guests || `${Number(parsed.adults) + Number(parsed.children)} guests`

  const { data, isLoading, isFetching } = useSearchResults({
    where: parsed.where,
    propertyTypes: parsed.propertyTypes,
    checkin: parsed.checkin,
    checkout: parsed.checkout,
    adults: parsed.adults,
    children: parsed.children,
    rooms: parsed.rooms,
    page: currentPage,
    min_price: parsed.min_price,
    max_price: parsed.max_price,
    room_type_ids: parsed.room_type_ids,
    bed_type_ids: parsed.bed_type_ids,
    amenity_ids: parsed.amenity_ids,
  })

  const results = useMemo(() => data?.results ?? [], [data])
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const maxPrice = useMemo(() => {
    if (results.length === 0) return 500
    return Math.ceil(Math.max(...results.map((p) => p.total_price ?? 0)))
  }, [results])

  const isInitialLoading = isLoading && !data
  const isRefetching = isFetching && !!data

  const filterParams = useMemo(
    () => buildFilterQueryString(parsed),
    [parsed]
  )

  const hasFilters = Boolean(parsed.where || parsed.propertyTypes)

  return (
    <div className="min-h-screen bg-background font-jakarta">
      <Navbar />

      <StickySearchHeader>
        <SearchBar />
      </StickySearchHeader>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto">
            <FilterSidebar maxPrice={maxPrice} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
                Filters
              </button>
              <h2 className="text-xl font-bold font-brand text-brand-heading">
                {isInitialLoading ? "Searching..." : `${total} stays${parsed.where ? ` in ${parsed.where}` : parsed.propertyTypes ? ` - ${parsed.propertyTypes}` : ""}`}
              </h2>
              {isRefetching && (
                <div className="h-1 w-16 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-accent animate-pulse rounded-full" />
                </div>
              )}
              </div>
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-brand-accent text-white" : "text-gray-500 hover:bg-gray-100"}`}
                  title="List view"
                >
                  <LayoutList size={16} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-brand-accent text-white" : "text-gray-500 hover:bg-gray-100"}`}
                  title="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
            </div>

            <div className={viewMode === "list" ? "space-y-4" : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"}>
              {isInitialLoading ? (
                <div className="flex items-center justify-center py-20">
                  <LoadingSpinner />
                </div>
              ) : results.length === 0 ? (
                <EmptySearch hasFilters={hasFilters} />
              ) : (
                results.map((property) =>
                  viewMode === "list" ? (
                    <SearchResultCard
                      key={property.property_id}
                      property={property}
                      isFavorite={isFavorite(property.property_id)}
                      onToggleFavorite={toggleFavorite}
                      filterParams={filterParams}
                      guests={guests}
                    />
                  ) : (
                    <SearchResultGridCard
                      key={property.property_id}
                      property={property}
                      isFavorite={isFavorite(property.property_id)}
                      onToggleFavorite={toggleFavorite}
                      filterParams={filterParams}
                      guests={guests}
                    />
                  )
                )
              )}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute inset-y-0 left-0 w-[300px] max-w-[85vw] bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar maxPrice={maxPrice} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
