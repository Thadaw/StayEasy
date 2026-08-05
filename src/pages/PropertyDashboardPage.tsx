import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useUIStore } from '../stores/uiStore'
import { usePropertyStore } from '../stores/propertyStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import StatCard from '../components/dashboard/StatCard'
import RevenueChart from '../components/dashboard/RevenueChart'
import OccupancyChart from '../components/dashboard/OccupancyChart'
import ArrivalsDepartures from '../components/dashboard/ArrivalsDepartures'
import RecentBookings from '../components/dashboard/RecentBookings'
import RoomsStatus from '../components/dashboard/RoomsStatus'
import RestaurantOverview from '../components/dashboard/RestaurantOverview'
import QuickActions from '../components/dashboard/QuickActions'
import { getProperty, getRooms } from '../services/pmsApi'
import { propertyKeys, roomKeys } from '../lib/queryKeys'
import { Wallet, Bed, Calendar, TrendingUp, BarChart, ArrowLeft } from 'lucide-react'

export default function PropertyDashboardPage() {
  const { propertyId } = useParams<{ propertyId: string }>()
  const navigate = useNavigate()
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const setCurrentPropertyId = usePropertyStore((s) => s.setCurrentPropertyId)

  useEffect(() => {
    if (propertyId) {
      setCurrentPropertyId(propertyId)
    }
  }, [propertyId, setCurrentPropertyId])

  const { data: property, isLoading: loadingProperty } = useQuery({
    queryKey: propertyKeys.detail(propertyId!),
    queryFn: () => getProperty(propertyId!),
    enabled: !!propertyId,
  })

  const { data: rooms = [], isLoading: loadingRooms } = useQuery({
    queryKey: roomKeys.byProperty(propertyId!),
    queryFn: () => getRooms(propertyId!),
    enabled: !!propertyId,
    select: (data) => Array.isArray(data) ? data : [],
  })

  const loading = loadingProperty || loadingRooms

  const totalRooms = property?.total_rooms || rooms.length || 0
  const availableRooms = rooms.filter(r => r.status === 'AVAILABLE').length
  const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED' || r.status === 'BOOKED').length
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
  const totalRevenue = rooms.reduce((sum, r) => sum + (Number(r.base_rate) || 0), 0)
  const avgRate = rooms.length > 0 ? Math.round(totalRevenue / rooms.length) : 0
  const location = property ? [property.city, property.state, property.country].filter(Boolean).join(', ') : ''

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
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
            <button onClick={() => navigate('/host/my-properties')} style={{ padding: '10px 20px', background: 'var(--primary)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Back to Properties</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Dashboard" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          {/* Back + Property Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <button onClick={() => navigate('/host/my-properties')} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', fontSize: 13, color: '#6B7280', cursor: 'pointer' }}>
              <ArrowLeft size={14} /> Back
            </button>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{property.name}</h2>
              <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: 0 }}>{location}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 20 }}>
            <StatCard icon={<Wallet size={18} color="var(--primary)" />} iconBg="var(--accent)" label="Total Revenue" value={`NPR ${totalRevenue.toLocaleString()}`} change="Based on room rates" positive={true} />
            <StatCard icon={<Bed size={18} color="var(--primary)" />} iconBg="var(--accent)" label="Occupancy Rate" value={`${occupancyRate}%`} change={`${occupiedRooms} of ${totalRooms} rooms`} positive={occupancyRate > 50} />
            <StatCard icon={<Calendar size={18} color="var(--primary)" />} iconBg="var(--accent)" label="Total Rooms" value={String(totalRooms)} change={`${availableRooms} available`} positive={true} />
            <StatCard icon={<TrendingUp size={18} color="var(--primary)" />} iconBg="var(--accent)" label="Avg. Room Rate" value={`NPR ${avgRate.toLocaleString()}`} change="Per room" positive={true} />
            <StatCard icon={<BarChart size={18} color="var(--primary)" />} iconBg="var(--accent)" label="Available" value={String(availableRooms)} change={`${Math.round((availableRooms / (totalRooms || 1)) * 100)}% of total`} positive={availableRooms > 0} />
          </div>

          {/* Charts Row */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <RevenueChart />
            <OccupancyChart />
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
