import { useState } from 'react'
import toast from 'react-hot-toast'
import { PROFILE_DEFAULTS } from './demoSettings'

const inputStyle = (disabled: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  background: disabled ? '#f9fafb' : '#fff',
  fontSize: 13,
  color: disabled ? '#6b7280' : '#374151',
  outline: 'none',
  boxSizing: 'border-box',
})

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  color: '#6b7280',
  marginBottom: 6,
}

export default function ProfileSettingsTab() {
  const [profile, setProfile] = useState(PROFILE_DEFAULTS)
  const [editable, setEditable] = useState(false)

  const set = (key: keyof typeof PROFILE_DEFAULTS, value: string) =>
    setProfile((prev) => ({ ...prev, [key]: value }))

  const field = (label: string, key: keyof typeof PROFILE_DEFAULTS, type = 'text') => (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={profile[key]}
        disabled={!editable}
        onChange={(e) => set(key, e.target.value)}
        style={inputStyle(!editable)}
      />
    </div>
  )

  return (
    <div className="s-card">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#2563eb',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            AC
          </span>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>{profile.fullName}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
              {profile.position} at ServeIQ Grand Hotel
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setEditable((v) => !v)
            if (editable) setProfile(PROFILE_DEFAULTS)
          }}
          style={{
            padding: '9px 16px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: '#fff',
            color: '#111827',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {editable ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {field('Full Name', 'fullName')}
        {field('Email Address', 'email', 'email')}
        {field('Phone Number', 'phone', 'tel')}
        {field('Position', 'position')}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
        <button
          disabled={!editable}
          onClick={() => {
            toast.success('Profile changes saved')
            setEditable(false)
          }}
          style={{
            padding: '10px 22px',
            borderRadius: 8,
            border: 'none',
            background: editable ? '#111827' : '#d1d5db',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: editable ? 'pointer' : 'not-allowed',
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
