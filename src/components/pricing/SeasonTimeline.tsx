import type { SeasonTimeline as SeasonTimelineType } from '../../types/pricing'

interface SeasonTimelineProps {
  seasons: SeasonTimelineType[]
}

const months = [
  { label: 'Jun 2025', key: 'jun' },
  { label: 'Jul 2025', key: 'jul' },
  { label: 'Aug 2025', key: 'aug' },
  { label: 'Sep 2025', key: 'sep' },
  { label: 'Oct 2025', key: 'oct' },
  { label: 'Nov 2025', key: 'nov' },
]

const timelineStart = new Date('2025-06-01')
const timelineEnd = new Date('2025-11-30')
const totalDays = (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)

function getBarPosition(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const startOffset = Math.max(0, (start.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24))
  const barWidth = Math.min(totalDays - startOffset, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const leftPercent = (startOffset / totalDays) * 100
  const widthPercent = (barWidth / totalDays) * 100
  return { left: `${leftPercent}%`, width: `${Math.max(widthPercent, 2)}%` }
}

export default function SeasonTimeline({ seasons }: SeasonTimelineProps) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', marginBottom: 24, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Season Timeline (Next 6 Months)</h3>
        </div>
        <div style={{ position: 'relative' }}>
          <select
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              padding: '6px 28px 6px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
              background: '#fff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%236B7280\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10l-5 5z\'/%3E%3C/svg%3E") no-repeat right 8px center',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option>Next 6 Months</option>
            <option>Next 12 Months</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Month headers */}
        <div style={{ display: 'flex', marginLeft: 160, marginBottom: 16, position: 'relative' }}>
          {months.map((month, idx) => (
            <div
              key={month.key}
              style={{
                flex: 1,
                fontSize: 12,
                fontWeight: 500,
                color: '#6B7280',
                textAlign: idx === 0 ? 'left' : 'center',
              }}
            >
              {month.label}
            </div>
          ))}
        </div>

        {/* Season rows */}
        {seasons.map(season => {
          const pos = getBarPosition(season.startDate, season.endDate)
          return (
            <div key={season.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 12, position: 'relative', height: 36 }}>
              {/* Season label */}
              <div style={{ width: 148, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, paddingRight: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: season.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#374151', whiteSpace: 'nowrap' }}>{season.name}</span>
              </div>

              {/* Timeline bar area */}
              <div style={{ flex: 1, position: 'relative', height: 28 }}>
                {/* Grid lines */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                  {months.map((_, idx) => (
                    <div key={idx} style={{ flex: 1, borderLeft: idx > 0 ? '1px solid #F3F4F6' : 'none' }} />
                  ))}
                </div>

                {/* Season bar */}
                <div
                  style={{
                    position: 'absolute',
                    left: pos.left,
                    width: pos.width,
                    top: 4,
                    height: 20,
                    background: season.color,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.85,
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', padding: '0 8px' }}>
                    {season.label}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
