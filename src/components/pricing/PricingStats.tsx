import { Tag, Calendar, DollarSign, TrendingUp, Plus } from 'lucide-react'
import type { PricingStats as PricingStatsType } from '../../types/pricing'

interface PricingStatsProps {
  stats: PricingStatsType
  onAddDiscount: () => void
}

const statCards = (stats: PricingStatsType) => [
  {
    label: 'Active Discounts',
    value: stats.activeDiscounts,
    subtitle: 'Currently running',
    icon: Tag,
    bg: '#F3E8FF',
    color: '#7C3AED',
  },
  {
    label: 'Seasonal Prices',
    value: stats.seasonalPrices,
    subtitle: 'Active periods',
    icon: Calendar,
    bg: '#DCFCE7',
    color: '#16A34A',
  },
  {
    label: 'Best Available Rate',
    value: `NPR ${stats.bestRate.toLocaleString()}`,
    subtitle: 'Average rate',
    icon: DollarSign,
    bg: '#DBEAFE',
    color: '#2563EB',
  },
  {
    label: 'Revenue Impact',
    value: `+${stats.revenueImpact}%`,
    subtitle: 'vs last month',
    icon: TrendingUp,
    bg: '#FEF3C7',
    color: '#D97706',
  },
]

export default function PricingStats({ stats, onAddDiscount }: PricingStatsProps) {
  const cards = statCards(stats)

  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'stretch' }}>
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
            flex: '1 1 0',
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
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>{card.subtitle}</p>
          </div>
        </div>
      ))}
      <button
        onClick={onAddDiscount}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '16px 28px',
          border: 'none',
          borderRadius: 12,
          background: '#7C3AED',
          fontSize: 15,
          fontWeight: 600,
          color: '#fff',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          minWidth: 180,
          justifyContent: 'center',
        }}
      >
        <Plus size={20} />
        Add Discount
      </button>
    </div>
  )
}
