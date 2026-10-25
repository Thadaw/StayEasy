import { useQuery } from "@tanstack/react-query"
import type { AuthRequestConfig } from "@/api/axiosInstance"
import { getAvailableRooms } from "@/api/properties/propertyApi"
import { roomKeys } from "@/lib/queryKeys"

// -- Available rooms --
export function useAvailableRoomsQuery(
  propertyId: string | null | undefined,
  checkinDate: string,
  checkoutDate: string,
  adults: number = 2,
  children: number = 0,
  rooms: number = 1,
  requestConfig?: AuthRequestConfig,
) {
  return useQuery({
    queryKey: roomKeys.available(propertyId || "", checkinDate, checkoutDate, adults, children, rooms),
    queryFn: ({ signal }) =>
      getAvailableRooms(propertyId || "", checkinDate, checkoutDate, adults, children, rooms, requestConfig, signal),
    enabled: !!propertyId && !!checkinDate && !!checkoutDate,
    staleTime: 30_000,
  })
}
