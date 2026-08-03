import { Eye, UserPlus, Check } from 'lucide-react'
import type { HousekeepingTask } from '../../types/housekeeping'

interface TaskTableProps {
  tasks: HousekeepingTask[]
  onViewTask: (task: HousekeepingTask) => void
  onAssignTask: (task: HousekeepingTask) => void
  onCompleteTask?: (taskId: string) => void
}

export const allTasks: HousekeepingTask[] = [
  { id: 'HK-001', room: 'Room 201', taskType: 'Cleaning', priority: 'High', assignedTo: 'Sita Sharma', dueTime: '10:00 AM', status: 'Pending' },
  { id: 'HK-002', room: 'Room 305', taskType: 'Linen Change', priority: 'Medium', assignedTo: 'Ram Gurung', dueTime: '11:30 AM', status: 'In Progress' },
  { id: 'HK-003', room: 'Room 108', taskType: 'Deep Cleaning', priority: 'High', assignedTo: null, dueTime: 'Today', status: 'Pending' },
  { id: 'HK-004', room: 'Room 402', taskType: 'Bathroom Cleaning', priority: 'Low', assignedTo: 'Maya Rai', dueTime: '3:00 PM', status: 'Completed' },
  { id: 'HK-005', room: 'Room 102', taskType: 'Cleaning', priority: 'Medium', assignedTo: 'Sita Sharma', dueTime: '9:00 AM', status: 'Completed' },
  { id: 'HK-006', room: 'Room 205', taskType: 'Deep Cleaning', priority: 'High', assignedTo: 'Ram Gurung', dueTime: '1:00 PM', status: 'In Progress' },
  { id: 'HK-007', room: 'Room 301', taskType: 'Linen Change', priority: 'Low', assignedTo: 'Maya Rai', dueTime: '4:00 PM', status: 'Pending' },
  { id: 'HK-008', room: 'Room 401', taskType: 'Cleaning', priority: 'Medium', assignedTo: null, dueTime: '2:00 PM', status: 'Pending' },
]

export const taskStatusColors: Record<string, { bg: string; text: string }> = {
  Pending: { bg: '#FEF3C7', text: '#92400E' },
  'In Progress': { bg: '#EDE9FE', text: '#5B21B6' },
  Completed: { bg: '#D1FAE5', text: '#065F46' },
}

export const priorityColors: Record<string, { bg: string; text: string }> = {
  High: { bg: '#FEE2E2', text: '#991B1B' },
  Medium: { bg: '#FEF3C7', text: '#92400E' },
  Low: { bg: '#E5E7EB', text: '#374151' },
}

const avatarColors = ['var(--primary)', '#2563EB', '#059669', '#D97706', '#DC2626', '#0891B2']
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase()

export default function TaskTable({ tasks, onViewTask, onAssignTask, onCompleteTask }: TaskTableProps) {
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
            {['TASK ID', 'ROOM', 'TASK TYPE', 'PRIORITY', 'ASSIGNED TO', 'DUE TIME', 'STATUS', 'ACTIONS'].map(col => (
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
          {tasks.map((task) => {
            const statusCol = taskStatusColors[task.status] || { bg: '#F3F4F6', text: '#374151' }
            const priorityCol = priorityColors[task.priority] || { bg: '#F3F4F6', text: '#374151' }

            return (
              <tr
                key={task.id}
                style={{ borderBottom: '1px solid #F3F4F6' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#111827' }}>
                  {task.id}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500, color: '#111827' }}>
                  {task.room}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151' }}>
                  {task.taskType}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: priorityCol.bg,
                      color: priorityCol.text,
                    }}
                  >
                    {task.priority}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {task.assignedTo ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: avatarColors[task.assignedTo.length % avatarColors.length],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(task.assignedTo)}
                      </div>
                      <span style={{ fontSize: 14, color: '#374151' }}>{task.assignedTo}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: 14, color: '#D1D5DB' }}>Unassigned</span>
                  )}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151' }}>
                  {task.dueTime}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: statusCol.bg,
                      color: statusCol.text,
                    }}
                  >
                    {task.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    {task.assignedTo ? (
                      <>
                        {task.status !== 'Completed' && (
                          <button
                            title="Mark Complete"
                            onClick={() => onCompleteTask?.(task.id)}
                            style={{
                              width: 32, height: 32, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669',
                            }}
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          title="View"
                          onClick={() => onViewTask(task)}
                          style={{
                            width: 32, height: 32, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280',
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        title="Assign"
                        onClick={() => onAssignTask(task)}
                        style={{
                          padding: '4px 12px', border: '1px solid var(--primary)', background: '#fff', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4,
                        }}
                      >
                        <UserPlus size={14} />
                        Assign
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={8} style={{ padding: '40px 16px', textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
                No tasks found matching your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
