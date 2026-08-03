import { Users, UserCheck, Clock, UserX, Building2 } from 'lucide-react'
import type { StaffStats as StaffStatsType } from '../../types/staff'

interface StaffStatsProps {
  stats: StaffStatsType
}

const statCards = (stats: StaffStatsType) => [
  {
    label: 'Total Staff',
    value: stats.total,
    subtitle: 'All Employees',
    icon: Users,
    bg: '#F3E8FF',
    color: 'var(--primary)',
  },
  {
    label: 'Active Staff',
    value: stats.active,
    subtitle: `${stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% of total`,
    icon: UserCheck,
    bg: '#DCFCE7',
    color: '#16A34A',
  },
  {
    label: 'On Leave',
    value: stats.onLeave,
    subtitle: `${stats.total > 0 ? ((stats.onLeave / stats.total) * 100).toFixed(1) : 0}% of total`,
    icon: Clock,
    bg: '#FEF3C7',
    color: '#D97706',
  },
  {
    label: 'Inactive',
    value: stats.inactive,
    subtitle: `${stats.total > 0 ? ((stats.inactive / stats.total) * 100).toFixed(1) : 0}% of total`,
    icon: UserX,
    bg: '#FEE2E2',
    color: '#DC2626',
  },
  {
    label: 'Departments',
    value: stats.departments,
    subtitle: 'All Departments',
    icon: Building2,
    bg: '#DBEAFE',
    color: '#2563EB',
  },
]

export default function StaffStats({ stats }: StaffStatsProps) {
  const cards = statCards(stats)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
      {cards.map(card => (
        <div
          key={card.label}
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: '20px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            border: '1px solid #E5E7EB',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: card.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <card.icon size={22} color={card.color} />
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0, fontWeight: 500 }}>{card.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#111827', margin: '2px 0 0', lineHeight: 1.1 }}>{card.value}</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
