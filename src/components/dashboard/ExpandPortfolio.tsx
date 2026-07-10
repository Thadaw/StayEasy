import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function ExpandPortfolio() {
  const navigate = useNavigate()
  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '2px dashed var(--border)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32, textAlign: 'center', minHeight: 280,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%', background: 'var(--muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}>
        <Home size={24} color="var(--muted-foreground)" />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 4px' }}>Expand Portfolio</h3>
      <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: '0 0 16px', maxWidth: 200 }}>
        You have 2 slots remaining on your current Pro plan.
      </p>
      <button onClick={() => navigate('/host/portal')} style={{
        padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)',
        background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        color: 'var(--foreground)',
      }}>
        Add Property
      </button>
    </div>
  )
}
