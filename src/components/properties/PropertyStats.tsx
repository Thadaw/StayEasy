import { Building2, BedDouble, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import type { PropertyStats as PropertyStatsType } from '../../types/properties'

interface PropertyStatsProps {
  stats: PropertyStatsType
}

const statCards = (stats: PropertyStatsType) => [
  {
    label: 'Total Properties',
    value: stats.totalProperties,
    subtitle: 'All Properties',
    icon: Building2,
    bg: '#F3E8FF',
    color: 'var(--primary)',
  },
  {
    label: 'Total Rooms',
    value: stats.totalRooms,
    subtitle: 'All Rooms',
    icon: BedDouble,
    bg: '#DCFCE7',
    color: '#16A34A',
  },
  {
    label: 'Total Bookings',
    value: stats.totalBookings.toLocaleString(),
    subtitle: 'This Month',
    icon: Calendar,
    bg: '#DBEAFE',
    color: '#2563EB',
  },
  {
    label: 'Revenue (This Month)',
    value: `NPR ${stats.revenue.toLocaleString()}`,
    subtitle: null,
    growth: stats.revenueGrowth,
    icon: DollarSign,
    bg: '#FEF3C7',
    color: '#D97706',
  },
  {
    label: 'Occupancy Rate',
    value: `${stats.occupancyRate}%`,
    subtitle: null,
    growth: stats.occupancyGrowth,
    icon: TrendingUp,
    bg: '#DCFCE7',
    color: '#16A34A',
  },
]

export default function PropertyStats({ stats }: PropertyStatsProps) {
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
            <p style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '2px 0 0', lineHeight: 1.1 }}>{card.value}</p>
            {card.growth !== undefined ? (
              <p style={{ fontSize: 11, color: '#16A34A', margin: '2px 0 0', fontWeight: 600 }}>
                <TrendingUp size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />
                +{card.growth}% vs May 1 – May 31, 2026
              </p>
            ) : (
              <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>{card.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
