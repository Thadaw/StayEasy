import { useState, useMemo } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import StaffStats from '../components/staff/StaffStats'
import StaffFilters from '../components/staff/StaffFilters'
import StaffTable from '../components/staff/StaffTable'
import StaffPagination from '../components/staff/StaffPagination'
import type { StaffMember } from '../types/staff'

const MOCK_STAFF: StaffMember[] = [
  { id: 1, name: 'Ramesh Thapa', email: 'ramesh.thapa@email.com', role: 'Manager', department: 'Front Office', contact: '+977 9812345678', joiningDate: 'Jan 15, 2024', status: 'Active' },
  { id: 2, name: 'Sunita Shrestha', email: 'sunita.shrestha@email.com', role: 'Receptionist', department: 'Front Office', contact: '+977 9823456789', joiningDate: 'Mar 10, 2024', status: 'Active' },
  { id: 3, name: 'Kiran Gurung', email: 'kiran.gurung@email.com', role: 'Housekeeping Staff', department: 'Housekeeping', contact: '+977 9845678901', joiningDate: 'Feb 5, 2024', status: 'Active' },
  { id: 4, name: 'Anita Lama', email: 'anita.lama@email.com', role: 'Housekeeping Supervisor', department: 'Housekeeping', contact: '+977 9856789012', joiningDate: 'Nov 20, 2023', status: 'On Leave' },
  { id: 5, name: 'Sanjay Rai', email: 'sanjay.rai@email.com', role: 'Chef', department: 'Kitchen', contact: '+977 9811122233', joiningDate: 'Apr 12, 2024', status: 'Active' },
  { id: 6, name: 'Bikash Magar', email: 'bikash.magar@email.com', role: 'Waiter', department: 'Restaurant', contact: '+977 9865432109', joiningDate: 'May 1, 2024', status: 'Active' },
  { id: 7, name: 'Pooja Adhikari', email: 'pooja.adhikari@email.com', role: 'Cashier', department: 'Accounts', contact: '+977 9843322110', joiningDate: 'Jan 8, 2024', status: 'Inactive' },
  { id: 8, name: 'Dinesh Parajuli', email: 'dinesh.parajuli@email.com', role: 'Maintenance Staff', department: 'Maintenance', contact: '+977 9819988776', joiningDate: 'Jun 3, 2024', status: 'Active' },
]

export default function StaffPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredStaff = useMemo(() => {
    return MOCK_STAFF.filter(member => {
      const matchesSearch =
        !search ||
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase()) ||
        member.contact.includes(search)
      const matchesDept = !departmentFilter || member.department === departmentFilter
      const matchesRole = !roleFilter || member.role === roleFilter
      const matchesStatus = !statusFilter || member.status === statusFilter
      return matchesSearch && matchesDept && matchesRole && matchesStatus
    })
  }, [search, departmentFilter, roleFilter, statusFilter])

  const stats = useMemo(() => {
    const total = MOCK_STAFF.length
    const active = MOCK_STAFF.filter(s => s.status === 'Active').length
    const onLeave = MOCK_STAFF.filter(s => s.status === 'On Leave').length
    const inactive = MOCK_STAFF.filter(s => s.status === 'Inactive').length
    const departments = new Set(MOCK_STAFF.map(s => s.department)).size
    return { total, active, onLeave, inactive, departments }
  }, [])

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage)
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Staff" subtitle="Manage your property staff and their roles" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>

          <StaffStats stats={stats} />

          <StaffFilters
            search={search}
            onSearchChange={setSearch}
            department={departmentFilter}
            onDepartmentChange={setDepartmentFilter}
            role={roleFilter}
            onRoleChange={setRoleFilter}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            onAddStaff={() => {}}
          />

          <StaffTable staff={paginatedStaff} />

          <StaffPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredStaff.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(count) => {
              setItemsPerPage(count)
              setCurrentPage(1)
            }}
          />
        </main>
      </div>
    </div>
  )
}
