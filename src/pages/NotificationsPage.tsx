import { useState } from 'react'
import { useUIStore } from '../stores/uiStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import { Bell, AlertTriangle, Clock, CheckCircle, Info, Trash2, CheckCheck } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'warning' | 'error' | 'success' | 'info'
  time: string
  read: boolean
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Subscription Expiring Soon',
    message: 'Your subscription will expire in 7 days. Renew now to avoid service interruption.',
    type: 'error',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'Renew Your Subscription',
    message: 'Your Basic plan renewal is due on Aug 15. Upgrade to Pro for more features.',
    type: 'warning',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    title: 'Pro Plan Upgrade Available',
    message: 'Unlock unlimited properties, advanced analytics, and priority support with our Pro plan.',
    type: 'info',
    time: '1 day ago',
    read: false,
  },
  {
    id: '4',
    title: 'Payment Successful',
    message: 'Your monthly subscription payment of $49.99 has been processed successfully.',
    type: 'success',
    time: '3 days ago',
    read: true,
  },
  {
    id: '5',
    title: 'Free Trial Ending',
    message: 'Your 14-day free trial ends in 2 days. Choose a plan to continue using StayEasy.',
    type: 'warning',
    time: '5 days ago',
    read: true,
  },
]

const typeConfig = {
  error: { icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  warning: { icon: Clock, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  success: { icon: CheckCircle, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  info: { icon: Info, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
}

export default function NotificationsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar simplified />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Notifications" subtitle="Stay updated with your subscription and account alerts." />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24, gap: 8 }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--foreground)',
                  }}
                >
                  <CheckCheck size={16} /> Mark All Read
                </button>
              )}
            </div>

          {/* Notifications List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notifications.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: 60,
                background: '#fff',
                borderRadius: 12,
                border: '1px solid var(--border)',
              }}>
                <Bell size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 4px' }}>
                  No notifications
                </p>
                <p style={{ fontSize: 14, color: 'var(--muted-foreground)', margin: 0 }}>
                  You're all caught up!
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const config = typeConfig[notification.type]
                const Icon = config.icon
                return (
                  <div
                    key={notification.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                      padding: '16px 20px',
                      background: notification.read ? '#fff' : config.bg,
                      borderRadius: 12,
                      border: `1px solid ${notification.read ? 'var(--border)' : config.color + '30'}`,
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: config.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={20} style={{ color: config.color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{
                          fontSize: 14,
                          fontWeight: notification.read ? 500 : 700,
                          color: 'var(--foreground)',
                        }}>
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <span style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: config.color,
                            flexShrink: 0,
                          }} />
                        )}
                      </div>
                      <p style={{
                        fontSize: 13,
                        color: 'var(--muted-foreground)',
                        margin: '0 0 6px',
                        lineHeight: 1.5,
                      }}>
                        {notification.message}
                      </p>
                      <span style={{ fontSize: 12, color: 'var(--muted-foreground)', opacity: 0.7 }}>
                        {notification.time}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: '1px solid var(--border)',
                            background: '#fff',
                            cursor: 'pointer',
                            fontSize: 12,
                            color: 'var(--foreground)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                          title="Mark as read"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 6,
                          border: '1px solid var(--border)',
                          background: '#fff',
                          cursor: 'pointer',
                          fontSize: 12,
                          color: '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                        title="Delete notification"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
