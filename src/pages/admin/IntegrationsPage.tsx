import { useUIStore } from '@/store/ui/uiStore'
import { Search } from 'lucide-react'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import IntegrationCard from '@/components/admin/integrations/IntegrationCard'
import IntegrationDetails from '@/components/admin/integrations/IntegrationDetails'
import {
  useIntegrationsStore,
  integrationCategories as categories,
  integrationStatuses as statuses,
} from '@/store/admin/integrationsStore'

export default function IntegrationsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const searchQuery = useIntegrationsStore((s) => s.searchQuery)
  const setSearchQuery = useIntegrationsStore((s) => s.setSearchQuery)
  const categoryFilter = useIntegrationsStore((s) => s.categoryFilter)
  const setCategoryFilter = useIntegrationsStore((s) => s.setCategoryFilter)
  const statusFilter = useIntegrationsStore((s) => s.statusFilter)
  const setStatusFilter = useIntegrationsStore((s) => s.setStatusFilter)
  const selectedId = useIntegrationsStore((s) => s.selectedId)
  const setSelectedId = useIntegrationsStore((s) => s.setSelectedId)
  const integrations = useIntegrationsStore((s) => s.integrations)
  const handleConnect = useIntegrationsStore((s) => s.connectIntegration)
  const handleDisconnect = useIntegrationsStore((s) => s.disconnectIntegration)

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

  const handleTestConnection = () => {
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
