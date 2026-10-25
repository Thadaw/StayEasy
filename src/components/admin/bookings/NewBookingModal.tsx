import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newBookingSchema, type NewBookingFormData } from '@/schemas/admin/newBookingSchema'
import type { RoomResponse, RoomTypeResponse } from '@/types/pms'

interface NewBookingModalProps {
  propertyName?: string
  rooms: RoomResponse[]
  roomTypes: RoomTypeResponse[]
  isSubmitting: boolean
  error: string | null
  onClose: () => void
  onSubmit: (data: NewBookingFormData) => void
}

const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 13, color: 'var(--foreground)', outline: 'none', boxSizing: 'border-box' as const }
const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: 'var(--muted-foreground)', marginBottom: 4, display: 'block' as const }
const errorStyle = { fontSize: 12, color: '#dc2626', marginTop: 4 }

export default function NewBookingModal({
  propertyName,
  rooms,
  roomTypes,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: NewBookingModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewBookingFormData>({
    resolver: zodResolver(newBookingSchema),
    defaultValues: { roomIds: [], checkIn: '', checkOut: '', adults: 2, children: 0 },
    mode: 'onTouched',
  })

  const selectedRoomIds = watch('roomIds')
  const checkIn = watch('checkIn')
  const roomTypeMap = new Map(roomTypes.map((rt) => [rt.id, rt.room_type_name]))

  const toggleRoom = (roomId: string, checked: boolean) => {
    const next = checked
      ? [...selectedRoomIds, roomId]
      : selectedRoomIds.filter((id) => id !== roomId)
    setValue('roomIds', next, { shouldValidate: true, shouldDirty: true })
  }

  return (
    <div
      onClick={() => { if (!isSubmitting) onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 12, padding: 28, width: 520, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px' }}>New Booking</h3>
        <p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: '0 0 20px' }}>
          {propertyName ? `Creating a booking for ${propertyName}` : 'Select a property first'} — the booking is created as <b>Pending</b> and payment is completed by the guest later.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Rooms *</label>
            {rooms.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--muted-foreground)', padding: '8px 0' }}>No rooms available for this property.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflow: 'auto' }}>
                {rooms.map((r) => {
                  const isSelected = selectedRoomIds.includes(r.id)
                  const hasCover = r.photos?.cover
                  const roomType = roomTypeMap.get(r.room_type_id) || 'Room'
                  return (
                    <label
                      key={r.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px',
                        borderRadius: 8, cursor: 'pointer', fontSize: 13,
                        border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        background: isSelected ? 'var(--accent)' : '#fff',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => toggleRoom(r.id, e.target.checked)}
                        style={{ width: 14, height: 14, cursor: 'pointer', flexShrink: 0 }}
                      />
                      <div style={{
                        width: 36, height: 36, borderRadius: 6, overflow: 'hidden',
                        background: '#f3f4f6', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {hasCover ? (
                          <img
                            src={r.photos?.cover ?? ''}
                            alt={r.room_name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ fontSize: 16 }}>🛏️</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontWeight: 600, color: 'var(--foreground)', lineHeight: '1.2' }}>
                          {r.room_name || 'Room'}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>
                          {roomType}
                        </span>
                      </div>
                    </label>
                  )
                })}
              </div>
            )}
            {errors.roomIds && <p style={errorStyle}>{errors.roomIds.message}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Check-in *</label>
              <input style={inputStyle} type="date" {...register('checkIn')} />
              {errors.checkIn && <p style={errorStyle}>{errors.checkIn.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Check-out *</label>
              <input style={inputStyle} type="date" min={checkIn || undefined} {...register('checkOut')} />
              {errors.checkOut && <p style={errorStyle}>{errors.checkOut.message}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Adults</label>
              <input style={inputStyle} type="number" min={1} max={30} {...register('adults', { valueAsNumber: true })} />
              {errors.adults && <p style={errorStyle}>{errors.adults.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Children</label>
              <input style={inputStyle} type="number" min={0} max={15} {...register('children', { valueAsNumber: true })} />
              {errors.children && <p style={errorStyle}>{errors.children.message}</p>}
            </div>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fee2e2', fontSize: 13, color: '#dc2626' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button type="button" onClick={onClose} disabled={isSubmitting} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
