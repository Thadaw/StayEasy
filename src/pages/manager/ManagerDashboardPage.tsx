import { useQuery } from '@tanstack/react-query'
import { useManagerPropertyStore } from '../../stores/managerPropertyStore'
import ManagerLayout from '../../components/manager/ManagerLayout'
import ManagerStatCard from '../../components/manager/dashboard/ManagerStatCard'
import OccupancyChart from '../../components/manager/dashboard/OccupancyChart'
import RevenueChart from '../../components/manager/dashboard/RevenueChart'
import BookingTrendChart from '../../components/manager/dashboard/BookingTrendChart'
import BookingSourceChart from '../../components/manager/dashboard/BookingSourceChart'
import HousekeepingStatus from '../../components/manager/dashboard/HousekeepingStatus'
import StaffPerformance from '../../components/manager/dashboard/StaffPerformance'
import RecentActivities from '../../components/manager/dashboard/RecentActivities'
import GuestFeedback from '../../components/manager/dashboard/GuestFeedback'
import UpcomingReservations from '../../components/manager/dashboard/UpcomingReservations'
import QuickActions from '../../components/manager/dashboard/QuickActions'
import { getAllProperties, getRooms, getPropertyBookings, getStaffList } from '../../services/pmsApi'
import { propertyKeys, roomKeys, bookingKeys, staffKeys } from '../../lib/queryKeys'
import { Building2, Bed, CalendarCheck, Users, LogOut, DollarSign, TrendingUp, Star } from 'lucide-react'

export default function ManagerDashboardPage() {
  const assignedPropertyId = useManagerPropertyStore((s) => s.assignedPropertyId)

  const { data: properties = [] } = useQuery({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })

  const property = properties.find((p) => p.id === assignedPropertyId) ?? properties[0] ?? null
  const effectivePropertyId = property?.id ?? ''

  const { data: rooms = [] } = useQuery({
    queryKey: roomKeys.byProperty(effectivePropertyId),
    queryFn: () => getRooms(effectivePropertyId),
    enabled: !!effectivePropertyId,
  })

  const { data: bookings = [] } = useQuery({
    queryKey: bookingKeys.byProperty(effectivePropertyId),
    queryFn: () => getPropertyBookings(effectivePropertyId),
    enabled: !!effectivePropertyId,
  })

  const { data: staff = [] } = useQuery({
    queryKey: staffKeys.list(effectivePropertyId),
    queryFn: () => getStaffList(effectivePropertyId),
    enabled: !!effectivePropertyId,
  })

  const today = new Date().toISOString().split('T')[0]

  const totalRooms = rooms.length
  const occupiedRooms = rooms.filter((r) => r.status === 'OCCUPIED').length
  const availableRooms = rooms.filter((r) => r.status === 'AVAILABLE').length
  const todayCheckins = bookings.filter((b) => b.checkin_date === today).length
  const todayCheckouts = bookings.filter((b) => b.checkout_date === today).length

  const todayRevenue = bookings
    .filter((b) => b.created_at?.startsWith(today))
    .reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0)

  const monthStart = today.slice(0, 7) + '-01'
  const monthlyRevenue = bookings
    .filter((b) => b.created_at >= monthStart)
    .reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0)

  const activeStaff = staff.filter((s) => s.status === 'ACTIVE').length

  return (
    <ManagerLayout>
      {/* Stat Cards - Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <ManagerStatCard
          icon={<Building2 size={20} color="#3b82f6" />}
          iconBg="#dbeafe"
          label="Total Rooms"
          value={totalRooms}
          change="+2%"
          positive={true}
        />
        <ManagerStatCard
          icon={<Bed size={20} color="#10b981" />}
          iconBg="#dcfce7"
          label="Occupied Rooms"
          value={occupiedRooms}
          change="+12%"
          positive={true}
        />
        <ManagerStatCard
          icon={<Bed size={20} color="#f59e0b" />}
          iconBg="#fef3c7"
          label="Available Rooms"
          value={availableRooms}
          change="-32%"
          positive={false}
        />
        <ManagerStatCard
          icon={<CalendarCheck size={20} color="#8b5cf6" />}
          iconBg="#ede9fe"
          label="Today's Check-ins"
          value={todayCheckins}
          change="+5%"
          positive={true}
        />
      </div>

      {/* Stat Cards - Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <ManagerStatCard
          icon={<LogOut size={20} color="#ef4444" />}
          iconBg="#fee2e2"
          label="Today's Check-outs"
          value={todayCheckouts}
          change="+8%"
          positive={true}
        />
        <ManagerStatCard
          icon={<DollarSign size={20} color="#10b981" />}
          iconBg="#dcfce7"
          label="Revenue Today"
          value={`$${todayRevenue.toLocaleString()}`}
          change="+15%"
          positive={true}
        />
        <ManagerStatCard
          icon={<TrendingUp size={20} color="#3b82f6" />}
          iconBg="#dbeafe"
          label="Monthly Revenue"
          value={`$${monthlyRevenue.toLocaleString()}`}
          change="+8%"
          positive={true}
        />
        <ManagerStatCard
          icon={<Star size={20} color="#f59e0b" />}
          iconBg="#fef3c7"
          label="Customer Satisfaction"
          value="4.8/5"
          change="+0.2"
          positive={true}
        />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, marginBottom: 16 }}>
        <OccupancyChart />
        <RevenueChart />
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <BookingTrendChart />
        <BookingSourceChart />
      </div>

      {/* Status Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <HousekeepingStatus />
        <StaffPerformance />
      </div>

      {/* Recent Activities & Guest Feedback */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <RecentActivities />
        <GuestFeedback />
      </div>

      {/* Upcoming Reservations & Quick Actions */}
      <div style={{ display: 'flex', gap: 16 }}>
        <UpcomingReservations />
        <QuickActions />
      </div>
    </ManagerLayout>
  )
}
