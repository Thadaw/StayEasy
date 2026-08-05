import { MoreHorizontal, Plus } from 'lucide-react'

interface Policy {
  id: string
  name: string
  icon: string
  iconBg: string
  iconColor: string
  type: string
  typeBg: string
  typeColor: string
  description: string
  appliesTo: string
  status: 'Active' | 'Inactive'
}

const defaultPolicies: Policy[] = [
  {
    id: '1',
    name: 'Cancellation Policy',
    icon: '🕐',
    iconBg: '#F5F3FF',
    iconColor: 'var(--primary)',
    type: 'Cancellation',
    typeBg: '#F5F3FF',
    typeColor: 'var(--primary)',
    description: 'Orders can be cancelled within 15 minutes of placing.',
    appliesTo: 'All Orders',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Refund Policy',
    icon: '💰',
    iconBg: '#FDF2F8',
    iconColor: '#DB2777',
    type: 'Refund',
    typeBg: '#FDF2F8',
    typeColor: '#DB2777',
    description: 'Refunds are processed within 24 hours.',
    appliesTo: 'All Orders',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Discount Policy',
    icon: '🏷️',
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
    type: 'Discount',
    typeBg: '#EFF6FF',
    typeColor: '#2563EB',
    description: 'Maximum discount allowed up to 20% per order.',
    appliesTo: 'All Orders',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Age Verification',
    icon: '👤',
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
    type: 'Restriction',
    typeBg: '#F3F4F6',
    typeColor: '#374151',
    description: 'Applicable for age-restricted items (18+).',
    appliesTo: 'Dine In',
    status: 'Active',
  },
  {
    id: '5',
    name: 'No Show Policy',
    icon: '🚫',
    iconBg: '#FDF2F8',
    iconColor: '#DB2777',
    type: 'Reservation',
    typeBg: '#FDF2F8',
    typeColor: '#DB2777',
    description: 'No show reservations will be held for 10 minutes.',
    appliesTo: 'Reservations',
    status: 'Inactive',
  },
]

export default function PoliciesTable() {
  const policies = defaultPolicies

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Policies</h2>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0' }}>
              Manage restaurant policies that will be applied to orders and operations.
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
            Add Policy
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              {['POLICY NAME', 'TYPE', 'DESCRIPTION', 'APPLIES TO', 'STATUS', 'ACTION'].map((col) => (
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
            {policies.map((policy) => (
              <tr key={policy.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '14px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: policy.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {policy.icon}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{policy.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 24px' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: policy.typeBg,
                      color: policy.typeColor,
                    }}
                  >
                    {policy.type}
                  </span>
                </td>
                <td style={{ padding: '14px 24px', fontSize: 13, color: '#374151', maxWidth: 280 }}>
                  {policy.description}
                </td>
                <td style={{ padding: '14px 24px', fontSize: 14, color: '#374151' }}>
                  {policy.appliesTo}
                </td>
                <td style={{ padding: '14px 24px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: policy.status === 'Active' ? '#D1FAE5' : '#F3F4F6',
                      color: policy.status === 'Active' ? '#065F46' : '#6B7280',
                    }}
                  >
                    {policy.status}
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
    </div>
  )
}
