import { useUIStore } from '@/store/ui/uiStore'
import { Search, Bell } from 'lucide-react'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import { useNotificationsStore } from '@/store/admin/notificationsStore'

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
  const searchQuery = useNotificationsStore((s) => s.searchQuery)
  const setSearchQuery = useNotificationsStore((s) => s.setSearchQuery)
  const filterType = useNotificationsStore((s) => s.filterType)
  const setFilterType = useNotificationsStore((s) => s.setFilterType)
  const filterRead = useNotificationsStore((s) => s.filterRead)
  const setFilterRead = useNotificationsStore((s) => s.setFilterRead)
  const selectedId = useNotificationsStore((s) => s.selectedId)
  const setSelectedId = useNotificationsStore((s) => s.setSelectedId)
  const notifications = useNotificationsStore((s) => s.notifications)
  const markAsRead = useNotificationsStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationsStore((s) => s.markAllAsRead)
  const deleteNotification = useNotificationsStore((s) => s.deleteNotification)

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

