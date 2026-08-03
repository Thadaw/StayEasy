import { MoreHorizontal, Plus } from 'lucide-react'

interface Tax {
  id: string
  name: string
  icon: string
  iconBg: string
  iconColor: string
  type: string
  typeBg: string
  typeColor: string
  rate: string
  appliesTo: string
  status: 'Active' | 'Inactive'
}

const defaultTaxes: Tax[] = [
  {
    id: '1',
    name: 'VAT 13%',
    icon: '🏛️',
    iconBg: '#F5F3FF',
    iconColor: 'var(--primary)',
    type: 'Inclusive',
    typeBg: '#F5F3FF',
    typeColor: 'var(--primary)',
    rate: '13.00%',
    appliesTo: 'All Items',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Service Charge 10%',
    icon: '💰',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    type: 'Exclusive',
    typeBg: '#F3F4F6',
    typeColor: '#374151',
    rate: '10.00%',
    appliesTo: 'Dine In',
    status: 'Active',
  },
  {
    id: '3',
    name: 'SC 5% (Takeaway)',
    icon: '📝',
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
    type: 'Exclusive',
    typeBg: '#F3F4F6',
    typeColor: '#374151',
    rate: '5.00%',
    appliesTo: 'Takeaway',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Delivery Charge 0%',
    icon: '🚀',
    iconBg: '#ECFDF5',
    iconColor: '#059669',
    type: 'Exclusive',
    typeBg: '#F3F4F6',
    typeColor: '#374151',
    rate: '0.00%',
    appliesTo: 'Delivery',
    status: 'Inactive',
  },
  {
    id: '5',
    name: 'Municipal Tax 2%',
    icon: '🏢',
    iconBg: '#FDF2F8',
    iconColor: '#DB2777',
    type: 'Exclusive',
    typeBg: '#F3F4F6',
    typeColor: '#374151',
    rate: '2.00%',
    appliesTo: 'All Items',
    status: 'Active',
  },
]

export default function TaxesTable() {
  const taxes = defaultTaxes

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        marginBottom: 0,
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Taxes</h2>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0' }}>
              Create and manage all taxes used in your restaurant.
            </p>
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              border: 'none',
              borderRadius: 8,
              background: 'var(--primary)',
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            Add Tax
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              {['TAX NAME', 'TYPE', 'RATE (%)', 'APPLIES TO', 'STATUS', 'ACTION'].map((col) => (
                <th
                  key={col}
                  style={{
                    padding: '12px 24px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.05em',
                    textAlign: col === 'ACTION' ? 'center' : 'left',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {taxes.map((tax) => (
              <tr key={tax.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '14px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: tax.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {tax.icon}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{tax.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 24px' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: tax.typeBg,
                      color: tax.typeColor,
                    }}
                  >
                    {tax.type}
                  </span>
                </td>
                <td style={{ padding: '14px 24px', fontSize: 14, fontWeight: 500, color: '#111827' }}>
                  {tax.rate}
                </td>
                <td style={{ padding: '14px 24px', fontSize: 14, color: '#374151' }}>
                  {tax.appliesTo}
                </td>
                <td style={{ padding: '14px 24px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: tax.status === 'Active' ? '#D1FAE5' : '#F3F4F6',
                      color: tax.status === 'Active' ? '#065F46' : '#6B7280',
                    }}
                  >
                    {tax.status}
                  </span>
                </td>
                <td style={{ padding: '14px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button
                      style={{
                        width: 32,
                        height: 32,
                        border: 'none',
                        background: 'transparent',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6B7280',
                      }}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div
        style={{
          padding: '14px 24px',
          borderTop: '1px solid #F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: '#EBF5FB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 11, color: '#2E86AB', fontWeight: 700 }}>ℹ</span>
          </div>
          <span style={{ fontSize: 13, color: '#6B7280' }}>
            Tax priority order (top to bottom) will be applied during calculation.
          </span>
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            background: '#fff',
            fontSize: 13,
            fontWeight: 500,
            color: '#374151',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 14 }}>⇄</span>
          Reorder Taxes
        </button>
      </div>
    </div>
  )
}
