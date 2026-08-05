import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "../../../shared/components/Navbar";
import { SearchBar } from "../../../shared/components/SearchBar";
import { StickySearchHeader } from "../../../shared/components/StickySearchHeader";
import { Footer } from "../../../shared/components/Footer";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { useFavorites } from "../../../context/FavoritesContext";
import { useSearchResults } from "../hooks/useSearchResults";

import { FilterSidebar } from "../components/FilterSidebar";
import { SearchResultCard } from "../components/SearchResultCard";
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

  const { results: searchResults, loading } = useSearchResults(
    whereParam,
    propertyTypes,
    checkinParam,
    checkoutParam,
    guests
  );

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [propertyFilters, setPropertyFilters] = useState<string[]>(() => {
    const fromUrl = searchParams.get("propertyTypes")?.split(",").filter(Boolean);
    if (fromUrl && fromUrl.length > 0) {
      const mapped = fromUrl.map((t) => {
        const lower = t.toLowerCase();
        if (lower === "hotel" || lower === "hostel") return "Hotels";
        if (lower === "apartment") return "Apartments";
        if (lower === "villa") return "Villa";
        if (lower === "resort") return "Resort";
        return "Others";
      });
      return [...new Set(mapped)];
    }
    return ["All types"];
  });
  const [amenities, setAmenities] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

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

  const filteredProperties = useMemo(() => {
    return searchResults.filter((property) => {
      if (whereParam && whereParam.toLowerCase() !== (propertyTypes || "").toLowerCase()) {
        const parts = whereParam.toLowerCase().split(",").map((s) => s.trim());
        const matches = parts.some((p) =>
          (property.address || "").toLowerCase().includes(p) ||
          property.city.toLowerCase().includes(p) ||
          property.name.toLowerCase().includes(p) ||
          property.country.toLowerCase().includes(p) ||
          (property.state || "").toLowerCase().includes(p)
        );
        if (!matches) return false;
      }

      if (property.total_price < priceRange[0] || property.total_price > priceRange[1]) return false;

      if (amenities.length > 0) {
        const matches = amenities.every((a) =>
          (property.amenities || []).some((amenity) => amenity.toLowerCase().includes(a.toLowerCase()))
        );
        if (!matches) return false;
      }

      return true;
    });
  }, [searchResults, whereParam, propertyTypes, priceRange, amenities]);

  const clearAll = () => {
    setPriceRange([0, 500]);
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
          <FilterSidebar
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            propertyFilters={propertyFilters}
            onTogglePropertyType={togglePropertyType}
            amenities={amenities}
            onToggleAmenity={toggleAmenity}
            onClearAll={clearAll}
          />

          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h2 className="text-xl font-bold font-brand text-brand-heading">
                {loading ? "Searching..." : `${filteredProperties.length} stays${whereParam ? ` in ${whereParam}` : propertyTypes ? ` - ${propertyTypes}` : ""}`}
              </h2>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <LoadingSpinner />
                </div>
              ) : filteredProperties.length === 0 ? (
                <EmptySearch hasFilters={hasFilters} />
              ) : (
                filteredProperties.map((property) => (
                  <SearchResultCard
                    key={property.property_id}
                    property={property}
                    isFavorite={isFavorite(property.property_id)}
                    onToggleFavorite={toggleFavorite}
                    filterParams={buildFilterParams()}
                    guests={guests}
                  />
                ))
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={15}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
