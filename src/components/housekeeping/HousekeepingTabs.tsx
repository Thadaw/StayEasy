interface HousekeepingTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  activeFloor: string
  onFloorChange: (floor: string) => void
}

const tabs = ['Room Status', 'Housekeeping Tasks', 'Staff Assignments']
const floors = ['All Floors', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor']

export default function HousekeepingTabs({ activeTab, onTabChange, activeFloor, onFloorChange }: HousekeepingTabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottom: '1px solid #E5E7EB',
      }}
    >
      <div style={{ display: 'flex', gap: 0 }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
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

      <div style={{ display: 'flex', gap: 6 }}>
        {floors.map(floor => (
          <button
            key={floor}
            onClick={() => onFloorChange(floor)}
            style={{
              padding: '6px 14px',
              border: activeFloor === floor ? 'none' : '1px solid #E5E7EB',
              borderRadius: 20,
              background: activeFloor === floor ? 'var(--primary)' : '#fff',
              color: activeFloor === floor ? '#fff' : '#6B7280',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {floor}
          </button>
        ))}
      </div>
    </div>
  )
}
