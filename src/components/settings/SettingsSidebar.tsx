import {
  Building2, Settings, Calendar, BedDouble,
  Receipt, Wifi
} from 'lucide-react'

interface SettingsSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems = [
  { id: 'company', label: 'Company Profile', icon: Building2 },
  { id: 'general', label: 'General Settings', icon: Settings },
  { id: 'booking', label: 'Booking Settings', icon: Calendar },
  { id: 'room', label: 'Room & Rate Settings', icon: BedDouble },
  { id: 'taxes', label: 'Taxes & Policies', icon: Receipt },
  { id: 'amenities', label: 'Amenities', icon: Wifi },
]

export default function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <div
      style={{
        width: 240,
        flexShrink: 0,
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: '8px 0',
        height: 'fit-content',
      }}
    >
      {menuItems.map(item => {
        const isActive = activeTab === item.id
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '11px 20px',
              border: 'none',
              background: isActive ? '#F5F3FF' : 'transparent',
              color: isActive ? 'var(--primary)' : '#374151',
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              textAlign: 'left',
              borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
            }}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
