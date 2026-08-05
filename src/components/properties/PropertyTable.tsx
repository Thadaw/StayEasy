import { Eye, Pencil, MoreVertical, MapPin, Phone } from 'lucide-react'
import type { Property } from '../../types/properties'

interface PropertyTableProps {
  properties: Property[]
}

const typeBadgeColors: Record<string, { bg: string; text: string }> = {
  Hotel: { bg: '#DBEAFE', text: '#1E40AF' },
  Resort: { bg: '#D1FAE5', text: '#065F46' },
  Lodge: { bg: '#FEF3C7', text: '#92400E' },
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#D1FAE5', text: '#065F46' },
  Inactive: { bg: '#F3F4F6', text: '#6B7280' },
}

const getOccupancyColor = (rate: number) => {
  if (rate >= 75) return '#16A34A'
  if (rate >= 60) return '#2563EB'
  if (rate >= 50) return '#D97706'
  return '#DC2626'
}

const propertyImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=60&fit=crop',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=80&h=60&fit=crop',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=80&h=60&fit=crop',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=80&h=60&fit=crop',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=80&h=60&fit=crop',
  'https://images.unsplash.com/photo-1587381420270-7d7b6a47d0ff?w=80&h=60&fit=crop',
]

const avatarColors = [
  'var(--primary)', '#2563EB', '#059669', '#D97706',
  '#DC2626', '#0891B2',
]

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

export default function PropertyTable({ properties }: PropertyTableProps) {
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
            {['PROPERTY', 'TYPE', 'LOCATION', 'ROOMS', 'OCCUPANCY', 'STATUS', 'MANAGER', 'ACTIONS'].map(col => (
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
          {properties.map((prop, idx) => {
            const typeColors = typeBadgeColors[prop.type] || { bg: '#F3F4F6', text: '#374151' }
            const statusClr = statusColors[prop.status] || { bg: '#F3F4F6', text: '#374151' }
            const occupancyColor = getOccupancyColor(prop.occupancy)
            const img = propertyImages[idx % propertyImages.length]
            const avatarBg = avatarColors[idx % avatarColors.length]

            return (
              <tr key={prop.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 56,
                        height: 40,
                        borderRadius: 8,
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: '#F3F4F6',
                      }}
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' }}>{prop.name}</p>
                      <p style={{ margin: 0, fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>{prop.code}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: typeColors.bg,
                      color: typeColors.text,
                    }}
                  >
                    {prop.type}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: '#374151' }}>
                      <MapPin size={13} color="#9CA3AF" />
                      {prop.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
                      <Phone size={12} />
                      {prop.phone}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{prop.rooms}</span>
                    <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF' }}>Rooms</p>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', minWidth: 120 }}>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{prop.occupancy}%</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${prop.occupancy}%`,
                        height: '100%',
                        background: occupancyColor,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: statusClr.bg,
                      color: statusClr.text,
                    }}
                  >
                    {prop.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: avatarBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(prop.manager)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#111827' }}>{prop.manager}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF' }}>{prop.managerEmail}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <button
                      title="View"
                      style={{ width: 32, height: 32, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      title="Edit"
                      style={{ width: 32, height: 32, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      title="More options"
                      style={{ width: 32, height: 32, border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}
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
    </div>
  )
}
