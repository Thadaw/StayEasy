import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useManagerPropertyStore } from '../../stores/managerPropertyStore'
import ManagerLayout from '../../components/manager/ManagerLayout'
import BookingProgress from '../../components/manager/bookings/BookingProgress'
import NewBookingStep1, { type BookingFormData, initialFormData } from '../../components/manager/bookings/NewBookingStep1'
import NewBookingStep2 from '../../components/manager/bookings/NewBookingStep2'
import { createBooking, getAvailableRooms, getAllProperties } from '../../services/pmsApi'
import { bookingKeys, propertyKeys, roomKeys } from '../../lib/queryKeys'
import type { AvailableRoom, BookingCreatePayload } from '../../types/pms'

export default function ManagerNewBookingPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const assignedPropertyId = useManagerPropertyStore((s) => s.assignedPropertyId)

  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState<BookingFormData>(initialFormData)

  const { data: properties = [] } = useQuery({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })
  const property = properties.find((p) => p.id === assignedPropertyId) ?? properties[0]
  const effectivePropertyId = property?.id ?? ''

  const { data: availableRooms = [] } = useQuery({
    queryKey: roomKeys.available(effectivePropertyId, formData.checkIn, formData.checkOut, formData.adults, formData.children, 1),
    queryFn: () => getAvailableRooms(effectivePropertyId, formData.checkIn, formData.checkOut, formData.adults, formData.children),
    enabled: !!effectivePropertyId && !!formData.checkIn && !!formData.checkOut && formData.checkOut > formData.checkIn,
  })

  const selectedRoom = useMemo(() => {
    return availableRooms.find((r) => r.id === formData.selectedRoomId) || null
  }, [availableRooms, formData.selectedRoomId])

  const priceBreakdown = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut || !selectedRoom) return null
    const nights = Math.max(1, Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / 86400000))
    const rate = parseFloat(selectedRoom.base_rate) || 0
    const subtotal = nights * rate
    const taxes = Math.round(subtotal * 0.13)
    const total = subtotal + taxes
    return { nights, rate, subtotal, taxes, total }
  }, [formData.checkIn, formData.checkOut, selectedRoom])

  const handleFormChange = (partial: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }))
  }

  const handleContinue = () => setStep(2)
  const handleBack = () => setStep(1)
  const handleCancel = () => navigate('/manager/bookings')

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.byProperty(effectivePropertyId) })
      navigate('/manager/bookings')
    },
  })

  const handleConfirm = () => {
    if (!selectedRoom || !effectivePropertyId || !priceBreakdown) return
    const payload: BookingCreatePayload = {
      idempotency_key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      property_id: effectivePropertyId,
      room_ids: [selectedRoom.id],
      check_in: formData.checkIn,
      check_out: formData.checkOut,
      adults: formData.adults,
      children: formData.children,
    }
    mutation.mutate(payload)
  }

  return (
    <ManagerLayout>
      <BookingProgress currentStep={step} />

      {step === 1 ? (
        <NewBookingStep1
          data={formData}
          onChange={handleFormChange}
          onContinue={handleContinue}
          onCancel={handleCancel}
        />
      ) : selectedRoom && priceBreakdown ? (
        <NewBookingStep2
          formData={formData}
          selectedRoom={selectedRoom}
          price={priceBreakdown}
          propertyName={property?.name || 'Property'}
          onBack={handleBack}
          onConfirm={handleConfirm}
          isSubmitting={mutation.isPending}
        />
      ) : null}
    </ManagerLayout>
  )
}
