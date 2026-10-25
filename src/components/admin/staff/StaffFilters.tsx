import { Search } from 'lucide-react'

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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px 10px 36px',
  borderRadius: 8,
  border: '1px solid #E5E7EB',
  background: '#fff',
  fontSize: 13,
  color: '#374151',
  outline: 'none',
  boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #E5E7EB',
  background: '#fff',
  fontSize: 13,
  color: '#374151',
  cursor: 'pointer',
  outline: 'none',
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
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16, marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <div style={{ position: 'relative', flex: '1 1 240px' }}>
        <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input style={inputStyle} placeholder="Search staff by name, email, or contact" value={search} onChange={(e) => onSearchChange(e.target.value)} />
      </div>
      <select style={selectStyle} value={department} onChange={(e) => onDepartmentChange(e.target.value)}>
        <option value="">All Departments</option>
        <option value="Management">Management</option>
        <option value="Front Office">Front Office</option>
        <option value="Housekeeping">Housekeeping</option>
        <option value="Restaurant">Restaurant</option>
        <option value="Kitchen">Kitchen</option>
        <option value="Maintenance">Maintenance</option>
      </select>
      <select style={selectStyle} value={role} onChange={(e) => onRoleChange(e.target.value)}>
        <option value="">All Roles</option>
        <option value="Manager">Manager</option>
        <option value="Front Desk">Front Desk</option>
        <option value="Housekeeping">Housekeeping</option>
        <option value="Waiter">Waiter</option>
        <option value="Kitchen">Kitchen</option>
        <option value="Maintenance">Maintenance</option>
      </select>
      <select style={selectStyle} value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="On Leave">On Leave</option>
        <option value="Inactive">Inactive</option>
      </select>
      <button onClick={onAddStaff} style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        + Add Staff
      </button>
    </div>
  )
}
