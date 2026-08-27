import { X } from 'lucide-react'
import type { ShiftDetail } from '../../types/shiftCoverage'
import { getStatusColor, getStatusBgColor } from '../../types/shiftCoverage'

interface ShiftDetailModalProps {
  shift: ShiftDetail
  day: string
  onClose: () => void
}

export default function ShiftDetailModal({ shift, day, onClose }: ShiftDetailModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          width: '100%',
          maxWidth: 480,
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>
              Shift Details
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>{day}</p>
          </div>
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
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <DetailRow label="Department" value={shift.department} />
            <DetailRow label="Shift" value={shift.shift} />
            <DetailRow label="Time" value={shift.time} />
            <DetailRow label="Required" value={shift.required.toString()} />
            <DetailRow label="Assigned" value={shift.assigned.toString()} />
            <DetailRow label="Coverage" value={`${shift.coverage}%`} />
          </div>

          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Status</div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  color: getStatusColor(shift.status),
                  background: getStatusBgColor(shift.status),
                }}
              >
                {shift.status}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Missing / Extra</div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: shift.missing !== null ? '#DC2626' : '#6B7280',
                }}
              >
                {shift.missing !== null ? shift.missing : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#F3F4F6',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{value}</div>
    </div>
  )
}
