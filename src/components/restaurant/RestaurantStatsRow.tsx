import { ShoppingBag, DollarSign, Receipt, Utensils } from 'lucide-react'

const stats = [
  {
    icon: ShoppingBag,
    label: "Today's Orders",
    value: '58',
    change: '18% vs yesterday',
    positive: true,
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
  },
  {
    icon: DollarSign,
    label: "Today's Sales",
    value: 'NPR 85,450',
    change: '22% vs yesterday',
    positive: true,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
  },
  {
    icon: Receipt,
    label: 'Average Order Value',
    value: 'NPR 1,473',
    change: '8% vs yesterday',
    positive: true,
    iconBg: '#fef3c7',
    iconColor: '#d97706',
  },
  {
    icon: Utensils,
    label: 'Active Tables',
    value: '12 / 28',
    change: '42% Occupied',
    positive: true,
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
  },
]

export default function RestaurantStatsRow() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid var(--border)',
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: s.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <s.icon size={20} color={s.iconColor} />
            </div>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{s.label}</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{s.value}</div>
          <div style={{ fontSize: 12, color: s.positive ? 'var(--status-success)' : 'var(--destructive)', display: 'flex', alignItems: 'center', gap: 4 }}>
            {s.positive ? '↗' : '↘'} {s.change}
          </div>
        </div>
      ))}
    </div>
  )
}
