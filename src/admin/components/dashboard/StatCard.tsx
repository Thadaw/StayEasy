import { useNavigate } from 'react-router-dom'

interface StatCardProps {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string
  change: string
  changeLabel?: string
  positive: boolean
  path?: string
}

export default function StatCard({ icon, iconBg, label, value, change, changeLabel, positive, path }: StatCardProps) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => path && navigate(path)}
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        padding: 20,
        cursor: path ? 'pointer' : 'default',
        transition: 'box-shadow 0.15s, transform 0.15s',
      }}
      onMouseEnter={(e) => {
        if (path) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{label}</div>
        </div>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 2,
          padding: '2px 6px',
          borderRadius: 4,
          background: positive ? '#dcfce7' : '#fee2e2',
          color: positive ? '#16a34a' : '#dc2626',
          fontWeight: 600,
        }}>
          {positive ? '↗' : '↘'} {change}
        </span>
        {changeLabel && (
          <span style={{ color: '#9ca3af' }}>{changeLabel}</span>
        )}
      </div>
    </div>
  )
}
