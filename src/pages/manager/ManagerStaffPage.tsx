import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ManagerLayout from '../../components/manager/ManagerLayout'
import ManagerStaffStats from '../../components/manager/staff/ManagerStaffStats'
import ManagerStaffFilters from '../../components/manager/staff/ManagerStaffFilters'
import ManagerStaffDirectory from '../../components/manager/staff/ManagerStaffDirectory'
import ManagerShiftManagement from '../../components/manager/staff/ManagerShiftManagement'
import StaffOverviewCards from '../../components/manager/staff/StaffOverviewCards'
import AssignTaskModal, { type AssignTaskValues } from '../../components/manager/staff/AssignTaskModal'
import ExportStaffReportModal from '../../components/manager/staff/ExportStaffReportModal'
import type { StaffAction } from '../../components/manager/staff/StaffActionsMenu'
import { DEMO_STAFF, type StaffRow } from '../../components/manager/staff/demoStaff'
import { useApprovalsStore } from '../../stores/approvalsStore'

export default function ManagerStaffPage() {
  const navigate = useNavigate()
  const pendingApprovals = useApprovalsStore((s) => s.requests.length)
  const [showAssignTask, setShowAssignTask] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('All Departments')
  const [statusFilter, setStatusFilter] = useState('All Status')

  const filteredStaff = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return DEMO_STAFF.filter((member) => {
      const matchSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.staffId.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query) ||
        member.position.toLowerCase().includes(query)

      const matchDepartment =
        departmentFilter === 'All Departments' || member.department === departmentFilter
      const matchStatus = statusFilter === 'All Status' || member.attendance === statusFilter

      return matchSearch && matchDepartment && matchStatus
    })
  }, [searchQuery, departmentFilter, statusFilter])

  const handleRowAction = (member: StaffRow, action: StaffAction) => {
    if (action === 'profile') toast(`${member.name} · staff profile coming soon`)
    else if (action === 'edit') toast(`Edit staff · ${member.name} coming soon`)
    else toast(`Schedule for ${member.name} coming soon`)
  }

  const handleAssignTask = (values: AssignTaskValues) => {
    const name = values.employee.split(' · ')[0]
    setShowAssignTask(false)
    toast.success(values.notify ? `Task assigned · ${name} notified` : `Task assigned · ${name}`)
  }

  return (
    <ManagerLayout
      title="Staff Management"
      subtitle="Monitor and manage hotel staff operations."
      searchPlaceholder="Search staff, shifts, departments..."
    >
      <ManagerStaffStats />

      <ManagerStaffFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onAssignTask={() => setShowAssignTask(true)}
        onApprovals={() => navigate('/manager/staff/approvals')}
        onExport={() => setShowExport(true)}
        approvalsCount={pendingApprovals}
      />

      <ManagerStaffDirectory staff={filteredStaff} onAction={handleRowAction} />

      <ManagerShiftManagement onViewCoverage={() => toast('Shift coverage details · coming soon')} />

      <StaffOverviewCards onView={(card) => toast(`${card} · coming soon`)} />

      {showAssignTask && (
        <AssignTaskModal onClose={() => setShowAssignTask(false)} onAssign={handleAssignTask} />
      )}

      {showExport && (
        <ExportStaffReportModal
          onClose={() => setShowExport(false)}
          onExport={(format) => {
            setShowExport(false)
            toast.success(`Staff report exported · ${format}`)
          }}
        />
      )}
    </ManagerLayout>
  )
}
