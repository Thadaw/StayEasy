import { Edit, Trash2, Eye } from 'lucide-react'
import type { StaffMember } from '@/types/staff'

interface StaffTableProps {
  staff: StaffMember[]
  onViewStaff: (member: StaffMember) => void
  onEditStaff: (member: StaffMember) => void
  onDeleteStaff: (member: StaffMember) => void
  onChangeStatus: (member: StaffMember, status: StaffMember['status']) => void
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#D1FAE5', text: '#065F46' },
  'On Leave': { bg: '#FEF3C7', text: '#92400E' },
  Inactive: { bg: '#FEE2E2', text: '#991B1B' },
}

const avatarColors = ['var(--primary)', '#2563EB', '#059669', '#D97706', '#DC2626', '#0891B2', '#4F46E5', 'var(--primary)']

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

export default function StaffTable({ staff, onViewStaff, onEditStaff, onDeleteStaff, onChangeStatus }: StaffTableProps) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              {['Staff Member', 'Role & Department', 'Contact', 'Joining Date', 'Status', 'Actions'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.15s' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: avatarColors[member.id.length % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{member.name}</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>{member.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{member.role}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>{member.department}</div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151' }}>{member.contact}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151' }}>{member.joiningDate}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ display: 'inline-block', padding: '4px 10px', fontSize: 11, fontWeight: 600, borderRadius: 20, background: statusColors[member.status]?.bg, color: statusColors[member.status]?.text }}>
                    {member.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={() => onViewStaff(member)} style={{ padding: 6, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280' }} title="View">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => onEditStaff(member)} style={{ padding: 6, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280' }} title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => onDeleteStaff(member)} style={{ padding: 6, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: '#DC2626' }} title="Delete">
                      <Trash2 size={16} />
                    </button>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={member.status}
                        onChange={(e) => onChangeStatus(member, e.target.value as StaffMember['status'])}
                        style={{ padding: '4px 6px', borderRadius: 6, border: '1px solid #E5E7EB', fontSize: 11, cursor: 'pointer' }}
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
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
