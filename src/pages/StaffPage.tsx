import { useState, useMemo } from 'react'
import { useUIStore } from '../stores/uiStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import StaffStats from '../components/staff/StaffStats'
import StaffFilters from '../components/staff/StaffFilters'
import StaffTable from '../components/staff/StaffTable'
import StaffPagination from '../components/staff/StaffPagination'
import type { StaffMember } from '../types/staff'

const initialStaff: StaffMember[] = [
  { id: 1, name: 'Ramesh Thapa', email: 'ramesh.thapa@email.com', role: 'Manager', department: 'Front Office', contact: '+977 9812345678', joiningDate: 'Jan 15, 2024', status: 'Active' },
  { id: 2, name: 'Sunita Shrestha', email: 'sunita.shrestha@email.com', role: 'Receptionist', department: 'Front Office', contact: '+977 9823456789', joiningDate: 'Mar 10, 2024', status: 'Active' },
  { id: 3, name: 'Kiran Gurung', email: 'kiran.gurung@email.com', role: 'Housekeeping Staff', department: 'Housekeeping', contact: '+977 9845678901', joiningDate: 'Feb 5, 2024', status: 'Active' },
  { id: 4, name: 'Anita Lama', email: 'anita.lama@email.com', role: 'Housekeeping Supervisor', department: 'Housekeeping', contact: '+977 9856789012', joiningDate: 'Nov 20, 2023', status: 'On Leave' },
  { id: 5, name: 'Sanjay Rai', email: 'sanjay.rai@email.com', role: 'Chef', department: 'Kitchen', contact: '+977 9811122233', joiningDate: 'Apr 12, 2024', status: 'Active' },
  { id: 6, name: 'Bikash Magar', email: 'bikash.magar@email.com', role: 'Waiter', department: 'Restaurant', contact: '+977 9865432109', joiningDate: 'May 1, 2024', status: 'Active' },
  { id: 7, name: 'Pooja Adhikari', email: 'pooja.adhikari@email.com', role: 'Cashier', department: 'Accounts', contact: '+977 9843322110', joiningDate: 'Jan 8, 2024', status: 'Inactive' },
  { id: 8, name: 'Dinesh Parajuli', email: 'dinesh.parajuli@email.com', role: 'Maintenance Staff', department: 'Maintenance', contact: '+977 9819988776', joiningDate: 'Jun 3, 2024', status: 'Active' },
]

const emptyForm = { name: '', email: '', role: 'Receptionist', department: 'Front Office', contact: '', joiningDate: '', status: 'Active' as StaffMember['status'] }

const roles = ['Manager', 'Receptionist', 'Housekeeping Staff', 'Housekeeping Supervisor', 'Chef', 'Waiter', 'Cashier', 'Maintenance Staff']
const departments = ['Front Office', 'Housekeeping', 'Kitchen', 'Restaurant', 'Accounts', 'Maintenance']
const statuses: StaffMember['status'][] = ['Active', 'On Leave', 'Inactive']

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#D1FAE5', text: '#065F46' },
  'On Leave': { bg: '#FEF3C7', text: '#92400E' },
  Inactive: { bg: '#FEE2E2', text: '#991B1B' },
}

const avatarColors = ['var(--primary)', '#2563EB', '#059669', '#D97706', '#DC2626', '#0891B2', '#4F46E5', 'var(--primary)']

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

