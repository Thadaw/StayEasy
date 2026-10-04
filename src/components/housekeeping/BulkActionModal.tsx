import { useState, useMemo } from 'react'
import { X, Check } from 'lucide-react'
import type { HousekeepingRoom, Priority, ApiStaffOption, ApiRoomOption, ApiTaskTypeOption, BulkAssignTaskItem } from '../../types/housekeeping'

interface BulkActionModalProps {
  isOpen: boolean
  onClose: () => void
  rooms: HousekeepingRoom[]
  staffOptions: ApiStaffOption[]
  roomOptions: ApiRoomOption[]
  taskTypes: ApiTaskTypeOption[]
  onBulkAssign: (tasks: BulkAssignTaskItem[]) => void
}

const priorityOptions: Priority[] = ['High', 'Medium', 'Low']

const TARGET_STATUSES: HousekeepingRoom['status'][] = ['Dirty', 'Clean', 'In Progress', 'Out of Service']

interface RoomAssignment {
  notes: string
  housekeeperId: string
  priority: Priority
}

const defaultAssignment: RoomAssignment = { notes: 'Any Additional Notes', housekeeperId: '', priority: 'High' }

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #E5E7EB',
  background: '#fff',
  fontSize: 13,
  color: '#374151',
  outline: 'none',
  boxSizing: 'border-box',
}

