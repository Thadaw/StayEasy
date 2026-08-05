import { useState } from 'react'
import { Search, ChevronDown, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import type { StaffWorkload, StaffTask } from '../../types/housekeeping'

const avatarColors = ['var(--primary)', '#2563EB', '#059669', '#D97706', '#DC2626', '#0891B2']
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase()

const allStaff: StaffWorkload[] = [
  {
    id: 1, name: 'Sita Sharma', shift: 'Morning', todayTasks: 6, completed: 4, remaining: 2, availability: 'Available',
    tasks: [
      { room: 'Room 201', status: 'Completed' },
      { room: 'Room 205', status: 'Completed' },
      { room: 'Room 305', status: 'In Progress' },
      { room: 'Room 401', status: 'Pending' },
    ],
  },
  {
    id: 2, name: 'Ram Gurung', shift: 'Morning', todayTasks: 8, completed: 8, remaining: 0, availability: 'Busy',
    tasks: [
      { room: 'Room 101', status: 'Completed' },
      { room: 'Room 102', status: 'Completed' },
      { room: 'Room 202', status: 'Completed' },
      { room: 'Room 301', status: 'Completed' },
    ],
  },
  {
    id: 3, name: 'Maya Rai', shift: 'Evening', todayTasks: 5, completed: 2, remaining: 3, availability: 'Available',
    tasks: [
      { room: 'Room 402', status: 'Completed' },
      { room: 'Room 403', status: 'Completed' },
      { room: 'Room 501', status: 'In Progress' },
      { room: 'Room 502', status: 'Pending' },
    ],
  },
  {
    id: 4, name: 'Anita Lama', shift: 'Morning', todayTasks: 4, completed: 1, remaining: 3, availability: 'Available',
    tasks: [
      { room: 'Room 103', status: 'Completed' },
      { room: 'Room 104', status: 'In Progress' },
      { room: 'Room 105', status: 'Pending' },
      { room: 'Room 106', status: 'Pending' },
    ],
  },
]

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', fontSize: 14, color: '#374151', outline: 'none', boxSizing: 'border-box' }
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 4, display: 'block' }
const selectStyle: React.CSSProperties = { appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 36px 10px 14px', fontSize: 14, color: '#374151', fontWeight: 500, cursor: 'pointer', outline: 'none', backgroundImage: 'none', minWidth: 140 }

const statusDot: Record<string, string> = {
  Completed: '#059669',
  'In Progress': '#D97706',
  Pending: '#9CA3AF',
}

export default function StaffAssignmentView() {
  const [staff, setStaff] = useState<StaffWorkload[]>(allStaff)
  const [search, setSearch] = useState('')
  const [shiftFilter, setShiftFilter] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('')
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [viewingStaff, setViewingStaff] = useState<StaffWorkload | null>(null)
  const [assignForm, setAssignForm] = useState({ staff: '', task: '', priority: 'High', dueTime: '', notes: '' })

  const filteredStaff = staff.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase())
    const matchShift = !shiftFilter || s.shift === shiftFilter
    const matchAvail = !availabilityFilter || s.availability === availabilityFilter
    return matchSearch && matchShift && matchAvail
  })

  const handleAssign = () => {
    if (!assignForm.staff || !assignForm.task) return
    setStaff(prev => prev.map(s =>
      s.name === assignForm.staff
        ? { ...s, todayTasks: s.todayTasks + 1, remaining: s.remaining + 1 }
        : s
    ))
    setShowAssignModal(false)
    setAssignForm({ staff: '', task: '', priority: 'High', dueTime: '', notes: '' })
  }

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

        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <select value={shiftFilter} onChange={e => setShiftFilter(e.target.value)} style={selectStyle}>
            <option value="">Shift</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: 12, pointerEvents: 'none', color: '#9CA3AF' }} />
        </div>

        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <select value={availabilityFilter} onChange={e => setAvailabilityFilter(e.target.value)} style={selectStyle}>
            <option value="">Availability</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: 12, pointerEvents: 'none', color: '#9CA3AF' }} />
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

        <button
          onClick={() => setShowAssignModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: 'none', borderRadius: 8, background: 'var(--primary)', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer', marginLeft: 'auto' }}
        >
          <Plus size={18} />
          Assign Task
        </button>
      </div>

      {/* Staff Cards View */}
      {viewMode === 'cards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
          {filteredStaff.map(s => {
            const idx = s.id % avatarColors.length
            return (
              <div key={s.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: avatarColors[idx], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>
                    {getInitials(s.name)}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{s.name}</div>
                    <div style={{ fontSize: 13, color: '#6B7280' }}>{s.shift} Shift</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{s.todayTasks}</div>
                    <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>Today's Tasks</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#059669' }}>{s.completed}</div>
                    <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>Completed</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#D97706' }}>{s.remaining}</div>
                    <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>Remaining</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '8px 12px', borderRadius: 8, background: s.availability === 'Available' ? '#D1FAE5' : '#FEE2E2' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.availability === 'Available' ? '#059669' : '#DC2626' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: s.availability === 'Available' ? '#065F46' : '#991B1B' }}>
                    {s.availability === 'Available' ? 'Available' : 'Busy'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {s.availability === 'Available' ? (
                    <button
                      onClick={() => { setAssignForm({ staff: s.name, task: '', priority: 'High', dueTime: '', notes: '' }); setShowAssignModal(true) }}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--primary)', background: '#fff', color: 'var(--primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Assign Task
                    </button>
                  ) : (
                    <button
                      onClick={() => setViewingStaff(s)}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      View Tasks
                    </button>
                  )}
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
                {['STAFF', 'SHIFT', 'ASSIGNED TASKS', 'COMPLETED', 'REMAINING', 'STATUS', 'ACTIONS'].map(col => (
                  <th key={col} style={{ padding: '14px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em', textAlign: col === 'ACTIONS' ? 'center' : 'left', whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map(s => {
                const idx = s.id % avatarColors.length
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid #F3F4F6' }} onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: avatarColors[idx], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                          {getInitials(s.name)}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151' }}>{s.shift}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#111827' }}>{s.todayTasks}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#059669', fontWeight: 500 }}>{s.completed}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#D97706', fontWeight: 500 }}>{s.remaining}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.availability === 'Available' ? '#059669' : '#DC2626' }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: s.availability === 'Available' ? '#065F46' : '#991B1B' }}>
                          {s.availability === 'Available' ? 'Available' : 'Busy'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {s.availability === 'Available' ? (
                          <button onClick={() => { setAssignForm({ staff: s.name, task: '', priority: 'High', dueTime: '', notes: '' }); setShowAssignModal(true) }} style={{ padding: '4px 12px', border: '1px solid var(--primary)', background: '#fff', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>
                            Assign
                          </button>
                        ) : (
                          <button onClick={() => setViewingStaff(s)} style={{ padding: '4px 12px', border: '1px solid #E5E7EB', background: '#fff', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#374151' }}>
                            View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Task Modal */}
      {showAssignModal && (
        <div onClick={() => setShowAssignModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 480, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px' }}>Assign Task</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Staff *</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={assignForm.staff} onChange={e => setAssignForm({ ...assignForm, staff: e.target.value })}>
                  <option value="">Select staff member</option>
                  {allStaff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Task *</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={assignForm.task} onChange={e => setAssignForm({ ...assignForm, task: e.target.value })}>
                  <option value="">Select task</option>
                  <option value="Room 201 Cleaning">Room 201 Cleaning</option>
                  <option value="Room 305 Linen Change">Room 305 Linen Change</option>
                  <option value="Room 108 Deep Cleaning">Room 108 Deep Cleaning</option>
                  <option value="Room 402 Bathroom Cleaning">Room 402 Bathroom Cleaning</option>
                  <option value="Room 401 Cleaning">Room 401 Cleaning</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={assignForm.priority} onChange={e => setAssignForm({ ...assignForm, priority: e.target.value })}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Due Time</label>
                <input type="time" style={inputStyle} value={assignForm.dueTime} onChange={e => setAssignForm({ ...assignForm, dueTime: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Notes</label>
                <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical', fontFamily: 'inherit' }} placeholder="Any additional notes..." value={assignForm.notes} onChange={e => setAssignForm({ ...assignForm, notes: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowAssignModal(false)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}>Cancel</button>
              <button onClick={handleAssign} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Assign</button>
            </div>
          </div>
        </div>
      )}

      {/* View Staff Tasks Modal */}
      {viewingStaff && (
        <div onClick={() => setViewingStaff(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 480, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{viewingStaff.name}</h3>
              <button onClick={() => setViewingStaff(null)} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#6B7280' }}>×</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '8px 12px', borderRadius: 8, background: '#F9FAFB' }}>
              <Clock size={16} color="#6B7280" />
              <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Today's Tasks</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {viewingStaff.tasks.map((t: StaffTask, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 8, background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: t.status === 'Completed' ? '#D1FAE5' : t.status === 'In Progress' ? '#FEF3C7' : '#F3F4F6' }}>
                    {t.status === 'Completed' && <CheckCircle size={14} color="#059669" />}
                    {t.status === 'In Progress' && <AlertCircle size={14} color="#D97706" />}
                    {t.status === 'Pending' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D1D5DB' }} />}
                  </div>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#111827' }}>{t.room}</span>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: statusDot[t.status] === '#059669' ? '#D1FAE5' : statusDot[t.status] === '#D97706' ? '#FEF3C7' : '#F3F4F6', color: statusDot[t.status] === '#059669' ? '#065F46' : statusDot[t.status] === '#D97706' ? '#92400E' : '#6B7280' }}>
                    {t.status}
                  </span>
                </div>
              ))}
              {viewingStaff.tasks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#9CA3AF', fontSize: 14 }}>No tasks assigned today</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
