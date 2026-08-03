import { Wallet, CalendarCheck, Clock, XCircle, TrendingUp } from 'lucide-react'
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
    { icon: CalendarCheck, label: 'Total Bookings', value: String(total), change: `${total} on record`, positive: true },
    { icon: Wallet, label: 'Confirmed', value: String(confirmed), change: `${pct(confirmed)} of total`, positive: true },
    { icon: Clock, label: 'Pending', value: String(pending), change: `${pct(pending)} of total`, positive: false },
    { icon: XCircle, label: 'Cancelled', value: String(cancelled), change: `${pct(cancelled)} of total`, positive: false },
    { icon: TrendingUp, label: 'Total Revenue', value: `NPR ${revenue.toLocaleString()}`, change: 'non-cancelled bookings', positive: true },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 20 }}>
      {stats.map((s) => (
        <div key={s.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{s.label}</div>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={18} color="var(--primary)" />
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{s.value}</div>
          <div style={{ fontSize: 12, color: s.positive ? 'var(--status-success)' : 'var(--destructive)' }}>
            {s.positive ? '\u2197' : '\u2198'} {s.change}
          </div>
        </div>
      ))}
    </div>
  )
}
