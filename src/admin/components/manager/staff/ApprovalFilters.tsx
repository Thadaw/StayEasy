import { ArrowLeft } from 'lucide-react'
import { APPROVAL_DEPARTMENT_OPTIONS, APPROVAL_TYPE_OPTIONS } from './demoApprovals'

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

interface ApprovalFiltersProps {
  typeFilter: string
  onTypeChange: (value: string) => void
  departmentFilter: string
  onDepartmentChange: (value: string) => void
  onBack: () => void
}

export default function ApprovalFilters({
  typeFilter,
  onTypeChange,
  departmentFilter,
  onDepartmentChange,
  onBack,
}: ApprovalFiltersProps) {
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
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value)}
        style={{ ...controlStyle, flex: '1 1 160px', minWidth: 140, maxWidth: 220, cursor: 'pointer' }}
      >
        {APPROVAL_TYPE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        value={departmentFilter}
        onChange={(e) => onDepartmentChange(e.target.value)}
        style={{ ...controlStyle, flex: '1 1 160px', minWidth: 140, maxWidth: 220, cursor: 'pointer' }}
      >
        {APPROVAL_DEPARTMENT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          marginLeft: 'auto',
          flex: '0 0 auto',
          padding: '10px 16px',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          background: '#fff',
          color: '#374151',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        <ArrowLeft size={15} />
        Back to Staff
      </button>
    </div>
  )
}
