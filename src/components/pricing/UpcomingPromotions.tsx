import { Calendar, Gift, Sun, Sparkles, ArrowRight } from 'lucide-react'
import type { UpcomingPromotion } from '../../types/pricing'

interface UpcomingPromotionsProps {
  promotions: UpcomingPromotion[]
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Calendar, Gift, Sun, Sparkles,
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Upcoming: { bg: '#DBEAFE', text: '#1E40AF' },
  Active: { bg: '#D1FAE5', text: '#065F46' },
  Expired: { bg: '#F3F4F6', text: '#6B7280' },
}

export default function UpcomingPromotions({ promotions }: UpcomingPromotionsProps) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden', width: 340, flexShrink: 0 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Upcoming Promotions</h3>
        <button style={{
          background: 'none', border: '1px solid #E5E7EB', borderRadius: 8,
          padding: '6px 12px', fontSize: 13, fontWeight: 500,
          color: '#374151', cursor: 'pointer',
        }}>
          View calendar
        </button>
      </div>

      <div style={{ padding: '8px 0' }}>
        {promotions.map((promo, idx) => {
          const Icon = iconMap[promo.icon] || Calendar
          const sc = statusColors[promo.status] || statusColors.Upcoming
          return (
            <div
              key={promo.id}
              style={{
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                borderBottom: idx < promotions.length - 1 ? '1px solid #F3F4F6' : 'none',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: promo.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 2,
              }}>
                <Icon size={18} color={promo.iconColor} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{promo.name}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 6, fontSize: 11,
                    fontWeight: 600, background: sc.bg, color: sc.text, whiteSpace: 'nowrap',
                  }}>
                    {promo.status}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0' }}>{promo.dateRange}</p>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{promo.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>
        <button style={{
          background: 'none', border: 'none', color: 'var(--primary)',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          View all promotions <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
