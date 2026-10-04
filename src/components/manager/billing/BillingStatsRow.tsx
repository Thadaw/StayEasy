import { DollarSign, HandCoins, Clock, AlertTriangle, RotateCcw, Target } from 'lucide-react'

const stats = [
  {
    label: 'Total Revenue',
    value: 'NPR 184.5K',
    sub: '↑ +12.5% vs last month',
    subColor: '#16a34a',
    icon: <DollarSign size={18} />,
    iconColor: '#10b981',
  },
  {
    label: 'Outstanding',
    value: 'NPR 5.42M',
    sub: '4.8% vs last month',
    subColor: '#d97706',
    icon: <HandCoins size={18} />,
    iconColor: '#2563eb',
  },
  {
    label: 'Pending Payments',
    value: 'NPR 174K',
    sub: '23 invoices pending',
    subColor: '#d97706',
    icon: <Clock size={18} />,
    iconColor: '#f59e0b',
  },
  {
    label: 'Overdue',
    value: '142',
    sub: 'NPR 89.5K overdue',
    subColor: '#dc2626',
    icon: <AlertTriangle size={18} />,
    iconColor: '#ef4444',
  },
  {
    label: 'Refunds Issued',
    value: 'NPR 286K',
    sub: '15 refunds processed',
    subColor: '#8b5cf6',
    icon: <RotateCcw size={18} />,
    iconColor: '#8b5cf6',
  },
  {
    label: 'Monthly Target',
    value: 'NPR 386K',
    sub: '↑ +14.2% vs last month',
    subColor: '#16a34a',
    icon: <Target size={18} />,
    iconColor: '#2563eb',
  },
]

export default function BillingStatsRow() {
  return (
    <div className="b-stats">
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: '16px 16px 14px',
            position: 'relative',
            minWidth: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              display: 'flex',
              color: stat.iconColor,
            }}
          >
            {stat.icon}
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#6b7280',
              fontWeight: 500,
              marginBottom: 8,
              paddingRight: 24,
            }}
          >
            {stat.label}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#111827',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: 6,
            }}
          >
            {stat.value}
          </div>
          <div style={{ fontSize: 11, color: stat.subColor, fontWeight: 500 }}>{stat.sub}</div>
        </div>
      ))}
    </div>
  )
}
