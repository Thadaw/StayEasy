import { create } from 'zustand'

export interface HostNotification {
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

interface NotificationsState {
  notifications: HostNotification[]
  searchQuery: string
  filterType: string
  filterRead: string
  selectedId: string
  setSearchQuery: (searchQuery: string) => void
  setFilterType: (filterType: string) => void
  setFilterRead: (filterRead: string) => void
  setSelectedId: (selectedId: string) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: initialNotifications,
  searchQuery: '',
  filterType: 'All',
  filterRead: 'All',
  selectedId: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterType: (filterType) => set({ filterType }),
  setFilterRead: (filterRead) => set({ filterRead }),
  setSelectedId: (selectedId) => set({ selectedId }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, status: 'Read' as const } : n)),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, status: 'Read' as const })),
    })),
  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      selectedId: state.selectedId === id ? '' : state.selectedId,
    })),
}))
