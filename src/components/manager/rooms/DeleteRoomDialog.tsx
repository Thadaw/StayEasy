import { useEffect } from 'react'
import type { RoomRow } from './demoRooms'

interface DeleteRoomDialogProps {
  room: RoomRow
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteRoomDialog({ room, onClose, onConfirm }: DeleteRoomDialogProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 12, padding: 28, width: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 12px', color: '#111827' }}>Delete Room</h3>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
          Are you sure you want to delete room <strong>#{room.number}</strong> ({room.type})? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
