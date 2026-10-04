import { useState } from 'react'
import { useUIStore } from '../stores/uiStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import ReportFilters from '../components/reports/ReportFilters'
import ReportStats from '../components/reports/ReportStats'
import RevenueChart from '../components/reports/RevenueChart'
import RevenueByRoomType from '../components/reports/RevenueByRoomType'
import RevenueInRoomTypeTable from '../components/reports/RevenueInRoomTypeTable'
import BookingsTrend from '../components/reports/BookingsTrend'
import TopPerformingChannels from '../components/reports/TopPerformingChannels'
import type {
  KpiCardData,
  RevenueTrendData,
  RoomTypeRevenue,
  RevenueInRoomTypeRow,
  BookingTrendData,
  ChannelData,
} from '../types/reports'

const KPI_DATA: KpiCardData[] = [
  { label: 'Total Revenue', value: '$24,560', growth: 5.2, iconBg: '#E8F6EF', iconColor: '#1E8449', iconType: 'currency' },
  { label: 'ARR', value: '$135.42', growth: 4.8, iconBg: '#FEF3C7', iconColor: '#D97706', iconType: 'dollar' },
  { label: 'RevPAR', value: '$98.31', growth: 6.2, iconBg: '#DBEAFE', iconColor: '#2563EB', iconType: 'barChart' },
  { label: 'Occupancy Rate', value: '72.6%', growth: 4.4, iconBg: '#DBEAFE', iconColor: '#2563EB', iconType: 'building' },
  { label: 'Bookings Today', value: '58', growth: 16.4, iconBg: '#FEE2E2', iconColor: '#DC2626', iconType: 'bell' },
]

const REVENUE_TREND_DATA: RevenueTrendData[] = [
  { date: 'May 9', revenue: 12000 },
  { date: 'May 10', revenue: 14500 },
  { date: 'May 11', revenue: 9000 },
  { date: 'May 12', revenue: 7500 },
  { date: 'May 13', revenue: 11000 },
  { date: 'May 14', revenue: 13500 },
  { date: 'May 15', revenue: 10000 },
]

const ROOM_TYPE_REVENUE: RoomTypeRevenue[] = [
  { roomType: 'Standard', revenue: 6230 },
  { roomType: 'Deluxe', revenue: 9455 },
  { roomType: 'Suite', revenue: 11200 },
  { roomType: 'Premium', revenue: 3615 },
  { roomType: 'Penthouse', revenue: 2250 },
]

const REVENUE_TABLE_DATA: RevenueInRoomTypeRow[] = [
  { roomType: 'Standard', roomNights: 290, adr: 92.48, roomRevenue: 8230.00, percentOfTotal: 27.8 },
  { roomType: 'Deluxe', roomNights: 163, adr: 103.12, roomRevenue: 6762.00, percentOfTotal: 30.1 },
  { roomType: 'Suite', roomNights: 88, adr: 132.35, roomRevenue: 6230.00, percentOfTotal: 27.8 },
  { roomType: 'Premium', roomNights: 55, adr: 123.78, roomRevenue: 4480.00, percentOfTotal: 16.3 },
]

const BOOKING_TREND_DATA: BookingTrendData[] = [
  { date: 'May 9', bookings: 100 },
  { date: 'May 10', bookings: 105 },
  { date: 'May 11', bookings: 110 },
  { date: 'May 12', bookings: 95 },
  { date: 'May 13', bookings: 115 },
  { date: 'May 14', bookings: 125 },
  { date: 'May 15', bookings: 118 },
]

const CHANNEL_DATA: ChannelData[] = [
  { channel: 'Direct Bookings', percentage: 45, color: '#1A3C5E' },
  { channel: 'OTA', percentage: 30, color: '#2E86AB' },
  { channel: 'Walk-in', percentage: 15, color: '#57B8D9' },
  { channel: 'Phone', percentage: 10, color: '#7C3AED' },
]

export default function ReportsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const [dateRange, setDateRange] = useState('May 8, 2025 – May 15, 2025')
  const [roomType, setRoomType] = useState('All Room Types')
  const [bookingChannel, setBookingChannel] = useState('All Booking Channel')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Reports & Analytics" subtitle="Analytics and reporting dashboard" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          <ReportFilters
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            roomType={roomType}
            onRoomTypeChange={setRoomType}
            bookingChannel={bookingChannel}
            onBookingChannelChange={setBookingChannel}
            onApply={() => {}}
            onReset={() => {}}
            onExport={() => {}}
          />

          <ReportStats stats={KPI_DATA} />

          <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
            <RevenueChart data={REVENUE_TREND_DATA} />
            <RevenueByRoomType data={ROOM_TYPE_REVENUE} />
          </div>

          <RevenueInRoomTypeTable
            data={REVENUE_TABLE_DATA}
            totalNights={529}
            totalAdr={108.88}
            totalRevenue={13772.00}
          />

          <div style={{ display: 'flex', gap: 20 }}>
            <BookingsTrend data={BOOKING_TREND_DATA} />
            <TopPerformingChannels data={CHANNEL_DATA} totalRevenue={24560} />
          </div>
        </main>
      </div>
    </div>
  )
}
