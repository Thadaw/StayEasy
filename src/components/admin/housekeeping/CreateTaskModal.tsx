import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTaskSchema, type CreateTaskFormData } from '@/schemas/admin/housekeepingSchema'
import StaffSelectField from './StaffSelectField'
import type { ApiStaffOption } from '@/types/housekeeping'

interface CreateTaskModalProps {
  roomOptions: string[]
  staffOptions: ApiStaffOption[]
  initialRoom?: string
  initialStaff?: string
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (data: CreateTaskFormData) => void
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', fontSize: 14, color: '#374151', outline: 'none', boxSizing: 'border-box' }
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 4, display: 'block' }
const errorStyle: React.CSSProperties = { fontSize: 12, color: '#dc2626', marginTop: 4 }

export default function CreateTaskModal({
  roomOptions,
  staffOptions,
  initialRoom,
  initialStaff,
  isSubmitting,
  onClose,
  onSubmit,
}: CreateTaskModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      room: initialRoom ?? '',
      taskType: 'Cleaning',
      priority: 'High',
      assignedStaff: initialStaff ?? '',
      dueTime: '11:00',
      notes: '',
    },
    mode: 'onTouched',
  })

  const assignedStaff = watch('assignedStaff')

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <form onClick={e => e.stopPropagation()} onSubmit={handleSubmit(onSubmit)} noValidate style={{ background: '#fff', borderRadius: 12, padding: 28, width: 500, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px' }}>Create Housekeeping Task</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Room *</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} {...register('room')}>
              <option value="">Select room</option>
              {roomOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.room && <p style={errorStyle}>{errors.room.message}</p>}
          </div>
          <div>
            <label style={labelStyle}>Task Type</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} {...register('taskType')}>
              <option value="Cleaning">Cleaning</option>
              <option value="Linen Change">Linen Change</option>
              <option value="Deep Cleaning">Deep Cleaning</option>
              <option value="Bathroom Cleaning">Bathroom Cleaning</option>
            </select>
            {errors.taskType && <p style={errorStyle}>{errors.taskType.message}</p>}
          </div>
          <div>
            <label style={labelStyle}>Priority</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} {...register('priority')}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            {errors.priority && <p style={errorStyle}>{errors.priority.message}</p>}
          </div>
          <div>
            <label style={labelStyle}>Assign Staff *</label>
            <StaffSelectField
              staffOptions={staffOptions}
              value={assignedStaff}
              onChange={(name) => setValue('assignedStaff', name, { shouldValidate: true, shouldDirty: true })}
              includeUnassigned
            />
            {errors.assignedStaff && <p style={errorStyle}>{errors.assignedStaff.message}</p>}
          </div>
          <div>
            <label style={labelStyle}>Due Time</label>
            <input type="time" style={inputStyle} {...register('dueTime')} />
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical', fontFamily: 'inherit' }} placeholder="Any additional notes..." {...register('notes')} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <button type="button" onClick={onClose} disabled={isSubmitting} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}>Cancel</button>
          <button type="submit" disabled={isSubmitting} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: isSubmitting ? 0.6 : 1 }}>
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  )
}
