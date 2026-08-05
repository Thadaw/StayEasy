import type { ActivityLog } from '../../types/activity'

interface ActivityDetailsProps {
  activity: ActivityLog | null
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Success: { bg: '#D1FAE5', text: '#065F46' },
  Warning: { bg: '#FEF3C7', text: '#92400E' },
  Failed: { bg: '#FEE2E2', text: '#991B1B' },
}

export default function ActivityDetails({ activity }: ActivityDetailsProps) {
  if (!activity) {
    return (
      <div style={{
        background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
        padding: 20, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', minHeight: 200,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 12, background: '#F3F4F6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 12,
        }}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/>
          </svg>
        </div>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>No Activity Selected</p>
        <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0, textAlign: 'center' }}>Select an activity from the list to see more details.</p>
      </div>
    )
  }

  const sc = statusColors[activity.status] || statusColors.Success

  const details = [
    { label: 'Date & Time', value: activity.dateTime },
    { label: 'User', value: activity.user.name },
    { label: 'Email', value: activity.user.email },
    { label: 'Module', value: activity.module },
    { label: 'Action', value: activity.action },
    { label: 'IP Address', value: activity.ipAddress, mono: true },
    { label: 'Status', value: activity.status, status: true },
  ]

  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
      padding: 20,
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Activity Details</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {details.map(d => (
          <div key={d.label} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 13, color: '#6B7280', flexShrink: 0 }}>{d.label}</span>
            {d.status ? (
              <span style={{
                padding: '2px 8px', borderRadius: 6, fontSize: 12,
                fontWeight: 600, background: sc.bg, color: sc.text,
              }}>
                {d.value}
              </span>
            ) : (
              <span style={{
                fontSize: 13, fontWeight: 500, color: '#111827',
                fontFamily: d.mono ? 'monospace' : 'inherit',
                textAlign: 'right',
              }}>
                {d.value}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 6px', fontWeight: 500 }}>Description</p>
        <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.5 }}>{activity.description}</p>
      </div>
    </div>
  )
}
