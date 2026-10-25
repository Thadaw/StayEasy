import { create } from 'zustand'
import type { Integration } from '@/components/admin/integrations/IntegrationCard'

export interface IntegrationSettings {
  syncFrequency: string
  autoSync: boolean
}

const initialIntegrations: Integration[] = [
  {
    id: 'esewa',
    name: 'eSewa',
    description: 'Accept online payments from guests via eSewa wallet',
    icon: '💳',
    iconBg: '#EDE9FE',
    category: 'payment',
    status: 'connected',
    merchantId: '************4523',
    recentActivity: [
      { action: 'Payment of NPR 18,000 received', time: '5 min ago' },
      { action: 'Payment of NPR 24,000 received', time: '1 hour ago' },
      { action: 'Refund processed for #BK-1042', time: '3 hours ago' },
    ],
  },
  {
    id: 'khalti',
    name: 'Khalti',
    description: 'Online payment gateway for seamless guest transactions',
    icon: '💳',
    iconBg: '#DBEAFE',
    category: 'payment',
    status: 'connected',
    merchantId: '************7891',
    recentActivity: [
      { action: 'Payment of NPR 9,000 received', time: '15 min ago' },
      { action: 'Payment of NPR 21,000 received', time: '2 hours ago' },
    ],
  },
  {
    id: 'gmail-smtp',
    name: 'Gmail SMTP',
    description: 'Send booking confirmation and notification emails',
    icon: '📧',
    iconBg: '#D1FAE5',
    category: 'email',
    status: 'connected',
    lastSync: '5 min ago',
    syncFrequency: 'Every 5 Minutes',
    autoSync: true,
    recentActivity: [
      { action: 'Booking confirmation sent to john@email.com', time: '10 min ago' },
      { action: 'Check-in reminder sent to 5 guests', time: '1 hour ago' },
      { action: 'Invoice sent to emily.j@email.com', time: '3 hours ago' },
    ],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Customer messaging and automated notifications',
    icon: '📱',
    iconBg: '#D1FAE5',
    category: 'messaging',
    status: 'connected',
    lastSync: '10 min ago',
    syncFrequency: 'Every 15 Minutes',
    autoSync: true,
    recentActivity: [
      { action: 'Welcome message sent to John Smith', time: '20 min ago' },
      { action: 'Check-in instructions sent to 3 guests', time: '2 hours ago' },
    ],
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync hotel bookings automatically',
    icon: '📅',
    iconBg: '#DBEAFE',
    category: 'calendar',
    status: 'connected',
    lastSync: '2 Minutes Ago',
    syncFrequency: 'Every 5 Minutes',
    calendarId: 'hotel@serveiq.com',
    autoSync: true,
    recentActivity: [
      { action: 'Booking #205 Synced', time: '5 min ago' },
      { action: 'Booking #204 Updated', time: '15 min ago' },
      { action: 'Reservation Cancelled', time: '1 hour ago' },
    ],
  },
  {
    id: 'google-maps',
    name: 'Google Maps',
    description: 'Display hotel location on your website and booking confirmations',
    icon: '📍',
    iconBg: '#FEF3C7',
    category: 'maps',
    status: 'not_connected',
    benefits: ['Interactive hotel location map', 'Directions for guests', 'Area points of interest'],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'International payment processing for credit/debit cards',
    icon: '💳',
    iconBg: '#EDE9FE',
    category: 'payment',
    status: 'not_connected',
    benefits: ['Accept all major credit cards', 'International payments', 'Automatic currency conversion'],
  },
  {
    id: 'sms-gateway',
    name: 'SMS Gateway',
    description: 'Send booking confirmations and alerts via SMS',
    icon: '📩',
    iconBg: '#D1FAE5',
    category: 'messaging',
    status: 'not_connected',
    benefits: ['SMS booking confirmations', 'Check-in reminders', 'Promotional messages'],
  },
  {
    id: 'google-drive',
    name: 'Google Drive (Backup)',
    description: 'Automatic backup of hotel data and reports',
    icon: '☁️',
    iconBg: '#DBEAFE',
    category: 'storage',
    status: 'not_connected',
    benefits: ['Automatic daily backups', 'Report storage', 'Data recovery'],
  },
]

export const integrationCategories = ['All', 'Payment', 'Calendar', 'Email', 'Messaging', 'Maps', 'Storage']
export const integrationStatuses = ['All', 'Connected', 'Not Connected']

interface IntegrationsState {
  integrations: Integration[]
  searchQuery: string
  categoryFilter: string
  statusFilter: string
  selectedId: string
  showDisconnectConfirm: boolean
  testResult: 'success' | 'error' | null
  integrationSettings: Record<string, IntegrationSettings>
  setSearchQuery: (searchQuery: string) => void
  setCategoryFilter: (categoryFilter: string) => void
  setStatusFilter: (statusFilter: string) => void
  setSelectedId: (selectedId: string) => void
  setShowDisconnectConfirm: (showDisconnectConfirm: boolean) => void
  setTestResult: (testResult: 'success' | 'error' | null) => void
  setIntegrationSettings: (id: string, settings: IntegrationSettings) => void
  connectIntegration: (id: string) => void
  disconnectIntegration: (id: string) => void
}

export const useIntegrationsStore = create<IntegrationsState>((set) => ({
  integrations: initialIntegrations,
  searchQuery: '',
  categoryFilter: 'All',
  statusFilter: 'All',
  selectedId: 'google-calendar',
  showDisconnectConfirm: false,
  testResult: null,
  integrationSettings: {},
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSelectedId: (selectedId) => set({ selectedId, showDisconnectConfirm: false, testResult: null }),
  setShowDisconnectConfirm: (showDisconnectConfirm) => set({ showDisconnectConfirm }),
  setTestResult: (testResult) => set({ testResult }),
  setIntegrationSettings: (id, settings) =>
    set((state) => ({ integrationSettings: { ...state.integrationSettings, [id]: settings } })),
  connectIntegration: (id) =>
    set((state) => ({
      integrations: state.integrations.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'connected' as const,
              lastSync: 'Just now',
              syncFrequency: 'Every 5 Minutes',
              autoSync: true,
              recentActivity: [],
            }
          : i
      ),
    })),
  disconnectIntegration: (id) =>
    set((state) => ({
      integrations: state.integrations.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'not_connected' as const,
              lastSync: undefined,
              syncFrequency: undefined,
              autoSync: undefined,
              recentActivity: undefined,
            }
          : i
      ),
    })),
}))
