import { useState } from 'react'
import { X } from 'lucide-react'

interface RejectRequestModalProps {
  requestName: string
  onClose: () => void
  onConfirm: (reason: string, details: string, remarks: string) => void
}

const rejectionReasons = [
  {
    id: 'leave_limit',
    label: 'Leave Limit Exceeded',
    description: 'Max leaves reached for this period',
  },
  {
    id: 'schedule_packed',
    label: 'Schedule Packed / Peak Hours',
    description: 'High occupancy or staff shortage on selected dates',
  },
  {
    id: 'short_notice',
    label: 'Short Notice',
    description: 'Same-day or last-minute request',
  },
  {
    id: 'critical_task',
    label: 'Critical Task Pending',
    description: 'Assigned to essential duties on those dates',
  },
  {
    id: 'other',
    label: 'Other Reason',
    description: '',
  },
]

export default function RejectRequestModal({ requestName, onClose, onConfirm }: RejectRequestModalProps) {
  const [selectedReason, setSelectedReason] = useState('other')
  const [specifyReason, setSpecifyReason] = useState('')
  const [remarks, setRemarks] = useState('')

  const handleReject = () => {
    const reason = selectedReason === 'other' ? specifyReason : rejectionReasons.find(r => r.id === selectedReason)?.label || ''
    onConfirm(reason, specifyReason, remarks)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 12,
          width: '100%',
          maxWidth: 480,
          overflow: 'visible',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
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
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: '#111827',
              fontFamily: "'Sora', 'Inter', sans-serif",
            }}
          >
            Reject Request
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

        {/* Body */}
        <div style={{ padding: '20px 24px' }}>
          {/* Description */}
          <p style={{ margin: '0 0 20px', fontSize: 14, color: '#374151', lineHeight: 1.5 }}>
            Select a reason for rejecting this request.
          </p>

          {/* Radio Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {rejectionReasons.map((reason) => (
              <label
                key={reason.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  cursor: 'pointer',
                }}
              >
                {/* Custom Radio */}
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: selectedReason === reason.id ? '2px solid #2E86AB' : '2px solid #D1D5DB',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1,
                    transition: 'border-color 0.15s',
                  }}
                >
                  {selectedReason === reason.id && (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#2E86AB',
                      }}
                    />
                  )}
                </div>
                {/* Hidden native radio for accessibility */}
                <input
                  type="radio"
                  name="rejectReason"
                  value={reason.id}
                  checked={selectedReason === reason.id}
                  onChange={() => setSelectedReason(reason.id)}
                  style={{ display: 'none' }}
                />
                {/* Label + Description */}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>
                    {reason.label}
                  </div>
                  {reason.description && (
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                      {reason.description}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>

          {/* Other Reason - Conditional Inputs */}
          {selectedReason === 'other' && (
            <div style={{ marginTop: 24 }}>
              {/* Specify Reason */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 8,
                  }}
                >
                  PLEASE SPECIFY REASON (REQUIRED)
                </label>
                <input
                  type="text"
                  value={specifyReason}
                  onChange={(e) => setSpecifyReason(e.target.value)}
                  placeholder="Add specific reason not listed above..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #E5E7EB',
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#374151',
                    outline: 'none',
                    transition: 'border-color 0.15s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#2E86AB')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                />
              </div>

              {/* Additional Remarks */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 8,
                  }}
                >
                  ADDITIONAL REMARKS (OPTIONAL)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add specific note or detail if needed..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #E5E7EB',
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#374151',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#2E86AB')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            padding: '16px 24px',
            borderTop: '1px solid #E5E7EB',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              background: '#fff',
              color: '#374151',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#DC2626',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#B91C1C')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#DC2626')}
          >
            Reject Request from this section
          </button>
        </div>
      </div>
    </div>
  )
}
