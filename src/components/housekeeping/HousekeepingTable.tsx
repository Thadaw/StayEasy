import { Eye, MoreVertical } from 'lucide-react'
import type { HousekeepingRoom } from '../../types/housekeeping'

interface HousekeepingTableProps {
  rooms: HousekeepingRoom[]
  onViewRoom?: (room: HousekeepingRoom) => void
  onMoreActions?: (room: HousekeepingRoom, action: string) => void
}

const statusBadgeColors: Record<string, { bg: string; text: string }> = {
  Clean: { bg: '#D1FAE5', text: '#065F46' },
  Dirty: { bg: '#FEE2E2', text: '#991B1B' },
  'In Progress': { bg: '#EDE9FE', text: '#5B21B6' },
  'Out of Service': { bg: '#FEE2E2', text: '#991B1B' },
}

const avatarColors = [
  'var(--primary)', '#2563EB', '#059669', '#D97706',
  '#DC2626', '#0891B2', '#4F46E5', '#065F46',
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
            {['ROOM', 'ROOM TYPE', 'FLOOR', 'STATUS', 'ASSIGNED TO', 'LAST CLEANED', 'NEXT CLEANING', 'ACTIONS'].map(col => (
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
            const colors = statusBadgeColors[room.status] || { bg: '#F3F4F6', text: '#374151' }
            const thumb = roomThumbnails[idx % roomThumbnails.length]

            return (
              <tr
                key={room.id}
                style={{ borderBottom: '1px solid #F3F4F6' }}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 48,
                        height: 36,
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
                <td style={{ padding: '14px 16px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#111827' }}>{room.roomType}</p>
                    <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF' }}>{room.bedDescription}</p>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151' }}>
                  {room.floor}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: colors.bg,
                      color: colors.text,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {room.status}
                  </span>
                </td>
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
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151', whiteSpace: 'nowrap' }}>
                  {room.lastCleaned || '-'}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151', whiteSpace: 'nowrap' }}>
                  {room.nextCleaning || '-'}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <button
                      title="View"
                      onClick={() => onViewRoom?.(room)}
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
                      <Eye size={16} />
                    </button>
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
