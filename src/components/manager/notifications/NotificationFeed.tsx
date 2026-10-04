import { Calendar, Wrench, Sparkles, ArrowLeftRight, CreditCard, Star, RotateCcw, Crown, MoreVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import { NOTIFICATION_STATUS_PILL, type NotificationItem } from './demoNotifications'

const ICONS = {
  calendar: Calendar,
  wrench: Wrench,
  sparkles: Sparkles,
  swap: ArrowLeftRight,
  card: CreditCard,
  star: Star,
  refund: RotateCcw,
  crown: Crown,
}

interface NotificationFeedProps {
  items: NotificationItem[]
  onReset: () => void
}

export default function NotificationFeed({ items, onReset }: NotificationFeedProps) {
  return (
    <div className="n-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '20px 24px 16px',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Notification Feed</h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Latest alerts and activity updates</p>
        </div>
        <button
          onClick={onReset}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: '#fff',
            color: '#111827',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item) => {
          const Icon = ICONS[item.icon]
          const pill = NOTIFICATION_STATUS_PILL[item.status]
          return (
            <div
              key={item.id}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 24px 14px 0',
                borderTop: '1px solid #f3f4f6',
                position: 'relative',
              }}
            >
              <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: item.accent }} />

              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: item.iconBg,
                  color: item.iconColor,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 20,
                  flexShrink: 0,
                }}
              >
                <Icon size={18} />
              </span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{item.description}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{item.time}</div>
              </div>

              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  background: pill.background,
                  color: pill.color,
                  whiteSpace: 'nowrap',
                }}
              >
                {item.status}
              </span>

              <button
                title="More"
                onClick={() => toast.success(`Opened "${item.title}"`)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: 'none',
                  background: 'transparent',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f3f4f6'
                  e.currentTarget.style.color = '#374151'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#9ca3af'
                }}
              >
                <MoreVertical size={15} />
              </button>
            </div>
          )
        })}
        {items.length === 0 && (
          <div style={{ padding: '32px 24px', textAlign: 'center', color: '#9ca3af', fontSize: 13, borderTop: '1px solid #f3f4f6' }}>
            No notifications match the selected filters.
          </div>
        )}
      </div>
    </div>
  )
}
