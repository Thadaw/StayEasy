import { useState } from 'react'
import toast from 'react-hot-toast'

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  color: '#6b7280',
  marginBottom: 6,
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  background: '#fff',
  fontSize: 13,
  color: '#374151',
  outline: 'none',
  cursor: 'pointer',
  boxSizing: 'border-box',
}

const OPTIONS = {
  language: ['English', 'Nepali', 'Hindi'],
  dateFormat: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
  timeFormat: ['12-Hour (AM/PM)', '24-Hour'],
  theme: ['Light Mode', 'Dark Mode', 'System'],
}

export default function PreferencesSettingsTab() {
  const [language, setLanguage] = useState(OPTIONS.language[0])
  const [dateFormat, setDateFormat] = useState(OPTIONS.dateFormat[0])
  const [timeFormat, setTimeFormat] = useState(OPTIONS.timeFormat[0])
  const [theme, setTheme] = useState(OPTIONS.theme[0])

  const field = (
    label: string,
    value: string,
    options: string[],
    onChange: (v: string) => void,
  ) => (
    <div>
      <label style={fieldLabel}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  )

  return (
    <div>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Preferences</h3>
      <p style={{ margin: '4px 0 16px', fontSize: 13, color: '#6b7280' }}>
        Customize language, appearance, date and time formats
      </p>

      <div className="s-card">
        <div className="s-pref-grid">
          {field('Language', language, OPTIONS.language, setLanguage)}
          {field('Date Format', dateFormat, OPTIONS.dateFormat, setDateFormat)}
          {field('Time Format', timeFormat, OPTIONS.timeFormat, setTimeFormat)}
          {field('Theme', theme, OPTIONS.theme, setTheme)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
          <button
            onClick={() => toast.success('Preferences saved')}
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              border: 'none',
              background: '#111827',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
