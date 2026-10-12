import { Search, ClipboardPlus, FileDown } from 'lucide-react'
import { DEPARTMENT_OPTIONS, ATTENDANCE_OPTIONS } from './demoStaff'

const controlStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  background: '#fff',
  fontSize: 13,
  color: '#374151',
  outline: 'none',
  boxSizing: 'border-box',
  width: '100%',
}

const navyButton: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 7,
  flex: '0 0 auto',
  padding: '10px 16px',
  borderRadius: 8,
  border: 'none',
  background: '#111827',
  color: '#fff',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

interface ManagerStaffFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  departmentFilter: string
  onDepartmentChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  onAssignTask: () => void
  onApprovals: () => void
  onExport: () => void
  approvalsCount: number
}

export default function ManagerStaffFilters({
  searchQuery,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  statusFilter,
  onStatusChange,
  onAssignTask,
  onApprovals,
  onExport,
  approvalsCount,
}: ManagerStaffFiltersProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
      }}
    >
      <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 190 }}>
        <Search
          size={15}
          color="#9ca3af"
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search employee..."
          style={{ ...controlStyle, paddingLeft: 34 }}
        />
      </div>

      <select
        value={departmentFilter}
        onChange={(e) => onDepartmentChange(e.target.value)}
        style={{ ...controlStyle, flex: '1 1 150px', minWidth: 130, cursor: 'pointer' }}
      >
        {DEPARTMENT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        style={{ ...controlStyle, flex: '1 1 130px', minWidth: 120, cursor: 'pointer' }}
      >
        {ATTENDANCE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 10,
          marginLeft: 'auto',
        }}
      >
        <button onClick={onAssignTask} style={navyButton}>
          <ClipboardPlus size={15} />
          Assign Task
        </button>
        <button
          onClick={onApprovals}
          style={{
            ...navyButton,
            background: '#fff',
            color: '#374151',
            border: '1px solid #e5e7eb',
          }}
        >
          Approvals · {approvalsCount}
        </button>
        <button onClick={onExport} style={navyButton}>
          <FileDown size={15} />
          Export Staff Report
        </button>
      </div>
    </div>
  )
}
