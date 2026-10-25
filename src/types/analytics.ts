// Response shapes for the Analytics endpoints
// (backend: app/modules/dashboard/schemas.py, wrapped in StandardResponse).
//
// Money fields are `Decimal` on the backend; Pydantic v2 serializes Decimal
// to a JSON string, but we accept number too and coerce with Number().

export interface ChannelPerformance {
  channel_name: string
  booking_count: number
  revenue: number | string
}

export interface DashboardOverview {
  total_revenue: number | string
  arr: number | string
  occupancy_rate: number
  bookings_today: number
  top_channels: ChannelPerformance[]
}

export interface RevenueTrendPoint {
  date: string
  revenue: number | string
}

export interface RevenueByRoomType {
  room_type_name: string
  revenue: number | string
  booking_count: number
}

export interface BookingTrendPoint {
  date: string
  booking_count: number
}
