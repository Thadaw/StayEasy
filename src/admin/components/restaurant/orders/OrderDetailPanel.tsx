import { X, Printer, Share2, Edit2, Trash2, Check } from 'lucide-react'

export interface OrderDetail {
  id: string
  status: string
  statusColor: string
  statusBg: string
  type: string
  typeIcon: string
  table: string
  time: string
  timeAgo: string
  customer: {
    name: string
    phone: string
    partySize: number
  }
  items: {
    id: string
    name: string
    description: string
    quantity: number
    price: string
    unitPrice?: string
    image: string
  }[]
  subtotal: string
  discount: string
  tax: string
  total: string
}

interface OrderDetailPanelProps {
  order: OrderDetail | null
  onClose: () => void
}

export default function OrderDetailPanel({ order, onClose }: OrderDetailPanelProps) {
  if (!order) return null

  return (
    <div style={{ width: 340, flexShrink: 0, background: '#fff', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Order {order.id}</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--muted-foreground)' }}
          >
            <X size={18} />
          </button>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 500,
            background: order.statusBg,
            color: order.statusColor,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />
          {order.status}
        </span>
      </div>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted-foreground)' }}>
            <span style={{ fontSize: 14 }}>{order.typeIcon}</span>
            {order.type}
          </div>
          {order.table && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted-foreground)' }}>
              <span>🪑</span>
              {order.table}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted-foreground)' }}>
            <span>🕐</span>
            <div>
              <div>{order.time}</div>
              <div style={{ fontSize: 11 }}>{order.timeAgo}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: 14, fontWeight: 600 }}>
              {order.customer.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{order.customer.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{order.customer.phone}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Party Size</div>
            <div style={{ fontWeight: 600 }}>{order.customer.partySize} Guests</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Items ({order.items.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {order.items.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{item.description}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{item.price}</div>
                {item.unitPrice && (
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{item.unitPrice} each</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--muted)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Summary</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--muted-foreground)' }}>Subtotal</span>
            <span style={{ fontWeight: 500 }}>{order.subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--muted-foreground)' }}>Discount</span>
            <span style={{ fontWeight: 500, color: order.discount === 'NPR 0' ? 'var(--muted-foreground)' : 'var(--destructive)' }}>{order.discount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--muted-foreground)' }}>Tax (VAT 13%)</span>
            <span style={{ fontWeight: 500 }}>{order.tax}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Total Amount</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>{order.total}</span>
        </div>
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <button
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--foreground)',
            }}
          >
            <Printer size={16} />
            Print KOT
          </button>
          <button
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--foreground)',
            }}
          >
            <Printer size={16} />
            Print Bill
          </button>
          <button
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--foreground)',
            }}
          >
            <Share2 size={16} />
            Share Bill
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <button
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--primary)',
            }}
          >
            <Edit2 size={16} />
            Edit Order
          </button>
          <button
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--destructive)',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--destructive)',
            }}
          >
            <Trash2 size={16} />
            Cancel Order
          </button>
        </div>

        <button
          style={{
            width: '100%',
            padding: '14px 0',
            borderRadius: 8,
            border: 'none',
            background: 'var(--primary)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Check size={18} />
          Mark as Ready
        </button>
      </div>
    </div>
  )
}
