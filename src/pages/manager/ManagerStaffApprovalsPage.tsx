import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { History } from 'lucide-react'
import ManagerLayout from '../../components/manager/ManagerLayout'
import ApprovalStatCards from '../../components/manager/staff/ApprovalStatCards'
import ApprovalFilters from '../../components/manager/staff/ApprovalFilters'
import ApprovalRequestCard from '../../components/manager/staff/ApprovalRequestCard'
import RejectApprovalModal from '../../components/manager/staff/RejectApprovalModal'
import { matchesDepartment, type ApprovalKind } from '../../components/manager/staff/demoApprovals'
import { useApprovalsStore } from '../../stores/approvalsStore'

type TabKind = ApprovalKind

export default function ManagerStaffApprovalsPage() {
  const navigate = useNavigate()
  const requests = useApprovalsStore((s) => s.requests)
  const decide = useApprovalsStore((s) => s.decide)

  const [activeTab, setActiveTab] = useState<TabKind>('leave')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [departmentFilter, setDepartmentFilter] = useState('All Departments')
  const [rejectTarget, setRejectTarget] = useState<{ id: string; name: string } | null>(null)

  const leaveCount = useMemo(
    () => requests.filter((r) => r.kind === 'leave').length,
    [requests],
  )
  const swapCount = requests.length - leaveCount

  const visibleRequests = useMemo(() => {
    const kindFromType = typeFilter === 'Leave' ? 'leave' : typeFilter === 'Shift Swap' ? 'swap' : null
    return requests.filter((r) => {
      const matchTab = r.kind === activeTab
      const matchType = kindFromType === null || r.kind === kindFromType
      const matchDepartment = matchesDepartment(r, departmentFilter)
      return matchTab && matchType && matchDepartment
    })
  }, [requests, activeTab, typeFilter, departmentFilter])

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 16px',
    borderRadius: 8,
    border: '1px solid',
    borderColor: active ? '#bfdbfe' : '#e5e7eb',
    background: active ? '#eff6ff' : '#fff',
    color: active ? '#2563eb' : '#6b7280',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  })

  return (
    <ManagerLayout
      breadcrumb={
        <span>
          <Link to="/manager/staff" style={{ color: '#9ca3af', textDecoration: 'none' }}>
            Staff
          </Link>
          <span style={{ margin: '0 6px' }}>/</span>
          <span style={{ color: '#6b7280' }}>Pending Approvals</span>
        </span>
      }
      title="Pending Approvals"
      subtitle="Review and act on pending requests."
      searchPlaceholder="Search requests, staff..."
    >
      <ApprovalStatCards leaveCount={leaveCount} swapCount={swapCount} />

      <ApprovalFilters
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        onBack={() => navigate('/manager/staff')}
      />

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setActiveTab('leave')} style={tabStyle(activeTab === 'leave')}>
          Leave Requests · {leaveCount}
        </button>
        <button onClick={() => setActiveTab('swap')} style={tabStyle(activeTab === 'swap')}>
          Shift Swaps · {swapCount}
        </button>
      </div>

      {visibleRequests.length === 0 ? (
        <div
          style={{
            background: '#fff',
            border: '1px dashed #e5e7eb',
            borderRadius: 12,
            padding: '40px 20px',
            textAlign: 'center',
            fontSize: 14,
            color: '#9ca3af',
          }}
        >
          {requests.length === 0
            ? 'No pending approvals. All requests have been handled.'
            : 'No requests match the selected filters.'}
        </div>
      ) : (
        <div style={{ marginBottom: 14 }}>
          {visibleRequests.map((request) => (
            <ApprovalRequestCard
              key={request.id}
              request={request}
              onDecide={(approved) => {
                const name =
                  request.kind === 'leave'
                    ? request.name
                    : `${request.personA.name} ⇄ ${request.personB.name}`
                if (approved) {
                  decide(request.id)
                  toast.success(`Approved · ${name}`)
                } else {
                  setRejectTarget({ id: request.id, name })
                }
              }}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => toast('Approval history · coming soon')}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '12px 16px',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          background: '#fff',
          color: '#374151',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <History size={15} />
        View Full Approval History
      </button>

      {rejectTarget && (
        <RejectApprovalModal
          onClose={() => setRejectTarget(null)}
          onConfirm={(reason, remarks) => {
            decide(rejectTarget.id)
            toast.success(
              remarks
                ? `Request rejected · ${rejectTarget.name} · ${reason} — ${remarks}`
                : `Request rejected · ${rejectTarget.name} · ${reason}`,
            )
            setRejectTarget(null)
          }}
        />
      )}
    </ManagerLayout>
  )
}
