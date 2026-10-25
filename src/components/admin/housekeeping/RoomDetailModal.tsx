import type { HousekeepingRoom } from '@/types/housekeeping'

interface RoomDetailModalProps {
  room: HousekeepingRoom
  onClose: () => void
  onCreateTask: (room: HousekeepingRoom) => void
}

export default function RoomDetailModal({ room, onClose, onCreateTask }: RoomDetailModalProps) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 520, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Room Details</h3>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#6B7280' }}>x</button>
        </div>
        <div style={{ padding: 16, background: '#F9FAFB', borderRadius: 10, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Room {room.roomNumber}</div>
              <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{room.roomType} - {room.bedDescription}</div>
            </div>
            <span style={{ padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600, background: room.status === 'Clean' ? '#D1FAE5' : room.status === 'Dirty' ? '#FEE2E2' : room.status === 'In Progress' ? '#EDE9FE' : '#FEE2E2', color: room.status === 'Clean' ? '#065F46' : room.status === 'Dirty' ? '#991B1B' : room.status === 'In Progress' ? '#5B21B6' : '#991B1B' }}>
              {room.status}
            </span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Floor</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{room.floor}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Assigned To</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{room.assignedTo || 'Unassigned'}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Last Cleaned</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{room.lastCleaned || 'Never'}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Next Cleaning</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{room.nextCleaning || 'Not scheduled'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={() => onCreateTask(room)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--primary)', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>Create Task</button>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Close</button>
        </div>
      </div>
    </div>
  )
}
