import { useQuery } from "@tanstack/react-query"
import api from "@/api/axiosInstance"
import { getRooms } from "@/api/pms/pmsApi"
import { frontdeskKeys } from "@/lib/queryKeys"

export interface CalendarDay {
  date: string
  status: string
  booking_ref: string | null
  guest_name: string | null
}

export interface CalendarRoom {
  room_id: string
  room_name: string
  room_type: string
  bed_type: string
  floor_number: number
  base_rate?: number
  days: CalendarDay[]
}

interface CalendarResponse {
  success: boolean
  data: {
    start_date: string
    rooms: CalendarRoom[]
  }
}

// -- Room availability calendar (room-status page) --
export function useRoomCalendarQuery(
  propertyId: string | null | undefined,
  startDate: string,
  endDate: string,
  roomStatusFilter?: string
) {
  return useQuery({
    queryKey: [...frontdeskKeys.roomCalendar(propertyId || ""), startDate, endDate, roomStatusFilter],
    queryFn: async (): Promise<CalendarRoom[]> => {
      if (!propertyId) return []
      const params: Record<string, string> = { start_date: startDate, end_date: endDate }
      if (roomStatusFilter) params.room_status = roomStatusFilter
      const { data: result } = await api.get(`/staff/properties/${propertyId}/room-calendar`, { params })
      const response = result as CalendarResponse
      return response?.data?.rooms || []
    },
    enabled: !!propertyId,
  })
}

// -- Rooms with base rates (for calendar overlays) --
export function useRoomsWithRatesQuery(propertyId: string | null | undefined) {
  return useQuery({
    queryKey: frontdeskKeys.roomsWithRates(propertyId || ""),
    queryFn: async (): Promise<{ room_id: string; base_rate: number }[]> => {
      if (!propertyId) return []
      const rooms = await getRooms(propertyId)
      return rooms.map((r) => ({ room_id: r.id, base_rate: Number(r.base_rate) || 0 }))
    },
    enabled: !!propertyId,
  })
}
