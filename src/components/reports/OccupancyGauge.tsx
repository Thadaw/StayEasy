import type { OccupancyData } from '../../types/reports'

interface OccupancyGaugeProps {
  data: OccupancyData
}

export default function OccupancyGauge({ data }: OccupancyGaugeProps) {
  const angle = (data.rate / 100) * 180
  const radius = 80
  const cx = 90
  const cy = 85

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleDeg: number) => {
    const angleRad = ((180 - angleDeg) * Math.PI) / 180
    return {
      x: centerX + r * Math.cos(angleRad),
      y: centerY - r * Math.sin(angleRad),
    }
  }

  const describeArc = (x: number, y: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, r, endAngle)
    const end = polarToCartesian(x, y, r, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: '20px',
        flex: '1 1 0',
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Occupancy Overview</h3>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 180, height: 100, marginBottom: 8 }}>
          <svg width="180" height="100" viewBox="0 0 180 100">
            <path
              d={describeArc(cx, cy, radius, 0, 180)}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d={describeArc(cx, cy, radius, 0, angle)}
              fill="none"
              stroke="#16A34A"
              strokeWidth="14"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 28, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1 }}>{data.rate}%</p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 0' }}>Occupancy Rate</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16, marginTop: 30 }}>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>0%</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#16A34A' }}>+{data.growth}%</span>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>vs May 1 – May 31, 2026</span>
          </div>
          <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 8 }}>100%</span>
        </div>

        <div style={{ display: 'flex', gap: 24, width: '100%', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>Sold Rooms</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '4px 0 0' }}>{data.soldRooms}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>Available Rooms</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '4px 0 0' }}>{data.availableRooms}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>Blocked Rooms</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '4px 0 0' }}>{data.blockedRooms}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
