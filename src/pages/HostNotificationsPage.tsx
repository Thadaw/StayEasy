import { useState } from 'react'
import { useUIStore } from '../stores/uiStore'
import { Search, Bell } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'

interface HostNotification {
  id: string
  icon: string
  title: string
  subtitle: string
  description: string
  time: string
  type: 'booking' | 'payment' | 'checkin' | 'housekeeping' | 'restaurant' | 'warning' | 'system'
  priority: 'High' | 'Medium' | 'Low'
  status: 'Unread' | 'Read'
  created: string
  module: string
  actionLabel: string
  actionModule: string
  color: string
  bg: string
}

const initialNotifications: HostNotification[] = [
  {
    id: '1', icon: '🔴', title: 'New Booking', subtitle: 'John Smith booked Deluxe Room 204.', description: 'John Smith booked Deluxe Room 204 for 3 nights.', time: '2 minutes ago', type: 'booking', priority: 'High', status: 'Unread', created: 'Today, 10:25 AM', module: 'Bookings', actionLabel: 'View Booking', actionModule: '/host/bookings', color: '#ef4444', bg: 'rgba(239,68,68,0.1)',
  },
  {
    id: '2', icon: '🟢', title: 'Payment Received', subtitle: 'NPR 12,500 received via eSewa.', description: 'NPR 12,500 received via eSewa for booking #BK-1025.', time: '15 minutes ago', type: 'payment', priority: 'Medium', status: 'Unread', created: 'Today, 10:12 AM', module: 'Payments', actionLabel: 'View Payment', actionModule: '/host/payments', color: '#22c55e', bg: 'rgba(34,197,94,0.1)',
  },
  {
    id: '3', icon: '🟠', title: 'Check-in Reminder', subtitle: '5 guests are arriving today.', description: '5 guests are scheduled to check in today. Please prepare rooms.', time: '30 minutes ago', type: 'checkin', priority: 'High', status: 'Unread', created: 'Today, 09:57 AM', module: 'Guests', actionLabel: 'View Guests', actionModule: '/host/guests', color: '#f97316', bg: 'rgba(249,115,22,0.1)',
  },
  {
    id: '4', icon: '🔵', title: 'Housekeeping Completed', subtitle: 'Room 305 is ready for check-in.', description: 'Housekeeping has completed cleaning Room 305. It is ready for new guests.', time: '1 hour ago', type: 'housekeeping', priority: 'Medium', status: 'Unread', created: 'Today, 09:30 AM', module: 'Housekeeping', actionLabel: 'View Room', actionModule: '/host/housekeeping', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',
  },
  {
    id: '5', icon: '🟣', title: 'Restaurant Order Ready', subtitle: 'Order #R-208 for Table 7 is ready.', description: 'Order #R-208 for Table 7 has been prepared and is ready for serving.', time: '1 hour ago', type: 'restaurant', priority: 'Medium', status: 'Unread', created: 'Today, 09:15 AM', module: 'Restaurant POS', actionLabel: 'View Order', actionModule: '/host/restaurant', color: '#a855f7', bg: 'rgba(168,85,247,0.1)',
  },
  {
    id: '6', icon: '⚠️', title: 'Low Room Availability', subtitle: 'Only 2 Deluxe Rooms available.', description: 'Only 2 Deluxe Rooms are available for upcoming dates. Consider adjusting pricing.', time: '2 hours ago', type: 'warning', priority: 'Low', status: 'Unread', created: 'Today, 08:30 AM', module: 'Pricing', actionLabel: '', actionModule: '', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
  },
  {
    id: '7', icon: '⚙️', title: 'System Backup Completed', subtitle: 'Daily backup completed successfully.', description: 'Daily system backup has been completed successfully. All data is secured.', time: 'Yesterday', type: 'system', priority: 'Low', status: 'Read', created: 'Yesterday, 02:00 AM', module: 'System', actionLabel: '', actionModule: '', color: '#6b7280', bg: 'rgba(107,114,128,0.1)',
  },
  {
    id: '8', icon: '🔴', title: 'New Booking', subtitle: 'Emily Johnson booked Suite 501.', description: 'Emily Johnson booked Suite 501 for 2 nights (Aug 12 - Aug 14).', time: 'Yesterday', type: 'booking', priority: 'High', status: 'Read', created: 'Yesterday, 04:15 PM', module: 'Bookings', actionLabel: 'View Booking', actionModule: '/host/bookings', color: '#ef4444', bg: 'rgba(239,68,68,0.1)',
  },
]

const typeConfig: Record<string, { label: string; icon: string }> = {
  booking: { label: 'Booking', icon: '🔴' },
  payment: { label: 'Payment', icon: '🟢' },
  checkin: { label: 'Check-in', icon: '🟠' },
  housekeeping: { label: 'Housekeeping', icon: '🔵' },
  restaurant: { label: 'Restaurant', icon: '🟣' },
  warning: { label: 'Warning', icon: '⚠️' },
  system: { label: 'System', icon: '⚙️' },
}

