import { useUIStore } from '@/stores/uiStore'
import Sidebar from '@/admin/components/dashboard/Sidebar'
import DashboardHeader from '@/admin/components/dashboard/DashboardHeader'
import RestaurantStatsRow from '@/admin/components/restaurant/RestaurantStatsRow'
import RestaurantQuickActions from '@/admin/components/restaurant/RestaurantQuickActions'
import SalesOverviewChart from '@/admin/components/restaurant/SalesOverviewChart'
import OrdersByTypeChart from '@/admin/components/restaurant/OrdersByTypeChart'
import ActiveOrdersList from '@/admin/components/restaurant/ActiveOrdersList'
import TopSellingItems from '@/admin/components/restaurant/TopSellingItems'
import BusyHoursHeatmap from '@/admin/components/restaurant/BusyHoursHeatmap'
import KitchenStatus from '@/admin/components/restaurant/KitchenStatus'

export default function RestaurantPosPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Restaurant (POS)" subtitle="Manage restaurant operations, orders and menu." />
        <main style={{ flex: 1, overflow: 'auto', padding: 24, background: '#f5f6fa' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, marginBottom: 20 }}>
            <RestaurantStatsRow />
            <RestaurantQuickActions />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20, marginBottom: 20 }}>
            <SalesOverviewChart />
            <OrdersByTypeChart />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20 }}>
            <div>
              <TopSellingItems />
            </div>
            <div>
              <BusyHoursHeatmap />
              <ActiveOrdersList />
              <KitchenStatus />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
