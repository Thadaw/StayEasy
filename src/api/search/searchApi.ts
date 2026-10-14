import api from "@/api/axiosInstance"
import { getDefaultDates } from "@/utils/date"
import { parseSearchResponse, parseSearchMeta } from "@/utils/helpers"
import type { SearchProperty } from "@/types/api"

export const PAGE_SIZE = 10

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

export interface SearchResultsParams {
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

export interface SearchResultsResponse {
  results: SearchProperty[]
  total: number
}

export async function searchProperties(
  destination: string,
  limit = 6,
  signal?: AbortSignal,
): Promise<SearchProperty[]> {
  const { today, tomorrow } = getDefaultDates()
  const { data } = await api.get("/search", {
    params: {
      destination,
      check_in: today,
      check_out: tomorrow,
      adults: "2",
      children: "0",
      rooms: "1",
    },
    signal,
  })
  return parseSearchResponse<SearchProperty>(data).slice(0, limit)
}

export async function searchResults(
  params: SearchResultsParams,
  signal?: AbortSignal,
): Promise<SearchResultsResponse> {
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

export interface NearbyMeta {
  radiusKm: number | null
}

export interface NearbyCoords {
  lat: number
  lng: number
}

export interface NearbyParams {
  checkIn: string
  checkOut: string
  adults: number
  children: number
  rooms: number
}

const FETCH_LIMIT = 20

export function parseRadiusMeta(data: unknown): NearbyMeta {
  const outer = data as Record<string, unknown> | undefined
  const inner = outer?.data as Record<string, unknown> | undefined
  const source = inner?.meta ?? outer?.meta
  const km = (source as { search_radius_km?: unknown } | undefined)?.search_radius_km
  return { radiusKm: typeof km === "number" ? km : null }
}

export async function searchNearby(
  coords: NearbyCoords,
  params: NearbyParams,
  signal?: AbortSignal,
): Promise<{ results: SearchProperty[]; meta: NearbyMeta }> {
  const { data } = await api.get("/search/nearby", {
    params: {
      lat: coords.lat,
      lon: coords.lng,
      limit: FETCH_LIMIT,
      check_in: params.checkIn,
      check_out: params.checkOut,
      adults: params.adults,
      children: params.children,
      rooms: params.rooms,
    },
    signal,
  })

  return { results: parseSearchResponse<SearchProperty>(data), meta: parseRadiusMeta(data) }
}

export interface SystemAmenity {
  id: string
  amenity_name: string
}

export interface SystemBedType {
  id: string
  bed_name: string
}

export interface SystemRoomType {
  id: string
  room_type_name: string
}

export async function getSystemAmenities(signal?: AbortSignal): Promise<SystemAmenity[]> {
  const res = await api.get("/search/system-amenities", { signal })
  const data = res.data
  let items: { id?: string; amenity_name?: string; name?: string }[] = []
  if (Array.isArray(data)) {
    items = data
  } else if (data && Array.isArray(data.data)) {
    items = data.data
  }
  return items
    .map((item) => ({
      id: item?.id || "",
      amenity_name: item?.amenity_name || item?.name || "",
    }))
    .filter((n) => n.amenity_name)
}

export async function getSystemBedTypes(signal?: AbortSignal): Promise<SystemBedType[]> {
  const res = await api.get("/search/system-bed-types", { signal })
  const data = res.data
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.data)) return data.data
  return []
}

export async function getSystemRoomTypes(signal?: AbortSignal): Promise<SystemRoomType[]> {
  const res = await api.get("/search/system-room-types", { signal })
  const data = res.data
  let items: { id?: string; room_type_name?: string; name?: string }[] = []
  if (Array.isArray(data)) {
    items = data
  } else if (data && Array.isArray(data.data)) {
    items = data.data
  }
  return items.map((item) => ({
    id: item.id || "",
    room_type_name: item.room_type_name || item.name || "",
  }))
}
