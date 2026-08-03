import { useState } from 'react'
import { useUIStore } from '../stores/uiStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import TaxesTable from '../components/taxes/TaxesTable'
import PoliciesTable from '../components/taxes/PoliciesTable'
import TaxSummarySidebar from '../components/taxes/TaxSummarySidebar'
import PolicyDetailsSidebar from '../components/taxes/PolicyDetailsSidebar'
import QuickActionsSidebar from '../components/taxes/QuickActionsSidebar'

const tabs = ['Taxes', 'Policies']

export default function TaxesPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const [activeTab, setActiveTab] = useState('Taxes')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Taxes & Policies" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 0,
              borderBottom: '1px solid #E5E7EB',
              marginBottom: 24,
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 20px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: 14,
                  fontWeight: 500,
                  color: activeTab === tab ? 'var(--primary)' : '#6B7280',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: -1,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content: Left side + Right sidebar */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            {/* Left side - main content */}
            <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {activeTab === 'Taxes' && (
                <>
                  <TaxesTable />
                  <PoliciesTable />
                </>
              )}
              {activeTab === 'Policies' && (
                <>
                  <PoliciesTable />
                  <TaxesTable />
                </>
              )}
            </div>

            {/* Right sidebar */}
            <div style={{ width: 300, flexShrink: 0 }}>
              <TaxSummarySidebar />
              <PolicyDetailsSidebar />
              <QuickActionsSidebar />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
