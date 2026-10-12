export interface NotificationKpi {
  label: string
  value: string
  caption: string
}

export const NOTIFICATION_KPIS: NotificationKpi[] = [
  { label: 'Unread Notifications', value: '18', caption: '8 requires attention' },
  { label: 'New Today', value: '9', caption: 'Since midnight' },
  { label: 'High Priority Alerts', value: '3', caption: 'Immediate review' },
  { label: 'Resolved Notifications', value: '126', caption: 'This month' },
]

export type NotificationType = 'Booking' | 'Maintenance' | 'Housekeeping' | 'Staff' | 'Payment' | 'Review' | 'Guest'
export type NotificationStatus = 'Unread' | 'High' | 'Pending' | 'Resolved'

export const NOTIFICATION_STATUS_PILL: Record<NotificationStatus, { background: string; color: string }> = {
  Unread: { background: '#dbeafe', color: '#2563eb' },
  High: { background: '#fee2e2', color: '#dc2626' },
  Pending: { background: '#fef3c7', color: '#d97706' },
  Resolved: { background: '#dcfce7', color: '#16a34a' },
}

export const NOTIFICATION_TYPES: NotificationType[] = [
  'Booking',
  'Maintenance',
  'Housekeeping',
  'Staff',
  'Payment',
  'Review',
  'Guest',
]

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  type: NotificationType
  status: NotificationStatus
  icon: 'calendar' | 'wrench' | 'sparkles' | 'swap' | 'card' | 'star' | 'refund' | 'crown'
  accent: string
  iconBg: string
  iconColor: string
}

export const NOTIFICATION_FEED: NotificationItem[] = [
  {
    id: 'n1',
    title: 'New Booking Received',
    description: 'New reservation #4821 by Sophie Bennett for Deluxe Room 406.',
    time: '2 minutes ago',
    type: 'Booking',
    status: 'Unread',
    icon: 'calendar',
    accent: '#2563eb',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
  },
  {
    id: 'n2',
    title: 'Room Maintenance Overdue',
    description: "Room 304 AC repair is overdue and may affect today's availability.",
    time: '1 hour ago',
    type: 'Maintenance',
    status: 'High',
    icon: 'wrench',
    accent: '#dc2626',
    iconBg: '#fee2e2',
    iconColor: '#dc2626',
  },
  {
    id: 'n3',
    title: 'Cleaning Completed',
    description: 'Room 212 passed inspection after housekeeping completion.',
    time: '10 minutes ago',
    type: 'Housekeeping',
    status: 'Unread',
    icon: 'sparkles',
    accent: '#16a34a',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
  },
  {
    id: 'n4',
    title: 'Shift Swap Awaiting Approval',
    description: 'Rina Thapa swapped Front Desk evening shift with Samir for tomorrow.',
    time: '30 minutes ago',
    type: 'Staff',
    status: 'Pending',
    icon: 'swap',
    accent: '#2563eb',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
  },
  {
    id: 'n5',
    title: 'Payment Received',
    description: 'Booking #4819 completed successfully via card.',
    time: '45 minutes ago',
    type: 'Payment',
    status: 'Resolved',
    icon: 'card',
    accent: '#16a34a',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
  },
  {
    id: 'n6',
    title: 'New Guest Review',
    description: 'A new 5-star review has been submitted by Emily Stone.',
    time: '1 hour ago',
    type: 'Review',
    status: 'Unread',
    icon: 'star',
    accent: '#2563eb',
    iconBg: '#dbeafe',
    iconColor: '#d97706',
  },
  {
    id: 'n7',
    title: 'Refund Request Review',
    description: 'Refund request for Booking #4816 exceeds the manager auto-approval limit.',
    time: '2 hours ago',
    type: 'Booking',
    status: 'High',
    icon: 'refund',
    accent: '#ea580c',
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
  },
  {
    id: 'n8',
    title: 'VIP Guest Arriving Soon',
    description: 'VIP guest Laura Chen is scheduled to arrive in Suite 512.',
    time: '1 hour ago',
    type: 'Guest',
    status: 'Unread',
    icon: 'crown',
    accent: '#2563eb',
    iconBg: '#dbeafe',
    iconColor: '#8b5cf6',
  },
]
