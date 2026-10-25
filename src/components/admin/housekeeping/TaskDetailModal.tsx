import type { HousekeepingTask } from '@/types/housekeeping'

interface TaskDetailModalProps {
  task: HousekeepingTask
  onClose: () => void
  onComplete: (taskId: string) => void
  onReassign: (task: HousekeepingTask) => void
}

export default function TaskDetailModal({ task, onClose, onComplete, onReassign }: TaskDetailModalProps) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 500, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Task Details</h3>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#6B7280' }}>x</button>
        </div>
        <div style={{ padding: 16, background: '#F9FAFB', borderRadius: 10, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{task.id}</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{task.room} - {task.taskType}</div>
            </div>
            <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: task.status === 'Completed' ? '#D1FAE5' : task.status === 'In Progress' ? '#EDE9FE' : '#FEF3C7', color: task.status === 'Completed' ? '#065F46' : task.status === 'In Progress' ? '#5B21B6' : '#92400E' }}>
              {task.status}
            </span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Priority</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{task.priority}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Assigned To</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{task.assignedTo || 'Unassigned'}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Due Time</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{task.dueTime}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Task Type</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{task.taskType}</div>
          </div>
        </div>
        {task.notes && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Notes</div>
            <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{task.notes}</div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          {task.status !== 'Completed' && (
            <button onClick={() => onComplete(task.id)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Mark Complete</button>
          )}
          <button onClick={() => onReassign(task)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}>Reassign</button>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Close</button>
        </div>
      </div>
    </div>
  )
}