export default function HostNotificationsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [filterRead, setFilterRead] = useState('All')
  const [selectedId, setSelectedId] = useState<string>('')
  const [notifications, setNotifications] = useState<HostNotification[]>(initialNotifications)

  const unreadCount = notifications.filter((n) => n.status === 'Unread').length
  const highPriorityCount = notifications.filter((n) => n.priority === 'High').length
  const todayCount = notifications.filter((n) => n.time.includes('minute') || n.time.includes('hour')).length

  const filtered = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'All' || n.type === filterType
    const matchesRead =
      filterRead === 'All' ||
      (filterRead === 'Unread' && n.status === 'Unread') ||
      (filterRead === 'Read' && n.status === 'Read')
    return matchesSearch && matchesType && matchesRead
  })

  const selectedNotification = notifications.find((n) => n.id === selectedId) || null

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'Read' as const } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, status: 'Read' as const }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    if (selectedId === id) setSelectedId('')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Notifications" subtitle="Stay updated with bookings, payments, housekeeping, and system alerts." />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total', value: notifications.length, color: 'var(--brand-dark)' },
              { label: 'Unread', value: unreadCount, color: '#ef4444' },
              { label: 'High Priority', value: highPriorityCount, color: '#f97316' },
              { label: 'Today', value: todayCount, color: '#3b82f6' },
            ].map((stat) => (
              <div key={stat.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '16px 20px' }}>
                <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 360, padding: '10px 14px', background: '#fff', borderRadius: 8, border: '1px solid var(--border)' }}>
              <Search size={16} style={{ color: 'var(--muted-foreground)' }} />
              <input
                placeholder="Search Notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, outline: 'none', color: 'var(--foreground)' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ padding: '10px 32px 10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 13, color: 'var(--foreground)', appearance: 'none', cursor: 'pointer' }}
              >
                <option value="All">All</option>
                <option value="booking">Booking</option>
                <option value="payment">Payment</option>
                <option value="checkin">Check-in</option>
                <option value="housekeeping">Housekeeping</option>
                <option value="restaurant">Restaurant</option>
                <option value="warning">Warning</option>
                <option value="system">System</option>
              </select>
              <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 12, color: 'var(--muted-foreground)' }}>▼</div>
            </div>
            <div style={{ position: 'relative' }}>
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                style={{ padding: '10px 32px 10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 13, color: 'var(--foreground)', appearance: 'none', cursor: 'pointer' }}
              >
                <option value="All">All Status</option>
                <option value="Unread">Unread</option>
                <option value="Read">Read</option>
              </select>
              <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 12, color: 'var(--muted-foreground)' }}>▼</div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--foreground)',
                  whiteSpace: 'nowrap',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-5.5 5.5"/></svg>
                Mark All as Read
              </button>
            )}
          </div>

          {/* Main Content: List + Details */}
          <div style={{ display: 'flex', gap: 20 }}>
            {/* Notification List */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <Bell size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                    <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 4px' }}>No notifications found</p>
                    <p style={{ fontSize: 14, color: 'var(--muted-foreground)', margin: 0 }}>Try adjusting your search or filters.</p>
                  </div>
                ) : (
                  filtered.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => setSelectedId(notification.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 14,
                        padding: '16px 20px',
                        background: notification.status === 'Unread' ? notification.bg : '#fff',
                        borderRadius: 12,
                        border: `1px solid ${selectedId === notification.id ? notification.color : notification.status === 'Unread' ? notification.color + '30' : 'var(--border)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{notification.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: 14, fontWeight: notification.status === 'Unread' ? 700 : 500, color: 'var(--foreground)' }}>
                            {notification.title}
                          </span>
                          {notification.status === 'Unread' && (
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: notification.color, flexShrink: 0 }} />
                          )}
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: '0 0 6px', lineHeight: 1.5 }}>
                          {notification.subtitle}
                        </p>
                        <span style={{ fontSize: 12, color: 'var(--muted-foreground)', opacity: 0.7 }}>
                          {notification.time}
                        </span>
                      </div>
                      {notification.actionLabel && (
                        <button
                          onClick={(e) => { e.stopPropagation() }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 6,
                            border: '1px solid var(--border)',
                            background: '#fff',
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 500,
                            color: 'var(--foreground)',
                            flexShrink: 0,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {notification.actionLabel}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
              {filtered.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <button
                    style={{
                      padding: '10px 24px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: '#fff',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--foreground)',
                    }}
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>

            {/* Details Panel */}
            {selectedNotification && (
              <div style={{ width: 340, flexShrink: 0, background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 24, alignSelf: 'flex-start', position: 'sticky', top: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-dark)', marginBottom: 20 }}>Notification Details</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Type', value: typeConfig[selectedNotification.type]?.label || selectedNotification.type },
                    { label: 'Priority', value: selectedNotification.priority, color: selectedNotification.priority === 'High' ? '#ef4444' : selectedNotification.priority === 'Medium' ? '#f97316' : '#6b7280' },
                    { label: 'Status', value: selectedNotification.status, color: selectedNotification.status === 'Unread' ? '#3b82f6' : '#6b7280' },
                    { label: 'Created', value: selectedNotification.created },
                    { label: 'Related Module', value: selectedNotification.module },
                  ].map((field) => (
                    <div key={field.label}>
                      <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 2 }}>{field.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: field.color || 'var(--foreground)' }}>
                        {field.value}
                        {field.label === 'Type' && <span style={{ marginLeft: 6 }}>{selectedNotification.icon}</span>}
                      </div>
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 2 }}>Description</div>
                    <div style={{ fontSize: 14, color: 'var(--foreground)', lineHeight: 1.5, background: '#f8f9fb', padding: 12, borderRadius: 8, marginTop: 4 }}>
                      {selectedNotification.description}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
                  {selectedNotification.actionLabel && (
                    <button
                      style={{
                        padding: '10px 16px',
                        borderRadius: 8,
                        border: 'none',
                        background: '#2e86ab',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {selectedNotification.actionLabel === 'View Booking' ? 'Open Module' : selectedNotification.actionLabel}
                    </button>
                  )}
                  <button
                    onClick={() => markAsRead(selectedNotification.id)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: '#fff',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--foreground)',
                    }}
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => deleteNotification(selectedNotification.id)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 8,
                      border: '1px solid #ef4444',
                      background: '#fff',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#ef4444',
                    }}
                  >
                    Delete Notification
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

