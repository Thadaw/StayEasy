import { useUIStore } from '@/store/ui/uiStore'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import SupportForm from '@/components/admin/support/SupportForm'

export default function SupportPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Support Tickets" subtitle="Raise a Ticket" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          <div style={{ maxWidth: 900 }}>
            <SupportForm />
          </div>
        </main>
      </div>
    </div>
  )
}
