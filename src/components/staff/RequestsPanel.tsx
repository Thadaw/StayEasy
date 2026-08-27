import { useState } from 'react'
import { X, Clock, ArrowRightLeft } from 'lucide-react'
import ApprovalHistory from './ApprovalHistory'
import RejectRequestModal from './RejectRequestModal'

interface LeaveRequest {
  id: number
  name: string
  department: string
  avatarInitials: string
  avatarColor: string
  date: string
  reasonCategory: string
  reason: string
  type: 'leave' | 'shift_swap'
  targetName?: string
  targetDepartment?: string
  targetAvatarInitials?: string
  targetAvatarColor?: string
  shiftFrom?: string
  shiftTo?: string
}

const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 1,
    name: 'Ram Thapa',
    department: 'HOUSEKEEPING',
    avatarInitials: 'RT',
    avatarColor: '#8B5CF6',
    date: 'Aug 07',
    reasonCategory: 'Personal / Family',
    reason: 'Requesting 3 days off due to family function in home town. Handled over urgent tasks to Sita.',
    type: 'leave',
  },
  {
    id: 2,
    name: 'James Chen',
    department: 'FRONT DESK',
    avatarInitials: 'JC',
    avatarColor: '#10B981',
    date: 'Aug 12',
    reasonCategory: 'Medical Appointment',
    reason: 'Medical check-up appointment at the city clinic. I\'ve cleared my morning duties.',
    type: 'leave',
  },
  {
    id: 3,
    name: 'James Chen',
    department: 'FRONT DESK',
    avatarInitials: 'JC',
    avatarColor: '#10B981',
    date: 'Aug 12',
    reasonCategory: 'Medical Appointment',
    reason: 'Medical check-up appointment at the city clinic. I\'ve cleared my morning duties.',
    type: 'leave',
  },
]

const initialShiftSwapRequests: LeaveRequest[] = [
  {
    id: 4,
    name: 'Elena V.',
    department: 'HOUSEKEEPING',
    avatarInitials: 'EV',
    avatarColor: '#8B5CF6',
    targetName: 'Mark O.',
    targetDepartment: 'HOUSEKEEPING',
    targetAvatarInitials: 'MO',
    targetAvatarColor: '#10B981',
    shiftFrom: 'Fri, Aug 9 Evening',
    shiftTo: 'Sat, Aug 10 Morning',
    reasonCategory: 'Personal / Family',
    reason: 'Requesting 3 days off due to family function in home town.',
    type: 'shift_swap',
  },
  {
    id: 5,
    name: 'John Doe',
    department: 'HOUSEKEEPING',
    avatarInitials: 'JD',
    avatarColor: '#F59E0B',
    targetName: 'Mark O.',
    targetDepartment: 'HOUSEKEEPING',
    targetAvatarInitials: 'MO',
    targetAvatarColor: '#10B981',
    shiftFrom: 'Sat, Aug 10 Morning',
    shiftTo: 'Sun, Aug 11 Morning',
    reasonCategory: 'Personal / Family',
    reason: 'Covering Mark\'s shift as he has an urgent exam on Saturday morning.',
    type: 'shift_swap',
  },
  {
    id: 6,
    name: 'Elena V.',
    department: 'HOUSEKEEPING',
    avatarInitials: 'EV',
    avatarColor: '#8B5CF6',
    targetName: 'Mark O.',
    targetDepartment: 'HOUSEKEEPING',
    targetAvatarInitials: 'MO',
    targetAvatarColor: '#10B981',
    shiftFrom: 'Sat, Aug 10 Morning',
    shiftTo: 'Sun, Aug 11 Morning',
    reasonCategory: 'Medical',
    reason: 'Medical check-up appointment at the city clinic. I\'ve cleared my morning duties.',
    type: 'shift_swap',
  },
]

const roles = ['All Roles', 'Manager', 'Housekeeping', 'Front Desk', 'Restaurant', 'Kitchen Staff']

