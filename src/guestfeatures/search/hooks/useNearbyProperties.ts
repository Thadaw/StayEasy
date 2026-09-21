import { useQuery } from "@tanstack/react-query"
import api from "../../../services/axios"
import type { SearchProperty } from "../../../shared/types/api"
import { getDefaultDates } from "../../../shared/utils/date"

function getStoredCoords(): { lat: number; lon: number } | null {
  try {
    const stored = localStorage.getItem("nearbyLocation")
    if (!stored) return null
    const match = stored.match(/([\d.-]+),\s*([\d.-]+)/)
    if (!match) return null
    return { lat: parseFloat(match[1]), lon: parseFloat(match[2]) }
  } catch {
    return null
  }
}

function getGeolocation(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (localStorage.getItem("locationDenied") === "true") {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 8000 }
    )
  })
}

export function useNearbyProperties(limit = 6) {
  return useQuery({
    queryKey: ["nearbyProperties", limit] as const,
    queryFn: async ({ signal }): Promise<SearchProperty[]> => {
      const stored = getStoredCoords()
      let coords = stored

      if (!coords) {
        coords = await getGeolocation()
      }

      if (!coords) return []

      const { today, tomorrow } = getDefaultDates()
      const response = await api.get("/search/nearby", {
        params: {
          lat: coords.lat,
          lon: coords.lon,
          limit,
          check_in: today,
          check_out: tomorrow,
          adults: 2,
          children: 0,
          rooms: 1,
        },
        signal,
      })
      return response.data?.data || []
    },
    staleTime: 60 * 60_000,
    gcTime: 60 * 60_000,
  })
}
