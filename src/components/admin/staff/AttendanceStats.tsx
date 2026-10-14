import { Users, UserX, Clock, TrendingUp } from 'lucide-react'

interface StatCard {
  label: string
  value: string
  subtext: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  trendUp?: boolean
}

const stats: StatCard[] = [
  {
    label: 'Present Today',
    value: '982',
    subtext: '+5.7% from last month',
    icon: <Users size={20} />,
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    trendUp: true,
  },
  {
    label: 'Absent',
    value: '42',
    subtext: '+4.0% from last month',
    icon: <UserX size={20} />,
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    trendUp: true,
  },
  {
    label: 'Late Arrivals',
    value: '18',
    subtext: '+1.7% from last month',
    icon: <Clock size={20} />,
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    trendUp: true,
  },
  {
    label: 'Attendance Rate',
    value: '94.6%',
    subtext: '+5.7% from last month',
    icon: <TrendingUp size={20} />,
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    trendUp: true,
  },
]

export default function AttendanceStats() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {stats.map((stat, i) => (
        <div
          key={i}
          style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #E5E7EB',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: stat.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stat.iconColor,
            }}
          >
            {stat.icon}
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
              {stat.label}
            </div>
          </div>
          <div style={{ fontSize: 12, color: stat.trendUp ? '#16A34A' : '#DC2626', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>{stat.trendUp ? '↑' : '↓'}</span>
            <span>{stat.subtext}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
