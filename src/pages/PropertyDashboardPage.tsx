import { useState } from 'react'
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
import { Wallet, Bed, Calendar, TrendingUp, BarChart } from 'lucide-react'

export default function PropertyDashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const property = { name: 'The Heights Residences', location: 'Downtown Seattle, WA' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Dashboard" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          {/* Property Info */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{property.name}</h2>
            <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: 0 }}>{property.location}</p>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 20 }}>
            <StatCard icon={<Wallet size={18} color="var(--primary)" />} iconBg="var(--accent)" label="Total Revenue" value="NPR 2,458,250" change="18.6% vs May 1 – May 31" positive={true} />
            <StatCard icon={<Bed size={18} color="var(--primary)" />} iconBg="var(--accent)" label="Occupancy Rate" value="72.4%" change="8.3% vs May 1 – May 31" positive={true} />
            <StatCard icon={<Calendar size={18} color="var(--primary)" />} iconBg="var(--accent)" label="Total Bookings" value="245" change="15.7% vs May 1 – May 31" positive={true} />
            <StatCard icon={<TrendingUp size={18} color="var(--primary)" />} iconBg="var(--accent)" label="ADR (Avg. Room Rate)" value="NPR 5,620" change="11.2% vs May 1 – May 31" positive={true} />
            <StatCard icon={<BarChart size={18} color="var(--primary)" />} iconBg="var(--accent)" label="RevPAR" value="NPR 4,065" change="20.4% vs May 1 – May 31" positive={false} />
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
            <RoomsStatus />
            <RestaurantOverview />
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </main>
      </div>
    </div>
  )
}
