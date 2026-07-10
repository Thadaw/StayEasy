import { Eye, Pencil, MoreVertical } from 'lucide-react'
import type { StaffMember } from '../../types/staff'

interface StaffTableProps {
  staff: StaffMember[]
}

const roleBadgeColors: Record<string, { bg: string; text: string }> = {
  Manager: { bg: '#EDE9FE', text: '#6D28D9' },
  Receptionist: { bg: '#D1FAE5', text: '#065F46' },
  'Housekeeping Staff': { bg: '#D1FAE5', text: '#065F46' },
  'Housekeeping Supervisor': { bg: '#D1FAE5', text: '#065F46' },
  Chef: { bg: '#DBEAFE', text: '#1E40AF' },
  Waiter: { bg: '#D1FAE5', text: '#065F46' },
  Cashier: { bg: '#FEE2E2', text: '#991B1B' },
  'Maintenance Staff': { bg: '#D1FAE5', text: '#065F46' },
}

const statusBadgeColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#D1FAE5', text: '#065F46' },
  'On Leave': { bg: '#FEF3C7', text: '#92400E' },
  Inactive: { bg: '#FEE2E2', text: '#991B1B' },
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const avatarColors = [
  '#7C3AED', '#2563EB', '#059669', '#D97706',
  '#DC2626', '#7C3AED', '#0891B2', '#4F46E5',
]

export default function StaffTable({ staff }: StaffTableProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
            {['STAFF', 'ROLE', 'DEPARTMENT', 'CONTACT', 'JOINING DATE', 'STATUS', 'ACTIONS'].map(col => (
              <th
                key={col}
                style={{
                  padding: '14px 16px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em',
                  textAlign: col === 'ACTIONS' ? 'center' : 'left',
                  whiteSpace: 'nowrap',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {staff.map((member, idx) => {
            const roleColors = roleBadgeColors[member.role] || { bg: '#F3F4F6', text: '#374151' }
            const statusColors = statusBadgeColors[member.status] || { bg: '#F3F4F6', text: '#374151' }
            const avatarBg = avatarColors[idx % avatarColors.length]

            return (
              <tr
                key={member.id}
                style={{ borderBottom: '1px solid #F3F4F6' }}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: avatarBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' }}>{member.name}</p>
                      <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>{member.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: roleColors.bg,
                      color: roleColors.text,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {member.role}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151' }}>
                  {member.department}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151', whiteSpace: 'nowrap' }}>
                  {member.contact}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151', whiteSpace: 'nowrap' }}>
                  {member.joiningDate}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: statusColors.bg,
                      color: statusColors.text,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {member.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <button
                      title="View"
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
                      <Eye size={16} />
                    </button>
                    <button
                      title="Edit"
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
                      <Pencil size={16} />
                    </button>
                    <button
                      title="More options"
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
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
