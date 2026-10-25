import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUIStore } from '@/store/ui/uiStore'
import { usePropertyStore } from '@/store/properties/propertyStore'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import StatCard from '@/components/admin/dashboard/StatCard'
import RevenueChart from '@/components/admin/dashboard/RevenueChart'
import OccupancyChart from '@/components/admin/dashboard/OccupancyChart'
import ArrivalsDepartures from '@/components/admin/dashboard/ArrivalsDepartures'
import RecentBookings from '@/components/admin/dashboard/RecentBookings'
import RoomsStatus from '@/components/admin/dashboard/RoomsStatus'
import RestaurantOverview from '@/components/admin/dashboard/RestaurantOverview'
import QuickActions from '@/components/admin/dashboard/QuickActions'
import {
  useAdminActivePropertiesQuery,
  useRoomsByPropertyQuery,
  usePropertyBookingsQuery,
  usePropertyAnalyticsQuery,
  useRevenueTrendQuery,
} from '@/services/queries/admin/dashboardQueries'
import { useDateRangeStore, isWithinRange } from '@/store/bookings/dateRangeStore'
import { Wallet, Bed, Calendar, TrendingUp, BarChart, ArrowLeft } from 'lucide-react'

export default function PropertyDashboardPage() {
  const { propertyId } = useParams<{ propertyId: string }>()
  const navigate = useNavigate()
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const setCurrentPropertyId = usePropertyStore((s) => s.setCurrentPropertyId)
  const dateFrom = useDateRangeStore((s) => s.from)
  const dateTo = useDateRangeStore((s) => s.to)
  const dateRangeLabel = useDateRangeStore((s) => s.label)

  useEffect(() => {
    if (propertyId) {
      setCurrentPropertyId(propertyId)
    }
  }, [propertyId, setCurrentPropertyId])

  const { data: allProperties = [], isLoading: loadingProperty } = useAdminActivePropertiesQuery()
  const property = allProperties.find((p) => p.id === propertyId)

  const { data: rooms = [], isLoading: loadingRooms } = useRoomsByPropertyQuery(propertyId, !!propertyId)

  const { data: allBookings = [] } = usePropertyBookingsQuery(propertyId, !!propertyId)
  const bookings = useMemo(
    () => allBookings.filter((b) => isWithinRange(b.created_at, dateFrom, dateTo)),
    [allBookings, dateFrom, dateTo],
  )

  // Analytics API (GET /properties/{id}/analytics*)
  const { data: analytics, isLoading: loadingAnalytics } = usePropertyAnalyticsQuery(propertyId)
  const { data: revenueTrend = [] } = useRevenueTrendQuery(propertyId, 30)

  const loading = loadingProperty || loadingRooms || loadingAnalytics

  const totalRooms = property?.total_rooms || rooms.length || 0
  const availableRooms = rooms.filter(r => r.status === 'AVAILABLE').length
  const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED' || r.status === 'BOOKED').length
  const maintenanceRooms = rooms.filter(r => r.status === 'MAINTENANCE' || r.status === 'OUT_OF_SERVICE').length
  const outOfOrderRooms = rooms.filter(r => r.status === 'OUT_OF_ORDER').length
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0)
  const soldRooms = occupiedRooms
  const adr = soldRooms > 0 ? Math.round(totalRevenue / soldRooms) : 0
  const revpar = totalRooms > 0 ? Math.round(totalRevenue / totalRooms) : 0
  const location = property ? [property.city, property.state, property.country].filter(Boolean).join(', ') : ''

  // Prefer server-computed analytics; fall back to client-computed values.
  const analyticsRevenue = analytics ? Number(analytics.total_revenue) : totalRevenue
  const analyticsArr = analytics ? Number(analytics.arr) : 0
  const analyticsOccupancy = analytics ? Math.round(analytics.occupancy_rate) : occupancyRate
  const bookingsToday = analytics?.bookings_today ?? 0

  const revenueTrendData = useMemo(
    () => revenueTrend.map(p => ({
      day: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Number(p.revenue) || 0,
    })),
    [revenueTrend],
  )

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTopColor: '#2563eb', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: 14, color: '#6B7280' }}>Loading property data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 16 }}>Property not found</p>
            <button onClick={() => navigate('/host/my-properties')} style={{ padding: '10px 20px', background: '#2563eb', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Back to Properties</button>
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
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={property.name}
          subtitle={location}
        />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          {/* Back Button */}
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => navigate('/host/my-properties')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                background: '#fff',
                fontSize: 13,
                color: '#6b7280',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb'
                e.currentTarget.style.borderColor = '#d1d5db'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }}
            >
              <ArrowLeft size={16} /> Back to Properties
            </button>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 20 }}>
            <StatCard
              icon={<Wallet size={20} color="#2563eb" />}
              iconBg="#eff6ff"
              label="Total Revenue"
              value={`NPR ${Math.round(analyticsRevenue).toLocaleString()}`}
            />
            <StatCard
              icon={<TrendingUp size={20} color="#2563eb" />}
              iconBg="#eff6ff"
              label="Annual Revenue (ARR)"
              value={`NPR ${Math.round(analyticsArr).toLocaleString()}`}
            />
            <StatCard
              icon={<Bed size={20} color="#2563eb" />}
              iconBg="#eff6ff"
              label="Occupancy Rate"
              value={`${analyticsOccupancy}%`}
              positive={analyticsOccupancy > 50}
            />
            <StatCard
              icon={<Calendar size={20} color="#2563eb" />}
              iconBg="#eff6ff"
              label="Bookings Today"
              value={String(bookingsToday)}
              positive={bookingsToday > 0}
            />
            <StatCard
              icon={<BarChart size={20} color="#2563eb" />}
              iconBg="#eff6ff"
              label="RevPAR"
              value={`NPR ${revpar.toLocaleString()}`}
              positive={revpar > 0}
            />
          </div>

          {/* Charts Row */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <RevenueChart revenueTrend={revenueTrendData} />
            <OccupancyChart
              occupied={occupiedRooms}
              available={availableRooms}
              maintenance={maintenanceRooms}
              outOfOrder={outOfOrderRooms}
            />
            <ArrivalsDepartures />
          </div>

          {/* Data Row */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <RecentBookings />
            <RoomsStatus rooms={rooms} totalRooms={totalRooms} />
            <RestaurantOverview />
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </main>
      </div>
    </div>
  )
}
