import { useQuery } from "@tanstack/react-query"
import api from "../../../services/axios"
import { getDefaultDates } from "../../../shared/utils/date"
import { parseSearchResponse, parseSearchMeta } from "../../../shared/utils/helpers"
import type { SearchProperty } from "../../../shared/types/api"

const PAGE_SIZE = 10

const PROPERTY_TYPE_ALIASES: Record<string, string> = {
  hotel: "HOTEL", hotels: "HOTEL",
  hostel: "HOSTEL", hostels: "HOSTEL",
  resort: "RESORT", resorts: "RESORT",
  villa: "VILLA", villas: "VILLA",
  apartment: "APARTMENT", apartments: "APARTMENT",
  guesthouse: "GUESTHOUSE", guesthouses: "GUESTHOUSE",
  restaurant: "RESTURANT", restaurants: "RESTURANT",
  other: "OTHER", others: "OTHER",
}

function resolveSearchTerms(location: string, propertyType: string) {
  const trimmed = location.trim()
  const lower = trimmed.toLowerCase()

  const detectedType = PROPERTY_TYPE_ALIASES[propertyType.toLowerCase()] || PROPERTY_TYPE_ALIASES[lower] || propertyType || ""

  if (detectedType && !propertyType) {
    const destination = trimmed.replace(new RegExp(`^${trimmed.split(/\s/)[0]}\\s*$`, "i"), "").trim()
    return { destination: destination || trimmed, propertyType: detectedType }
  }

  if (detectedType && !trimmed) {
    return { destination: propertyType, propertyType: detectedType }
  }

  return { destination: trimmed || "Nepal", propertyType: detectedType }
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
  minPrice?: string,
  maxPrice?: string,
  roomTypeIds?: string,
  bedTypeIds?: string,
  amenityIds?: string
): Record<string, string> {
  const { today, tomorrow } = getDefaultDates()
  const { destination } = resolveSearchTerms(location, propertyType)

  const params: Record<string, string> = {
    check_in: checkIn || today,
    check_out: checkOut || tomorrow,
    skip: String(skip),
    limit: String(limit),
    destination,
  }
  params.adults = adults || "1"
  params.children = children || "0"
  params.rooms = rooms || "1"
  if (minPrice && minPrice !== "0") params.min_price = minPrice
  if (maxPrice && maxPrice !== "500") params.max_price = maxPrice
  if (roomTypeIds && roomTypeIds.length > 0) params.room_type_ids = roomTypeIds
  if (bedTypeIds && bedTypeIds.length > 0) params.bed_type_ids = bedTypeIds
  if (amenityIds && amenityIds.length > 0) params.amenity_ids = amenityIds
  return params
}

interface UseSearchResultsParams {
  where: string
  propertyTypes: string
  checkin: string
  checkout: string
  adults: string
  children: string
  rooms: string
  page: number
  min_price?: string
  max_price?: string
  room_type_ids?: string
  bed_type_ids?: string
  amenity_ids?: string
}

interface SearchResultsResponse {
  results: SearchProperty[]
  total: number
}

async function fetchSearchResults(params: UseSearchResultsParams, signal?: AbortSignal): Promise<SearchResultsResponse> {
  const skip = (params.page - 1) * PAGE_SIZE
  const queryParams = buildParams(
    params.where,
    params.propertyTypes,
    params.checkin,
    params.checkout,
    params.adults,
    params.children,
    params.rooms,
    PAGE_SIZE,
    skip,
    params.min_price,
    params.max_price,
    params.room_type_ids,
    params.bed_type_ids,
    params.amenity_ids
  )

  const pageRes = await api.get("/search", { params: queryParams, signal })
  const results = parseSearchResponse<SearchProperty>(pageRes.data)
  const pageMeta = parseSearchMeta(pageRes.data)

  return {
    results,
    total: pageMeta?.total ?? results.length,
  }
}

export function useSearchResults(params: UseSearchResultsParams) {
  const hasSearchTerm = params.where || params.propertyTypes

  return useQuery({
    queryKey: ["search", params.where, params.propertyTypes, params.checkin, params.checkout, params.adults, params.children, params.rooms, params.page, params.min_price, params.max_price, params.room_type_ids, params.bed_type_ids, params.amenity_ids],
    queryFn: ({ signal }) => fetchSearchResults(params, signal),
    enabled: !!hasSearchTerm,
    placeholderData: (prev) => prev,
  })
}

export { PAGE_SIZE }
