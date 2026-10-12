import toast from 'react-hot-toast'
import { RefreshCw } from 'lucide-react'

const rows: Array<{ label: string; value: string }> = [
  { label: 'App Version', value: 'v2.4.1' },
  { label: 'Environment', value: 'Production' },
  { label: 'Last Updated', value: 'Apr 30, 2025' },
  { label: 'Server Region', value: 'Asia · Kathmandu' },
  { label: 'Support Email', value: 'support@serveiq.com' },
]

const health: Array<{ label: string; status: string }> = [
  { label: 'Database', status: 'Operational' },
  { label: 'API', status: 'Healthy' },
  { label: 'CDN', status: 'Operational' },
]

export default function SystemInformationTab() {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>System Information</h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
            Application version and environment details
          </p>
        </div>
        <button
          onClick={() => toast.success("You're on the latest version (v2.4.1)")}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: '#fff',
            color: '#374151',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <RefreshCw size={14} />
          Check for Updates
        </button>
      </div>

      <div className="s-card">
        <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>System Information</span>

        <div style={{ marginTop: 8 }}>
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
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', textAlign: 'right' }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="s-card" style={{ marginTop: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Service Health</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
          {health.map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                background: '#f8f9fb',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#16a34a',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontSize: 13, color: '#374151' }}>{item.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
