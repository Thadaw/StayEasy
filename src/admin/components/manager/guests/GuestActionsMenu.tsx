import type { GuestRow } from './demoGuests'

export type GuestAction = 'profile' | 'stayHistory' | 'bookings'

interface GuestActionsMenuProps {
  guest: GuestRow
  onAction: (action: GuestAction) => void
}

const items: { label: string; action: GuestAction }[] = [
  { label: 'View Profile', action: 'profile' },
  { label: 'View Stay History', action: 'stayHistory' },
  { label: 'View Bookings', action: 'bookings' },
]

export default function GuestActionsMenu({ guest, onAction }: GuestActionsMenuProps) {
  return (
    <div
      style={{
        position: 'absolute',
        right: 16,
        top: '100%',
        zIndex: 50,
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
        width: 220,
        padding: '16px 0 8px',
      }}
    >
      <div style={{ padding: '0 18px 12px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Guest Actions</div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
          {guest.name} • {guest.guestCode}
        </div>
      </div>
      <div style={{ padding: '6px 0' }}>
        {items.map((item) => (
          <button
            key={item.action}
            onClick={(e) => {
              e.stopPropagation()
              onAction(item.action)
            }}
            style={{
              display: 'block',
              width: '100%',
              padding: '11px 18px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#16a34a'
              e.currentTarget.style.background = '#f0fdf4'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#374151'
              e.currentTarget.style.background = 'none'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
