import { useState } from 'react'
import { X } from 'lucide-react'

interface ReviewMaintenanceModalProps {
  isOpen: boolean
  onClose: () => void
}

const priorities = ['Low', 'Medium', 'Urgent'] as const
const categories = ['Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting', 'Appliance Repair']

export default function ReviewMaintenanceModal({ isOpen, onClose }: ReviewMaintenanceModalProps) {
  const [selectedPriority, setSelectedPriority] = useState<string>('Urgent')
  const [category, setCategory] = useState('Plumbing')
  const [technician, setTechnician] = useState('Ramesh Kumar')
  const [returnDate, setReturnDate] = useState('2026-11-09')
  const [instructions, setInstructions] = useState('')
  const [blockRoom, setBlockRoom] = useState(true)

  if (!isOpen) return null

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
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 860,
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 80px rgba(0,0,0,0.2)',
        }}
      >
        {/* ========== HEADER ========== */}
        <div style={{ padding: '20px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>
                  Review Maintenance Request
                </h2>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background: '#FEF3C7',
                    color: '#92400E',
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706' }} />
                  Pending Review
                </span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6B7280' }}>
                Room 305 - Deluxe King, Floor 3 &bull; Submitted by: Sarah J. &bull; 10 mins ago
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280',
                flexShrink: 0,
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ========== BODY: TWO COLUMNS ========== */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 0, padding: '20px 24px' }}>
          {/* ===== LEFT: Evidence & Description ===== */}
          <div style={{ paddingRight: 24, borderRight: '1px solid #E5E7EB' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#374151' }}>
              Evidence &amp; Description
            </h3>

            {/* Evidence Image */}
            <div
              style={{
                width: '100%',
                height: 180,
                borderRadius: 10,
                overflow: 'hidden',
                background: '#E5E7EB',
                marginBottom: 16,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1631545806609-3c480e6e7e88?w=600&h=300&fit=crop"
                alt="AC water leakage evidence"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Category + Priority Info Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  padding: '12px 14px',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Category
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Plumbing</div>
              </div>
              <div
                style={{
                  padding: '12px 14px',
                  border: '1px solid #FECACA',
                  borderRadius: 8,
                  background: '#FEF2F2',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Reported Priority
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14 }}>!</span>
                  Urgent
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#9CA3AF' }}>(Housekeeper Tagged)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Description
              </div>
              <div
                style={{
                  padding: 14,
                  background: '#F9FAFB',
                  borderRadius: 8,
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: '#374151',
                  border: '1px solid #F3F4F6',
                }}
              >
                &ldquo;Severe AC water leakage directly above bed area. Water is pooling on the nightstand and splashing onto the mattress. Room needs urgent repair before next guest check-in.&rdquo;
              </div>
            </div>
          </div>

          {/* ===== RIGHT: Assignment & Actions ===== */}
          <div style={{ paddingLeft: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#374151' }}>
              Assignment &amp; Actions
            </h3>

            {/* Priority Override */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                Priority Override
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {priorities.map(p => {
                  const isSelected = selectedPriority === p
                  const isUrgent = p === 'Urgent'
                  return (
                    <button
                      key={p}
                      onClick={() => setSelectedPriority(p)}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        borderRadius: 8,
                        border: isSelected
                          ? isUrgent ? '1.5px solid #DC2626' : '1.5px solid #2563EB'
                          : '1px solid #E5E7EB',
                        background: isSelected
                          ? isUrgent ? '#DC2626' : '#EFF6FF'
                          : '#fff',
                        color: isSelected
                          ? isUrgent ? '#fff' : '#2563EB'
                          : '#6B7280',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Category Override */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Category Override
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#374151',
                  background: '#fff',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Assign Technician */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Assign Technician
              </label>
              <input
                type="text"
                value={technician}
                onChange={e => setTechnician(e.target.value)}
                placeholder="Enter technician name"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#374151',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Expected Return Date */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Expected Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#374151',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Additional Instructions */}
            <div style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Additional Instructions
              </label>
              <textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="e.g. Please bring extra floor towels and check the exterior drainage pipe..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#374151',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* ========== FOOTER ========== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderTop: '1px solid #E5E7EB',
            background: '#F9FAFB',
            borderRadius: '0 0 16px 16px',
          }}
        >
          {/* Checkbox */}
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              cursor: 'pointer',
              maxWidth: 340,
            }}
          >
            <input
              type="checkbox"
              checked={blockRoom}
              onChange={e => setBlockRoom(e.target.checked)}
              style={{
                width: 18,
                height: 18,
                marginTop: 1,
                accentColor: '#2563EB',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>
                Block Room for Booking / Mark as Out of Order (ODO)
              </div>
              <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                Room status will automatically change to ODO upon confirmation.
              </div>
            </div>
          </label>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <button
              onClick={onClose}
              style={{
                padding: '9px 20px',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                background: '#fff',
                fontSize: 13,
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '9px 20px',
                borderRadius: 8,
                border: 'none',
                background: '#1E293B',
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Assign Staff &amp; Block Room
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
