interface ActivityOverviewProps {
  total: number
  breakdown: { label: string; count: number; percentage: string; color: string }[]
}

export default function ActivityOverview({ total, breakdown }: ActivityOverviewProps) {
  const size = 140
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  let cumulativePercent = 0
  const segments = breakdown.map(item => {
    const percent = parseFloat(item.percentage)
    const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`
    const strokeDashoffset = -((cumulativePercent / 100) * circumference)
    cumulativePercent += percent
    return { ...item, strokeDasharray, strokeDashoffset }
  })

  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
      padding: 20, marginBottom: 16,
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 20px' }}>Activity Overview</h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Donut Chart */}
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            {segments.map((seg, idx) => (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
              />
            ))}
          </svg>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{total.toLocaleString()}</span>
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>Total</span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {breakdown.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{item.count}</span>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>({item.percentage})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
