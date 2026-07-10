import {
  Building2, Settings, Calendar, BedDouble, UtensilsCrossed,
  Sparkles, Bell, CreditCard, Receipt, Shield, Mail,
  FileText, Upload, Lock, Activity
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
  { id: 'restaurant', label: 'Restaurant Settings', icon: UtensilsCrossed },
  { id: 'housekeeping', label: 'Housekeeping Settings', icon: Sparkles },
  { id: 'notification', label: 'Notification Settings', icon: Bell },
  { id: 'payment', label: 'Payment Settings', icon: CreditCard },
  { id: 'taxes', label: 'Taxes', icon: Receipt },
  { id: 'policies', label: 'Policies', icon: Shield },
  { id: 'email', label: 'Email Templates', icon: Mail },
  { id: 'document', label: 'Document Templates', icon: FileText },
  { id: 'backup', label: 'Backup & Restore', icon: Upload },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'activity', label: 'Activity Logs', icon: Activity },
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
              color: isActive ? '#7C3AED' : '#374151',
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              textAlign: 'left',
              borderLeft: isActive ? '3px solid #7C3AED' : '3px solid transparent',
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
