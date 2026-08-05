import { useState } from 'react'
import { useUIStore } from '../stores/uiStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import ActivityStats from '../components/activity/ActivityStats'
import ActivityFilters from '../components/activity/ActivityFilters'
import ActivityTable from '../components/activity/ActivityTable'
import ActivityOverview from '../components/activity/ActivityOverview'
import ActivityRecentByModule from '../components/activity/ActivityRecentByModule'
import ActivityDetails from '../components/activity/ActivityDetails'
import type { ActivityLog, ActivityStat, ActivityModule } from '../types/activity'

const MOCK_STATS: ActivityStat[] = [
  { label: 'Total Activities', value: 1248, trend: '18.6%', trendUp: true, subtitle: 'vs last 7 days', icon: 'ClipboardList', iconBg: '#EDE9FE', iconColor: '#5B21B6' },
  { label: 'User Logins', value: 248, trend: '12.4%', trendUp: true, subtitle: 'vs last 7 days', icon: 'Users', iconBg: '#D1FAE5', iconColor: '#059669' },
  { label: 'Data Changes', value: 654, trend: '21.7%', trendUp: true, subtitle: 'vs last 7 days', icon: 'Pencil', iconBg: '#FEF3C7', iconColor: '#D97706' },
  { label: 'Deletions', value: 32, trend: '5.3%', trendUp: false, subtitle: 'vs last 7 days', icon: 'Trash', iconBg: '#FEE2E2', iconColor: '#DC2626' },
  { label: 'Security Events', value: 14, trend: '12.5%', trendUp: false, subtitle: 'vs last 7 days', icon: 'Shield', iconBg: '#DBEAFE', iconColor: '#2563EB' },
]

const MOCK_ACTIVITIES: ActivityLog[] = [
  {
    id: 1,
    dateTime: 'May 30, 2025 10:30:25 AM',
    user: { name: 'Admin', email: 'admin@stayeasy.com' },
    module: 'Bookings', moduleColor: { bg: '#DBEAFE', text: '#1E40AF' },
    action: 'Created', actionColor: { bg: '#D1FAE5', text: '#065F46' },
    description: 'New booking created for John Smith (BK-1254)',
    descriptionLink: 'John Smith (BK-1254)',
    ipAddress: '192.168.1.10', status: 'Success',
  },
  {
    id: 2,
    dateTime: 'May 30, 2025 10:15:42 AM',
    user: { name: 'Sita Sharma', email: 'sita@stayeasy.com' },
    module: 'Guests', moduleColor: { bg: '#D1FAE5', text: '#065F46' },
    action: 'Updated', actionColor: { bg: '#DBEAFE', text: '#1E40AF' },
    description: 'Updated guest information for Rahul Verma (G-1023)',
    descriptionLink: 'Rahul Verma (G-1023)',
    ipAddress: '192.168.1.15', status: 'Success',
  },
  {
    id: 3,
    dateTime: 'May 30, 2025 09:58:11 AM',
    user: { name: 'Ramesh Thapa', email: 'ramesh@stayeasy.com' },
    module: 'Rooms', moduleColor: { bg: '#FEF3C7', text: '#92400E' },
    action: 'Updated', actionColor: { bg: '#DBEAFE', text: '#1E40AF' },
    description: 'Room 205 details updated (Type: Deluxe)',
    ipAddress: '192.168.1.18', status: 'Success',
  },
  {
    id: 4,
    dateTime: 'May 30, 2025 09:30:05 AM',
    user: { name: 'Maya Gurung', email: 'maya@stayeasy.com' },
    module: 'Housekeeping', moduleColor: { bg: '#FCE7F3', text: '#BE185D' },
    action: 'Completed', actionColor: { bg: '#D1FAE5', text: '#065F46' },
    description: 'Housekeeping task completed for Room 305',
    ipAddress: '192.168.1.22', status: 'Success',
  },
  {
    id: 5,
    dateTime: 'May 30, 2025 09:12:47 AM',
    user: { name: 'Admin', email: 'admin@stayeasy.com' },
    module: 'Pricing', moduleColor: { bg: '#EDE9FE', text: '#5B21B6' },
    action: 'Created', actionColor: { bg: '#D1FAE5', text: '#065F46' },
    description: 'Seasonal pricing added (Summer Promotion)',
    descriptionLink: 'Summer Promotion',
    ipAddress: '192.168.1.10', status: 'Success',
  },
  {
    id: 6,
    dateTime: 'May 30, 2025 08:45:33 AM',
    user: { name: 'Anita Karki', email: 'anita@stayeasy.com' },
    module: 'Payments', moduleColor: { bg: '#D1FAE5', text: '#065F46' },
    action: 'Updated', actionColor: { bg: '#DBEAFE', text: '#1E40AF' },
    description: 'Payment status updated for Booking BK-1248',
    descriptionLink: 'Booking BK-1248',
    ipAddress: '192.168.1.16', status: 'Success',
  },
  {
    id: 7,
    dateTime: 'May 30, 2025 08:20:18 AM',
    user: { name: 'System', email: 'system@stayeasy.com' },
    module: 'System', moduleColor: { bg: '#F3F4F6', text: '#374151' },
    action: 'Login', actionColor: { bg: '#DBEAFE', text: '#1E40AF' },
    description: 'User logged in to the system',
    ipAddress: '192.168.1.10', status: 'Success',
  },
  {
    id: 8,
    dateTime: 'May 30, 2025 07:55:02 AM',
    user: { name: 'John Doe', email: 'john@stayeasy.com' },
    module: 'Guests', moduleColor: { bg: '#D1FAE5', text: '#065F46' },
    action: 'Deleted', actionColor: { bg: '#FEE2E2', text: '#991B1B' },
    description: 'Guest record deleted (Guest ID: G-0998)',
    descriptionLink: 'Guest ID: G-0998',
    ipAddress: '192.168.1.25', status: 'Warning',
  },
  {
    id: 9,
    dateTime: 'May 30, 2025 07:30:44 AM',
    user: { name: 'Pooja Lama', email: 'pooja@stayeasy.com' },
    module: 'Users', moduleColor: { bg: '#DBEAFE', text: '#1E40AF' },
    action: 'Login Failed', actionColor: { bg: '#FEE2E2', text: '#991B1B' },
    description: 'Failed login attempt',
    ipAddress: '192.168.1.30', status: 'Failed',
  },
  {
    id: 10,
    dateTime: 'May 30, 2025 07:10:31 AM',
    user: { name: 'Admin', email: 'admin@stayeasy.com' },
    module: 'Settings', moduleColor: { bg: '#F3F4F6', text: '#374151' },
    action: 'Updated', actionColor: { bg: '#DBEAFE', text: '#1E40AF' },
    description: 'General settings updated',
    ipAddress: '192.168.1.10', status: 'Success',
  },
]

