import { useQuery } from "@tanstack/react-query"
import { getTodayArrivals, getTodayDepartures } from "@/api/pms/pmsApi"
import { frontdeskKeys } from "@/lib/queryKeys"

// -- Today's arrivals (check-in list) --
export function useTodayArrivalsQuery(propertyId: string | null | undefined) {
  return useQuery({
    queryKey: frontdeskKeys.arrivals(propertyId || ""),
    queryFn: async () => {
      if (!propertyId) return []
      return await getTodayArrivals(propertyId)
    },
    enabled: !!propertyId,
  })
}

// -- Today's departures (check-out list) --
export function useTodayDeparturesQuery(
  propertyId: string | null | undefined,
  options?: { refetchInterval?: number },
) {
  return useQuery({
    queryKey: frontdeskKeys.departures(propertyId || ""),
    queryFn: async () => {
      if (!propertyId) return []
      return await getTodayDepartures(propertyId)
    },
    enabled: !!propertyId,
    refetchInterval: options?.refetchInterval ?? 60000,
  })
}
