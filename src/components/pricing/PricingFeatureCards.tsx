import { Calendar, Tag, Gift, ArrowRight } from 'lucide-react'
import type { PricingFeatureCard } from '../../types/pricing'

interface PricingFeatureCardsProps {
  cards: PricingFeatureCard[]
  onNavigate: (key: string) => void
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Calendar, Tag, Gift,
}

export default function PricingFeatureCards({ cards, onNavigate }: PricingFeatureCardsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
      {cards.map(card => {
        const Icon = iconMap[card.icon] || Calendar
        return (
          <div
            key={card.id}
            style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              padding: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <div style={{
              width: 80, height: 80, borderRadius: 16,
              background: card.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={36} color={card.iconColor} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: card.iconColor, margin: '0 0 6px' }}>{card.title}</h3>
              <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 12px', lineHeight: 1.5 }}>{card.description}</p>
              <button
                onClick={() => onNavigate(card.viewKey)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 8,
                  border: 'none', background: card.buttonColor,
                  color: '#fff', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Manage <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
