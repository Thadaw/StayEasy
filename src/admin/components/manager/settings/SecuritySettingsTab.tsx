import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  color: '#6b7280',
  marginBottom: 6,
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <label style={fieldLabel}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 40px 10px 12px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: '#fff',
            fontSize: 13,
            color: '#374151',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="button"
          title={visible ? 'Hide' : 'Show'}
          onClick={() => setVisible((v) => !v)}
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            border: 'none',
            background: 'transparent',
            color: '#9ca3af',
            cursor: 'pointer',
            display: 'inline-flex',
            padding: 4,
          }}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '9px 0',
        borderBottom: '1px solid #f3f4f6',
      }}
    >
      <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

export default function SecuritySettingsTab() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

  const changePassword = () => {
    if (!current || !next || !confirm) {
      toast.error('Please fill in all password fields')
      return
    }
    if (next !== confirm) {
      toast.error('New passwords do not match')
      return
    }
    toast.success('Password changed successfully')
    setCurrent('')
    setNext('')
    setConfirm('')
  }

  return (
    <div>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Security</h3>
      <p style={{ margin: '4px 0 16px', fontSize: 13, color: '#6b7280' }}>
        Protect your account and review recent access activity
      </p>

      <div className="s-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480 }}>
          <PasswordField label="Current Password" value={current} onChange={setCurrent} />
          <PasswordField label="New Password" value={next} onChange={setNext} />
          <PasswordField label="Confirm Password" value={confirm} onChange={setConfirm} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button
            onClick={changePassword}
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
            Change Password
          </button>
        </div>
      </div>

      <div className="s-two-col">
        <div className="s-card">
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
            Two-Factor Authentication
          </div>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: '#6b7280' }}>
            Extra security for your manager account.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
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
              Enabled
            </span>
          </div>
        </div>

        <div className="s-card">
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 10 }}>
            Last Login Activity
          </div>
          <InfoRow label="Date & Time" value="Apr 28, 2025 · 09:42 AM" />
          <InfoRow label="Device" value="Chrome · Windows 11" />
          <InfoRow label="Location" value="Pokhara, Nepal" />
        </div>
      </div>
    </div>
  )
}
