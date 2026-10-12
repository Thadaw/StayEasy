import { useQuery, keepPreviousData } from "@tanstack/react-query"
import api from "../../../services/axios"
import type { SearchProperty } from "../../../shared/types/api"
import { getDefaultDates } from "../../../shared/utils/date"
import { parseSearchResponse } from "../../../shared/utils/helpers"
import { useLocation } from "../../../context/LocationContext"
import { nearbyKeys } from "../../../lib/queryKeys"

/** The API rejects anything outside 1..50 with a 422. */
const MIN_LIMIT = 1
const MAX_LIMIT = 50

/**
 * One shared page size, sliced client-side, so the hero cards and the rail cost
 * a single request. 20 gives the rail headroom over the 10 it renders.
 */
const FETCH_LIMIT = 20

export interface NearbyMeta {
  radiusKm: number | null
}

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

function parseRadiusMeta(data: unknown): NearbyMeta {
  const outer = data as Record<string, unknown> | undefined
  const inner = outer?.data as Record<string, unknown> | undefined
  const source = inner?.meta ?? outer?.meta
  const km = (source as { search_radius_km?: unknown } | undefined)?.search_radius_km
  return { radiusKm: typeof km === "number" ? km : null }
}

/**
 * Fetches properties around the visitor's granted location.
 *
 * This hook is deliberately pure: it never calls `getCurrentPosition`. The old
 * version did, inside `queryFn`, which meant a cache miss could pop a native
 * permission dialog with no in-app context and `retry: 1` could re-fire it.
 * Location now comes from `useLocation()` and only an explicit user action
 * starts a request.
 *
 * The coordinates live in the query key, so moving city invalidates the cache
 * instead of serving the previous city's results for an hour.
 */
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
    queryFn: async ({ signal }): Promise<{ results: SearchProperty[]; meta: NearbyMeta }> => {
      // A missing or non-finite coordinate makes the endpoint return 422, so
      // the guard lives here as well as in the `enabled` flag.
      if (!coords) return { results: [], meta: { radiusKm: null } }

      const { data } = await api.get("/search/nearby", {
        params: {
          lat: coords.lat,
          lon: coords.lng,
          limit: FETCH_LIMIT,
          check_in: checkIn,
          check_out: checkOut,
          adults,
          children,
          rooms,
        },
        signal,
      })

      return { results: parseSearchResponse<SearchProperty>(data), meta: parseRadiusMeta(data) }
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
