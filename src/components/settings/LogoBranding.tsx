import { Trash2 } from 'lucide-react'
import type { LogoBranding } from '../../types/settings'

interface LogoBrandingProps {
  data: LogoBranding
  onChange: (data: Partial<LogoBranding>) => void
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  border: '1px solid #E5E7EB',
  padding: '20px',
  marginBottom: 16,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  fontSize: 14,
  color: '#111827',
  outline: 'none',
  background: '#fff',
  boxSizing: 'border-box' as const,
}

export default function LogoBranding({ data, onChange }: LogoBrandingProps) {
  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Logo & Branding</h3>
      <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px' }}>Upload your property logo and branding details</p>

      <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 8, display: 'block' }}>Logo</label>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 12,
            border: '2px dashed #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F9FAFB',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, color: 'var(--primary)' }}>🪷</div>
            <p style={{ fontSize: 8, color: '#6B7280', margin: '2px 0 0', fontWeight: 600 }}>Hotel Blue Pearl</p>
          </div>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#111827', margin: 0 }}>{data.logoName}</p>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '4px 0 8px' }}>Recommended size: 512x512px</p>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              border: 'none',
              background: 'transparent',
              color: '#DC2626',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <Trash2 size={14} />
            Remove
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6, display: 'block' }}>Primary Color</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: data.primaryColor,
                border: '1px solid #E5E7EB',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            />
            <input
              type="text"
              value={data.primaryColor}
              onChange={e => onChange({ primaryColor: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6, display: 'block' }}>Secondary Color</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: data.secondaryColor,
                border: '1px solid #E5E7EB',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            />
            <input
              type="text"
              value={data.secondaryColor}
              onChange={e => onChange({ secondaryColor: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
