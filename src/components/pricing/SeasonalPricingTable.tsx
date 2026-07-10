import { Pencil, MoreVertical, Plus } from 'lucide-react'
import type { SeasonalPricing } from '../../types/pricing'

interface SeasonalPricingTableProps {
  seasons: SeasonalPricing[]
  onAddSeason: () => void
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#D1FAE5', text: '#065F46' },
  Scheduled: { bg: '#DBEAFE', text: '#1E40AF' },
  Expired: { bg: '#F3F4F6', text: '#6B7280' },
}

export default function SeasonalPricingTable({ seasons, onAddSeason }: SeasonalPricingTableProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        flex: '1 1 0',
      }}
    >
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Seasonal Pricing</h3>
          <button
            onClick={onAddSeason}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', border: 'none', borderRadius: 8,
              background: '#7C3AED', fontSize: 13, fontWeight: 600,
              color: '#fff', cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            Add Season
          </button>
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Set custom rates for different seasons and dates</p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
            {['SEASON NAME', 'DATE RANGE', 'APPLIES TO', 'RATE ADJUSTMENT', 'STATUS', 'ACTIONS'].map(col => (
              <th
                key={col}
                style={{
                  padding: '12px 16px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em',
                  textAlign: col === 'ACTIONS' ? 'center' : 'left',
                  whiteSpace: 'nowrap',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {seasons.map(season => {
            const sc = statusColors[season.status] || { bg: '#F3F4F6', text: '#374151' }
            const isPositive = season.rateAdjustment.startsWith('+')
            return (
              <tr key={season.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{season.emoji}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{season.seasonName}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>
                  {season.dateRange}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>
                  {season.appliesTo}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: isPositive ? '#16A34A' : '#DC2626' }}>
                    {season.rateAdjustment}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      padding: '3px 8px', borderRadius: 6, fontSize: 12,
                      fontWeight: 600, background: sc.bg, color: sc.text,
                    }}
                  >
                    {season.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <button
                      style={{ width: 28, height: 28, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      style={{ width: 28, height: 28, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6' }}>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Showing 1 to {seasons.length} of {seasons.length} seasons</p>
      </div>
    </div>
  )
}