export default function BulkActionModal({ isOpen, onClose, rooms, staffOptions, roomOptions, taskTypes, onBulkAssign }: BulkActionModalProps) {
  const taskTypeOptions = taskTypes.length > 0
    ? taskTypes
    : [{ value: 'ROOM_CLEANING', label: 'Room Cleaning' }]
  const statusOptions = TARGET_STATUSES.filter(s => rooms.some(r => r.status === s))
  const [selectedTaskType, setSelectedTaskType] = useState<string>(taskTypeOptions[0].value)
  const [selectedStatus, setSelectedStatus] = useState<string>(statusOptions[0] ?? 'Dirty')
  const [selectedRoomIds, setSelectedRoomIds] = useState<Set<number>>(new Set())
  const [assignments, setAssignments] = useState<Map<number, RoomAssignment>>(new Map())

  const filteredRooms = useMemo(() => {
    return rooms.filter(r => r.status === selectedStatus)
  }, [rooms, selectedStatus])

  const toggleRoom = (roomId: number) => {
    setSelectedRoomIds(prev => {
      const next = new Set(prev)
      if (next.has(roomId)) {
        next.delete(roomId)
        setAssignments(a => { const m = new Map(a); m.delete(roomId); return m })
      } else {
        next.add(roomId)
        setAssignments(a => {
          const m = new Map(a)
          if (!m.has(roomId)) m.set(roomId, { ...defaultAssignment })
          return m
        })
      }
      return next
    })
  }

  const toggleAll = () => {
    if (selectedRoomIds.size === filteredRooms.length) {
      setSelectedRoomIds(new Set())
      setAssignments(new Map())
    } else {
      const allIds = new Set(filteredRooms.map(r => r.id))
      setSelectedRoomIds(allIds)
      setAssignments(prev => {
        const m = new Map(prev)
        filteredRooms.forEach(r => { if (!m.has(r.id)) m.set(r.id, { ...defaultAssignment }) })
        return m
      })
    }
  }

  const updateAssignment = (roomId: number, field: keyof RoomAssignment, value: string) => {
    setAssignments(prev => {
      const m = new Map(prev)
      const existing = m.get(roomId) || { ...defaultAssignment }
      m.set(roomId, { ...existing, [field]: value })
      return m
    })
  }

  const handleApply = () => {
    const bulkTasks: BulkAssignTaskItem[] = []
    filteredRooms
      .filter(r => selectedRoomIds.has(r.id))
      .forEach(room => {
        const assignment = assignments.get(room.id)
        if (!assignment || !assignment.housekeeperId) return
        const apiRoom = roomOptions.find(ro => ro.name === `Room ${room.roomNumber}` || ro.name === room.roomNumber)
        if (!apiRoom) return
        bulkTasks.push({
          task_type: selectedTaskType,
          room_id: apiRoom.id,
          staff_id: assignment.housekeeperId,
          due_time: new Date(Date.now() + 60 * 1000).toISOString(),
          priority: assignment.priority === 'High' ? 'HIGH' : assignment.priority === 'Low' ? 'LOW' : 'MEDIUM',
          notes: assignment.notes || null,
        })
      })
    if (bulkTasks.length > 0) {
      onBulkAssign(bulkTasks)
    }
    onClose()
    setSelectedRoomIds(new Set())
    setAssignments(new Map())
  }

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 860,
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 80px rgba(0,0,0,0.2)',
        }}
      >
        {/* ========== HEADER ========== */}
        <div style={{ padding: '20px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>
              Assign Bulk Room Operations
            </h2>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280',
                flexShrink: 0,
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ========== BODY ========== */}
        <div style={{ padding: '20px 24px' }}>
          {/* Section 1: Select Operation / Target Status */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              1. Select Operation
            </label>
            <select
              value={selectedTaskType}
              onChange={e => {
                setSelectedTaskType(e.target.value)
                setSelectedRoomIds(new Set())
                setAssignments(new Map())
              }}
              style={{
                ...inputStyle,
                padding: '10px 14px',
                cursor: 'pointer',
                maxWidth: 400,
              }}
            >
              {taskTypeOptions.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Section 2: Select Rooms */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                2. Select Rooms
              </label>
              {selectedRoomIds.size > 0 && (
                <span style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  background: '#EFF6FF',
                  color: '#2563EB',
                }}>
                  {selectedRoomIds.size} Room{selectedRoomIds.size !== 1 ? 's' : ''} Selected
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {statusOptions.map(s => {
                const count = rooms.filter(r => r.status === s).length
                const active = selectedStatus === s
                return (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedStatus(s)
                      setSelectedRoomIds(new Set())
                      setAssignments(new Map())
                    }}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 999,
                      border: active ? '1.5px solid #2563EB' : '1px solid #E5E7EB',
                      background: active ? '#EFF6FF' : '#fff',
                      color: active ? '#2563EB' : '#374151',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {s} ({count})
                  </button>
                )
              })}
            </div>

            {filteredRooms.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#9CA3AF', fontSize: 13, background: '#F9FAFB', borderRadius: 10 }}>
                No rooms with status "{selectedStatus}"
              </div>
            ) : (
              <>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    marginBottom: 6,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#6B7280',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoomIds.size === filteredRooms.length && filteredRooms.length > 0}
                    onChange={toggleAll}
                    style={{ width: 16, height: 16, accentColor: '#2563EB', cursor: 'pointer' }}
                  />
                  Select All
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {filteredRooms.map(room => {
                    const isSelected = selectedRoomIds.has(room.id)
                    return (
                      <label
                        key={room.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: isSelected ? '1.5px solid #2563EB' : '1px solid #E5E7EB',
                          background: isSelected ? '#EFF6FF' : '#fff',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        <div style={{
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          border: isSelected ? 'none' : '1.5px solid #D1D5DB',
                          background: isSelected ? '#2563EB' : '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {isSelected && <Check size={12} color="#fff" strokeWidth={3} />}
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRoom(room.id)}
                          style={{ display: 'none' }}
                        />
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                          Room {room.roomNumber} ({room.roomType})
                        </span>
                      </label>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Section 3: Assign Housekeepers */}
          {selectedRoomIds.size > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 10 }}>
                3. Assign Housekeepers (Dynamic rows based on selected rooms)
              </label>
              <div style={{ border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 1fr 1fr',
                  gap: 0,
                  background: '#F9FAFB',
                  borderBottom: '1px solid #E5E7EB',
                  padding: '10px 16px',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROOM NO.</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NOTES</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ASSIGN HOUSEKEEPER</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PRIORITY</div>
                </div>
                {/* Table Rows */}
                {filteredRooms
                  .filter(r => selectedRoomIds.has(r.id))
                  .map(room => {
                    const assignment = assignments.get(room.id) || defaultAssignment
                    return (
                      <div
                        key={room.id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '80px 1fr 1fr 1fr',
                          gap: 0,
                          padding: '12px 16px',
                          borderBottom: '1px solid #F3F4F6',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{room.roomNumber}</div>
                        <input
                          type="text"
                          value={assignment.notes}
                          onChange={e => updateAssignment(room.id, 'notes', e.target.value)}
                          placeholder="Any Additional Notes"
                          style={{ ...inputStyle, fontSize: 13 }}
                        />
                        <select
                          value={assignment.housekeeperId}
                          onChange={e => updateAssignment(room.id, 'housekeeperId', e.target.value)}
                          style={{ ...inputStyle, cursor: 'pointer', fontSize: 13 }}
                        >
                          <option value="">Select housekeeper</option>
                          {staffOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <select
                          value={assignment.priority}
                          onChange={e => updateAssignment(room.id, 'priority', e.target.value)}
                          style={{ ...inputStyle, cursor: 'pointer', fontSize: 13 }}
                        >
                          {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>

        {/* ========== FOOTER ========== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderTop: '1px solid #E5E7EB',
            background: '#F9FAFB',
            borderRadius: '0 0 16px 16px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '9px 20px',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              background: '#fff',
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={selectedRoomIds.size === 0}
            style={{
              padding: '9px 20px',
              borderRadius: 8,
              border: 'none',
              background: selectedRoomIds.size > 0 ? '#1E293B' : '#D1D5DB',
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              cursor: selectedRoomIds.size > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            Apply Bulk Assignments ({selectedRoomIds.size} Task{selectedRoomIds.size !== 1 ? 's' : ''})
          </button>
        </div>
      </div>
    </div>
  )
}
