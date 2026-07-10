import type { ContactPerson as ContactPersonType } from '../../types/settings'

interface ContactPersonProps {
  data: ContactPersonType
  onChange: (data: Partial<ContactPersonType>) => void
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  border: '1px solid #E5E7EB',
  padding: '20px',
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

export default function ContactPerson({ data, onChange }: ContactPersonProps) {
  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Contact Person</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            value={data.name}
            onChange={e => onChange({ name: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Designation</label>
          <input
            type="text"
            value={data.designation}
            onChange={e => onChange({ designation: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={labelStyle}>Phone</label>
          <input
            type="tel"
            value={data.phone}
            onChange={e => onChange({ phone: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={data.email}
            onChange={e => onChange({ email: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>
    </div>
  )
}
