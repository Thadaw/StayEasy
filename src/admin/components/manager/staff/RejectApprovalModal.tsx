import { useEffect, useState } from 'react'

interface RejectApprovalModalProps {
  onClose: () => void
  onConfirm: (reason: string, remarks: string) => void
}

const rejectionReasons = [
  {
    id: 'leave_limit',
    label: 'Leave Limit Exceeded',
    description: 'Maximum leave allowance reached for this period.',
  },
  {
    id: 'schedule_packed',
    label: 'Schedule Packed / Peak Hours',
    description: 'Minimum workforce coverage will be affected.',
  },
  {
    id: 'short_notice',
    label: 'Short Notice',
    description: 'Request was submitted without sufficient notice.',
  },
  {
    id: 'critical_task',
    label: 'Critical Task Pending',
    description: 'Key assigned responsibilities remain on these dates.',
  },
  {
    id: 'other',
    label: 'Other Reason',
    description: 'Provide a specific reason below.',
  },
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  background: '#fff',
  fontSize: 13,
  color: '#374151',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  color: '#6b7280',
  marginBottom: 6,
}

export default function RejectApprovalModal({ onClose, onConfirm }: RejectApprovalModalProps) {
  const [selectedReason, setSelectedReason] = useState('other')
  const [specifyReason, setSpecifyReason] = useState('')
  const [remarks, setRemarks] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleReject = () => {
    if (selectedReason === 'other' && !specifyReason.trim()) {
      setError('Please provide a specific reason.')
      return
    }
    const reason =
      selectedReason === 'other'
        ? specifyReason.trim()
        : rejectionReasons.find((r) => r.id === selectedReason)?.label || ''
    onConfirm(reason, remarks.trim())
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
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
          borderRadius: 16,
          width: 460,
          maxWidth: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        <h3 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#111827' }}>
          Reject Request
        </h3>
        <p style={{ margin: '0 0 18px', fontSize: 13, color: '#9ca3af' }}>
          Select a reason for rejecting this staff request.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rejectionReasons.map((reason) => {
            const selected = selectedReason === reason.id
            return (
              <button
                key={reason.id}
                type="button"
                onClick={() => {
                  setSelectedReason(reason.id)
                  setError('')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `1px solid ${selected ? '#dc2626' : '#e5e7eb'}`,
                  background: selected ? '#fef2f2' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: selected ? '#dc2626' : '#e5e7eb',
                    flexShrink: 0,
                    marginTop: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selected && (
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />
                  )}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#111827' }}>
                    {reason.label}
                  </span>
                  <span style={{ display: 'block', fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                    {reason.description}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {selectedReason === 'other' && (
          <div style={{ marginTop: 18 }}>
            <label style={labelStyle}>Specific Reason (required)</label>
            <input
              type="text"
              value={specifyReason}
              onChange={(e) => {
                setSpecifyReason(e.target.value)
                setError('')
              }}
              placeholder="Add a specific reason not listed above..."
              style={{ ...inputStyle, borderColor: error ? '#dc2626' : '#e5e7eb' }}
            />
            {error && (
              <div style={{ fontSize: 12, color: '#dc2626', marginTop: 6 }}>{error}</div>
            )}

            <label style={{ ...labelStyle, marginTop: 14 }}>Additional Remarks (optional)</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add more context for the employee..."
              style={inputStyle}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#111827',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              border: 'none',
              background: '#dc2626',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reject Request
          </button>
        </div>
      </div>
    </div>
  )
}
