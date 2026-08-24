import { useNavigate } from 'react-router-dom'
import { ShoppingBag, DollarSign, Receipt, Clock } from 'lucide-react'

const stats = [
  { icon: ShoppingBag, label: 'Total Orders', value: '128', change: '14.6%', positive: true },
  { icon: DollarSign, label: 'Total Sales', value: 'NPR 78,450', change: '12.3%', positive: true },
  { icon: Receipt, label: 'Average Order Value', value: 'NPR 613', change: '8.7%', positive: true },
  { icon: Clock, label: 'Pending Orders', value: '12', change: '2', positive: false },
]

export default function RestaurantOverview() {
  const navigate = useNavigate()
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 20, width: 280, flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#111827' }}>
          Restaurant Overview <span style={{ fontWeight: 400, color: '#9ca3af', fontSize: 13 }}>(Today)</span>
        </h3>
        <button
          onClick={() => navigate('/host/restaurant')}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          View All
        </button>
      </div>
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 0',
            borderBottom: i < stats.length - 1 ? '1px solid #f3f4f6' : 'none',
          }}
        >
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <s.icon size={16} color="#2563eb" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{s.value}</div>
          </div>
          <div style={{
            fontSize: 12,
            fontWeight: 600,
            color: s.positive ? '#16a34a' : '#dc2626',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            {s.positive ? '↗' : '↘'} {s.change}
          </div>
        </div>
      ))}
    </div>
  )
}
