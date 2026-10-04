import { LEGEND_STATUSES, ROOM_STATUS_COLORS } from './demoRooms'

interface ManagerRoomStatusLegendProps {
  shown: number
  total: number
}

export default function ManagerRoomStatusLegend({ shown, total }: ManagerRoomStatusLegendProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap',
      marginBottom: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Room Status</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          {LEGEND_STATUSES.map((s) => (
            <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: ROOM_STATUS_COLORS[s]?.dot ?? '#9ca3af',
              }} />
              {s}
            </span>
          ))}
        </div>
      </div>

      <span style={{ fontSize: 13, color: '#6b7280' }}>
        Showing {shown} of {total} rooms
      </span>
    </div>
  )
}
