import { MoreHorizontal } from 'lucide-react'

export interface Order {
  id: string
  items: number
  type: string
  typeColor: string
  typeBg: string
  typeIcon: string
  customer: string
  table?: string
  phone?: string
  status: string
  statusColor: string
  statusBg: string
  time: string
  timeAgo: string
  amount: string
}

interface OrdersTableProps {
  orders: Order[]
  selectedOrderId: string | null
  onOrderSelect: (orderId: string) => void
}

export default function OrdersTable({ orders, selectedOrderId, onOrderSelect }: OrdersTableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--muted-foreground)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ORDER</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--muted-foreground)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>TYPE</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--muted-foreground)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CUSTOMER / TABLE</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--muted-foreground)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>STATUS</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--muted-foreground)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>TIME</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--muted-foreground)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AMOUNT</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--muted-foreground)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              onClick={() => onOrderSelect(order.id)}
              style={{
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                background: selectedOrderId === order.id ? 'var(--accent)' : 'transparent',
                borderLeft: selectedOrderId === order.id ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedOrderId !== order.id) {
                  e.currentTarget.style.background = 'var(--muted)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedOrderId !== order.id) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>{order.id}</div>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{order.items} items</div>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{order.typeIcon}</span>
                  <span style={{ color: order.typeColor }}>{order.type}</span>
                </div>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 500, color: 'var(--foreground)' }}>{order.customer}</div>
                {order.table && <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{order.table}</div>}
                {order.phone && <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{order.phone}</div>}
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 500,
                    background: order.statusBg,
                    color: order.statusColor,
                  }}
                >
                  {order.status}
                </span>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ color: 'var(--foreground)' }}>{order.time}</div>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{order.timeAgo}</div>
              </td>
              <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                {order.amount}
              </td>
              <td style={{ padding: '14px 16px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  <MoreHorizontal size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
