import { Search, ChevronDown, Plus } from 'lucide-react'

interface StaffFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  department: string
  onDepartmentChange: (value: string) => void
  role: string
  onRoleChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  onAddStaff: () => void
}

const selectStyle: React.CSSProperties = {
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  background: '#fff',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  padding: '10px 36px 10px 14px',
  fontSize: 14,
  color: '#374151',
  fontWeight: 500,
  cursor: 'pointer',
  outline: 'none',
  backgroundImage: 'none',
  minWidth: 160,
}

const dropdownWrapperStyle: React.CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
}

const dropdownIconStyle: React.CSSProperties = {
  position: 'absolute',
  right: 12,
  pointerEvents: 'none',
  color: '#9CA3AF',
}

export default function StaffFilters({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  onAddStaff,
}: StaffFiltersProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          position: 'relative',
          flex: '1 1 280px',
          maxWidth: 380,
        }}
      >
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9CA3AF',
          }}
        />
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search by name, email or phone..."
          style={{
            width: '100%',
            padding: '10px 14px 10px 42px',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            fontSize: 14,
            color: '#374151',
            outline: 'none',
            background: '#fff',
          }}
        />
      </div>

      <div style={dropdownWrapperStyle}>
        <select
          value={department}
          onChange={e => onDepartmentChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Departments</option>
          <option value="Front Office">Front Office</option>
          <option value="Housekeeping">Housekeeping</option>
          <option value="Kitchen">Kitchen</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Accounts">Accounts</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        <ChevronDown size={16} style={dropdownIconStyle} />
      </div>

      <div style={dropdownWrapperStyle}>
        <select
          value={role}
          onChange={e => onRoleChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Roles</option>
          <option value="Manager">Manager</option>
          <option value="Receptionist">Receptionist</option>
          <option value="Housekeeping Staff">Housekeeping Staff</option>
          <option value="Housekeeping Supervisor">Housekeeping Supervisor</option>
          <option value="Chef">Chef</option>
          <option value="Waiter">Waiter</option>
          <option value="Cashier">Cashier</option>
          <option value="Maintenance Staff">Maintenance Staff</option>
        </select>
        <ChevronDown size={16} style={dropdownIconStyle} />
      </div>

      <div style={dropdownWrapperStyle}>
        <select
          value={status}
          onChange={e => onStatusChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
        <ChevronDown size={16} style={dropdownIconStyle} />
      </div>

      <button
        onClick={onAddStaff}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 20px',
          border: 'none',
          borderRadius: 8,
          background: 'var(--primary)',
          fontSize: 14,
          fontWeight: 600,
          color: '#fff',
          cursor: 'pointer',
          marginLeft: 'auto',
        }}
      >
        <Plus size={18} />
        Add Staff
      </button>
    </div>
  )
}
