import { Calendar, Tag, Gift, TrendingUp, ArrowRight } from 'lucide-react'
import type { PricingOverviewStat } from '../../types/pricing'

interface PricingOverviewStatsProps {
  stats: PricingOverviewStat[]
  onNavigate: (key: string) => void
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Calendar, Tag, Gift, TrendingUp,
}

export default function PricingOverviewStats({ stats, onNavigate }: PricingOverviewStatsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
      {stats.map(stat => {
        const Icon = iconMap[stat.icon] || Calendar
        return (
          <div
            key={stat.id}
            style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: stat.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={20} color={stat.iconColor} />
              </div>
              <div>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0, fontWeight: 500 }}>{stat.label}</p>
                <p style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '2px 0 0', lineHeight: 1.1 }}>{stat.value}</p>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>{stat.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate(stat.linkText)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', padding: 0,
                color: 'var(--primary)', fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {stat.linkText} <ArrowRight size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
