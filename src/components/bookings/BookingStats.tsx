import { Wallet, CalendarCheck, Clock, XCircle, TrendingUp } from 'lucide-react'

const stats = [
  { icon: CalendarCheck, label: 'Total Bookings', value: '245', change: '15.7% vs May 1 – May 31', positive: true },
  { icon: Wallet, label: 'Confirmed', value: '198', change: '81% of total', positive: true },
  { icon: Clock, label: 'Pending', value: '32', change: '13% of total', positive: false },
  { icon: XCircle, label: 'Cancelled', value: '15', change: '6% of total', positive: false },
  { icon: TrendingUp, label: 'Total Revenue', value: 'NPR 4,53,750', change: '18.6% vs May 1 – May 31', positive: true },
]

export default function BookingStats() {
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
