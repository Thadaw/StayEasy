import type { CompanyProfile } from '../../types/settings'

interface CompanyProfileFormProps {
  data: CompanyProfile
  onChange: (data: Partial<CompanyProfile>) => void
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

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%236B7280\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10l-5 5z\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 36,
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: '#374151',
  marginBottom: 6,
  display: 'block',
}

export default function CompanyProfileForm({ data, onChange }: CompanyProfileFormProps) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>Company Profile</h2>
        <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0' }}>Update your hotel/restaurant information</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Property / Company Name</label>
          <input
            type="text"
            value={data.propertyName}
            onChange={e => onChange({ propertyName: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Property Type</label>
          <select
            value={data.propertyType}
            onChange={e => onChange({ propertyType: e.target.value })}
            style={selectStyle}
          >
            <option>Hotel</option>
            <option>Resort</option>
            <option>Lodge</option>
            <option>Apartment</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Tagline / Slogan</label>
        <input
          type="text"
          value={data.tagline}
          onChange={e => onChange({ tagline: e.target.value })}
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Phone Number</label>
          <input
            type="tel"
            value={data.phone}
            onChange={e => onChange({ phone: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            value={data.email}
            onChange={e => onChange({ email: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Website</label>
          <input
            type="url"
            value={data.website}
            onChange={e => onChange({ website: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>VAT / PAN Number</label>
          <input
            type="text"
            value={data.vatPan}
            onChange={e => onChange({ vatPan: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Address</label>
        <textarea
          value={data.address}
          onChange={e => onChange({ address: e.target.value })}
          rows={2}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>City</label>
          <input
            type="text"
            value={data.city}
            onChange={e => onChange({ city: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>State / Province</label>
          <input
            type="text"
            value={data.state}
            onChange={e => onChange({ state: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Postal Code</label>
          <input
            type="text"
            value={data.postalCode}
            onChange={e => onChange({ postalCode: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Country</label>
          <select
            value={data.country}
            onChange={e => onChange({ country: e.target.value })}
            style={selectStyle}
          >
            <option>Nepal</option>
            <option>India</option>
            <option>Bhutan</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Currency</label>
          <select
            value={data.currency}
            onChange={e => onChange({ currency: e.target.value })}
            style={selectStyle}
          >
            <option>NPR (Nepalese Rupee)</option>
            <option>INR (Indian Rupee)</option>
            <option>USD (US Dollar)</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Time Zone</label>
          <select
            value={data.timeZone}
            onChange={e => onChange({ timeZone: e.target.value })}
            style={selectStyle}
          >
            <option>(GMT+05:45) Kathmandu</option>
            <option>(GMT+05:30) Mumbai</option>
            <option>(GMT+00:00) London</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>Default Language</label>
          <select
            value={data.language}
            onChange={e => onChange({ language: e.target.value })}
            style={selectStyle}
          >
            <option>English</option>
            <option>Nepali</option>
            <option>Hindi</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Date Format</label>
          <select
            value={data.dateFormat}
            onChange={e => onChange({ dateFormat: e.target.value })}
            style={selectStyle}
          >
            <option>Jun 1, 2026</option>
            <option>01/06/2026</option>
            <option>2026-06-01</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Time Format</label>
          <select
            value={data.timeFormat}
            onChange={e => onChange({ timeFormat: e.target.value })}
            style={selectStyle}
          >
            <option>12 Hours (hh:mm AM/PM)</option>
            <option>24 Hours (HH:mm)</option>
          </select>
        </div>
      </div>
    </div>
  )
}