const MOCK_MODULES: ActivityModule[] = [
  { name: 'Bookings', count: 320, icon: 'Calendar', color: '#2563EB' },
  { name: 'Guests', count: 268, icon: 'Users', color: '#059669' },
  { name: 'Rooms', count: 187, icon: 'Bed', color: '#D97706' },
  { name: 'Payments', count: 156, icon: 'CreditCard', color: '#059669' },
  { name: 'Housekeeping', count: 98, icon: 'Sparkles', color: '#DB2777' },
]

const OVERVIEW_BREAKDOWN = [
  { label: 'Logins', count: 248, percentage: '19.9', color: '#2563EB' },
  { label: 'Data Changes', count: 654, percentage: '52.6', color: '#059669' },
  { label: 'Creations', count: 210, percentage: '16.8', color: '#F59E0B' },
  { label: 'Deletions', count: 32, percentage: '2.6', color: '#EF4444' },
  { label: 'Others', count: 104, percentage: '8.1', color: '#9CA3AF' },
]

export default function ActivityLogsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null)
  const [search, setSearch] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Activity Logs" subtitle="Track all important activities and changes made in the system." />
        <main style={{ display: 'flex', flex: 1, overflow: 'hidden', gap: 0 }}>
          {/* Main Content */}
          <div style={{ flex: 1, padding: 24, overflow: 'auto', minWidth: 0 }}>
            <ActivityStats stats={MOCK_STATS} />

            <ActivityFilters
              search={search} onSearchChange={setSearch}
              userFilter={userFilter} onUserFilterChange={setUserFilter}
              moduleFilter={moduleFilter} onModuleFilterChange={setModuleFilter}
              actionFilter={actionFilter} onActionFilterChange={setActionFilter}
              statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
            />

            <ActivityTable
              activities={MOCK_ACTIVITIES}
              onSelectActivity={setSelectedActivity}
              selectedActivity={selectedActivity}
            />
          </div>

          {/* Right Sidebar */}
          <div style={{ width: 320, flexShrink: 0, padding: '24px 24px 24px 0', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
            <ActivityOverview total={1248} breakdown={OVERVIEW_BREAKDOWN} />
            <ActivityRecentByModule modules={MOCK_MODULES} />
            <ActivityDetails activity={selectedActivity} />
          </div>
        </main>
      </div>
    </div>
  )
}
