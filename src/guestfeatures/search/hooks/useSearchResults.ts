import { useEffect, useState } from "react";
import api from "../../../services/axios";
import { getDefaultDates } from "../../../shared/utils/date";
import { parseSearchResponse, parseSearchMeta } from "../../../shared/utils/helpers";
import type { SearchProperty } from "../../../shared/types/api";

const PAGE_SIZE = 10;

const PROPERTY_TYPE_ALIASES: Record<string, string> = {
  hotel: "HOTEL", hotels: "HOTEL",
  hostel: "HOSTEL", hostels: "HOSTEL",
  resort: "RESORT", resorts: "RESORT",
  villa: "VILLA", villas: "VILLA",
  apartment: "APARTMENT", apartments: "APARTMENT",
  guesthouse: "GUESTHOUSE", guesthouses: "GUESTHOUSE",
  restaurant: "RESTURANT", restaurants: "RESTURANT",
  other: "OTHER", others: "OTHER",
};

function resolveSearchTerms(location: string, propertyType: string) {
  const trimmed = location.trim();
  const lower = trimmed.toLowerCase();

  const detectedType = PROPERTY_TYPE_ALIASES[propertyType.toLowerCase()] || PROPERTY_TYPE_ALIASES[lower] || propertyType || "";

  if (detectedType && !propertyType) {
    const destination = trimmed.replace(new RegExp(`^${trimmed.split(/\s/)[0]}\\s*$`, "i"), "").trim();
    return { destination: destination || trimmed, propertyType: detectedType };
  }

  if (detectedType && !trimmed) {
    return { destination: propertyType, propertyType: detectedType };
  }

  return { destination: trimmed || "Nepal", propertyType: detectedType };
}

function buildParams(
  location: string,
  propertyType: string,
  checkIn: string,
  checkOut: string,
  adults: string,
  children: string,
  rooms: string,
  limit: number,
  skip: number,
  minPrice?: number | null,
  maxPrice?: number | null,
  roomTypeIds?: string[],
  bedTypeIds?: string[],
  amenityIds?: string[]
): Record<string, string> {
  const { today, tomorrow } = getDefaultDates();
  const { destination, propertyType: resolvedType } = resolveSearchTerms(location, propertyType);

  const params: Record<string, string> = {
    check_in: checkIn || today,
    check_out: checkOut || tomorrow,
    skip: String(skip),
    limit: String(limit),
    destination,
  };
  params.adults = adults || "1";
  params.children = children || "0";
  params.rooms = rooms || "1";
  if (minPrice != null && minPrice > 0) params.min_price = String(minPrice);
  if (maxPrice != null && maxPrice > 0) params.max_price = String(maxPrice);
  if (roomTypeIds && roomTypeIds.length > 0) {
    params.room_type_ids = roomTypeIds.join(",");
  }
  if (bedTypeIds && bedTypeIds.length > 0) {
    params.bed_type_ids = bedTypeIds.join(",");
  }
  if (amenityIds && amenityIds.length > 0) {
    params.amenity_ids = amenityIds.join(",");
  }
  return params;
}

export function useSearchResults(
  location: string,
  propertyType: string,
  checkIn: string,
  checkOut: string,
  adults: string,
  children: string,
  rooms: string,
  page: number,
  minPrice?: number | null,
  maxPrice?: number | null,
  roomTypeIds?: string[],
  bedTypeIds?: string[],
  amenityIds?: string[]
) {
  const [results, setResults] = useState<SearchProperty[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location && !propertyType) {
      setLoading(false);
      setResults([]);
      setTotal(0);
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        const skip = (page - 1) * PAGE_SIZE;
        const pageParams = buildParams(location, propertyType, checkIn, checkOut, adults, children, rooms, PAGE_SIZE, skip, minPrice, maxPrice, roomTypeIds, bedTypeIds, amenityIds);
        const pageRes = await api.get("/search", { params: pageParams });
        if (cancelled) return;
        setResults(parseSearchResponse<SearchProperty>(pageRes.data));
        const pageMeta = parseSearchMeta(pageRes.data);
        setTotal(pageMeta?.total ?? parseSearchResponse<SearchProperty>(pageRes.data).length);
      } catch (error) {
        if (!cancelled) {
          console.error("Search API error:", error);
          setResults([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [location, propertyType, checkIn, checkOut, adults, children, rooms, page, minPrice, maxPrice, roomTypeIds, bedTypeIds, amenityIds]);

  return {
    results,
    loading,
    total,
    pageSize: PAGE_SIZE,
  };
}
