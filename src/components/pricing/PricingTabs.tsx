interface PricingTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = ['Room Pricing', 'Seasonal Pricing', 'Discounts & Offers', 'Packages']

export default function PricingTabs({ activeTab, onTabChange }: PricingTabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 0,
        borderBottom: '1px solid #E5E7EB',
        marginBottom: 24,
      }}
    >
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
            color: activeTab === tab ? '#7C3AED' : '#6B7280',
            cursor: 'pointer',
            borderBottom: activeTab === tab ? '2px solid #7C3AED' : '2px solid transparent',
            marginBottom: -1,
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
