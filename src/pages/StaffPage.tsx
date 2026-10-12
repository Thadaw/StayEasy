import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUIStore } from '../stores/uiStore'
import { usePropertyStore } from '../stores/propertyStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import StaffStats from '../components/staff/StaffStats'
import StaffFilters from '../components/staff/StaffFilters'
import StaffTable from '../components/staff/StaffTable'
import StaffPagination from '../components/staff/StaffPagination'
import { getAllProperties, getStaffList, deleteStaff, updateStaff } from '../services/pmsApi'
import { propertyKeys, staffKeys } from '../lib/queryKeys'
import { mapApiStaffToStaffMember, toApiStatus } from '../types/staff'
import type { StaffMember } from '../types/staff'

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
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const [overallMode, setOverallMode] = useState(() => currentPropertyId === null)
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<StaffMember | null>(null)

  const { data: properties = [] } = useQuery({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })

  const property = properties.find((p) => p.id === currentPropertyId) ?? properties[0] ?? null
  const effectivePropertyId = property?.id ?? ''

  const { data: apiStaff = [], isLoading } = useQuery({
    queryKey: staffKeys.list(effectivePropertyId),
    queryFn: async () => {
      const all: import('../types/staff').ApiStaff[] = []
      let skip = 0
      const pageSize = 50
      for (;;) {
        const batch = await getStaffList(effectivePropertyId, { skip, limit: pageSize })
        all.push(...batch)
        if (batch.length < pageSize) break
        skip += pageSize
      }
      return all
    },
    enabled: !!effectivePropertyId,
  })

  const staffList = useMemo(() => {
    return apiStaff.map(mapApiStaffToStaffMember)
  }, [apiStaff])

  const deleteMutation = useMutation({
    mutationFn: (staffId: string) => deleteStaff(effectivePropertyId, staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.list(effectivePropertyId) })
      setConfirmDelete(null)
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ staffId, status }: { staffId: string; status: StaffMember['status'] }) =>
      updateStaff(effectivePropertyId, staffId, { status: toApiStatus(status) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.list(effectivePropertyId) })
    },
  })

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
    navigate('/host/staff/add')
  }

  const openEditModal = (member: StaffMember) => {
    navigate(`/host/staff/edit/${member.id}`)
  }

  const handleDelete = (member: StaffMember) => {
    setConfirmDelete(member)
  }

  const confirmDeleteStaff = () => {
    if (confirmDelete) {
      deleteMutation.mutate(confirmDelete.id)
    }
  }

  const handleChangeStatus = (member: StaffMember, newStatus: StaffMember['status']) => {
    statusMutation.mutate({ staffId: member.id, status: newStatus })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          title="Staff"
          subtitle={overallMode ? 'All properties' : 'Filtering by property'}
          showOverallOption
          selectedLabel={overallMode ? 'Overall Staff' : property?.name || 'Property'}
          onPropertyChange={(id) => setOverallMode(id === null)}
        />
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

          {isLoading ? (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 60, textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
              Loading staff...
            </div>
          ) : (
            <StaffTable
              staff={paginatedStaff}
              onViewStaff={setViewingStaff}
              onEditStaff={openEditModal}
              onDeleteStaff={handleDelete}
              onChangeStatus={handleChangeStatus}
            />
          )}

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
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: avatarColors[viewingStaff.id.length % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700 }}>
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

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div onClick={() => setConfirmDelete(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 28, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>Delete Staff Member</h3>
            <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}>Cancel</button>
              <button onClick={confirmDeleteStaff} disabled={deleteMutation.isPending} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#DC2626', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: deleteMutation.isPending ? 0.6 : 1 }}>
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
