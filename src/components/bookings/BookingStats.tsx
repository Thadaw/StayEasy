import { Wallet, CalendarCheck, Clock, XCircle, TrendingUp } from 'lucide-react'
import StatCard from '../dashboard/StatCard'
import type { Booking } from './BookingTable'

const ACTIVE_STATUSES = ['Confirmed', 'Checked-in', 'Checked-out']

interface BookingStatsProps {
  bookings: Booking[]
}

export default function BookingStats({ bookings }: BookingStatsProps) {
  const total = bookings.length
  const confirmed = bookings.filter((b) => ACTIVE_STATUSES.includes(b.status)).length
  const pending = bookings.filter((b) => b.status === 'Pending').length
  const cancelled = bookings.filter((b) => b.status === 'Cancelled').length
  const revenue = bookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + (parseInt(b.amount.replace(/\D/g, ''), 10) || 0), 0)

  const pct = (n: number) => (total === 0 ? '0%' : `${Math.round((n / total) * 100)}%`)

  const stats = [
    { icon: <CalendarCheck size={18} color="#fff" />, iconBg: 'var(--primary)', label: 'Total Bookings', value: String(total), change: `${total} on record`, positive: true },
    { icon: <Wallet size={18} color="#fff" />, iconBg: '#3B82F6', label: 'Confirmed', value: String(confirmed), change: `${pct(confirmed)} of total`, positive: true },
    { icon: <Clock size={18} color="#fff" />, iconBg: '#F59E0B', label: 'Pending', value: String(pending), change: `${pct(pending)} of total`, positive: false },
    { icon: <XCircle size={18} color="#fff" />, iconBg: '#EF4444', label: 'Cancelled', value: String(cancelled), change: `${pct(cancelled)} of total`, positive: false },
    { icon: <TrendingUp size={18} color="#fff" />, iconBg: '#10B981', label: 'Total Revenue', value: `NPR ${revenue.toLocaleString()}`, change: 'non-cancelled bookings', positive: true },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
      {stats.map((s) => (
        <StatCard
          key={s.label}
          icon={s.icon}
          iconBg={s.iconBg}
          label={s.label}
          value={s.value}
          change={s.change}
          positive={s.positive}
        />
      ))}
    </div>
  )
}
