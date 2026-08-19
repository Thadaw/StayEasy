import { Bell, Check, Trash2, Circle } from 'lucide-react'
import { useNotifications } from '../../../context/NotificationContext'

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications()

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
                      {!notification.read && (
                        <Circle size={8} className="text-brand-accent" fill="#2E86AB" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-brand-text-secondary mt-0.5">{notification.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-brand-placeholder">
                      {new Date(notification.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
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
