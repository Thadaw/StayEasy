import { ArrowRight } from 'lucide-react'
import type { TopRoomType } from '../../types/reports'

interface TopRoomTypesProps {
  rooms: TopRoomType[]
}

export default function TopRoomTypes({ rooms }: TopRoomTypesProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        flex: '1 1 0',
      }}
    >
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Top Performing Room Types</h3>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
            {['ROOM TYPE', 'OCCUPANCY', 'REVENUE'].map(col => (
              <th
                key={col}
                style={{
                  padding: '12px 20px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em',
                  textAlign: 'left',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '12px 20px', fontSize: 14, fontWeight: 500, color: '#111827' }}>
                {room.roomType}
              </td>
              <td style={{ padding: '12px 20px', fontSize: 14, color: '#374151' }}>
                {room.occupancy}%
              </td>
              <td style={{ padding: '12px 20px', fontSize: 14, fontWeight: 600, color: '#111827' }}>
                NPR {room.revenue.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          View full report
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
