import { useState } from 'react'
import { useUIStore } from '../stores/uiStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import ReportTabs from '../components/reports/ReportTabs'
import ReportFilters from '../components/reports/ReportFilters'
import ReportStats from '../components/reports/ReportStats'
import RevenueChart from '../components/reports/RevenueChart'
import RevenueByDepartment from '../components/reports/RevenueByDepartment'
import OccupancyGauge from '../components/reports/OccupancyGauge'
import TopRoomTypes from '../components/reports/TopRoomTypes'
import RecentBookings from '../components/reports/RecentBookings'
import RevenueSummary from '../components/reports/RevenueSummary'
import type {
  RevenueDataPoint,
  DepartmentRevenue,
  OccupancyData,
  TopRoomType,
  RecentBooking,
  RevenueSummaryItem,
} from '../types/reports'

const REVENUE_DATA: RevenueDataPoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: `Jun ${i + 1}`,
  totalRevenue: 30000 + Math.floor(Math.random() * 50000),
  roomRevenue: 20000 + Math.floor(Math.random() * 35000),
}))

const DEPARTMENT_DATA: DepartmentRevenue[] = [
  { name: 'Rooms', percentage: 68.6, amount: 856000, color: 'var(--primary)' },
  { name: 'Restaurant (F&B)', percentage: 25.0, amount: 312000, color: '#2563EB' },
  { name: 'Other Services', percentage: 6.4, amount: 80000, color: '#16A34A' },
]

const OCCUPANCY_DATA: OccupancyData = {
  rate: 72.4,
  soldRooms: 548,
  availableRooms: 757,
  blockedRooms: 32,
  growth: 10.3,
}

const TOP_ROOMS: TopRoomType[] = [
  { id: 1, roomType: 'Deluxe Room', occupancy: 78.4, revenue: 456000 },
  { id: 2, roomType: 'Suite Room', occupancy: 74.2, revenue: 286000 },
  { id: 3, roomType: 'Standard Room', occupancy: 69.1, revenue: 210000 },
  { id: 4, roomType: 'Family Room', occupancy: 65.3, revenue: 168000 },
  { id: 5, roomType: 'Single Room', occupancy: 58.6, revenue: 92000 },
]

const RECENT_BOOKINGS: RecentBooking[] = [
  { id: '1', bookingId: 'BK-250601', guest: 'John Smith', checkIn: 'Jun 1, 2026', amount: 18000, status: 'Confirmed' },
  { id: '2', bookingId: 'BK-250602', guest: 'Emily Johnson', checkIn: 'Jun 1, 2026', amount: 24000, status: 'Checked In' },
  { id: '3', bookingId: 'BK-250603', guest: 'Michael Brown', checkIn: 'Jun 1, 2026', amount: 9000, status: 'Pending' },
  { id: '4', bookingId: 'BK-250604', guest: 'Sarah Taylor', checkIn: 'Jun 2, 2026', amount: 21000, status: 'Confirmed' },
  { id: '5', bookingId: 'BK-250605', guest: 'David Wilson', checkIn: 'Jun 2, 2026', amount: 22500, status: 'Checked Out' },
]

const REVENUE_SUMMARY: RevenueSummaryItem[] = [
  { label: 'Total Revenue', value: 1248000 },
  { label: 'Room Revenue', value: 856000 },
  { label: 'F&B Revenue', value: 312000 },
  { label: 'Other Services', value: 80000 },
  { label: 'Total Expenses', value: 420000, color: '#DC2626' },
  { label: 'Net Profit', value: 828000, color: '#16A34A', bold: true },
]

export default function ReportsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const [activeTab, setActiveTab] = useState('Overview')
  const [dateRange, setDateRange] = useState('Jun 1 – Jun 30, 2026')
  const [property, setProperty] = useState('All Properties')
  const [department, setDepartment] = useState('All Departments')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Reports" subtitle="Analyze performance and track key metrics" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>

          <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <ReportFilters
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            property={property}
            onPropertyChange={setProperty}
            department={department}
            onDepartmentChange={setDepartment}
            onExport={() => {}}
          />

          <ReportStats
            stats={{
              totalRevenue: 1248000,
              roomRevenue: 856000,
              fbRevenue: 312000,
              totalBookings: 256,
              avgDailyRate: 8450,
              occupancyRate: 72.4,
              revenueGrowth: 18.6,
              roomRevenueGrowth: 16.2,
              fbRevenueGrowth: 21.8,
              bookingsGrowth: 12.6,
              adrGrowth: 9.7,
              occupancyGrowth: 10.3,
            }}
          />

          <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
            <RevenueChart data={REVENUE_DATA} />
            <RevenueByDepartment data={DEPARTMENT_DATA} total={1248000} />
            <OccupancyGauge data={OCCUPANCY_DATA} />
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <TopRoomTypes rooms={TOP_ROOMS} />
            <RecentBookings bookings={RECENT_BOOKINGS} />
            <RevenueSummary items={REVENUE_SUMMARY} />
          </div>
        </main>
      </div>
    </div>
  )
}
