import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutList, LayoutGrid } from "lucide-react";
import { Navbar } from "../../../shared/components/Navbar";
import { SearchBar } from "../../../shared/components/SearchBar";
import { StickySearchHeader } from "../../../shared/components/StickySearchHeader";
import { Footer } from "../../../shared/components/Footer";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { useFavorites } from "../../../context/FavoritesContext";
import { useSearchResults } from "../hooks/useSearchResults";

import { FilterSidebar } from "../components/FilterSidebar";
import { SearchResultCard } from "../components/SearchResultCard";
import { SearchResultGridCard } from "../components/SearchResultGridCard";
import { Pagination } from "../components/Pagination";
import { EmptySearch } from "../components/EmptySearch";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const guests = searchParams.get("guests") || "2 guests";
  const whereParam = searchParams.get("where") || "";
  const propertyTypes = searchParams.get("propertyTypes") || "";
  const checkinParam = searchParams.get("checkin") || "";
  const checkoutParam = searchParams.get("checkout") || "";
  const { isFavorite, toggleFavorite } = useFavorites();

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const { results, loading, total, pageSize } = useSearchResults(
    whereParam,
    propertyTypes,
    checkinParam,
    checkoutParam,
    guests,
    currentPage
  );

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const maxPrice = useMemo(() => {
    if (results.length === 0) return 500;
    return Math.ceil(Math.max(...results.map((p) => p.total_price ?? 0)));
  }, [results]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [propertyFilters, setPropertyFilters] = useState<string[]>(() => {
    const fromUrl = searchParams.get("propertyTypes")?.split(",").filter(Boolean);
    if (fromUrl && fromUrl.length > 0) {
      const mapped = fromUrl.map((t) => {
        const lower = t.toLowerCase();
        if (lower === "hotel" || lower === "hostel") return "Hotel";
        if (lower === "apartment") return "Apartment";
        if (lower === "villa") return "Villa";
        if (lower === "resort") return "Resort";
        return "Others";
      });
      return [...new Set(mapped)];
    }
    return ["All types"];
  });
  const [amenities, setAmenities] = useState<string[]>([]);

  useEffect(() => {
    setCurrentPage(1);
  }, [whereParam, propertyTypes, checkinParam, checkoutParam, guests]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const togglePropertyType = (type: string) => {
    if (type === "All types") {
      setPropertyFilters(["All types"]);
    } else {
      setPropertyFilters((prev) => {
        const next = prev.filter((t) => t !== "All types");
        if (next.includes(type)) {
          return next.filter((t) => t !== type);
        }
        return [...next, type];
      });
    }
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  useEffect(() => {
    setPriceRange(([, prevMax]) => [0, maxPrice]);
  }, [maxPrice]);

  const pageResults = useMemo(() => {
    return results.filter((property) => {
      if (!propertyFilters.includes("All types")) {
        const type = (property.type || "").toLowerCase().trim();
        const matchesType = propertyFilters.some((f) => {
          if (f === "Others") {
            const knownTypes = ["hotel", "hostel", "apartment", "villa", "resort"];
            return !knownTypes.some((kt) => type.includes(kt));
          }
          const fLower = f.toLowerCase().replace(/s$/, "");
          const tNorm = type.replace(/s$/, "");
          return tNorm === fLower;
        });
        if (!matchesType) return false;
      }

      const price = property.total_price ?? 0;
      if (price < priceRange[0] || price > priceRange[1]) return false;

      if (amenities.length > 0) {
        const matches = amenities.every((a) =>
          (property.amenities || []).some((amenity) =>
            amenity.toLowerCase().includes(a.toLowerCase())
          )
        );
        if (!matches) return false;
      }

      return true;
    });
  }, [results, propertyFilters, priceRange, amenities]);

  const clearAll = () => {
    setPriceRange([0, maxPrice]);
    setPropertyFilters(["All types"]);
    setAmenities([]);
  };

  const buildFilterParams = () => {
    const params = new URLSearchParams();
    if (whereParam) params.set("where", whereParam);
    if (checkinParam) params.set("checkin", checkinParam);
    if (checkoutParam) params.set("checkout", checkoutParam);
    if (guests) params.set("guests", guests);
    if (amenities.length > 0) params.set("amenities", amenities.join(","));
    return params.toString();
  };

  const hasFilters = Boolean(whereParam || propertyTypes);

  return (
    <div className="min-h-screen bg-background font-jakarta">
      <Navbar />

      <StickySearchHeader>
        <SearchBar />
      </StickySearchHeader>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          <div className="sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto">
            <FilterSidebar
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              maxPrice={maxPrice}
              propertyFilters={propertyFilters}
              onTogglePropertyType={togglePropertyType}
              amenities={amenities}
              onToggleAmenity={toggleAmenity}
              onClearAll={clearAll}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold font-brand text-brand-heading">
                {loading ? "Searching..." : `${total} stays${whereParam ? ` in ${whereParam}` : propertyTypes ? ` - ${propertyTypes}` : ""}`}
              </h2>
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
              {loading ? (
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
                      filterParams={buildFilterParams()}
                      guests={guests}
                    />
                  ) : (
                    <SearchResultGridCard
                      key={property.property_id}
                      property={property}
                      isFavorite={isFavorite(property.property_id)}
                      onToggleFavorite={toggleFavorite}
                      filterParams={buildFilterParams()}
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

      <Footer />
    </div>
  );
}
