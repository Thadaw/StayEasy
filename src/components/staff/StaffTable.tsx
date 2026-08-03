import { useState } from 'react'
import { Eye, Pencil, MoreVertical, RefreshCw, Trash2 } from 'lucide-react'
import type { StaffMember } from '../../types/staff'

interface StaffTableProps {
  staff: StaffMember[]
  onViewStaff: (member: StaffMember) => void
  onEditStaff: (member: StaffMember) => void
  onDeleteStaff: (member: StaffMember) => void
  onChangeStatus: (member: StaffMember, newStatus: StaffMember['status']) => void
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
  'var(--primary)', '#2563EB', '#059669', '#D97706',
  '#DC2626', 'var(--primary)', '#0891B2', '#4F46E5',
]

export default function StaffTable({ staff, onViewStaff, onEditStaff, onDeleteStaff, onChangeStatus }: StaffTableProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; member: StaffMember } | null>(null)

  return (
    <>
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
                style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }}
                onClick={() => onViewStaff(member)}
                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
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
                      onClick={(e) => { e.stopPropagation(); onViewStaff(member) }}
                      style={{
                        width: 32, height: 32, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280',
                      }}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      title="Edit"
                      onClick={(e) => { e.stopPropagation(); onEditStaff(member) }}
                      style={{
                        width: 32, height: 32, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280',
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      title="More options"
                      onClick={(e) => {
                        e.stopPropagation()
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                        setContextMenu(contextMenu?.member.id === member.id ? null : { x: rect.left - 120, y: rect.bottom + 4, member })
                      }}
                      style={{
                        width: 32, height: 32, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280',
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
          {staff.length === 0 && (
            <tr>
              <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
                No staff members found matching your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {contextMenu && (
      <>
        <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setContextMenu(null)} />
        <div style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', zIndex: 1000, minWidth: 180, padding: '4px 0' }}>
          {[
            { icon: Eye, label: 'View Details', action: () => { onViewStaff(contextMenu.member) } },
            { icon: Pencil, label: 'Edit Staff', action: () => { onEditStaff(contextMenu.member) } },
            { icon: RefreshCw, label: 'Change Status', action: () => {
              const order: StaffMember['status'][] = ['Active', 'On Leave', 'Inactive']
              const idx = order.indexOf(contextMenu.member.status)
              const next = order[(idx + 1) % order.length]
              onChangeStatus(contextMenu.member, next)
            }},
            { divider: true },
            { icon: Trash2, label: 'Delete', action: () => { onDeleteStaff(contextMenu.member) }, danger: true },
          ].map((item, i) =>
            'divider' in item ? (
              <div key={i} style={{ height: 1, background: '#E5E7EB', margin: '4px 0' }} />
            ) : (
              <button key={i} onClick={() => { item.action(); setContextMenu(null) }} style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: 'danger' in item && item.danger ? '#DC2626' : '#374151', textAlign: 'left',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            )
          )}
        </div>
      </>
    )}
    </>
  )
}
