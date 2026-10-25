import { useQueries, useQuery } from "@tanstack/react-query"
import { getAllProperties, getPropertyBookings } from "@/api/pms/pmsApi"
import { bookingKeys, propertyKeys } from "@/lib/queryKeys"
import type { GeneralInfoResponse, PropertyBooking } from "@/types/pms"

export function useAdminPropertiesQuery() {
  return useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
    select: (data) => (Array.isArray(data) ? data : []),
  })
}

export function usePropertyBookingsQuery(propertyId: string | null | undefined, enabled = true) {
  return useQuery<PropertyBooking[]>({
    queryKey: bookingKeys.byProperty(propertyId || ""),
    queryFn: () => getPropertyBookings(propertyId!),
    enabled: enabled && !!propertyId,
    select: (data) => (Array.isArray(data) ? data : []),
  })
}

export function useOverallPropertyBookingsQuery(propertyIds: string[], enabled = true) {
  return useQueries({
    queries: propertyIds.map((id) => ({
      queryKey: bookingKeys.byProperty(id),
      queryFn: () => getPropertyBookings(id),
      select: (data: unknown) => (Array.isArray(data) ? data : []),
      enabled: enabled && propertyIds.length > 0,
    })),
  })
}
