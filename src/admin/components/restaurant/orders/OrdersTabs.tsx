const tabs = ['All Orders', 'Dine In', 'Takeaway', 'Delivery', 'Walk-in']

interface OrdersTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function OrdersTabs({ activeTab, onTabChange }: OrdersTabsProps) {
  return (
    <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{
            padding: '14px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === tab ? 'var(--primary)' : 'var(--muted-foreground)',
            fontSize: 14,
            fontWeight: activeTab === tab ? 600 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '-1px',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
