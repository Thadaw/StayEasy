import { useQuery, keepPreviousData } from "@tanstack/react-query"
import {
  searchProperties,
  searchResults,
  searchNearby,
  getSystemAmenities,
  getSystemBedTypes,
  getSystemRoomTypes,
  PAGE_SIZE,
  type SearchResultsParams,
  type NearbyMeta,
} from "@/api/search/searchApi"
import type { SearchProperty } from "@/types/api"
import { getDefaultDates } from "@/utils/date"
import { useLocation } from "@/context/LocationContext"
import {
  getPropertyReviews,
  formatReviewApiError,
  isCancelError,
  type PropertyReview,
} from "@/api/reviews/reviewApi"
import { nearbyKeys, reviewKeys } from "@/lib/queryKeys"

export { PAGE_SIZE }

export function useSearchProperties(destination: string, limit = 6) {
  return useQuery({
    queryKey: ["searchProperties", destination, limit] as const,
    queryFn: ({ signal }) => searchProperties(destination, limit, signal),
    enabled: !!destination,
    staleTime: 5 * 60_000,
  })
}

export function useSearchResults(params: SearchResultsParams) {
  const hasSearchTerm = params.where || params.propertyTypes

  return useQuery({
    queryKey: ["search", params.where, params.propertyTypes, params.checkin, params.checkout, params.adults, params.children, params.rooms, params.page, params.min_price, params.max_price, params.room_type_ids, params.bed_type_ids, params.amenity_ids],
    queryFn: ({ signal }) => searchResults(params, signal),
    enabled: !!hasSearchTerm,
    placeholderData: (prev) => prev,
  })
}

/** The API rejects anything outside 1..50 with a 422. */
const MIN_LIMIT = 1
const MAX_LIMIT = 50

export interface UseNearbyOptions {
  checkIn?: string
  checkOut?: string
  adults?: number
  children?: number
  rooms?: number
}

export interface UseNearbyResult {
  properties: SearchProperty[]
  meta: NearbyMeta
  isLoading: boolean
  isError: boolean
}

function clampLimit(limit: number): number {
  if (!Number.isFinite(limit)) return MIN_LIMIT
  return Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, Math.trunc(limit)))
}

export function useNearbyProperties(limit = 10, options: UseNearbyOptions = {}): UseNearbyResult {
  const { coords, status } = useLocation()
  const { today, tomorrow } = getDefaultDates()

  const checkIn = options.checkIn || today
  const checkOut = options.checkOut || tomorrow
  const adults = options.adults ?? 2
  const children = options.children ?? 0
  const rooms = options.rooms ?? 1

  const enabled = status === "granted" && coords !== null
  const resolvedLimit = clampLimit(limit)

  const query = useQuery({
    queryKey: coords
      ? nearbyKeys.list({ lat: coords.lat, lng: coords.lng, checkIn, checkOut, adults, children, rooms })
      : nearbyKeys.all,
    queryFn: ({ signal }) => {
      if (!coords) return Promise.resolve({ results: [] as SearchProperty[], meta: { radiusKm: null } })
      return searchNearby(
        { lat: coords.lat, lng: coords.lng },
        { checkIn, checkOut, adults, children, rooms },
        signal,
      )
    },
    enabled,
    // A 4xx here means the request was malformed, so retrying cannot help and
    // would only re-run the query for nothing.
    retry: false,
    staleTime: 5 * 60_000,
    gcTime: 60 * 60_000,
    placeholderData: keepPreviousData,
  })

  const properties = (query.data?.results ?? []).slice(0, resolvedLimit)

  return {
    properties,
    meta: query.data?.meta ?? { radiusKm: null },
    isLoading: enabled && query.isPending,
    isError: query.isError,
  }
}

export function usePropertyAmenities() {
  const { data: amenities = [], ...rest } = useQuery({
    queryKey: ["system-amenities"],
    queryFn: ({ signal }) => getSystemAmenities(signal),
    staleTime: Infinity,
    gcTime: Infinity,
  })

  return { amenities, ...rest }
}

export function usePropertyBedTypes() {
  const { data: bedTypes = [], ...rest } = useQuery({
    queryKey: ["system-bed-types"],
    queryFn: ({ signal }) => getSystemBedTypes(signal),
    staleTime: Infinity,
    gcTime: Infinity,
  })

  return { bedTypes, ...rest }
}

export function usePropertyRoomTypes() {
  const { data: roomTypes = [], ...rest } = useQuery({
    queryKey: ["system-room-types"],
    queryFn: ({ signal }) => getSystemRoomTypes(signal),
    staleTime: Infinity,
    gcTime: Infinity,
  })

  return { roomTypes, ...rest }
}

export function usePropertyReviews(propertyId: string | undefined) {
  const query = useQuery({
    queryKey: reviewKeys.detail(propertyId || ""),
    queryFn: async ({ signal }) => {
      try {
        return await getPropertyReviews(propertyId || "", signal)
      } catch (err) {
        // Preserve the old cancellation semantics: an aborted request is not a
        // failure, so hand TanStack an AbortError it knows to ignore.
        if (isCancelError(err)) throw new DOMException("Aborted", "AbortError")
        throw new Error(formatReviewApiError(err, "Failed to load reviews"))
      }
    },
    enabled: !!propertyId,
    staleTime: 5 * 60_000,
  })

  return {
    reviews: (query.data?.reviews ?? []) as PropertyReview[],
    averageRating: query.data?.averageRating ?? 0,
    totalReviews: query.data?.totalReviews ?? 0,
    isLoading: query.isLoading,
    error: query.error ? query.error.message : null,
    refetch: query.refetch,
  }
}

export type { PropertyReview } from "@/api/reviews/reviewApi"
