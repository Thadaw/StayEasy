import { ChevronRight } from 'lucide-react'

const orders = [
  { id: '#ORD-1058', type: 'Dine In', typeColor: '#7c3aed', typeBg: '#ede9fe', table: 'Table 05', items: 2, customer: '', amount: 'NPR 1,250', time: '10:24 AM' },
  { id: '#ORD-1057', type: 'Takeaway', typeColor: '#d97706', typeBg: '#fef3c7', table: '', items: 3, customer: 'Customer', amount: 'NPR 1,780', time: '10:18 AM' },
  { id: '#ORD-1056', type: 'Delivery', typeColor: '#16a34a', typeBg: '#dcfce7', table: '', items: 4, customer: 'John Doe', amount: 'NPR 2,450', time: '10:15 AM' },
  { id: '#ORD-1055', type: 'Dine In', typeColor: '#7c3aed', typeBg: '#ede9fe', table: 'Table 08', items: 1, customer: '', amount: 'NPR 650', time: '10:10 AM' },
  { id: '#ORD-1054', type: 'Takeaway', typeColor: '#d97706', typeBg: '#fef3c7', table: '', items: 2, customer: 'Walk-in Customer', amount: 'NPR 1,100', time: '10:08 AM' },
]

export default function ActiveOrdersList() {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20, marginTop: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Active Orders</h3>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>View All</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {orders.map((o) => (
          <div
            key={o.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{o.id}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: o.typeBg,
                    color: o.typeColor,
                  }}
                >
                  {o.type}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
                {o.table ? `${o.table} • ` : ''}{o.customer ? `${o.customer} • ` : ''}{o.items} Items
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{o.amount}</div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{o.time}</div>
            </div>
          </div>
        ))}
      </div>

      <button
        style={{
          width: '100%',
          marginTop: 16,
          padding: '10px 0',
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--foreground)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        View All Orders
        <ChevronRight size={14} />
      </button>
    </div>
  )
}
