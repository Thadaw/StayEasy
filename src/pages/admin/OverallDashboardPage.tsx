import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import StatCard from '@/components/admin/dashboard/StatCard'
import RevenueChart from '@/components/admin/dashboard/RevenueChart'
import OccupancyChart from '@/components/admin/dashboard/OccupancyChart'
import RecentBookings from '@/components/admin/dashboard/RecentBookings'
import RoomsStatus from '@/components/admin/dashboard/RoomsStatus'
import QuickActions from '@/components/admin/dashboard/QuickActions'
import ArrivalsDepartures from '@/components/admin/dashboard/ArrivalsDepartures'
import {
  useAdminActivePropertiesQuery,
  useOverallRoomsQuery,
  useOverallPropertyBookingsQuery,
} from '@/services/queries/admin/dashboardQueries'
import { useDateRangeStore, isWithinRange } from '@/store/bookings/dateRangeStore'
import { Wallet, Bed, Calendar, TrendingUp, BarChart } from 'lucide-react'
import type { RoomResponse, PropertyBooking } from '@/types/pms'

export default function OverallDashboardPage() {
  const navigate = useNavigate()
  const dateFrom = useDateRangeStore((s) => s.from)
  const dateTo = useDateRangeStore((s) => s.to)

  // Fetch all properties
  const {
    data: allProperties = [],
    isLoading: loadingProperties,
    isError: propertiesFailed,
    refetch: refetchProperties,
  } = useAdminActivePropertiesQuery()

  const activePropertyIds = useMemo(
    () => allProperties.map((p) => p.id),
    [allProperties]
  )

  // Fetch rooms for all active properties in parallel
  const roomQueries = useOverallRoomsQuery(activePropertyIds, activePropertyIds.length > 0)

  // Fetch bookings for all active properties in parallel
  const bookingQueries = useOverallPropertyBookingsQuery(activePropertyIds, activePropertyIds.length > 0)

  const loading = loadingProperties || roomQueries.some((q) => q.isLoading) || bookingQueries.some((q) => q.isLoading)

  // Aggregate all rooms
  const allRooms: RoomResponse[] = useMemo(
    () => roomQueries.flatMap((q) => (q.data ? (q.data as RoomResponse[]) : [])),
    [roomQueries]
  )

  // Aggregate all bookings, limited to the selected header date range
  const allBookings: PropertyBooking[] = useMemo(
    () =>
      bookingQueries
        .flatMap((q) => (q.data ? (q.data as PropertyBooking[]) : []))
        .filter((b) => isWithinRange(b.created_at, dateFrom, dateTo)),
    [bookingQueries, dateFrom, dateTo],
  )

  // Compute aggregated stats
  const stats = useMemo(() => {
    const totalRooms = allRooms.length
    const occupiedRooms = allRooms.filter((r) => r.status === 'OCCUPIED' || r.status === 'BOOKED').length
    const availableRooms = allRooms.filter((r) => r.status === 'AVAILABLE').length
    const maintenanceRooms = allRooms.filter((r) => r.status === 'MAINTENANCE' || r.status === 'OUT_OF_SERVICE').length
    const outOfOrderRooms = allRooms.filter((r) => r.status === 'OUT_OF_ORDER').length
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

    const totalRevenue = allBookings.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0)
    const totalBookings = allBookings.length
    const soldRooms = occupiedRooms
    const adr = soldRooms > 0 ? Math.round(totalRevenue / soldRooms) : 0
    const revpar = totalRooms > 0 ? Math.round(totalRevenue / totalRooms) : 0

    return {
      totalProperties: activePropertyIds.length,
      totalRooms,
      occupiedRooms,
      availableRooms,
      maintenanceRooms,
      outOfOrderRooms,
      occupancyRate,
      totalRevenue,
      totalBookings,
      adr,
      revpar,
    }
  }, [allRooms, allBookings, activePropertyIds])

  // Sort bookings by created_at descending for recent bookings
  const recentBookings = useMemo(
    () => [...allBookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5),
    [allBookings]
  )

  // Generate revenue chart data from bookings (group by date)
  const revenueChartData = useMemo(() => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const lastMonth = thisMonth - 1

    const grouped: Record<string, { thisMonth: number; lastMonth: number; thisWeek: number }> = {}

    allBookings.forEach((b) => {
      const date = new Date(b.created_at)
      const day = date.getDate()
      const month = date.getMonth()
      const monthLabel = date.toLocaleString('en-US', { month: 'short' })
      const key = `${monthLabel} ${day}`
      const amount = Number(b.total_amount) || 0

      if (!grouped[key]) {
        grouped[key] = { thisMonth: 0, lastMonth: 0, thisWeek: 0 }
      }

      if (month === thisMonth) {
        grouped[key].thisMonth += amount
      } else if (month === lastMonth) {
        grouped[key].lastMonth += amount
      }

      // Check if within last 7 days
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays <= 7) {
        grouped[key].thisWeek += amount
      }
    })

    return Object.entries(grouped)
      .map(([day, data]) => ({ day, ...data }))
      .sort((a, b) => parseInt(a.day.replace(/\D/g, '')) - parseInt(b.day.replace(/\D/g, '')))
      .slice(0, 7)
  }, [allBookings])

  // A failed properties fetch must never leave the page on an endless
  // "Loading portfolio data..." spinner — surface the failure instead.
  if (propertiesFailed) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: 380, padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
              We couldn&rsquo;t load your portfolio
            </h2>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 20px', lineHeight: 1.5 }}>
              Your account may still be setting up, or the server is temporarily unavailable.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => refetchProperties()}
                style={{
                  padding: '10px 20px', borderRadius: 8, border: 'none',
                  background: '#2563eb', color: '#fff', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600,
                }}
              >
                Try again
              </button>
              <button
                onClick={() => navigate('/host/tenant-setup')}
                style={{
                  padding: '10px 20px', borderRadius: 8, border: '1px solid #e5e7eb',
                  background: '#fff', color: '#374151', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600,
                }}
              >
                Finish account setup
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTopColor: '#2563eb', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: 14, color: '#6B7280' }}>Loading portfolio data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader
          title="Dashboard"
          subtitle="Overview of your portfolio performance"
        />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 20 }}>
            <StatCard
              icon={<Wallet size={20} color="#2563eb" />}
              iconBg="#eff6ff"
              label="Total Revenue"
              value={`NPR ${stats.totalRevenue.toLocaleString()}`}
              change="12.1%"
              changeLabel="vs last month"
              positive={true}
            />
            <StatCard
              icon={<Bed size={20} color="#2563eb" />}
              iconBg="#eff6ff"
              label="Occupancy Rate"
              value={`${stats.occupancyRate}%`}
              change="3.2%"
              changeLabel="vs last month"
              positive={stats.occupancyRate > 50}
            />
            <StatCard
              icon={<Calendar size={20} color="#2563eb" />}
              iconBg="#eff6ff"
              label="Total Bookings"
              value={String(stats.totalBookings)}
              change="13.7%"
              changeLabel="vs last month"
              positive={true}
            />
            <StatCard
              icon={<TrendingUp size={20} color="#2563eb" />}
              iconBg="#eff6ff"
              label="ADR (Avg. Room Rate)"
              value={`NPR ${stats.adr.toLocaleString()}`}
              change="1.2%"
              changeLabel="vs last month"
              positive={true}
            />
            <StatCard
              icon={<BarChart size={20} color="#2563eb" />}
              iconBg="#eff6ff"
              label="RevPAR"
              value={`NPR ${stats.revpar.toLocaleString()}`}
              change="20.4%"
              changeLabel="vs last month"
              positive={stats.revpar > 0}
            />
          </div>

          {/* Charts Row */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <RevenueChart data={revenueChartData.length > 0 ? revenueChartData : undefined} />
            <OccupancyChart
              occupied={stats.occupiedRooms}
              available={stats.availableRooms}
              maintenance={stats.maintenanceRooms}
              outOfOrder={stats.outOfOrderRooms}
            />
            <ArrivalsDepartures />
          </div>

          {/* Data Row */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <RecentBookings bookings={recentBookings} />
            <RoomsStatus rooms={allRooms} totalRooms={stats.totalRooms} />
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </main>
      </div>
    </div>
  )
}
