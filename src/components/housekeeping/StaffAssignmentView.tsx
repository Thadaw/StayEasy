import { useState } from 'react'
import { Search, ChevronDown, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import type { ApiStaffWorkSummary, ApiStaffOption } from '../../types/housekeeping'

interface StaffAssignmentViewProps {
  staffWorkSummary: ApiStaffWorkSummary[]
  staffOptions: ApiStaffOption[]
}

const avatarColors = ['var(--primary)', '#2563EB', '#059669', '#D97706', '#DC2626', '#0891B2']
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase()

const selectStyle: React.CSSProperties = { appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 36px 10px 14px', fontSize: 14, color: '#374151', fontWeight: 500, cursor: 'pointer', outline: 'none', backgroundImage: 'none', minWidth: 140 }

const statusDot: Record<string, string> = {
  Completed: '#059669',
  'In Progress': '#D97706',
  Pending: '#9CA3AF',
}

export default function StaffAssignmentView({ staffWorkSummary, staffOptions }: StaffAssignmentViewProps) {
  const [search, setSearch] = useState('')
  const [shiftFilter, setShiftFilter] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('')
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [viewingStaff, setViewingStaff] = useState<ApiStaffWorkSummary | null>(null)

  const filteredStaff = staffWorkSummary.filter(s => {
    const matchSearch = !search || s.staff_name.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 320 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Staff..."
            style={{ width: '100%', padding: '10px 14px 10px 42px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#374151', outline: 'none', background: '#fff' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 4, border: '1px solid #E5E7EB', borderRadius: 8, padding: 2, background: '#F9FAFB' }}>
          <button
            onClick={() => setViewMode('cards')}
            style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: viewMode === 'cards' ? 'var(--primary)' : 'transparent', color: viewMode === 'cards' ? '#fff' : '#6B7280', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: viewMode === 'table' ? 'var(--primary)' : 'transparent', color: viewMode === 'table' ? '#fff' : '#6B7280', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
          >
            Table
          </button>
        </div>
      </div>

      {/* Staff Cards View */}
      {viewMode === 'cards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
          {filteredStaff.map((s, idx) => {
            const colorIdx = idx % avatarColors.length
            const isAvailable = s.pending === 0 && s.in_progress === 0
            return (
              <div key={s.staff_id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: avatarColors[colorIdx], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>
                    {getInitials(s.staff_name)}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{s.staff_name}</div>
                    <div style={{ fontSize: 13, color: '#6B7280' }}>Housekeeping Staff</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{s.total_assigned}</div>
                    <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>Total Tasks</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#059669' }}>{s.completed}</div>
                    <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>Completed</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#D97706' }}>{s.pending + s.in_progress}</div>
                    <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>Remaining</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '8px 12px', borderRadius: 8, background: isAvailable ? '#D1FAE5' : '#FEE2E2' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: isAvailable ? '#059669' : '#DC2626' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: isAvailable ? '#065F46' : '#991B1B' }}>
                    {isAvailable ? 'Available' : 'Busy'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Staff Table View */}
      {viewMode === 'table' && (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                {['STAFF', 'TOTAL TASKS', 'COMPLETED', 'PENDING', 'IN PROGRESS', 'STATUS'].map(col => (
                  <th key={col} style={{ padding: '14px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em', textAlign: 'left', whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((s, idx) => {
                const colorIdx = idx % avatarColors.length
                const isAvailable = s.pending === 0 && s.in_progress === 0
                return (
                  <tr key={s.staff_id} style={{ borderBottom: '1px solid #F3F4F6' }} onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: avatarColors[colorIdx], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                          {getInitials(s.staff_name)}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{s.staff_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#111827' }}>{s.total_assigned}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#059669', fontWeight: 500 }}>{s.completed}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#D97706', fontWeight: 500 }}>{s.pending}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#5B21B6', fontWeight: 500 }}>{s.in_progress}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: isAvailable ? '#059669' : '#DC2626' }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: isAvailable ? '#065F46' : '#991B1B' }}>
                          {isAvailable ? 'Available' : 'Busy'}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
