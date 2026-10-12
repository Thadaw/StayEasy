interface ManagerBookingTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  counts: Record<string, number>
}

const tabs = ['All', 'Confirmed', 'Pending', 'Checked-In', 'Checked-out', 'Cancelled']

export default function ManagerBookingTabs({ activeTab, onTabChange, counts }: ManagerBookingTabsProps) {
  return (
    <div style={{
      display: 'flex',
      gap: 4,
      padding: 4,
      background: '#fff',
      borderRadius: 10,
      border: '1px solid #e5e7eb',
      marginBottom: 16,
      overflowX: 'auto',
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab
        const count = counts[tab] ?? 0
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: isActive ? '#eff6ff' : 'transparent',
              color: isActive ? '#2563eb' : '#6b7280',
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {tab} <span style={{ color: isActive ? '#2563eb' : '#9ca3af', marginLeft: 4 }}>({count})</span>
          </button>
        )
      })}
    </div>
  )
}
