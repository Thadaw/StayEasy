import { Pencil, MoreVertical, Settings } from 'lucide-react'
import type { RoomPricing } from '../../types/pricing'

interface RoomPricingTableProps {
  rooms: RoomPricing[]
}

const roomThumbnails = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=80&h=60&fit=crop',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=80&h=60&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=80&h=60&fit=crop',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=80&h=60&fit=crop',
]

export default function RoomPricingTable({ rooms }: RoomPricingTableProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Room Pricing</h2>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0' }}>Manage base rates for room types</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <select
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              padding: '8px 32px 8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              color: '#374151',
              background: '#fff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%236B7280\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10l-5 5z\'/%3E%3C/svg%3E") no-repeat right 10px center',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option>All Properties</option>
          </select>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              background: '#fff',
              fontSize: 14,
              fontWeight: 500,
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            <Settings size={16} />
            Manage Taxes
          </button>
        </div>
      </div>

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
              {['ROOM TYPE', 'OCCUPANCY', 'BASE RATE (NPR)', 'WEEKEND RATE (NPR)', 'EXTRA PERSON (NPR)', 'STATUS', 'ACTIONS'].map(col => (
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
            {rooms.map((room, idx) => (
              <tr key={room.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
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
                        src={roomThumbnails[idx % roomThumbnails.length]}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' }}>{room.roomType}</p>
                      <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF' }}>{room.bedDescription}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    {room.occupancy}
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#111827' }}>
                  {room.baseRate.toLocaleString()}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {room.weekendRate.toLocaleString()}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151' }}>
                  {room.extraPersonRate.toLocaleString()}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: '#D1FAE5',
                      color: '#065F46',
                    }}
                  >
                    {room.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <button
                      title="Edit"
                      style={{
                        width: 32, height: 32, border: 'none', background: 'transparent',
                        borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#6B7280',
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      title="More options"
                      style={{
                        width: 32, height: 32, border: 'none', background: 'transparent',
                        borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#6B7280',
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
