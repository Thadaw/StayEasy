import { COVERAGE_PILL, SHIFT_COVERAGE, SHIFT_TILES, WEEKLY_DUTY } from './demoStaff'

interface ManagerShiftManagementProps {
  onViewCoverage: () => void
}

export default function ManagerShiftManagement({ onViewCoverage }: ManagerShiftManagementProps) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Shift Management</h3>
        <span style={{ fontSize: 13, color: '#9ca3af' }}>Today: Monday, April 28</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ flex: '2 1 440px', minWidth: 0 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 12,
            }}
          >
            {SHIFT_TILES.map((tile) => (
              <div
                key={tile.name}
                style={{ background: tile.background, borderRadius: 10, padding: '14px 16px' }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: tile.color }}>{tile.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>{tile.time}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginTop: 7 }}>
                  {tile.staff} staff
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>
              Weekly Duty Schedule
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(64px, 1fr))',
                gap: 8,
              }}
            >
              {WEEKLY_DUTY.map((day) => (
                <div
                  key={day.day}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: '8px 4px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{day.day}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginTop: 2 }}>
                    {day.date}
                  </div>
                  <div style={{ fontSize: 10, color: '#6b7280', marginTop: 3 }}>{day.duty} at duty</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            flex: '1 1 240px',
            minWidth: 0,
            background: '#f9fafb',
            borderRadius: 10,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
            Shift Coverage
          </div>
          {SHIFT_COVERAGE.map((row) => {
            const pill = COVERAGE_PILL[row.status]
            return (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 0',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <span style={{ fontSize: 12.5, color: '#374151' }}>{row.label}</span>
                <span
                  style={{
                    padding: '3px 9px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    background: pill.background,
                    color: pill.color,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.status}
                </span>
              </div>
            )
          })}
          <div style={{ fontSize: 11.5, color: '#dc2626', marginTop: 10 }}>Next 7 days: 3 gaps</div>
          <button
            onClick={onViewCoverage}
            style={{
              alignSelf: 'flex-end',
              marginTop: 8,
              border: 'none',
              background: 'none',
              padding: 0,
              fontSize: 12.5,
              fontWeight: 500,
              color: '#2563eb',
              cursor: 'pointer',
            }}
          >
            View coverage →
          </button>
        </div>
      </div>
    </div>
  )
}
