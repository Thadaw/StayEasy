import { useState } from 'react'
import { useUIStore } from '../stores/uiStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import AttendanceStats from '../components/staff/AttendanceStats'
import TodaySummary from '../components/staff/TodaySummary'
import AttendanceTable from '../components/staff/AttendanceTable'
import WeeklyTrend from '../components/staff/WeeklyTrend'
import TimeClock from '../components/staff/TimeClock'
import RecentAlerts from '../components/staff/RecentAlerts'

export default function StaffShiftsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const [activeTab, setActiveTab] = useState<'daily' | 'requests'>('daily')

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

            {/* Right - Time Clock + Alerts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <TimeClock />
              <RecentAlerts />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
