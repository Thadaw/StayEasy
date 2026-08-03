import { X, Tag } from 'lucide-react'
import type { OfferDetail } from '../../types/pricing'

interface DiscountDetailPanelProps {
  offer: OfferDetail
  onClose: () => void
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#D1FAE5', text: '#065F46' },
  Upcoming: { bg: '#DBEAFE', text: '#1E40AF' },
  Expired: { bg: '#F3F4F6', text: '#6B7280' },
}

export default function DiscountDetailPanel({ offer, onClose }: DiscountDetailPanelProps) {
  const sc = statusColors[offer.status] || statusColors.Active

  const details = [
    { label: 'Offer Code', value: offer.code, mono: true },
    { label: 'Offer Type', value: offer.type },
    { label: 'Discount', value: offer.discount, highlight: true },
    { label: 'Applicable To', value: offer.applicableTo },
    { label: 'Minimum Stay', value: offer.minimumStay },
    { label: 'Maximum Discount', value: offer.maximumDiscount },
    { label: 'Validity Period', value: offer.validityPeriod },
    { label: 'Usage Limit', value: offer.usageLimit },
    { label: 'Used', value: offer.used },
  ]

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 380,
      background: '#fff', boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
      zIndex: 1000, display: 'flex', flexDirection: 'column',
      borderLeft: '1px solid #E5E7EB',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0, borderLeft: '3px solid var(--primary)', paddingLeft: 10 }}>Offer Details</h3>
        <button onClick={onClose} style={{
          width: 32, height: 32, borderRadius: 6, border: '1px solid #E5E7EB',
          background: '#fff', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: '#6B7280',
        }}>
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        {/* Offer header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: '#D1FAE5', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Tag size={20} color="#059669" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{offer.name}</span>
              <span style={{
                padding: '2px 8px', borderRadius: 6, fontSize: 11,
                fontWeight: 600, background: sc.bg, color: sc.text,
              }}>
                {offer.status}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {details.map(d => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 16, textAlign: 'center', fontSize: 12 }}>•</span>
                {d.label}
              </span>
              <span style={{
                fontSize: 13, fontWeight: d.highlight ? 600 : 500,
                color: d.highlight ? '#059669' : d.mono ? 'var(--primary)' : '#111827',
                fontFamily: d.mono ? 'monospace' : 'inherit',
              }}>
                {d.value}
              </span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#6B7280' }}>📄</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Description</span>
          </div>
          <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{offer.description}</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: 10 }}>
        <button style={{
          flex: 1, padding: '10px 16px', borderRadius: 8,
          border: '1px solid var(--primary)', background: '#fff',
          color: 'var(--primary)', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          ✏️ Edit Offer
        </button>
        <button style={{
          flex: 1, padding: '10px 16px', borderRadius: 8,
          border: '1px solid #DC2626', background: '#fff',
          color: '#DC2626', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          ⏻ Deactivate
        </button>
      </div>
    </div>
  )
}
