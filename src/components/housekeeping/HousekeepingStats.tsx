import { BedDouble, Sparkles, Droplets, Loader, Wrench } from 'lucide-react'
import type { RoomStats } from '../../types/housekeeping'

interface HousekeepingStatsProps {
  stats: RoomStats
  activeFilter: string
  onFilterChange: (status: string) => void
}

const statCards = (stats: RoomStats) => [
  {
    label: 'Total Rooms',
    value: stats.total,
    subtitle: 'Inventory',
    icon: BedDouble,
    bg: '#EFF6FF',
    color: '#2563EB',
    filterValue: '',
  },
  {
    label: 'Clean Rooms',
    value: stats.clean,
    subtitle: 'Ready',
    icon: Sparkles,
    bg: '#DCFCE7',
    color: '#16A34A',
    filterValue: 'Clean',
  },
  {
    label: 'Dirty Rooms',
    value: stats.dirty,
    subtitle: 'Needs Attention',
    icon: Droplets,
    bg: '#FEE2E2',
    color: '#DC2626',
    filterValue: 'Dirty',
  },
  {
    label: 'In Progress',
    value: stats.inProgress,
    subtitle: 'Cleaning now',
    icon: Loader,
    bg: '#FEF3C7',
    color: '#D97706',
    filterValue: 'In Progress',
  },
  {
    label: 'Maintenance',
    value: stats.outOfService,
    subtitle: stats.total > 0 ? `${((stats.outOfService / stats.total) * 100).toFixed(1)}% of total` : '0% of total',
    icon: Wrench,
    bg: '#F0F9FF',
    color: '#2563EB',
    filterValue: 'Out of Service',
  },
]

export default function HousekeepingStats({ stats, activeFilter, onFilterChange }: HousekeepingStatsProps) {
  const cards = statCards(stats)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
      {cards.map(card => {
        const isActive = activeFilter === card.filterValue
        return (
          <div
            key={card.label}
            onClick={() => onFilterChange(card.filterValue)}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '20px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              border: isActive ? '2px solid #2563EB' : '1px solid #E5E7EB',
              cursor: 'pointer',
              transition: 'border 0.15s, box-shadow 0.15s',
              boxShadow: isActive ? '0 0 0 1px #2563EB' : 'none',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = '#93C5FD' }}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none' } }}
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
        )
      })}
    </div>
  )
}
