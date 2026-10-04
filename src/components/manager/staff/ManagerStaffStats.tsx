import { Users, UserCheck, Clock, CalendarDays, Check, AlertTriangle } from 'lucide-react'
import { STAFF_STATS, type StaffStat } from './demoStaff'

const ICONS = {
  users: Users,
  userCheck: UserCheck,
  clock: Clock,
  calendar: CalendarDays,
  check: Check,
  alert: AlertTriangle,
}

interface ManagerStaffStatsProps {
  stats?: StaffStat[]
}

export default function ManagerStaffStats({ stats = STAFF_STATS }: ManagerStaffStatsProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}
    >
      {stats.map((stat) => {
        const Icon = ICONS[stat.icon]
        return (
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
            <Icon
              size={16}
              color={stat.accent}
              style={{ position: 'absolute', top: 16, right: 16 }}
            />
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 0.6,
                textTransform: 'uppercase',
                color: '#6b7280',
                paddingRight: 22,
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
        )
      })}
    </div>
  )
}
