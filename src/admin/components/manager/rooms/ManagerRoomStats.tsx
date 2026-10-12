import type { RoomRow } from './demoRooms'

interface ManagerRoomStatsProps {
  rooms: RoomRow[]
}

const DOT: Record<string, string> = {
  total: '#3b82f6',
  available: '#16a34a',
  occupied: '#2563eb',
  reserved: '#f59e0b',
  cleaning: '#6366f1',
  maintenance: '#dc2626',
}

export default function ManagerRoomStats({ rooms }: ManagerRoomStatsProps) {
  const total = rooms.length
  const count = (status: string) => rooms.filter((r) => r.status === status).length

  const available = count('Available')
  const occupied = count('Occupied')
  const reserved = count('Reserved')
  const cleaning = count('Cleaning')
  const maintenance = count('Maintenance') + count('Out of Order')

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0)

  const stats = [
    { key: 'total', label: 'Total Rooms', value: total, sublabel: 'Across 6 hotel facilities' },
    { key: 'available', label: 'Available', value: available, sublabel: `${pct(available)}% ready for check-in` },
    { key: 'occupied', label: 'Occupied', value: occupied, sublabel: `${pct(occupied)}% currently in use` },
    { key: 'reserved', label: 'Reserved', value: reserved, sublabel: `${pct(reserved)}% upcoming stays` },
    { key: 'cleaning', label: 'Cleaning', value: cleaning, sublabel: 'Housekeeping in progress' },
    { key: 'maintenance', label: 'Maintenance', value: maintenance, sublabel: 'Requires attention' },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: 16,
      marginBottom: 24,
    }}>
      {stats.map((stat) => (
        <div
          key={stat.key}
          style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            padding: 18,
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginBottom: 10,
          }}>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {stat.label}
            </span>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: DOT[stat.key],
              flexShrink: 0,
            }} />
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
            {stat.value}
          </div>
          <div style={{
            fontSize: 12,
            color: stat.key === 'maintenance' ? '#dc2626' : stat.key === 'cleaning' ? '#6366f1' : '#9ca3af',
            marginTop: 4,
          }}>
            {stat.sublabel}
          </div>
        </div>
      ))}
    </div>
  )
}
