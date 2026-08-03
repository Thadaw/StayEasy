import { X, Check } from 'lucide-react'
import type { PackageDetail } from '../../types/pricing'

interface PackageDetailPanelProps {
  pkg: PackageDetail
  onClose: () => void
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#D1FAE5', text: '#065F46' },
  Upcoming: { bg: '#DBEAFE', text: '#1E40AF' },
  Expired: { bg: '#F3F4F6', text: '#6B7280' },
}

export default function PackageDetailPanel({ pkg, onClose }: PackageDetailPanelProps) {
  const sc = statusColors[pkg.status] || statusColors.Active

  const details = [
    { label: 'Type', value: pkg.type },
    { label: 'Applicable To', value: pkg.applicableTo },
    { label: 'Price', value: `NPR ${pkg.price.toLocaleString()}`, bold: true },
    { label: 'Validity', value: pkg.validity },
    { label: 'Minimum Stay', value: pkg.minimumStay },
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
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Package Details</h3>
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
        {/* Image */}
        <div style={{ width: '100%', height: 160, borderRadius: 10, overflow: 'hidden', marginBottom: 16, background: '#F3F4F6' }}>
          <img src={pkg.image} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Package header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{pkg.name}</span>
          <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.text }}>
            {pkg.status}
          </span>
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {details.map(d => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 16, textAlign: 'center', fontSize: 12 }}>•</span>
                {d.label}
              </span>
              <span style={{ fontSize: 13, fontWeight: d.bold ? 600 : 500, color: d.bold ? '#111827' : '#374151' }}>
                {d.value}
              </span>
            </div>
          ))}
        </div>

        {/* Inclusions */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: '#6B7280' }}>🎁</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Inclusions</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pkg.inclusions.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={10} color="#059669" />
                </div>
                <span style={{ fontSize: 13, color: '#374151' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{ paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#6B7280' }}>📄</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Description</span>
          </div>
          <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{pkg.description}</p>
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
          ✏️ Edit Package
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
