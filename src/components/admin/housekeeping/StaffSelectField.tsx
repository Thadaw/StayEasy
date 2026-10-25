import type { ApiStaffOption } from '@/types/housekeeping'

interface StaffSelectFieldProps {
  staffOptions: ApiStaffOption[]
  value: string
  onChange: (name: string) => void
  includeUnassigned?: boolean
}

const avatarColors = ['var(--primary)', '#2563EB', '#059669', '#D97706', '#DC2626', '#0891B2']
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase() || '?'

export default function StaffSelectField({ staffOptions, value, onChange, includeUnassigned = false }: StaffSelectFieldProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, maxHeight: 220, overflow: 'auto' }}>
      {includeUnassigned && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8,
            border: value === '' ? '1.5px solid var(--primary)' : '1px solid #E5E7EB',
            background: value === '' ? '#EFF6FF' : '#fff', cursor: 'pointer', textAlign: 'left',
          }}
        >
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>?</div>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Unassigned</span>
        </button>
      )}
      {staffOptions.map(s => {
        const name = s.name || ''
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(name)}
            title={name}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8,
              border: value === name ? '1.5px solid var(--primary)' : '1px solid #E5E7EB',
              background: value === name ? '#EFF6FF' : '#fff', cursor: 'pointer', textAlign: 'left',
            }}
          >
            {s.cover_photo ? (
              <img src={s.cover_photo} alt={name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: avatarColors[(name.length || 0) % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{getInitials(name)}</div>
            )}
            <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{name}</span>
          </button>
        )
      })}
    </div>
  )
}
