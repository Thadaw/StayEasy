import {
  ATTENDANCE_OVERVIEW,
  DEPARTMENT_HEADCOUNT,
  LEAVE_STATS,
  PERFORMANCE_TREND,
} from './demoStaff'

interface StaffOverviewCardsProps {
  onView: (cardTitle: string) => void
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: 16,
  minWidth: 0,
}

function CardHeader({ title, onView }: { title: string; onView: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>{title}</h3>
      <button
        onClick={onView}
        style={{
          padding: '4px 11px',
          borderRadius: 6,
          border: '1px solid #e5e7eb',
          background: '#fff',
          fontSize: 11,
          fontWeight: 600,
          color: '#374151',
          cursor: 'pointer',
        }}
      >
        View
      </button>
    </div>
  )
}

function LegendRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 12.5, color: '#374151' }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontSize: 12.5, fontWeight: 600, color: '#111827' }}>{value}</span>
    </div>
  )
}

export default function StaffOverviewCards({ onView }: StaffOverviewCardsProps) {
  const attendanceTotal = ATTENDANCE_OVERVIEW.segments.reduce((sum, seg) => sum + seg.value, 0)
  const maxHeadcount = Math.max(...DEPARTMENT_HEADCOUNT.map((d) => d.value))
  const trendMin = 78
  const trendMax = 94

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 12,
        marginBottom: 8,
      }}
    >
      {/* Attendance Overview */}
      <div style={cardStyle}>
        <CardHeader title="Attendance Overview" onView={() => onView('Attendance Overview')} />
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>{ATTENDANCE_OVERVIEW.scope}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginTop: 4 }}>
          {ATTENDANCE_OVERVIEW.rate}
        </div>
        <div style={{ fontSize: 12, color: '#16a34a', marginTop: 2 }}>{ATTENDANCE_OVERVIEW.change}</div>

        <div
          style={{
            display: 'flex',
            height: 8,
            borderRadius: 4,
            overflow: 'hidden',
            marginTop: 12,
            background: '#f3f4f6',
          }}
        >
          {ATTENDANCE_OVERVIEW.segments.map((seg) => (
            <div
              key={seg.label}
              style={{
                width: `${(seg.value / attendanceTotal) * 100}%`,
                height: '100%',
                background: seg.color,
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: 4 }}>
          {ATTENDANCE_OVERVIEW.segments.map((seg) => (
            <LegendRow key={seg.label} label={seg.label} value={seg.value} color={seg.color} />
          ))}
        </div>
      </div>

      {/* Staff by Department */}
      <div style={cardStyle}>
        <CardHeader title="Staff by Department" onView={() => onView('Staff by Department')} />
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8, marginBottom: 6 }}>
          Headcount distribution
        </div>
        {DEPARTMENT_HEADCOUNT.map((dept) => (
          <div key={dept.label} style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
              <span style={{ color: '#374151' }}>{dept.label}</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{dept.value}</span>
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: '#f3f4f6',
                marginTop: 5,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(dept.value / maxHeadcount) * 100}%`,
                  height: '100%',
                  background: '#3b82f6',
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Performance Trend */}
      <div style={cardStyle}>
        <CardHeader title="Performance Trend" onView={() => onView('Performance Trend')} />
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
          Based on last 30 days evaluations
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginTop: 4 }}>92/100</div>
        <div style={{ fontSize: 12, color: '#16a34a', marginTop: 2 }}>+6 points since November</div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 96, marginTop: 14 }}>
          {PERFORMANCE_TREND.map((point) => {
            const pct = Math.max(
              20,
              ((point.value - trendMin) / (trendMax - trendMin)) * 100,
            )
            return (
              <div
                key={point.month}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}
              >
                <span style={{ fontSize: 10, color: '#6b7280', marginBottom: 3 }}>{point.value}</span>
                <div
                  style={{
                    width: '70%',
                    height: `${pct}%`,
                    background: '#1f2937',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
                <span style={{ fontSize: 10, color: '#9ca3af', marginTop: 5 }}>{point.month}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Leave Statistics */}
      <div style={cardStyle}>
        <CardHeader title="Leave Statistics" onView={() => onView('Leave Statistics')} />
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>This month</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginTop: 4 }}>
          {LEAVE_STATS[0].value}
        </div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>approved leave requests</div>
        <div style={{ marginTop: 6 }}>
          {LEAVE_STATS.map((leave) => (
            <LegendRow key={leave.label} label={leave.label} value={leave.value} color={leave.color} />
          ))}
        </div>
      </div>
    </div>
  )
}
