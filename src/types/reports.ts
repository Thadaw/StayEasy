export interface ReportStats {
  totalRevenue: number
  roomRevenue: number
  fbRevenue: number
  totalBookings: number
  avgDailyRate: number
  occupancyRate: number
  revenueGrowth: number
  roomRevenueGrowth: number
  fbRevenueGrowth: number
  bookingsGrowth: number
  adrGrowth: number
  occupancyGrowth: number
}

export interface RevenueDataPoint {
  date: string
  totalRevenue: number
  roomRevenue: number
}

export interface DepartmentRevenue {
  name: string
  percentage: number
  amount: number
  color: string
}

export interface OccupancyData {
  rate: number
  soldRooms: number
  availableRooms: number
  blockedRooms: number
  growth: number
}

export interface TopRoomType {
  id: number
  roomType: string
  occupancy: number
  revenue: number
}

export interface RecentBooking {
  id: string
  bookingId: string
  guest: string
  checkIn: string
  amount: number
  status: 'Confirmed' | 'Checked In' | 'Pending' | 'Checked Out'
}

export interface RevenueSummaryItem {
  label: string
  value: number
  color?: string
  bold?: boolean
}
