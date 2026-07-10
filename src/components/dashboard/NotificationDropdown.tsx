import { useState, useRef, useEffect } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Notification {
  id: string
  title: string
  message: string
  type: 'booking' | 'checkin' | 'payment' | 'housekeeping' | 'restaurant'
  time: string
  read: boolean
  color: string
}

const initialNotifications: Notification[] = [
  { id: '1', title: 'New Booking', message: 'John Smith booked Deluxe Room 204.', type: 'booking', time: '2 min ago', read: false, color: '#ef4444' },
  { id: '2', title: 'Check-in Today', message: '5 guests are scheduled to check in today.', type: 'checkin', time: '15 min ago', read: false, color: '#f97316' },
  { id: '3', title: 'Payment Received', message: 'Booking #BK-1045 paid via eSewa.', type: 'payment', time: '30 min ago', read: false, color: '#22c55e' },
  { id: '4', title: 'Housekeeping Completed', message: 'Room 305 is ready for guests.', type: 'housekeeping', time: '1 hour ago', read: false, color: '#3b82f6' },
  { id: '5', title: 'Restaurant Order Ready', message: 'Order #R-230 has been prepared.', type: 'restaurant', time: '2 hours ago', read: false, color: '#a855f7' },
]

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleViewAll = () => {
    setIsOpen(false)
    navigate('/host/notifications')
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'var(--muted)',
          cursor: 'pointer',
          color: 'var(--muted-foreground)',
          position: 'relative',
        }}
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#ef4444',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: 'var(--card)',
            borderRadius: 12,
            border: '1px solid var(--border)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            zIndex: 50,
            width: 380,
            maxHeight: 480,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--brand-dark)' }}>Notifications</span>
            <button
              onClick={markAllAsRead}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--primary)',
                padding: 0,
              }}
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          </div>

          {/* Notification list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: notification.read ? 'var(--card)' : 'rgba(46,134,171,0.04)',
                  transition: 'background 0.15s',
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: notification.color,
                    flexShrink: 0,
                    marginTop: 5,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontWeight: notification.read ? 500 : 700, fontSize: 13, color: 'var(--brand-dark)' }}>
                      {notification.title}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.4 }}>
                    {notification.message}
                  </p>
                  <span style={{ fontSize: 11, color: 'var(--muted-foreground)', opacity: 0.7 }}>{notification.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* View All */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <button
              onClick={handleViewAll}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--primary)',
                padding: 0,
              }}
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
