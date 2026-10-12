import { GUEST_STATS, type GuestStat } from './demoGuests'

interface ManagerGuestStatsProps {
  stats?: GuestStat[]
}

export default function ManagerGuestStats({ stats = GUEST_STATS }: ManagerGuestStatsProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: '16px 18px',
            position: 'relative',
            minWidth: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: stat.dot,
            }}
          />
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              color: '#6b7280',
              paddingRight: 14,
            }}
          >
            {stat.label}
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: '#111827',
              marginTop: 8,
              lineHeight: 1.1,
            }}
          >
            {stat.value}
          </div>
          <div
            style={{
              fontSize: 12,
              color: stat.sub.startsWith('+') ? '#16a34a' : '#9ca3af',
              marginTop: 6,
            }}
          >
            {stat.sub}
          </div>
        </div>
      ))}
    </div>
  )
}
