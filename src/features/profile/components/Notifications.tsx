import { useState } from 'react'
import { Bell, CalendarDays, TicketPercent, Shield, Check, Trash2, Circle } from 'lucide-react'

interface Notification {
  id: string
  icon: typeof Bell
  color: string
  bgColor: string
  title: string
  message: string
  timestamp: string
  read: boolean
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    icon: CalendarDays,
    color: 'var(--brand-accent)',
    bgColor: 'var(--brand-accent-light)',
    title: 'Booking Confirmed',
    message: 'Your booking at Himalaya Paradise has been confirmed. Check-in is on Jul 15, 2026.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    icon: TicketPercent,
    color: 'var(--brand-warning)',
    bgColor: 'var(--brand-warning-light)',
    title: 'Special Offer',
    message: 'Get 20% off on your next booking with code WELCOME20. Offer valid until Aug 31.',
    timestamp: '1 day ago',
    read: false,
  },
  {
    id: '3',
    icon: Shield,
    color: 'var(--brand-success)',
    bgColor: 'var(--brand-success-light)',
    title: 'Account Verified',
    message: 'Your identity has been verified successfully. You can now book with confidence.',
    timestamp: '3 days ago',
    read: true,
  },
  {
    id: '4',
    icon: Bell,
    color: 'var(--brand-text-secondary)',
    bgColor: 'var(--brand-secondary-surface)',
    title: 'Welcome to StayEasy',
    message: 'Thank you for joining StayEasy! Start exploring thousands of properties worldwide.',
    timestamp: '1 week ago',
    read: true,
  },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  if (notifications.length === 0) {
    return (
      <div className="max-w-3xl">
        <div className="bg-white rounded-xl border border-brand-card-border p-12 text-center">
          <Bell size={48} className="text-brand-placeholder mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-brand-heading mb-2">No notifications</h2>
          <p className="text-sm text-brand-text-secondary">You're all caught up!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-xl border border-brand-card-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-card-border">
          <h2 className="text-base font-semibold text-brand-heading flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-accent text-white">
                {unreadCount} new
              </span>
            )}
          </h2>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-semibold text-brand-accent hover:text-brand-accent-hover border-none bg-transparent cursor-pointer transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className="divide-y divide-brand-card-border">
          {notifications.map(notification => {
            const Icon = notification.icon
            return (
              <div
                key={notification.id}
                className={`flex items-start gap-4 px-6 py-4 transition-colors ${
                  !notification.read ? 'bg-brand-secondary-surface' : ''
                }`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: notification.bgColor }}
                >
                  <Icon size={18} style={{ color: notification.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-brand-heading`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {!notification.read ? (
                        <Circle size={8} className="text-brand-accent" fill="#2E86AB" />
                      ) : null}
                    </div>
                  </div>
                  <p className="text-xs text-brand-text-secondary mt-0.5">{notification.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-brand-placeholder">{notification.timestamp}</span>
                    <div className="flex gap-1.5">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-[10px] font-semibold px-2 py-1 rounded-lg border border-brand-card-border text-brand-text-secondary hover:bg-brand-secondary-surface transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check size={10} /> Mark read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-[10px] font-semibold px-2 py-1 rounded-lg border border-brand-card-border text-brand-danger hover:bg-brand-danger-light transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 size={10} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
