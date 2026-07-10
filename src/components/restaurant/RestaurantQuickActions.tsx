import { useNavigate } from 'react-router-dom'
import { Plus, Table2, ShoppingBag, Truck } from 'lucide-react'

const actions = [
  { icon: Plus, label: 'New Order', color: '#7c3aed', bg: '#ede9fe', path: '/host/restaurant' },
  { icon: Table2, label: 'New Table', color: '#2563eb', bg: '#dbeafe', path: '/host/restaurant/tables' },
  { icon: ShoppingBag, label: 'Takeaway', color: '#d97706', bg: '#fef3c7', path: '/host/restaurant/orders' },
  { icon: Truck, label: 'Delivery', color: '#16a34a', bg: '#dcfce7', path: '/host/restaurant/orders' },
]

export default function RestaurantQuickActions() {
  const navigate = useNavigate()
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 16px' }}>Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {actions.map((a) => (
          <div
            key={a.label}
            onClick={() => navigate(a.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 16,
              border: '1px solid var(--border)',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'box-shadow 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: a.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <a.icon size={20} color={a.color} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{a.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
