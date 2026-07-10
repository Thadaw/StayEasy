import { useNavigate } from 'react-router-dom'
import { ShoppingBag, DollarSign, Receipt, Clock } from 'lucide-react'

const stats = [
  { icon: ShoppingBag, label: 'Total Orders', value: '128', change: '\u2197 14.6%', positive: true },
  { icon: DollarSign, label: 'Total Sales', value: 'NPR 78,450', change: '\u2197 12.3%', positive: true },
  { icon: Receipt, label: 'Average Order Value', value: 'NPR 613', change: '\u2197 8.7%', positive: true },
  { icon: Clock, label: 'Pending Orders', value: '12', change: '\u2197 2', positive: false },
]

export default function RestaurantOverview() {
  const navigate = useNavigate()
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20, width: 280, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Restaurant Overview <span style={{ fontWeight: 400, color: 'var(--muted-foreground)', fontSize: 13 }}>(Today)</span></h3>
        <button onClick={() => navigate('/host/restaurant')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>View All</button>
      </div>
      {stats.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < stats.length - 1 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <s.icon size={16} color="var(--primary)" />
          </div>
          <div style={{ flex: 1, fontSize: 13 }}>{s.label}</div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{s.value}</div>
          <div style={{ fontSize: 11, color: s.positive ? 'var(--status-success)' : 'var(--destructive)' }}>{s.change}</div>
        </div>
      ))}
    </div>
  )
}
