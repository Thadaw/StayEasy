import { Settings, AlertTriangle, Plus } from 'lucide-react'

interface HousekeepingTabsBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onBulkAction: () => void
  onReviewMaintenance: () => void
  onAssignTask: () => void
}

const TABS = ['Room Status', 'Housekeeping Tasks', 'Staff Assignments']

export default function HousekeepingTabsBar({
  activeTab,
  onTabChange,
  onBulkAction,
  onReviewMaintenance,
  onAssignTask,
}: HousekeepingTabsBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="-mx-1 flex items-center gap-1 overflow-x-auto px-1">
        {TABS.map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-[13px] transition-colors ${
              activeTab === tab
                ? 'bg-[#EFF6FF] font-semibold text-[#2563EB]'
                : 'font-medium text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#374151]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onBulkAction}
          className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[#1E3A5F] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#16304C]"
        >
          <Settings size={14} />
          Bulk Action
        </button>
        <button
          type="button"
          onClick={onReviewMaintenance}
          className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[#EF4444] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#DC2626]"
        >
          <AlertTriangle size={14} />
          Review Maintenance
        </button>
        <button
          type="button"
          onClick={onAssignTask}
          className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[#0F172A] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#1E293B]"
        >
          <Plus size={15} />
          Assign Task
        </button>
      </div>
    </div>
  )
}
