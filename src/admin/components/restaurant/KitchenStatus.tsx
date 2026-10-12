import { ChefHat, CheckCircle2 } from 'lucide-react'

export default function KitchenStatus() {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20, marginTop: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Kitchen Status</h3>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>View KOT</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChefHat size={18} color="#d97706" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Preparing</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#d97706' }}>8 Orders</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} color="#16a34a" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Ready</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>3 Orders</span>
        </div>
      </div>
    </div>
  )
}
