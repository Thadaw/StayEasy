import { Settings, AlertTriangle, Plus } from 'lucide-react'

interface HousekeepingTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onBulkAction?: () => void
  onReviewMaintenance?: () => void
  onAssignTask?: () => void
}

const tabs = ['Room Status', 'Housekeeping Tasks', 'Staff Assignments']

export default function HousekeepingTabs({
  activeTab,
  onTabChange,
  onBulkAction,
  onReviewMaintenance,
  onAssignTask,
}: HousekeepingTabsProps) {
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
      {/* Left: Tabs */}
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
              color: activeTab === tab ? '#2563EB' : '#6B7280',
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid #2563EB' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Right: Action Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onBulkAction}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            background: '#fff',
            fontSize: 13,
            fontWeight: 500,
            color: '#374151',
            cursor: 'pointer',
          }}
        >
          <Settings size={14} />
          Bulk Action
        </button>
        <button
          onClick={onReviewMaintenance}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            border: '1px solid #FECACA',
            borderRadius: 8,
            background: '#FEF2F2',
            fontSize: 13,
            fontWeight: 500,
            color: '#DC2626',
            cursor: 'pointer',
          }}
        >
          <AlertTriangle size={14} />
          Review Maintenance
        </button>
        <button
          onClick={onAssignTask}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            border: 'none',
            borderRadius: 8,
            background: '#2563EB',
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          Assign Task
        </button>
      </div>
    </div>
  )
}
