import { BedDouble, Sparkles, Droplets, Loader, Ban } from 'lucide-react'
import type { HousekeepingStats as HousekeepingStatsType } from '../../types/housekeeping'

interface HousekeepingStatsProps {
  stats: HousekeepingStatsType
}

const statCards = (stats: HousekeepingStatsType) => [
  {
    label: 'Total Rooms',
    value: stats.total,
    subtitle: 'All Rooms',
    icon: BedDouble,
    bg: '#DBEAFE',
    color: '#2563EB',
  },
  {
    label: 'Clean Rooms',
    value: stats.clean,
    subtitle: `${stats.total > 0 ? ((stats.clean / stats.total) * 100).toFixed(1) : 0}% of total`,
    icon: Sparkles,
    bg: '#DCFCE7',
    color: '#16A34A',
  },
  {
    label: 'Dirty Rooms',
    value: stats.dirty,
    subtitle: `${stats.total > 0 ? ((stats.dirty / stats.total) * 100).toFixed(1) : 0}% of total`,
    icon: Droplets,
    bg: '#FEF3C7',
    color: '#D97706',
  },
  {
    label: 'In Progress',
    value: stats.inProgress,
    subtitle: `${stats.total > 0 ? ((stats.inProgress / stats.total) * 100).toFixed(1) : 0}% of total`,
    icon: Loader,
    bg: '#F3E8FF',
    color: '#7C3AED',
  },
  {
    label: 'Out of Service',
    value: stats.outOfService,
    subtitle: `${stats.total > 0 ? ((stats.outOfService / stats.total) * 100).toFixed(1) : 0}% of total`,
    icon: Ban,
    bg: '#FEE2E2',
    color: '#DC2626',
  },
]

export default function HousekeepingStats({ stats }: HousekeepingStatsProps) {
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
