import { useState } from 'react'
import { useUIStore } from '../stores/uiStore'
import { Search } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import IntegrationCard from '../components/integrations/IntegrationCard'
import IntegrationDetails from '../components/integrations/IntegrationDetails'
import type { Integration } from '../components/integrations/IntegrationCard'

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
    calendarId: 'hotel@stayeasy.com',
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

const categories = ['All', 'Payment', 'Calendar', 'Email', 'Messaging', 'Maps', 'Storage']
const statuses = ['All', 'Connected', 'Not Connected']

export default function IntegrationsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedId, setSelectedId] = useState<string>('google-calendar')
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations)

  const filtered = integrations.filter((i) => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || i.category === categoryFilter.toLowerCase()
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Connected' && i.status === 'connected') ||
      (statusFilter === 'Not Connected' && i.status === 'not_connected')
    return matchesSearch && matchesCategory && matchesStatus
  })

  const connectedCount = integrations.filter((i) => i.status === 'connected').length
  const availableCount = integrations.filter((i) => i.status === 'not_connected').length

  const selectedIntegration = integrations.find((i) => i.id === selectedId) || integrations[0]

  const handleConnect = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
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
      )
    )
  }

  const handleDisconnect = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
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
      )
    )
  }

  const handleTestConnection = (_id: string) => {
    // Placeholder for future API integration
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Integrations" subtitle="Manage third-party service integrations" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          {/* Search and Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 360, padding: '10px 14px', background: '#fff', borderRadius: 8, border: '1px solid var(--border)' }}>
              <Search size={16} style={{ color: 'var(--muted-foreground)' }} />
              <input
                placeholder="Search Integration..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, outline: 'none', color: 'var(--foreground)' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ padding: '10px 32px 10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 13, color: 'var(--foreground)', appearance: 'none', cursor: 'pointer' }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'Category' : c}</option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 12, color: 'var(--muted-foreground)' }}>▼</div>
            </div>
            <div style={{ position: 'relative' }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '10px 32px 10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 13, color: 'var(--foreground)', appearance: 'none', cursor: 'pointer' }}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s === 'All' ? 'Status' : s}</option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 12, color: 'var(--muted-foreground)' }}>▼</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24, maxWidth: 400 }}>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '16px 20px' }}>
              <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 4 }}>Connected</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--brand-dark)' }}>{connectedCount}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '16px 20px' }}>
              <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginBottom: 4 }}>Available</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--brand-dark)' }}>{availableCount}</div>
            </div>
          </div>

          {/* Main Content: List + Details */}
          <div style={{ display: 'flex', gap: 20 }}>
            {/* Integration List */}
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 280px)' }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted-foreground)' }}>
                  No integrations found matching your criteria.
                </div>
              ) : (
                filtered.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    isSelected={selectedIntegration?.id === integration.id}
                    onSelect={() => setSelectedId(integration.id)}
                  />
                ))
              )}
            </div>

            {/* Details Panel */}
            <div style={{ width: 380, flexShrink: 0 }}>
              {selectedIntegration && (
                <IntegrationDetails
                  key={selectedIntegration.id}
                  integration={selectedIntegration}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                  onTestConnection={handleTestConnection}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
