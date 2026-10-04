import { useState } from 'react'

const ITEMS = [
  {
    id: 'booking',
    title: 'Booking Notifications',
    description: 'New reservations, cancellations and reminders',
    defaultOn: true,
  },
  {
    id: 'payment',
    title: 'Payment Notifications',
    description: 'Payment confirmations and outstanding dues',
    defaultOn: true,
  },
  {
    id: 'reviews',
    title: 'Guest Reviews',
    description: 'New reviews and pending responses',
    defaultOn: true,
  },
  {
    id: 'maintenance',
    title: 'Maintenance Alerts',
    description: 'Room issues and service availability issues',
    defaultOn: true,
  },
  {
    id: 'staff',
    title: 'Staff Notifications',
    description: 'Shift swaps and staff attendance shifts',
    defaultOn: false,
  },
]

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        border: 'none',
        background: on ? '#2563eb' : '#d1d5db',
        position: 'relative',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background 0.15s',
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 20 : 2,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.15s',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  )
}

export default function NotificationsSettingsTab() {
  const [state, setState] = useState(() =>
    Object.fromEntries(ITEMS.map((item) => [item.id, item.defaultOn])),
  )

  return (
    <div>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Notifications</h3>
      <p style={{ margin: '4px 0 16px', fontSize: 13, color: '#6b7280' }}>Choose how you want to be notified</p>

      <div className="s-card" style={{ padding: '8px 24px' }}>
        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              padding: '16px 0',
              borderTop: i === 0 ? 'none' : '1px solid #f3f4f6',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{item.title}</div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{item.description}</div>
            </div>
            <Toggle
              label={item.title}
              on={state[item.id]}
              onToggle={() => setState((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
