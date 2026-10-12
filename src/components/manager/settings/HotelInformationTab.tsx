import { Eye } from 'lucide-react'
import toast from 'react-hot-toast'

const rows: Array<{ label: string; value: string }> = [
  { label: 'Hotel Name', value: 'ServeIQ Grand Hotel' },
  { label: 'Address', value: 'Kathmandu, Nepal' },
  { label: 'Contact', value: '+977-01-XXXXXXX' },
  { label: 'Email', value: 'info@serveiq.com' },
  { label: 'License ID', value: 'SNQ-2025-001' },
]

export default function HotelInformationTab() {
  return (
    <div>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Hotel Information</h3>
      <p style={{ margin: '4px 0 16px', fontSize: 13, color: '#6b7280' }}>View key details about your hotel</p>

      <div className="s-card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Hotel Information</span>
          <button
            onClick={() => toast('Hotel information is view-only for the Manager role', { icon: '🔒' })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#374151',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <Eye size={14} />
            View Only
          </button>
        </div>

        <div>
          {rows.map((row) => (
            <div
              key={row.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '13px 0',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <span style={{ fontSize: 13, color: '#6b7280' }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', textAlign: 'right' }}>{row.value}</span>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '13px 0',
            }}
          >
            <span style={{ fontSize: 13, color: '#6b7280' }}>Status</span>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
                background: '#dcfce7',
                color: '#16a34a',
              }}
            >
              Active
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 16,
            padding: '12px 14px',
            borderRadius: 8,
            background: '#eff6ff',
            border: '1px solid #dbeafe',
          }}
        >
          <span style={{ fontSize: 13, color: '#1d4ed8' }}>
            Hotel Information is view-only for the Manager role.
          </span>
        </div>
      </div>
    </div>
  )
}
