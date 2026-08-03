import { useNavigate } from 'react-router-dom'

const properties = [
  { name: 'The Heights Residences', location: 'Seattle, WA', occupancy: 92, revenue: '$18,450', growth: '+4.2%', growthUp: true },
  { name: 'Brick Lane Studios', location: 'London, UK', occupancy: 100, revenue: '$9,200', growth: '+2.1%', growthUp: true },
  { name: 'Oakwood Manor', location: 'Portland, OR', occupancy: 0, revenue: '$0', growth: '→ 0.0%', growthUp: false },
]

export default function PortfolioHealth() {
  const navigate = useNavigate()
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Portfolio Health</h3>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
          View Full Report ↗
        </button>
      </div>

      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        <div>Property</div>
        <div style={{ textAlign: 'center' }}>Occupancy</div>
        <div style={{ textAlign: 'right' }}>Monthly Revenue</div>
        <div style={{ textAlign: 'right' }}>Growth</div>
      </div>

      {/* Rows */}
      {properties.map((p, i) => (
        <div
          key={i}
          onClick={() => navigate('/host/my-properties')}
          style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
            padding: '12px 0', borderBottom: i < properties.length - 1 ? '1px solid var(--border)' : 'none',
            cursor: 'pointer', alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{p.location}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${p.occupancy}%`, height: '100%', background: p.occupancy > 80 ? 'var(--status-success)' : p.occupancy > 0 ? 'var(--primary)' : '#ddd', borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, minWidth: 36 }}>{p.occupancy}%</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 600 }}>{p.revenue}</div>
          <div style={{ textAlign: 'right', fontSize: 13, color: p.growthUp ? 'var(--status-success)' : 'var(--muted-foreground)', fontWeight: 500 }}>
            {p.growthUp ? '↗' : '→'} {p.growth}
          </div>
        </div>
      ))}
    </div>
  )
}
