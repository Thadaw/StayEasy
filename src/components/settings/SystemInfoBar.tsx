import { Info } from 'lucide-react'
import type { SystemInfo } from '../../types/settings'

interface SystemInfoBarProps {
  data: SystemInfo
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  border: '1px solid #E5E7EB',
  padding: '20px 24px',
  marginTop: 24,
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#6B7280',
  marginBottom: 4,
  display: 'block',
  fontWeight: 500,
}

const valueStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#111827',
  fontWeight: 600,
}

export default function SystemInfoBar({ data }: SystemInfoBarProps) {
  const items = [
    { label: 'System Version', value: data.systemVersion || '--' },
    { label: 'Last Backup', value: data.lastBackup || '--' },
    { label: 'Next Scheduled Backup', value: data.nextBackup || '--' },
    { label: 'Database Size', value: data.databaseSize || '--' },
    { label: 'Total Users', value: data.totalUsers || '--' },
    { label: 'Total Properties', value: data.totalProperties || '--' },
  ]

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#F5F3FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Info size={16} color="#1A3C5E" />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>
          System Information
        </h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
        {items.map(item => (
          <div key={item.label}>
            <span style={labelStyle}>{item.label}</span>
            <span style={valueStyle}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
