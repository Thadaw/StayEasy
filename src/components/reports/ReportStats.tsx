import { TrendingUp, TrendingDown } from 'lucide-react'
import type { ReportStats as ReportStatsType } from '../../types/reports'

interface ReportStatsProps {
  stats: ReportStatsType
}

const statCards = (stats: ReportStatsType) => [
  {
    label: 'Total Revenue',
    value: `NPR ${stats.totalRevenue.toLocaleString()}`,
    growth: stats.revenueGrowth,
    icon: '📊',
    bg: '#DCFCE7',
    color: '#16A34A',
  },
  {
    label: 'Room Revenue',
    value: `NPR ${stats.roomRevenue.toLocaleString()}`,
    growth: stats.roomRevenueGrowth,
    icon: '🛏️',
    bg: '#DBEAFE',
    color: '#2563EB',
  },
  {
    label: 'F&B Revenue',
    value: `NPR ${stats.fbRevenue.toLocaleString()}`,
    growth: stats.fbRevenueGrowth,
    icon: '🍽️',
    bg: '#FEF3C7',
    color: '#D97706',
  },
  {
    label: 'Total Bookings',
    value: stats.totalBookings.toString(),
    growth: stats.bookingsGrowth,
    icon: '📋',
    bg: '#DBEAFE',
    color: '#2563EB',
  },
  {
    label: 'Average Daily Rate',
    value: `NPR ${stats.avgDailyRate.toLocaleString()}`,
    growth: stats.adrGrowth,
    icon: '💰',
    bg: '#F3E8FF',
    color: 'var(--primary)',
  },
  {
    label: 'Occupancy Rate',
    value: `${stats.occupancyRate}%`,
    growth: stats.occupancyGrowth,
    icon: '📈',
    bg: '#DCFCE7',
    color: '#16A34A',
  },
]

export default function ReportStats({ stats }: ReportStatsProps) {
  const cards = statCards(stats)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, marginBottom: 24 }}>
      {cards.map(card => (
        <div
          key={card.label}
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: '16px 14px',
            border: '1px solid #E5E7EB',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: card.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}
            >
              {card.icon}
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#6B7280', margin: 0, fontWeight: 500 }}>{card.label}</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '4px 0 6px', lineHeight: 1.1 }}>{card.value}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {card.growth >= 0 ? (
              <TrendingUp size={12} color="#16A34A" />
            ) : (
              <TrendingDown size={12} color="#DC2626" />
            )}
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: card.growth >= 0 ? '#16A34A' : '#DC2626',
              }}
            >
              {card.growth >= 0 ? '+' : ''}{card.growth}%
            </span>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>vs May 1 – May 31, 2026</span>
          </div>
        </div>
      ))}
    </div>
  )
}
