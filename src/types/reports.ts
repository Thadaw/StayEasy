export interface KpiCardData {
  label: string
  value: string
  growth: number
  iconBg: string
  iconColor: string
  iconType: 'currency' | 'dollar' | 'barChart' | 'building' | 'bell'
}

export interface RevenueTrendData {
  date: string
  revenue: number
}

export interface RoomTypeRevenue {
  roomType: string
  revenue: number
}

export interface RevenueInRoomTypeRow {
  roomType: string
  roomNights: number
  adr: number
  roomRevenue: number
  percentOfTotal: number
}

export interface BookingTrendData {
  date: string
  bookings: number
}

export interface ChannelData {
  channel: string
  percentage: number
  color: string
}
