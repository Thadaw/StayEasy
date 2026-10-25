import { useUIStore } from '@/store/ui/uiStore'
import { useStaffShiftsStore } from '@/store/admin/staffShiftsStore'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import AttendanceStats from '@/components/admin/staff/AttendanceStats'
import TodaySummary from '@/components/admin/staff/TodaySummary'
import AttendanceTable from '@/components/admin/staff/AttendanceTable'
import WeeklyTrend from '@/components/admin/staff/WeeklyTrend'
import RecentAlerts from '@/components/admin/staff/RecentAlerts'

export default function StaffShiftsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const activeTab = useStaffShiftsStore((s) => s.activeTab)
  const setActiveTab = useStaffShiftsStore((s) => s.setActiveTab)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          title="Attendance"
          subtitle="Track Staffs attendance and time records"
        />

        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          {/* Stats Row + Today's Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, marginBottom: 20 }}>
            <AttendanceStats />
            <TodaySummary />
          </div>

          {/* Main Content + Right Sidebar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
            {/* Left - Attendance Table + Chart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <AttendanceTable activeTab={activeTab} onTabChange={setActiveTab} />
              {activeTab === 'daily' && <WeeklyTrend />}
            </div>

            {/* Right - Alerts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <RecentAlerts />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
