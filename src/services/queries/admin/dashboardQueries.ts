import { useQuery, useQueries } from "@tanstack/react-query"
import {
  getAllProperties,
  getRooms,
  getPropertyBookings,
  getPropertyAnalytics,
  getRevenueTrend,
  getRevenueByRoomType,
  getBookingTrend,
} from "@/api/pms/pmsApi"
import { propertyKeys, roomKeys, bookingKeys, analyticsKeys } from "@/lib/queryKeys"
import type { GeneralInfoResponse, RoomResponse, PropertyBooking } from "@/types/pms"

// Analytics endpoints accept days=1..30 (backend Query constraint).
export const ANALYTICS_MAX_DAYS = 30

export function useAdminPropertiesQuery() {
  return useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
    select: (data) => (Array.isArray(data) ? data : []),
  })
}

export function useAdminActivePropertiesQuery() {
  return useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
    select: (data) => {
      const list = Array.isArray(data) ? data : []
      return list.filter((p) => p.is_active !== false)
    },
  })
}

export function useRoomsByPropertyQuery(propertyId: string | null | undefined, enabled = true) {
  return useQuery<RoomResponse[]>({
    queryKey: roomKeys.byProperty(propertyId || ""),
    queryFn: () => getRooms(propertyId!),
    enabled: enabled && !!propertyId,
    select: (data) => (Array.isArray(data) ? data : []),
  })
}

export function useOverallRoomsQuery(propertyIds: string[], enabled = true) {
  return useQueries({
    queries: propertyIds.map((id) => ({
      queryKey: roomKeys.byProperty(id),
      queryFn: () => getRooms(id),
      select: (data: unknown) => (Array.isArray(data) ? data : []),
      enabled: enabled && propertyIds.length > 0,
    })),
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

// ─── Analytics (GET /properties/{id}/analytics*) ──────────────

export function usePropertyAnalyticsQuery(propertyId: string | null | undefined, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.overview(propertyId || ""),
    queryFn: () => getPropertyAnalytics(propertyId!),
    enabled: enabled && !!propertyId,
  })
}

export function useRevenueTrendQuery(propertyId: string | null | undefined, days = 7, enabled = true) {
  const clampedDays = Math.min(ANALYTICS_MAX_DAYS, Math.max(1, days))
  return useQuery({
    queryKey: analyticsKeys.revenueTrend(propertyId || "", clampedDays),
    queryFn: () => getRevenueTrend(propertyId!, clampedDays),
    enabled: enabled && !!propertyId,
    select: (data) => (Array.isArray(data) ? data : []),
  })
}

export function useRevenueByRoomTypeQuery(propertyId: string | null | undefined, days = 7, enabled = true) {
  const clampedDays = Math.min(ANALYTICS_MAX_DAYS, Math.max(1, days))
  return useQuery({
    queryKey: analyticsKeys.revenueByRoomType(propertyId || "", clampedDays),
    queryFn: () => getRevenueByRoomType(propertyId!, clampedDays),
    enabled: enabled && !!propertyId,
    select: (data) => (Array.isArray(data) ? data : []),
  })
}

export function useBookingTrendQuery(propertyId: string | null | undefined, days = 7, enabled = true) {
  const clampedDays = Math.min(ANALYTICS_MAX_DAYS, Math.max(1, days))
  return useQuery({
    queryKey: analyticsKeys.bookingTrend(propertyId || "", clampedDays),
    queryFn: () => getBookingTrend(propertyId!, clampedDays),
    enabled: enabled && !!propertyId,
    select: (data) => (Array.isArray(data) ? data : []),
  })
}
