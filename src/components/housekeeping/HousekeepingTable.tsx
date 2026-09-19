import { MoreVertical } from 'lucide-react'
import type { HousekeepingRoom } from '../../types/housekeeping'

interface HousekeepingTableProps {
  rooms: HousekeepingRoom[]
  onViewRoom?: (room: HousekeepingRoom) => void
  onMoreActions?: (room: HousekeepingRoom, action: string) => void
}

const statusBadgeColors: Record<string, { bg: string; text: string; dot: string }> = {
  Clean: { bg: '#DCFCE7', text: '#166534', dot: '#16A34A' },
  Dirty: { bg: '#FEE2E2', text: '#991B1B', dot: '#DC2626' },
  'In Progress': { bg: '#FEF3C7', text: '#92400E', dot: '#D97706' },
  'Out of Service': { bg: '#FEE2E2', text: '#991B1B', dot: '#DC2626' },
}

const avatarColors = [
  '#8B5CF6', '#2563EB', '#10B981', '#F59E0B',
  '#EF4444', '#0891B2', '#4F46E5', '#065F46',
]

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const roomThumbnails = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=80&h=60&fit=crop',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=80&h=60&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=80&h=60&fit=crop',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=80&h=60&fit=crop',
]

export default function HousekeepingTable({ rooms, onViewRoom, onMoreActions }: HousekeepingTableProps) {
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
            {['ROOM', 'TYPE', 'FLOOR', 'STATUS', 'ASSIGNED TO', 'LAST CLEANED', 'NEXT CLEANING', 'ACTIONS'].map(col => (
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
          {rooms.map((room, idx) => {
            const colors = statusBadgeColors[room.status] || { bg: '#F3F4F6', text: '#374151', dot: '#9CA3AF' }
            const thumb = roomThumbnails[idx % roomThumbnails.length]

            return (
              <tr
                key={room.id}
                style={{ borderBottom: '1px solid #F3F4F6' }}
              >
                {/* Room Number + Thumbnail */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 56,
                        height: 40,
                        borderRadius: 6,
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: '#F3F4F6',
                      }}
                    >
                      <img
                        src={thumb}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{room.roomNumber}</span>
                  </div>
                </td>

                {/* Type + Bed */}
                <td style={{ padding: '14px 16px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#111827' }}>{room.roomType}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF' }}>{room.bedDescription}</p>
                  </div>
                </td>

                {/* Floor */}
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151' }}>
                  {room.floor}
                </td>

                {/* Status Badge with Dot */}
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '5px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: colors.bg,
                      color: colors.text,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: colors.dot,
                        flexShrink: 0,
                      }}
                    />
                    {room.status}
                  </span>
                </td>

                {/* Assigned To */}
                <td style={{ padding: '14px 16px' }}>
                  {room.assignedTo ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: avatarColors[idx % avatarColors.length],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(room.assignedTo)}
                      </div>
                      <span style={{ fontSize: 14, color: '#374151' }}>{room.assignedTo}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: 14, color: '#D1D5DB' }}>-</span>
                  )}
                </td>

                {/* Last Cleaned */}
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151', whiteSpace: 'nowrap' }}>
                  {room.lastCleaned || '-'}
                </td>

                {/* Next Cleaning */}
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151', whiteSpace: 'nowrap' }}>
                  {room.nextCleaning || '-'}
                </td>

                {/* Actions - Three dot menu only */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button
                      title="More options"
                      onClick={() => onMoreActions?.(room, 'menu')}
                      style={{
                        width: 32,
                        height: 32,
                        border: 'none',
                        background: 'transparent',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6B7280',
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {rooms.length === 0 && (
        <div style={{ padding: '40px 16px', textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
          No rooms found matching your filters.
        </div>
      )}
    </div>
  )
}
