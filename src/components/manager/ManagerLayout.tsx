import ManagerSidebar from './ManagerSidebar'
import ManagerHeader from './ManagerHeader'
import EditBookingOverlay from './editbooking/EditBookingOverlay'
import { useUIStore } from '../../stores/uiStore'
import { useEditBookingStore } from '../../stores/editBookingStore'

interface ManagerLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  searchPlaceholder?: string
  breadcrumb?: React.ReactNode
}

export default function ManagerLayout({ children, title, subtitle, searchPlaceholder, breadcrumb }: ManagerLayoutProps) {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const editingId = useEditBookingStore((s) => s.editingId)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <ManagerSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <ManagerHeader
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={title}
          subtitle={subtitle}
          searchPlaceholder={searchPlaceholder}
          breadcrumb={breadcrumb}
        />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          {children}
        </main>
      </div>
      {editingId && <EditBookingOverlay key={editingId} bookingId={editingId} />}
    </div>
  )
}
