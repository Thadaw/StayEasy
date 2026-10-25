import { useQuery } from "@tanstack/react-query"
import api from "@/api/axiosInstance"
import { frontdeskKeys } from "@/lib/queryKeys"

// Shape returned by /staff/properties/:id/activities/booking
export interface Activity {
  id: string
  staff_name: string
  activity_type: string
  description: string
  booking_id: string
  room_id: string
  extra_data: Record<string, unknown>
  created_at: string
}

const EMPTY_ACTIVITIES: Activity[] = []

// -- Booking activities feed (filtering happens client-side) --
export function useBookingActivitiesQuery(propertyId: string | null | undefined) {
  return useQuery({
    queryKey: frontdeskKeys.activities(propertyId || ""),
    queryFn: async (): Promise<Activity[]> => {
      if (!propertyId) return EMPTY_ACTIVITIES
      const params: Record<string, string> = { limit: "100", skip: "0" }
      const { data: result } = await api.get(`/staff/properties/${propertyId}/activities/booking`, {
        params,
      })

      const apiResult = result as { success?: boolean; data?: Activity[] }
      if (apiResult.success === false) {
        throw new Error("Failed to fetch booking activities")
      }

      return apiResult.data ?? []
    },
    enabled: !!propertyId,
  })
}
