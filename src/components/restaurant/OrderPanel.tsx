import { Trash2, Minus, Plus, X } from 'lucide-react'

export interface OrderItem {
  item: { id: string; name: string; price: number; image: string }
  qty: number
}

interface OrderPanelProps {
  orderItems: OrderItem[]
  onUpdateQty: (itemId: string, qty: number) => void
  onRemove: (itemId: string) => void
  onClear: () => void
  note: string
  onNoteChange: (n: string) => void
}

export default function OrderPanel({ orderItems, onUpdateQty, onRemove, onClear, note, onNoteChange }: OrderPanelProps) {
  const subtotal = orderItems.reduce((sum, o) => sum + o.item.price * o.qty, 0)
  const serviceCharge = Math.round(subtotal * 0.10)
  const tax = Math.round(subtotal * 0.13)
  const total = subtotal + serviceCharge + tax

  return (
    <div style={{ width: 320, flexShrink: 0, background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 20, display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 200px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Current Order</h3>
        <button onClick={onClear} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'var(--destructive)', cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
          <Trash2 size={14} /> Clear Order
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
        {orderItems.length === 0 && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13 }}>
            No items in order
          </div>
        )}
        {orderItems.map((o) => (
          <div key={o.item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <img src={o.item.image} alt={o.item.name} style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.item.name}</div>
              <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500 }}>NPR {o.item.price.toLocaleString()}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
              <button onClick={() => onUpdateQty(o.item.id, Math.max(1, o.qty - 1))} style={{ width: 26, height: 26, borderRadius: 4, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Minus size={12} />
              </button>
              <span style={{ width: 28, textAlign: 'center', fontSize: 13, fontWeight: 500 }}>{o.qty}</span>
              <button onClick={() => onUpdateQty(o.item.id, o.qty + 1)} style={{ width: 26, height: 26, borderRadius: 4, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={12} />
              </button>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, minWidth: 60, textAlign: 'right', flexShrink: 0 }}>NPR {(o.item.price * o.qty).toLocaleString()}</div>
            <button onClick={() => onRemove(o.item.id)} style={{ width: 22, height: 22, borderRadius: '50%', border: 'none', background: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <X size={12} color="var(--muted-foreground)" />
            </button>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
          <span style={{ color: 'var(--muted-foreground)' }}>Subtotal</span>
          <span>NPR {subtotal.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
          <span style={{ color: 'var(--muted-foreground)' }}>Service Charge (10%)</span>
          <span>NPR {serviceCharge.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}>
          <span style={{ color: 'var(--muted-foreground)' }}>Tax (13%)</span>
          <span>NPR {tax.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>NPR {total.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4 }}>Note (Optional)</div>
        <textarea
          placeholder="Add order note..."
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={2}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
            fontSize: 13, resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button style={{
          flex: 1, padding: '12px 0', borderRadius: 8, border: '1px solid var(--primary)',
          background: '#fff', color: 'var(--primary)', cursor: 'pointer', fontSize: 14, fontWeight: 600,
        }}>
          Save Order
        </button>
        <button style={{
          flex: 1, padding: '12px 0', borderRadius: 8, border: 'none',
          background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          Checkout →
        </button>
      </div>
    </div>
  )
}
