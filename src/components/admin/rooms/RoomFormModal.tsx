import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { roomSchema, type RoomFormData } from '@/schemas/admin/roomSchema'
import type { Room } from '@/components/admin/rooms/RoomTable'
import type { RoomTypeResponse, BedTypeResponse } from '@/types/pms'

interface RoomFormModalProps {
  editingRoom: Room | null
  roomTypes: RoomTypeResponse[]
  bedTypes: BedTypeResponse[]
  submitting?: boolean
  onClose: () => void
  onSubmit: (data: RoomFormData) => void
}

const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 13, color: 'var(--foreground)', outline: 'none', boxSizing: 'border-box' as const }
const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: 'var(--muted-foreground)', marginBottom: 4, display: 'block' as const }
const errorStyle = { fontSize: 12, color: '#dc2626', marginTop: 4 }

function buildDefaults(editingRoom: Room | null): RoomFormData {
  if (editingRoom) {
    return {
      number: editingRoom.number,
      type: editingRoom.type,
      bedInfo: editingRoom.bedInfo,
      floor: editingRoom.floor,
      status: editingRoom.status,
      capacity: editingRoom.capacity,
      price: editingRoom.price,
    }
  }
  return {
    number: String(Math.floor(Math.random() * 900) + 100),
    type: 'Standard Room',
    bedInfo: '1 King Bed',
    floor: '1st Floor',
    status: 'Available',
    capacity: 2,
    price: '',
  }
}

export default function RoomFormModal({ editingRoom, roomTypes, bedTypes, submitting = false, onClose, onSubmit }: RoomFormModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: buildDefaults(editingRoom),
    mode: 'onTouched',
  })

  const floorValue = watch('floor')
  const floorNumber = floorValue.replace(/\D/g, '')

  const handleFloorChange = (raw: string) => {
    const value = raw || '1'
    const n = Number(value)
    const mod100 = n % 100
    const suffix = mod100 >= 11 && mod100 <= 13 ? 'th' : n % 10 === 1 ? 'st' : n % 10 === 2 ? 'nd' : n % 10 === 3 ? 'rd' : 'th'
    setValue('floor', `${value}${suffix} Floor`, { shouldValidate: true, shouldDirty: true })
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 12, padding: 28, width: 520, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px' }}>{editingRoom ? 'Edit Room' : 'Add Room'}</h3>

        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Room Number *</label>
              <input style={inputStyle} placeholder="e.g. 301" {...register('number')} />
              {errors.number && <p style={errorStyle}>{errors.number.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Room Type</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} {...register('type')}>
                {roomTypes.map(rt => <option key={rt.id} value={rt.room_type_name}>{rt.room_type_name}</option>)}
                {roomTypes.length === 0 && <>
                  <option>Standard Room</option>
                  <option>Deluxe Room</option>
                  <option>Suite Room</option>
                </>}
              </select>
              {errors.type && <p style={errorStyle}>{errors.type.message}</p>}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Bed Info</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} {...register('bedInfo')}>
              {bedTypes.map(bt => <option key={bt.id} value={bt.bed_name}>{bt.bed_name}</option>)}
              {bedTypes.length === 0 && <>
                <option>1 King Bed</option>
                <option>2 Single Beds</option>
                <option>1 King + 1 Single Bed</option>
              </>}
            </select>
            {errors.bedInfo && <p style={errorStyle}>{errors.bedInfo.message}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Floor</label>
              <input style={inputStyle} type="number" min={1} value={floorNumber} onChange={(e) => handleFloorChange(e.target.value)} />
              {errors.floor && <p style={errorStyle}>{errors.floor.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} {...register('status')}>
                <option>Available</option>
                <option>Occupied</option>
                <option>Cleaning</option>
                <option>Maintenance</option>
                <option>Out of Order</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Capacity</label>
              <input style={inputStyle} type="number" min={1} max={10} {...register('capacity', { valueAsNumber: true })} />
              {errors.capacity && <p style={errorStyle}>{errors.capacity.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Price / Night *</label>
              <input style={inputStyle} placeholder="e.g. NPR 8,000" {...register('price')} />
              {errors.price && <p style={errorStyle}>{errors.price.message}</p>}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button type="button" onClick={onClose} disabled={submitting} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 500, opacity: submitting ? 0.6 : 1 }}>Cancel</button>
            <button type="submit" disabled={submitting} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, opacity: submitting ? 0.6 : 1 }}>{submitting ? 'Saving…' : editingRoom ? 'Save Changes' : 'Add Room'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
