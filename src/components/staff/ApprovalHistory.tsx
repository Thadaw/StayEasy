import { useState } from 'react'
import { X, Calendar, ChevronDown, ChevronLeft, ChevronRight, Clock } from 'lucide-react'

interface HistoryRecord {
  id: number
  name: string
  department: string
  avatarInitials: string
  avatarColor: string
  type: 'leave' | 'shift_swap'
  dateRange: string
  leaveType?: string
  reasonCategory: string
  status: 'approved' | 'rejected'
  approvedBy?: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  swapDates?: string
}

const historyData: HistoryRecord[] = [
  {
    id: 1,
    name: 'Maya Rai',
    department: 'HOUSEKEEPING',
    avatarInitials: 'MR',
    avatarColor: '#8B5CF6',
    type: 'leave',
    dateRange: 'Aug 5-7',
    leaveType: 'Leave',
    reasonCategory: 'Personal / Family',
    status: 'approved',
    approvedBy: 'Admin Sachit',
    approvedAt: 'Aug 1, 10:30 AM',
  },
  {
    id: 2,
    name: 'Elena V. & Mark O.',
    department: 'SHIFT SWAP',
    avatarInitials: 'EV',
    avatarColor: '#10B981',
    type: 'shift_swap',
    dateRange: 'Aug 1 → Aug 2',
    reasonCategory: '',
    status: 'approved',
    approvedBy: 'Admin Sachit',
    approvedAt: 'Aug 2, 09:15 AM',
    swapDates: 'Aug 1 → Aug 2',
  },
  {
    id: 3,
    name: 'Hari P.',
    department: 'FRONT DESK',
    avatarInitials: 'HP',
    avatarColor: '#F59E0B',
    type: 'leave',
    dateRange: 'Aug 10',
    leaveType: 'Leave',
    reasonCategory: 'Low Staff Coverage',
    status: 'rejected',
    rejectedAt: 'Aug 8, 02:45 PM',
    rejectionReason: 'Low Staff Coverage',
  },
  {
    id: 4,
    name: 'Aswin Pandit',
    department: 'FRONT DESK',
    avatarInitials: 'AP',
    avatarColor: '#3B82F6',
    type: 'leave',
    dateRange: 'Aug 11',
    leaveType: 'Leave',
    reasonCategory: 'Low Staff Coverage',
    status: 'rejected',
    rejectedAt: 'Aug 7, 10:45 AM',
    rejectionReason: 'Low Staff Coverage',
  },
]

const statusStyles = {
  approved: { bg: '#D1FAE5', text: '#065F46' },
  rejected: { bg: '#FEE2E2', text: '#991B1B' },
}

export default function ApprovalHistory({ onClose }: { onClose: () => void }) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'leaves' | 'shift_swaps'>('all')

  const filteredData = activeFilter === 'all'
    ? historyData
    : historyData.filter(r => r.type === (activeFilter === 'leaves' ? 'leave' : 'shift_swap'))

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
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: "'Sora', 'Inter', sans-serif" }}>
          Approval & Swap History
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

      {/* Filters Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 24px',
          borderBottom: '1px solid #F3F4F6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
          <Calendar size={14} color="#6B7280" />
          <span>Aug 01 - Aug 31, 2024</span>
        </div>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <select
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              padding: '8px 32px 8px 12px',
              fontSize: 13,
              color: '#374151',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
              backgroundImage: 'none',
            }}
          >
            <option>Status: All</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 10, pointerEvents: 'none', color: '#9CA3AF' }} />
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '16px 24px' }}>
        {[
          { key: 'all' as const, label: 'ALL REQUESTS' },
          { key: 'leaves' as const, label: 'LEAVES ONLY' },
          { key: 'shift_swaps' as const, label: 'SHIFT SWAPS ONLY' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: activeFilter === tab.key ? '1px solid #2E86AB' : '1px solid #E5E7EB',
              background: activeFilter === tab.key ? '#2E86AB' : '#fff',
              color: activeFilter === tab.key ? '#fff' : '#374151',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.02em',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* History Cards */}
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {filteredData.map((record, index) => (
          <div
            key={record.id}
            style={{
              padding: '20px 0',
              borderBottom: index < filteredData.length - 1 ? '1px solid #F3F4F6' : 'none',
            }}
          >
            {/* Top Row: Avatar + Name + Status Badge */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: record.avatarColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {record.avatarInitials}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
                    {record.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    {record.department}
                  </div>
                </div>
              </div>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  background: statusStyles[record.status].bg,
                  color: statusStyles[record.status].text,
                }}
              >
                {record.status === 'approved' ? 'APPROVED' : 'REJECTED'}
              </span>
            </div>

            {/* Middle Row: Leave/Swap Info + Category */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: 54, marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                {record.type === 'leave' ? (
                  <>
                    <span>Leave</span>
                    <div
                      style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: '#2E86AB',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {record.dateRange}
                    </div>
                  </>
                ) : (
                  <>
                    <span>Shift Swap</span>
                    <div
                      style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: '#2E86AB',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {record.swapDates}
                    </div>
                  </>
                )}
              </div>
              {record.reasonCategory && (
                <span style={{ fontSize: 13, color: record.status === 'rejected' ? '#DC2626' : '#6B7280' }}>
                  {record.reasonCategory}
                </span>
              )}
            </div>

            {/* Bottom Row: Approval/Rejection Details */}
            <div style={{ marginLeft: 54, marginTop: 8, fontSize: 12, color: '#9CA3AF' }}>
              {record.status === 'approved' && record.approvedBy && (
                <span>Approved by {record.approvedBy} on {record.approvedAt}</span>
              )}
              {record.status === 'rejected' && (
                <span>Rejected on {record.rejectedAt}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 24px',
          borderTop: '1px solid #E5E7EB',
        }}
      >
        <span style={{ fontSize: 13, color: '#6B7280' }}>
          Showing {filteredData.length} of 28 Staffs
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 6,
              border: '1px solid #E5E7EB',
              background: '#fff',
              cursor: 'pointer',
              color: '#6B7280',
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>Page 1</span>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 6,
              border: '1px solid #E5E7EB',
              background: '#fff',
              cursor: 'pointer',
              color: '#6B7280',
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
