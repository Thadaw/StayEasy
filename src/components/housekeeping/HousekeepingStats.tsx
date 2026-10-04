import { BedDouble, Sparkles, Droplets, Loader, Ban } from 'lucide-react'
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
    caption: 'Inventory',
    icon: BedDouble,
    iconBg: '#2563EB',
    pillBg: '#EFF6FF',
    pillColor: '#2563EB',
    filterValue: '',
  },
  {
    label: 'Clean Rooms',
    value: stats.clean,
    caption: 'Ready',
    icon: Sparkles,
    iconBg: '#16A34A',
    pillBg: '#DCFCE7',
    pillColor: '#16A34A',
    filterValue: 'Clean',
  },
  {
    label: 'Dirty Rooms',
    value: stats.dirty,
    caption: 'Needs Attention',
    icon: Droplets,
    iconBg: '#DC2626',
    pillBg: '#FEE2E2',
    pillColor: '#DC2626',
    filterValue: 'Dirty',
  },
  {
    label: 'In Progress',
    value: stats.inProgress,
    caption: 'Cleaning now',
    icon: Loader,
    iconBg: '#F59E0B',
    pillBg: '#FEF3C7',
    pillColor: '#D97706',
    filterValue: 'In Progress',
  },
  {
    label: 'Maintenance',
    value: stats.outOfService,
    caption: stats.total > 0 ? `${((stats.outOfService / stats.total) * 100).toFixed(1)}% of total` : '0% of total',
    icon: Ban,
    iconBg: '#3B82F6',
    pillBg: '#EFF6FF',
    pillColor: '#2563EB',
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
              border: isActive ? '2px solid #2563EB' : '1px solid #E5E7EB',
              padding: 20,
              cursor: 'pointer',
              transition: 'border 0.15s, box-shadow 0.15s',
              boxShadow: isActive ? '0 0 0 1px #2563EB' : 'none',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = '#93C5FD' }}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none' } }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{card.label}</div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: card.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <card.icon size={18} color="#fff" />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{card.value}</div>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: card.pillBg,
                  color: card.pillColor,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {card.caption}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
