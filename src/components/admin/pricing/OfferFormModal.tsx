import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import type { DiscountOffer } from '@/types/pricing'
import { specialOfferFormSchema, todayISO, type SpecialOfferFormData } from '@/schemas/admin/specialOfferSchema'

interface OfferFormModalProps {
  open: boolean
  initial: DiscountOffer | null
  isSaving: boolean
  onClose: () => void
  onSubmit: (values: SpecialOfferFormData) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #E5E7EB',
  background: '#fff',
  fontSize: 14,
  color: '#374151',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 6,
  display: 'block',
}

const errorStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#DC2626',
  marginTop: 4,
}

export default function OfferFormModal({ open, initial, isSaving, onClose, onSubmit }: OfferFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SpecialOfferFormData>({
    resolver: zodResolver(specialOfferFormSchema),
    defaultValues: {
      title: '',
      description: '',
      discountPercentage: '',
      startDate: todayISO(),
      endDate: '',
      isActive: true,
    },
  })

  useEffect(() => {
    if (!open) return
    reset(
      initial
        ? {
            title: initial.name,
            description: initial.description,
            discountPercentage: String(initial.discountPercentage),
            startDate: initial.startDate,
            endDate: initial.endDate,
            isActive: initial.isActive,
          }
        : {
            title: '',
            description: '',
            discountPercentage: '',
            startDate: todayISO(),
            endDate: '',
            isActive: true,
          },
    )
  }, [open, initial, reset])

  if (!open) return null

  return (
    <div
      onMouseDown={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 14, width: '100%', maxWidth: 520,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: 0 }}>
              {initial ? 'Edit Special Offer' : 'Create New Offer'}
            </h3>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '2px 0 0' }}>
              {initial ? 'Update the details of this special offer.' : 'Set up a promotional discount for your property.'}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: '1px solid #E5E7EB',
            background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#6B7280',
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form
          id="offer-form"
          onSubmit={handleSubmit(onSubmit)}
          style={{ padding: 22, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <div>
            <label style={labelStyle}>Offer Title</label>
            <input style={inputStyle} placeholder="e.g. Early Bird 15%" {...register('title')} />
            {errors.title && <p style={errorStyle}>{errors.title.message}</p>}
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: 84, resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="Short description of the offer"
              {...register('description')}
            />
            {errors.description && <p style={errorStyle}>{errors.description.message}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Discount (%)</label>
              <input
                style={inputStyle}
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="15"
                {...register('discountPercentage')}
              />
              {errors.discountPercentage && <p style={errorStyle}>{errors.discountPercentage.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Applicable To</label>
              <input style={{ ...inputStyle, background: '#F9FAFB', color: '#6B7280' }} value="All Room Types" readOnly tabIndex={-1} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input style={inputStyle} type="date" {...register('startDate')} />
              {errors.startDate && <p style={errorStyle}>{errors.startDate.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>End Date</label>
              <input style={inputStyle} type="date" {...register('endDate')} />
              {errors.endDate && <p style={errorStyle}>{errors.endDate.message}</p>}
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" {...register('isActive')} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
            <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>Activate this offer immediately</span>
          </label>
        </form>

        {/* Footer */}
        <div style={{ padding: '16px 22px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 18px', borderRadius: 8, border: '1px solid #E5E7EB',
              background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#374151',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="offer-form"
            disabled={isSaving}
            style={{
              padding: '10px 22px', borderRadius: 8, border: 'none', background: 'var(--primary)',
              cursor: isSaving ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, color: '#fff',
              opacity: isSaving ? 0.6 : 1,
            }}
          >
            {isSaving ? 'Saving...' : initial ? 'Save Changes' : 'Create Offer'}
          </button>
        </div>
      </div>
    </div>
  )
}