export default function RequestsPanel({ onClose }: { onClose: () => void }) {
  const [activeRole, setActiveRole] = useState('All Roles')
  const [activeSubTab, setActiveSubTab] = useState<'leave' | 'shift_swap'>('leave')
  const [showHistory, setShowHistory] = useState(false)
  const [rejectingRequest, setRejectingRequest] = useState<LeaveRequest | null>(null)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests)
  const [shiftSwapRequests, setShiftSwapRequests] = useState<LeaveRequest[]>(initialShiftSwapRequests)

  if (showHistory) {
    return <ApprovalHistory onClose={() => setShowHistory(false)} />
  }

  const currentRequests = activeSubTab === 'leave' ? leaveRequests : shiftSwapRequests
  const filteredRequests = activeRole === 'All Roles'
    ? currentRequests
    : currentRequests.filter(r => r.department.toLowerCase().includes(activeRole.toLowerCase()))

  const handleApprove = (request: LeaveRequest) => {
    if (request.type === 'leave') {
      setLeaveRequests((prev) => prev.filter((r) => r.id !== request.id))
    } else {
      setShiftSwapRequests((prev) => prev.filter((r) => r.id !== request.id))
    }
  }

  const handleReject = (request: LeaveRequest) => {
    if (request.type === 'leave') {
      setLeaveRequests((prev) => prev.filter((r) => r.id !== request.id))
    } else {
      setShiftSwapRequests((prev) => prev.filter((r) => r.id !== request.id))
    }
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827', fontFamily: "'Sora', 'Inter', sans-serif" }}>
          Pending Approvals
        </h2>
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 8,
            border: 'none',
            background: '#F3F4F6',
            cursor: 'pointer',
            color: '#6B7280',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#E5E7EB')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#F3F4F6')}
        >
          <X size={18} />
        </button>
      </div>

      {/* Filter by Role */}
      <div style={{ padding: '16px 24px' }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#9CA3AF',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 10,
          }}
        >
          FILTER BY ROLE
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: activeRole === role ? '1px solid #2E86AB' : '1px solid #E5E7EB',
                background: activeRole === role ? '#2E86AB' : '#fff',
                color: activeRole === role ? '#fff' : '#374151',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', padding: '0 24px' }}>
        {[
          { key: 'leave' as const, label: 'LEAVE REQUESTS', count: leaveRequests.length },
          { key: 'shift_swap' as const, label: 'SHIFT SWAPS', count: shiftSwapRequests.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.03em',
              color: activeSubTab === tab.key ? '#2E86AB' : '#9CA3AF',
              cursor: 'pointer',
              borderBottom: activeSubTab === tab.key ? '2px solid #2E86AB' : '2px solid transparent',
              marginBottom: -1,
              transition: 'all 0.15s',
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Request Cards */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {filteredRequests.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
            No pending requests.
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {request.type === 'shift_swap' ? (
                /* -- Shift Swap Card -- */
                <div style={{ padding: '16px 20px' }}>
                  {/* Top Row: Requester <-> Target */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    {/* Requester */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: '50%',
                          background: request.avatarColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 14,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {request.avatarInitials}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
                          {request.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                          {request.department}
                        </div>
                      </div>
                    </div>

                    {/* Swap Arrow + Date Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          border: '1px solid #E5E7EB',
                          fontSize: 11,
                          fontWeight: 500,
                          color: '#374151',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {request.shiftFrom}
                      </div>
                      <ArrowRightLeft size={16} color="#2E86AB" />
                      <div
                        style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          border: '1px solid #E5E7EB',
                          fontSize: 11,
                          fontWeight: 500,
                          color: '#374151',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {request.shiftTo}
                      </div>
                    </div>

                    {/* Target */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
                          {request.targetName}
                        </div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                          {request.targetDepartment}
                        </div>
                      </div>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: '50%',
                          background: request.targetAvatarColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 14,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {request.targetAvatarInitials}
                      </div>
                    </div>
                  </div>

                  {/* Reason Category */}
                  <div style={{ textAlign: 'right', fontSize: 13, color: '#6B7280', marginBottom: 12 }}>
                    {request.reasonCategory}
                  </div>

                  {/* Reason Box */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                      REASON
                    </div>
                    <div
                      style={{
                        padding: '12px 16px',
                        background: '#F0F9FF',
                        borderLeft: '3px solid #2E86AB',
                        borderRadius: 6,
                        fontSize: 13,
                        color: '#374151',
                        lineHeight: 1.5,
                        fontStyle: 'italic',
                      }}
                    >
                      "{request.reason}"
                    </div>
                  </div>
                </div>
              ) : (
                /* -- Leave Request Card -- */
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: '50%',
                          background: request.avatarColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 14,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {request.avatarInitials}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
                          {request.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                          {request.department}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: '#2E86AB',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {request.date}
                    </div>
                  </div>

                  {/* Reason Category */}
                  <div style={{ textAlign: 'right', fontSize: 13, color: '#6B7280', marginBottom: 12 }}>
                    {request.reasonCategory}
                  </div>

                  {/* Reason Box */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                      REASON
                    </div>
                    <div
                      style={{
                        padding: '12px 16px',
                        background: '#F0F9FF',
                        borderLeft: '3px solid #2E86AB',
                        borderRadius: 6,
                        fontSize: 13,
                        color: '#374151',
                        lineHeight: 1.5,
                        fontStyle: 'italic',
                      }}
                    >
                      "{request.reason}"
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons (shared) */}
              <div style={{ display: 'flex', borderTop: '1px solid #E5E7EB' }}>
                <button
                  onClick={() => setRejectingRequest(request)}
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    border: 'none',
                    background: '#fff',
                    color: '#374151',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    borderRight: '1px solid #E5E7EB',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(request)}
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    border: 'none',
                    background: '#2E86AB',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#267395')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#2E86AB')}
                >
                  Approve
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Full Approval History */}
      <div
        style={{
          padding: '20px 24px',
          borderTop: '1px solid #E5E7EB',
          textAlign: 'center',
        }}
      >
        <button
          onClick={() => setShowHistory(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            border: '1px dashed #D1D5DB',
            borderRadius: 8,
            background: '#F9FAFB',
            color: '#9CA3AF',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.15s',
            width: '100%',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2E86AB'; e.currentTarget.style.color = '#2E86AB' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.color = '#9CA3AF' }}
        >
          <Clock size={14} />
          FULL APPROVAL HISTORY
        </button>
      </div>

      {/* Reject Request Modal */}
      {rejectingRequest && (
        <RejectRequestModal
          requestName={rejectingRequest.name}
          onClose={() => setRejectingRequest(null)}
          onConfirm={(reason, details, remarks) => {
            handleReject(rejectingRequest)
            setRejectingRequest(null)
          }}
        />
      )}
    </div>
  )
}
