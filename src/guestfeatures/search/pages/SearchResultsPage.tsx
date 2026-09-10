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
import { useSystemRoomTypes } from "../hooks/useSystemRoomTypes";
import { useSystemBedTypes } from "../hooks/useSystemBedTypes";
import { useSystemAmenities } from "../hooks/useSystemAmenities";

import { FilterSidebar } from "../components/FilterSidebar";
import { SearchResultCard } from "../components/SearchResultCard";
import { SearchResultGridCard } from "../components/SearchResultGridCard";
import { Pagination } from "../components/Pagination";
import { EmptySearch } from "../components/EmptySearch";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const adultsParam = searchParams.get("adults") || "2";
  const childrenParam = searchParams.get("children") || "0";
  const roomsParam = searchParams.get("rooms") || "1";
  const guests = searchParams.get("guests") || `${Number(adultsParam) + Number(childrenParam)} guests`;
  const whereParam = searchParams.get("where") || "";
  const propertyTypes = searchParams.get("propertyTypes") || "";
  const checkinParam = searchParams.get("checkin") || "";
  const checkoutParam = searchParams.get("checkout") || "";
  const { isFavorite, toggleFavorite } = useFavorites();
  const { roomTypes } = useSystemRoomTypes();
  const { bedTypes } = useSystemBedTypes();
  const { amenities: systemAmenities } = useSystemAmenities();

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("min_price")) || 0,
    Number(searchParams.get("max_price")) || 500,
  ]);
  const [propertyFilters, setPropertyFilters] = useState<string[]>(() => {
    const fromUrl = searchParams.get("propertyTypes")?.split(",").filter(Boolean);
    if (fromUrl && fromUrl.length > 0) {
      return fromUrl;
    }
    return [];
  });
  const [selectedRoomTypeIds, setSelectedRoomTypeIds] = useState<string[]>([]);
  const [selectedBedTypeIds, setSelectedBedTypeIds] = useState<string[]>([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([]);

  const { results, loading, total, pageSize } = useSearchResults(
    whereParam,
    propertyTypes,
    checkinParam,
    checkoutParam,
    adultsParam,
    childrenParam,
    roomsParam,
    currentPage,
    priceRange[0],
    priceRange[1],
    selectedRoomTypeIds,
    selectedBedTypeIds,
    selectedAmenityIds
  );

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const maxPrice = useMemo(() => {
    if (results.length === 0) return 500;
    return Math.ceil(Math.max(...results.map((p) => p.total_price ?? 0)));
  }, [results]);

  useEffect(() => {
    setCurrentPage(1);
  }, [whereParam, propertyTypes, checkinParam, checkoutParam, adultsParam, childrenParam, priceRange, selectedRoomTypeIds, selectedBedTypeIds, selectedAmenityIds]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    if (!searchParams.get("max_price")) {
      setPriceRange(([, prevMax]) => [0, maxPrice]);
    }
  }, [maxPrice]);

  const togglePropertyType = (type: string, id: string) => {
    setPropertyFilters((prev) => {
      if (prev.includes(type)) {
        setSelectedRoomTypeIds((prevIds) => prevIds.filter((i) => i !== id));
        return prev.filter((t) => t !== type);
      }
      setSelectedRoomTypeIds((prevIds) => [...prevIds, id]);
      return [...prev, type];
    });
  };

  const toggleBedType = (type: string, id: string) => {
    setSelectedBedTypeIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      return [...prev, id];
    });
  };

  const toggleAmenity = (amenity: string, id: string) => {
    setSelectedAmenityIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      return [...prev, id];
    });
  };

  const clearAll = () => {
    setPriceRange([0, maxPrice]);
    setPropertyFilters([]);
    setSelectedRoomTypeIds([]);
    setSelectedBedTypeIds([]);
    setSelectedAmenityIds([]);
  };

  const buildFilterParams = () => {
    const params = new URLSearchParams();
    if (whereParam) params.set("where", whereParam);
    if (checkinParam) params.set("checkin", checkinParam);
    if (checkoutParam) params.set("checkout", checkoutParam);
    if (adultsParam) params.set("adults", adultsParam);
    if (childrenParam) params.set("children", childrenParam);
    if (roomsParam) params.set("rooms", roomsParam);
    if (guests) params.set("guests", guests);
    if (priceRange[0] > 0) params.set("min_price", String(priceRange[0]));
    if (priceRange[1] < maxPrice) params.set("max_price", String(priceRange[1]));
    if (selectedRoomTypeIds.length > 0) params.set("room_type_ids", selectedRoomTypeIds.join(","));
    if (selectedBedTypeIds.length > 0) params.set("bed_type_ids", selectedBedTypeIds.join(","));
    if (selectedAmenityIds.length > 0) params.set("amenity_ids", selectedAmenityIds.join(","));
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
              roomTypes={roomTypes}
              bedTypes={bedTypes}
              systemAmenities={systemAmenities}
              propertyFilters={propertyFilters}
              onTogglePropertyType={togglePropertyType}
              selectedBedTypeIds={selectedBedTypeIds}
              onToggleBedType={toggleBedType}
              selectedAmenityIds={selectedAmenityIds}
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
