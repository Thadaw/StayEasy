import { Users, Calendar, AlertTriangle, Clock, BarChart3 } from 'lucide-react'
import type { ShiftCoverageStats } from '../../types/shiftCoverage'

interface StatsCardProps {
  stats: ShiftCoverageStats
}

export default function ShiftCoverageStats({ stats }: StatsCardProps) {
  const cards = [
    {
      label: 'Total Staff',
      value: stats.totalStaff.toString(),
      subtitle: 'All Departments',
      icon: <Users size={20} />,
      iconBg: '#F3E8FF',
      iconColor: '#8B5CF6',
      subtitleColor: '#9CA3AF',
    },
    {
      label: 'Scheduled Today',
      value: stats.scheduledToday.toString(),
      subtitle: 'Employees',
      icon: <Calendar size={20} />,
      iconBg: '#D1FAE5',
      iconColor: '#10B981',
      subtitleColor: '#9CA3AF',
    },
    {
      label: 'Understaffed Shifts',
      value: stats.understaffedShifts.toString(),
      subtitle: 'Needs Attention',
      icon: <AlertTriangle size={20} />,
      iconBg: '#FFEDD5',
      iconColor: '#F97316',
      subtitleColor: '#EF4444',
      showAttentionBadge: true,
    },
    {
      label: 'Employees on Leave',
      value: stats.employeesOnLeave.toString(),
      subtitle: 'Today',
      icon: <Clock size={20} />,
      iconBg: '#FEE2E2',
      iconColor: '#EF4444',
      subtitleColor: '#9CA3AF',
    },
    {
      label: 'Avg. Coverage',
      value: `${stats.avgCoverage}%`,
      subtitle: 'This Week',
      icon: <BarChart3 size={20} />,
      iconBg: '#DBEAFE',
      iconColor: '#3B82F6',
      subtitleColor: '#9CA3AF',
      showChangeBadge: true,
      change: stats.coverageChange,
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #E5E7EB',
            padding: '20px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: card.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: card.iconColor,
              flexShrink: 0,
            }}
          >
            {card.icon}
          </div>

          {/* Content */}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 500, marginBottom: 4 }}>
              {card.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{card.value}</span>
              {card.showAttentionBadge && (
                <span style={{ fontSize: 11, fontWeight: 600, color: '#EF4444' }}>
                  {card.subtitle}
                </span>
              )}
              {card.showChangeBadge && card.change !== undefined && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 2,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: '#DCFCE7',
                    color: '#16A34A',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  +{card.change}%
                </span>
              )}
            </div>
            {!card.showAttentionBadge && (
              <div style={{ fontSize: 12, color: card.subtitleColor, marginTop: 2 }}>
                {card.subtitle}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
