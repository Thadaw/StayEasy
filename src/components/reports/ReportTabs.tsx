interface ReportTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = ['Overview', 'Bookings', 'Rooms', 'Restaurant', 'Housekeeping', 'Guests', 'Staff', 'Financial']

export default function ReportTabs({ activeTab, onTabChange }: ReportTabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 0,
        borderBottom: '1px solid #E5E7EB',
        marginBottom: 20,
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{
            padding: '12px 18px',
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
  )
}
