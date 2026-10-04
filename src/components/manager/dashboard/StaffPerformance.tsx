import { useNavigate } from 'react-router-dom'

const stats = [
  { label: 'Active Staff', count: 42, percentage: 100, color: '#3b82f6', bg: '#dbeafe' },
  { label: 'On Duty', count: 28, percentage: 67, color: '#10b981', bg: '#dcfce7' },
  { label: 'Pending Tasks', count: 9, percentage: 21, color: '#f59e0b', bg: '#fef3c7' },
]

export default function StaffPerformance() {
  const navigate = useNavigate()
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      padding: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Staff Performance</h3>
        <button
          onClick={() => navigate('/manager/staff')}
          style={{
            fontSize: 13,
            color: '#2563eb',
            fontWeight: 500,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          View All →
        </button>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 10,
              background: stat.bg,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.count}</div>
            <div style={{ fontSize: 12, color: stat.color, fontWeight: 500, marginTop: 4 }}>{stat.label}</div>
            <div style={{
              marginTop: 8,
              height: 6,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.6)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${stat.percentage}%`,
                height: '100%',
                background: stat.color,
                borderRadius: 3,
              }} />
            </div>
            <div style={{ fontSize: 11, color: stat.color, marginTop: 4 }}>{stat.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
