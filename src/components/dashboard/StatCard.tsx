import { useNavigate } from 'react-router-dom'

interface StatCardProps {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string
  change: string
  positive: boolean
  path?: string
}

export default function StatCard({ icon, iconBg, label, value, change, positive, path }: StatCardProps) {
  const navigate = useNavigate()
  return (
    <div onClick={() => path && navigate(path)} style={{
      background: '#fff', borderRadius: 12, border: '1px solid var(--border)',
      padding: 20, cursor: path ? 'pointer' : 'default',
      transition: 'box-shadow 0.15s',
    }} onMouseEnter={(e) => { if (path) e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)' }} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>{label}</div>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: positive ? 'var(--status-success)' : 'var(--destructive)' }}>
        {positive ? '\u2197' : '\u2198'} {change}
      </div>
    </div>
  )
}
