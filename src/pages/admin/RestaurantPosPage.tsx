import { useUIStore } from '@/store/ui/uiStore'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import RestaurantStatsRow from '@/components/admin/restaurant/RestaurantStatsRow'
import RestaurantQuickActions from '@/components/admin/restaurant/RestaurantQuickActions'
import SalesOverviewChart from '@/components/admin/restaurant/SalesOverviewChart'
import OrdersByTypeChart from '@/components/admin/restaurant/OrdersByTypeChart'
import ActiveOrdersList from '@/components/admin/restaurant/ActiveOrdersList'
import TopSellingItems from '@/components/admin/restaurant/TopSellingItems'
import BusyHoursHeatmap from '@/components/admin/restaurant/BusyHoursHeatmap'
import KitchenStatus from '@/components/admin/restaurant/KitchenStatus'

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
