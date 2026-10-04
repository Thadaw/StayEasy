import { Building2, CalendarCheck, LogOut, Clock } from 'lucide-react'

interface ManagerBookingStatsProps {
  totalBookings: number
  todayArrivals: number
  todayDepartures: number
  pendingConfirmations: number
}

const stats = [
  { key: 'total', label: 'Total Bookings', sublabel: 'All active & upcoming', icon: Building2, iconBg: '#dbeafe', iconColor: '#3b82f6', dotColor: '#3b82f6' },
  { key: 'arrivals', label: "Today's Arrivals", sublabel: '3 already checked in', icon: CalendarCheck, iconBg: '#dcfce7', iconColor: '#10b981', dotColor: '#10b981' },
  { key: 'departures', label: "Today's Departures", sublabel: '5 completed', icon: LogOut, iconBg: '#dbeafe', iconColor: '#3b82f6', dotColor: '#3b82f6' },
  { key: 'pending', label: 'Pending Confirmations', sublabel: 'Needs attention', icon: Clock, iconBg: '#fef3c7', iconColor: '#f59e0b', dotColor: '#f59e0b' },
]

export default function ManagerBookingStats({ totalBookings, todayArrivals, todayDepartures, pendingConfirmations }: ManagerBookingStatsProps) {
  const values: Record<string, number> = {
    total: totalBookings,
    arrivals: todayArrivals,
    departures: todayDepartures,
    pending: pendingConfirmations,
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.key}
            style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: stat.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={22} color={stat.iconColor} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{values[stat.key]}</span>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: stat.dotColor }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{stat.label}</div>
              <div style={{ fontSize: 12, color: stat.key === 'pending' ? '#f59e0b' : '#9ca3af', marginTop: 2 }}>{stat.sublabel}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
