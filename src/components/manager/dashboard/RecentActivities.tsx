import { useNavigate } from 'react-router-dom'

const activities = [
  {
    id: 1,
    icon: '📋',
    title: 'New reservation from Okia Bennett for Suite 402',
    time: '10 minutes ago',
    color: '#3b82f6',
  },
  {
    id: 2,
    icon: '✅',
    title: 'Guest check-in completed for Daniel Lee in Room 210',
    time: '30 minutes ago',
    color: '#10b981',
  },
  {
    id: 3,
    icon: '🍽️',
    title: 'Room service requested in Room 315: 2 × Club Sandwich, 1 × Orange Juice, $45.00 charge added to folio',
    time: '1 hour ago',
    color: '#f59e0b',
  },
  {
    id: 4,
    icon: '💳',
    title: 'Payment received for Booking #2461 - $1,240.00 via credit card',
    time: '2 hours ago',
    color: '#8b5cf6',
  },
]

export default function RecentActivities() {
  const navigate = useNavigate()
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      padding: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Recent Activities</h3>
        <button
          onClick={() => navigate('/manager/notifications')}
          style={{
            fontSize: 13,
            color: '#2563eb',
            fontWeight: 500,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          View All →
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {activities.map((activity) => (
          <div key={activity.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `${activity.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              flexShrink: 0,
            }}>
              {activity.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{activity.title}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
