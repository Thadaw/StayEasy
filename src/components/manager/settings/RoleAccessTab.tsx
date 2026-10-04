import { useState } from 'react'
import toast from 'react-hot-toast'
import { UserPlus, Pencil, Check, X } from 'lucide-react'

type AccessLevel = 'Admin' | 'Write' | 'Read'

const ACCESS_STYLES: Record<AccessLevel, { background: string; color: string }> = {
  Admin: { background: '#dbeafe', color: '#2563eb' },
  Write: { background: '#fef3c7', color: '#d97706' },
  Read: { background: '#dcfce7', color: '#16a34a' },
}

const ACCESS_OPTIONS: AccessLevel[] = ['Admin', 'Write', 'Read']

const ROLE_ICONS: Record<string, string> = {
  Manager: '#2563eb',
  Receptionist: '#7c3aed',
  Housekeeper: '#0891b2',
  Accountant: '#d97706',
}

const INITIAL_ROLES: { name: string; members: number; access: AccessLevel }[] = [
  { name: 'Manager', members: 1, access: 'Admin' },
  { name: 'Receptionist', members: 4, access: 'Write' },
  { name: 'Housekeeper', members: 6, access: 'Read' },
  { name: 'Accountant', members: 2, access: 'Write' },
]

export default function RoleAccessTab() {
  const [roles, setRoles] = useState(INITIAL_ROLES)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState<AccessLevel>('Write')

  const startEdit = (name: string, current: AccessLevel) => {
    setEditing(name)
    setDraft(current)
  }

  const saveEdit = (name: string) => {
    setRoles((prev) => prev.map((role) => (role.name === name ? { ...role, access: draft } : role)))
    setEditing(null)
    toast.success(`${name} access updated to ${draft}`)
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Role & Access</h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
            Manage staff roles and what each can access
          </p>
        </div>
        <button
          onClick={() => toast.success('Invitation sent')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            borderRadius: 8,
            border: 'none',
            background: '#111827',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <UserPlus size={14} />
          Invite Member
        </button>
      </div>

      <div className="s-card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
            <thead>
              <tr>
                {['Role', 'Members', 'Access Level', 'Actions'].map((head) => (
                  <th
                    key={head}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => {
                const isEditing = editing === role.name
                return (
                  <tr key={role.name}>
                    <td style={{ padding: '13px 12px', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `${ROLE_ICONS[role.name] ?? '#2563eb'}1a`,
                            color: ROLE_ICONS[role.name] ?? '#2563eb',
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {role.name.charAt(0)}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{role.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 12px', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ fontSize: 13, color: '#374151' }}>{role.members}</span>
                    </td>
                    <td style={{ padding: '13px 12px', borderBottom: '1px solid #f3f4f6' }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <select
                            value={draft}
                            onChange={(e) => setDraft(e.target.value as AccessLevel)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 8,
                              border: '1px solid #e5e7eb',
                              background: '#fff',
                              fontSize: 13,
                              color: '#374151',
                              outline: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            {ACCESS_OPTIONS.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                          <button
                            aria-label={`Confirm ${role.name} access`}
                            onClick={() => saveEdit(role.name)}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              border: 'none',
                              background: '#16a34a',
                              color: '#fff',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <Check size={14} />
                          </button>
                          <button
                            aria-label={`Cancel ${role.name} edit`}
                            onClick={() => setEditing(null)}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              border: '1px solid #e5e7eb',
                              background: '#fff',
                              color: '#6b7280',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 500,
                            background: ACCESS_STYLES[role.access].background,
                            color: ACCESS_STYLES[role.access].color,
                          }}
                        >
                          {role.access}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '13px 12px', borderBottom: '1px solid #f3f4f6' }}>
                      {!isEditing && (
                        <button
                          onClick={() => startEdit(role.name, role.access)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '7px 14px',
                            borderRadius: 8,
                            border: '1px solid #e5e7eb',
                            background: '#fff',
                            color: '#374151',
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          <Pencil size={13} />
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 16,
            padding: '12px 14px',
            borderRadius: 8,
            background: '#eff6ff',
            border: '1px solid #dbeafe',
          }}
        >
          <span style={{ fontSize: 13, color: '#1d4ed8' }}>
            Admin: full access · Write: create & edit records · Read: view only
          </span>
        </div>
      </div>
    </div>
  )
}
