import { useEffect, useState } from 'react'
import { DEMO_STAFF, DEPARTMENT_OPTIONS } from './demoStaff'

export interface AssignTaskValues {
  employee: string
  department: string
  taskType: string
  priority: string
  dueDate: string
  dueTime: string
  shift: string
  dutyArea: string
  description: string
  notify: boolean
}

interface AssignTaskModalProps {
  onClose: () => void
  onAssign: (values: AssignTaskValues) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  background: '#fff',
  fontSize: 13,
  color: '#374151',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: '#6b7280',
  marginBottom: 6,
  display: 'block',
}

const fieldStyle: React.CSSProperties = {
  minWidth: 0,
}

const EMPLOYEE_OPTIONS = DEMO_STAFF.map((member) => `${member.name} · ${member.staffId}`)
const DEPARTMENT_SELECT_OPTIONS = DEPARTMENT_OPTIONS.filter((d) => d !== 'All Departments')
const TASK_TYPE_OPTIONS = [
  'Room Inspection',
  'Room Cleaning',
  'Linen Delivery',
  'Maintenance Check',
  'Front Desk Coverage',
]
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low']
const DUE_DATE_OPTIONS = ['Apr 28, 2025', 'Apr 29, 2025', 'Apr 30, 2025', 'May 1, 2025']
const DUE_TIME_OPTIONS = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '05:00 PM']
const SHIFT_OPTIONS = ['Morning · 06:00-14:00', 'Evening · 14:00-22:00', 'Night · 22:00-06:00']
const DUTY_AREA_OPTIONS = ['Floor 1', 'Floor 2', 'Floor 3', 'Floor 4', 'Floor 5', 'Lobby', 'Pool Area']

export default function AssignTaskModal({ onClose, onAssign }: AssignTaskModalProps) {
  const [employee, setEmployee] = useState('Maria Santos · ST-014')
  const [department, setDepartment] = useState('Housekeeping')
  const [taskType, setTaskType] = useState('Room Inspection')
  const [priority, setPriority] = useState('High')
  const [dueDate, setDueDate] = useState('Apr 28, 2025')
  const [dueTime, setDueTime] = useState('01:30 PM')
  const [shift, setShift] = useState('Morning · 06:00-14:00')
  const [dutyArea, setDutyArea] = useState('Floor 1')
  const [description, setDescription] = useState(
    'Inspect rooms 201–212 before VIP arrival and report any maintenance issues.',
  )
  const [notify, setNotify] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = () => {
    if (!description.trim()) {
      return setError('Task description is required.')
    }
    onAssign({
      employee,
      department,
      taskType,
      priority,
      dueDate,
      dueTime,
      shift,
      dutyArea,
      description: description.trim(),
      notify,
    })
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 28,
          width: 560,
          maxWidth: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>
          Assign Staff Task
        </h3>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>
          Create an operational task, set priority and assign it to a staff member.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
          }}
        >
          <div style={fieldStyle}>
            <label style={labelStyle}>Employee</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
            >
              {EMPLOYEE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Department</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {DEPARTMENT_SELECT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Task Type</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
            >
              {TASK_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Priority</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Due Date</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            >
              {DUE_DATE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Due Time</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
            >
              {DUE_TIME_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Shift</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={shift}
              onChange={(e) => setShift(e.target.value)}
            >
              {SHIFT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Duty Area</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={dutyArea}
              onChange={(e) => setDutyArea(e.target.value)}
            >
              {DUTY_AREA_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Task Description</label>
            <input
              style={inputStyle}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setError('')
              }}
            />
          </div>

          {error && (
            <div
              style={{
                gridColumn: '1 / -1',
                fontSize: 13,
                color: '#dc2626',
                background: '#fef2f2',
                padding: '10px 12px',
                borderRadius: 8,
              }}
            >
              {error}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 22,
          }}
        >
          <button
            onClick={() => setNotify((v) => !v)}
            role="switch"
            aria-checked={notify}
            aria-label="Notify assigned staff"
            style={{
              width: 40,
              height: 22,
              borderRadius: 999,
              border: 'none',
              background: notify ? '#111827' : '#d1d5db',
              position: 'relative',
              cursor: 'pointer',
              flexShrink: 0,
              padding: 0,
              transition: 'background 0.15s',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 3,
                left: notify ? 21 : 3,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.15s',
              }}
            />
          </button>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
              Notify assigned staff
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
              Send an in-app notification immediately.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              border: 'none',
              background: '#111827',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Assign Task
          </button>
        </div>
      </div>
    </div>
  )
}
