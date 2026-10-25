import { useQuery } from "@tanstack/react-query"
import api from "@/api/axiosInstance"
import { getFrontDeskSummary } from "@/api/pms/pmsApi"
import { frontdeskKeys } from "@/lib/queryKeys"

// -- Front desk summary (arrivals/departures/occupancy stats) --
export function useFrontDeskSummaryQuery(propertyId: string | null | undefined) {
  return useQuery({
    queryKey: frontdeskKeys.summary(propertyId || ""),
    queryFn: () => getFrontDeskSummary(propertyId!),
    enabled: !!propertyId,
    refetchInterval: 30000,
  })
}

// -- Bookings used to compute weekly revenue --
export interface RevenueBooking {
  created_at: string
  total_amount: string
}

export function useRevenueBookingsQuery(propertyId: string | null | undefined) {
  return useQuery({
    queryKey: frontdeskKeys.revenueBookings(propertyId || ""),
    queryFn: async (): Promise<RevenueBooking[]> => {
      if (!propertyId) return []
      try {
        const { data: result } = await api.get(`/properties/${propertyId}/bookings`, {
          params: { limit: "50", skip: "0" },
        })
        const wrapped = result as { data?: RevenueBooking[] }
        return (wrapped?.data ?? result) as RevenueBooking[]
      } catch {
        return []
      }
    },
    enabled: !!propertyId,
  })
}
