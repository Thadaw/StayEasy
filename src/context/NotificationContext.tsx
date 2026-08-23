import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import { CalendarDays, TicketPercent, Shield, Bell } from 'lucide-react'

export type NotificationIcon = typeof CalendarDays

export interface Notification {
  id: string
  icon: NotificationIcon
  color: string
  bgColor: string
  title: string
  message: string
  timestamp: string
  read: boolean
}

interface NotificationContextValue {
  notifications: Notification[]
  unreadCount: number
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

function getStorageKey(userId?: number): string {
  return userId ? `notifications_${userId}` : 'notifications_guest'
}

function loadNotifications(userId?: number): Notification[] {
  try {
    const data = localStorage.getItem(getStorageKey(userId))
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveNotifications(notifications: Notification[], userId?: number) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(notifications))
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>(() => loadNotifications(user?.id))

  useEffect(() => {
    setNotifications(loadNotifications(user?.id))
  }, [user?.id])

  useEffect(() => {
    saveNotifications(notifications, user?.id)
  }, [notifications, user?.id])

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = useCallback(
    (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const now = new Date().toISOString()
      const newNotification: Notification = {
        ...n,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: now,
        read: false,
      }
      setNotifications(prev => [newNotification, ...prev])
    },
    []
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, deleteNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider')
  return ctx
}