export default function StaffPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff)
  const [showModal, setShowModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<StaffMember | null>(null)
  const [form, setForm] = useState(emptyForm)

  const filteredStaff = useMemo(() => {
    return staffList.filter(member => {
      const matchesSearch = !search || member.name.toLowerCase().includes(search.toLowerCase()) || member.email.toLowerCase().includes(search.toLowerCase()) || member.contact.includes(search)
      const matchesDept = !departmentFilter || member.department === departmentFilter
      const matchesRole = !roleFilter || member.role === roleFilter
      const matchesStatus = !statusFilter || member.status === statusFilter
      return matchesSearch && matchesDept && matchesRole && matchesStatus
    })
  }, [staffList, search, departmentFilter, roleFilter, statusFilter])

  const stats = useMemo(() => {
    const total = staffList.length
    const active = staffList.filter(s => s.status === 'Active').length
    const onLeave = staffList.filter(s => s.status === 'On Leave').length
    const inactive = staffList.filter(s => s.status === 'Inactive').length
    const departments = new Set(staffList.map(s => s.department)).size
    return { total, active, onLeave, inactive, departments }
  }, [staffList])

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage)
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const openAddModal = () => {
    setEditingStaff(null)
    setForm({ ...emptyForm, joiningDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) })
    setShowModal(true)
  }

  const openEditModal = (member: StaffMember) => {
    setEditingStaff(member)
    setForm({ name: member.name, email: member.email, role: member.role, department: member.department, contact: member.contact, joiningDate: member.joiningDate, status: member.status })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name || !form.email) return
    if (editingStaff) {
      setStaffList(prev => prev.map(s => s.id === editingStaff.id ? { ...s, ...form } : s))
    } else {
      const newId = Math.max(0, ...staffList.map(s => s.id)) + 1
      setStaffList(prev => [{ id: newId, ...form }, ...prev])
    }
    setShowModal(false)
  }

  const handleDelete = (member: StaffMember) => {
    setConfirmDelete(member)
  }

  const confirmDeleteStaff = () => {
    if (confirmDelete) {
      setStaffList(prev => prev.filter(s => s.id !== confirmDelete.id))
      setConfirmDelete(null)
    }
  }

  const handleChangeStatus = (member: StaffMember, newStatus: StaffMember['status']) => {
    setStaffList(prev => prev.map(s => s.id === member.id ? { ...s, status: newStatus } : s))
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', fontSize: 14, color: '#374151', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 4, display: 'block' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
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
            onAddStaff={openAddModal}
          />

          <StaffTable
            staff={paginatedStaff}
            onViewStaff={setViewingStaff}
            onEditStaff={openEditModal}
            onDeleteStaff={handleDelete}
            onChangeStatus={handleChangeStatus}
          />

          <StaffPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredStaff.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(count) => { setItemsPerPage(count); setCurrentPage(1) }}
          />
        </main>
      </div>

      {/* View Staff Modal */}
      {viewingStaff && (
        <div onClick={() => setViewingStaff(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 480, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Staff Details</h3>
              <button onClick={() => setViewingStaff(null)} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#6B7280' }}>×</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, padding: 16, background: '#F9FAFB', borderRadius: 10 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: avatarColors[viewingStaff.id % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700 }}>
                {getInitials(viewingStaff.name)}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{viewingStaff.name}</div>
                <span style={{ display: 'inline-block', padding: '3px 10px', fontSize: 11, fontWeight: 600, borderRadius: 20, marginTop: 4, background: statusColors[viewingStaff.status]?.bg, color: statusColors[viewingStaff.status]?.text }}>
                  {viewingStaff.status}
                </span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Email', value: viewingStaff.email },
                { label: 'Contact', value: viewingStaff.contact },
                { label: 'Role', value: viewingStaff.role },
                { label: 'Department', value: viewingStaff.department },
                { label: 'Joining Date', value: viewingStaff.joiningDate },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => { setViewingStaff(null); openEditModal(viewingStaff) }} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Edit Staff</button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 500, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px' }}>{editingStaff ? 'Edit Staff' : 'Add Staff'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input style={inputStyle} placeholder="e.g. Ramesh Thapa" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input style={inputStyle} type="email" placeholder="staff@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Contact</label>
                  <input style={inputStyle} placeholder="+977 9812345678" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Role</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Department</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Joining Date</label>
                  <input style={inputStyle} value={form.joiningDate} onChange={e => setForm({ ...form, joiningDate: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as StaffMember['status'] })}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>{editingStaff ? 'Save Changes' : 'Add Staff'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div onClick={() => setConfirmDelete(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>Delete Staff Member</h3>
            <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}>Cancel</button>
              <button onClick={confirmDeleteStaff} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#DC2626', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
