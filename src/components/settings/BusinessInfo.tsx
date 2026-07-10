import type { BusinessInfo as BusinessInfoType } from '../../types/settings'

interface BusinessInfoProps {
  data: BusinessInfoType
  onChange: (data: Partial<BusinessInfoType>) => void
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

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: '#374151',
  marginBottom: 6,
  display: 'block',
}

export default function BusinessInfo({ data, onChange }: BusinessInfoProps) {
  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Business Information</h3>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Business Registration Number</label>
        <input
          type="text"
          value={data.registrationNumber}
          onChange={e => onChange({ registrationNumber: e.target.value })}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>License Number</label>
        <input
          type="text"
          value={data.licenseNumber}
          onChange={e => onChange({ licenseNumber: e.target.value })}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Established Year</label>
        <input
          type="text"
          value={data.establishedYear}
          onChange={e => onChange({ establishedYear: e.target.value })}
          style={inputStyle}
        />
      </div>
    </div>
  )
}
