import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Check, User, Bed, Calendar, CreditCard, AlertCircle } from "lucide-react"
import { getAvailableRooms, createWalkinBooking } from "../../services/pmsApi"
import { usePropertyStore } from "../../stores/propertyStore"
import type { AvailableRoom } from "../../types/pms"

interface GuestInfo {
  fullName: string
  email: string
  phone: string
  countryCode: string
  country: string
}

interface StayDetails {
  checkInDate: string
  checkOutDate: string
  adults: number
  children: number
  roomType: string
  specialRequests: string
}

interface BookingSummary {
  guest: GuestInfo
  stay: StayDetails
  roomNumber?: string
  totalAmount?: number
}

interface NewBookingFormProps {
  onComplete?: (booking: BookingSummary) => void
  onCancel?: () => void
  formatAmount?: (amount: number) => string
  currency?: string
}

const steps = [
  { id: 1, label: "Guest details", icon: User },
  { id: 2, label: "Stay & room", icon: Bed },
  { id: 3, label: "Rate & payment", icon: CreditCard },
  { id: 4, label: "Review & confirm", icon: Check },
]

export function NewBookingForm({ onComplete, onCancel, formatAmount = (n: number) => `${n}`, currency = "NPR" }: NewBookingFormProps) {
  const navigate = useNavigate()
  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+977",
    country: "Nepal",
  })
  const [stayDetails, setStayDetails] = useState<StayDetails>({
    checkInDate: "",
    checkOutDate: "",
    adults: 2,
    children: 0,
    roomType: "standard",
    specialRequests: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [paymentType, setPaymentType] = useState("full")
  const [advanceReceived, setAdvanceReceived] = useState("")
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([])
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [roomsError, setRoomsError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const clearError = (field: string) => {
    setErrors(prev => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}
    if (step === 1) {
      if (!guestInfo.fullName.trim()) newErrors.fullName = "Full name is required"
      if (!guestInfo.email.trim()) newErrors.email = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) newErrors.email = "Invalid email format"
      if (!guestInfo.phone.trim()) newErrors.phone = "Phone number is required"
    }
    if (step === 2) {
      if (!stayDetails.checkInDate) newErrors.checkInDate = "Check-in date is required"
      if (!stayDetails.checkOutDate) newErrors.checkOutDate = "Check-out date is required"
      else if (stayDetails.checkInDate && stayDetails.checkOutDate && stayDetails.checkOutDate <= stayDetails.checkInDate) newErrors.checkOutDate = "Check-out must be after check-in"
      if (selectedRooms.length === 0) newErrors.rooms = "Select at least one room"
      else if (capacityError) newErrors.rooms = `Selected room(s) fit ${capacityAdults} Adult${capacityAdults !== 1 ? "s" : ""}, ${capacityChildren} Children but ${stayDetails.adults} Adult${stayDetails.adults !== 1 ? "s" : ""}, ${stayDetails.children} Children needed.`
    }
    if (step === 3 && paymentType === "advance") {
      if (!advanceReceived || advanceReceivedNum <= 0) newErrors.advance = "Enter advance amount"
      else if (advanceReceivedNum > grandTotal) newErrors.advance = "Advance cannot exceed total"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const capacityAdults = selectedRooms.reduce((sum, id) => {
    const room = availableRooms.find((r) => r.id === id)
    return sum + (room ? Number(room.max_adults) : 0)
  }, 0)
  const capacityChildren = selectedRooms.reduce((sum, id) => {
    const room = availableRooms.find((r) => r.id === id)
    return sum + (room ? Number(room.max_children) : 0)
  }, 0)
  const capacityError = selectedRooms.length > 0 && (capacityAdults < stayDetails.adults || capacityChildren < stayDetails.children)

  const toggleRoom = (id: string) => {
    setSelectedRooms((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  useEffect(() => {
    if (!currentPropertyId || !stayDetails.checkInDate || !stayDetails.checkOutDate) {
      setAvailableRooms([])
      setSelectedRooms([])
      return
    }
    let cancelled = false
    setRoomsLoading(true)
    setRoomsError("")
    setSelectedRooms([])
    getAvailableRooms(currentPropertyId, stayDetails.checkInDate, stayDetails.checkOutDate, stayDetails.adults, stayDetails.children)
      .then((rooms) => { if (!cancelled) setAvailableRooms(rooms) })
      .catch(() => { if (!cancelled) setRoomsError("Failed to load available rooms") })
      .finally(() => { if (!cancelled) setRoomsLoading(false) })
    return () => { cancelled = true }
  }, [currentPropertyId, stayDetails.checkInDate, stayDetails.checkOutDate, stayDetails.adults, stayDetails.children])

  const groupedByFloor = availableRooms.reduce((acc, room) => {
    const floor = room.floor_number
    if (!acc[floor]) acc[floor] = []
    acc[floor].push(room)
    return acc
  }, {} as Record<number, AvailableRoom[]>)

  const handleGuestInfoChange = (field: keyof GuestInfo, value: string) => {
    setGuestInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleStayDetailsChange = (field: keyof StayDetails, value: string | number) => {
    setStayDetails(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (!validateStep(currentStep)) return
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return
    if (!currentPropertyId) return
    setSubmitting(true)
    setSubmitError("")
    try {
      const payload = {
        idempotency_key: crypto.randomUUID(),
        property_id: currentPropertyId,
        room_ids: selectedRooms,
        check_in: stayDetails.checkInDate,
        check_out: stayDetails.checkOutDate,
        adults: stayDetails.adults,
        children: stayDetails.children,
        guest_full_name: guestInfo.fullName,
        guest_email: guestInfo.email,
        guest_phone: `${guestInfo.countryCode} ${guestInfo.phone}`,
        guest_nationality: guestInfo.country,
        payment_method: paymentMethod === "cash" ? "PAY_ON_ARRIVAL" : paymentMethod.toUpperCase(),
        amount_paid: paymentType === "full" ? grandTotal : advanceReceivedNum,
        advance_amount: advanceReceivedNum,
        special_requests: stayDetails.specialRequests || undefined,
      }
      await createWalkinBooking(payload)
      setBookingSuccess(true)
      setTimeout(() => {
        navigate("/frontdesk/bookings")
      }, 2000)
    } catch (err: any) {
      setSubmitError(err?.response?.data?.detail || "Failed to create booking. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const nights = stayDetails.checkInDate && stayDetails.checkOutDate
    ? Math.max(0, Math.ceil((new Date(stayDetails.checkOutDate).getTime() - new Date(stayDetails.checkInDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 0

  const totalRate = selectedRooms.reduce((sum, id) => {
    const room = availableRooms.find((r) => r.id === id)
    return sum + (room ? Number(room.base_rate) * nights : 0)
  }, 0)

  const taxes = totalRate * 0.12
  const grandTotal = totalRate + taxes
  const advanceReceivedNum = parseFloat(advanceReceived) || 0
  const remainingAfterAdvance = grandTotal - advanceReceivedNum

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User size={18} className="text-blue-600" />
              <h3 className="text-base font-semibold text-gray-900">1. Guest details</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
              <input
                type="text"
                value={guestInfo.fullName}
                onChange={(e) => { handleGuestInfoChange("fullName", e.target.value); clearError("fullName") }}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? "border-red-400" : "border-gray-200"}`}
                placeholder="e.g. Olivia Martin"
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address *</label>
              <input
                type="email"
                value={guestInfo.email}
                onChange={(e) => { handleGuestInfoChange("email", e.target.value); clearError("email") }}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? "border-red-400" : "border-gray-200"}`}
                placeholder="olivia.martin@email.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
              <div className="flex gap-2">
                <select
                  value={guestInfo.countryCode}
                  onChange={(e) => handleGuestInfoChange("countryCode", e.target.value)}
                  className="w-28 px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="+977">NP +977</option>
                  <option value="+1">US +1</option>
                  <option value="+44">UK +44</option>
                  <option value="+91">IN +91</option>
                </select>
                <input
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => { handleGuestInfoChange("phone", e.target.value); clearError("phone") }}
                  className={`flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? "border-red-400" : "border-gray-200"}`}
                  placeholder="e.g. +1 (555) 000-0000"
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country / Region *</label>
              <select
                value={guestInfo.country}
                onChange={(e) => handleGuestInfoChange("country", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Nepal">Nepal</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="India">India</option>
              </select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Bed size={18} className="text-blue-600" />
              <h3 className="text-base font-semibold text-gray-900">2. Stay & room</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-In Date *</label>
                <input
                  type="date"
                  value={stayDetails.checkInDate}
                  onChange={(e) => { handleStayDetailsChange("checkInDate", e.target.value); clearError("checkInDate") }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.checkInDate ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.checkInDate && <p className="text-xs text-red-500 mt-1">{errors.checkInDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out Date *</label>
                <input
                  type="date"
                  value={stayDetails.checkOutDate}
                  onChange={(e) => { handleStayDetailsChange("checkOutDate", e.target.value); clearError("checkOutDate") }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.checkOutDate ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.checkOutDate && <p className="text-xs text-red-500 mt-1">{errors.checkOutDate}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleStayDetailsChange("adults", Math.max(1, stayDetails.adults - 1))}
                    className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-lg font-semibold">{stayDetails.adults}</span>
                  <button
                    type="button"
                    onClick={() => handleStayDetailsChange("adults", stayDetails.adults + 1)}
                    className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleStayDetailsChange("children", Math.max(0, stayDetails.children - 1))}
                    className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-lg font-semibold">{stayDetails.children}</span>
                  <button
                    type="button"
                    onClick={() => handleStayDetailsChange("children", stayDetails.children + 1)}
                    className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Available Rooms</label>
                <span className="text-xs text-gray-500">{availableRooms.length} rooms available · {selectedRooms.length} selected</span>
              </div>
              {errors.rooms && <p className="text-xs text-red-500 mb-2">{errors.rooms}</p>}
              {capacityError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-2">
                  <AlertCircle size={16} />
                  <span>Selected room(s) fit {capacityAdults} Adult{capacityAdults !== 1 ? "s" : ""}, {capacityChildren} Children but {stayDetails.adults} Adult{stayDetails.adults !== 1 ? "s" : ""}, {stayDetails.children} Children needed.</span>
                </div>
              )}
              {roomsLoading && (
                <div className="text-center py-8 text-gray-500 text-sm">Loading available rooms...</div>
              )}
              {roomsError && (
                <div className="text-center py-8 text-red-500 text-sm">{roomsError}</div>
              )}
              {!roomsLoading && !roomsError && stayDetails.checkInDate && stayDetails.checkOutDate && availableRooms.length > 0 && (
                <div className="flex items-center gap-4 text-xs text-gray-600 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-blue-500" />
                    <span>{stayDetails.checkInDate} → {stayDetails.checkOutDate}</span>
                  </div>
                  <div className="w-px h-3 bg-blue-200" />
                  <div className="flex items-center gap-1.5">
                    <User size={13} className="text-blue-500" />
                    <span>{stayDetails.adults} Adult{stayDetails.adults !== 1 ? "s" : ""}{stayDetails.children > 0 ? `, ${stayDetails.children} Child${stayDetails.children !== 1 ? "ren" : ""}` : ""}</span>
                  </div>
                  <div className="w-px h-3 bg-blue-200" />
                  <span className="font-medium">{availableRooms.length} room{availableRooms.length !== 1 ? "s" : ""} found</span>
                </div>
              )}
              {!roomsLoading && !roomsError && stayDetails.checkInDate && stayDetails.checkOutDate && availableRooms.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">No available rooms for selected dates</div>
              )}
              {!roomsLoading && !roomsError && availableRooms.length > 0 && (
              <div className="space-y-4">
                {Object.entries(groupedByFloor).map(([floor, rooms]) => (
                  <div key={floor}>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Floor {floor}</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-[1fr_1.2fr_1fr_0.8fr_0.8fr] gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        <div>Room</div>
                        <div>Type</div>
                        <div>Bed</div>
                        <div>Guests</div>
                        <div>Rate</div>
                      </div>
                      {rooms.map((room) => {
                        const isSelected = selectedRooms.includes(room.id)
                        return (
                          <div
                            key={room.id}
                            onClick={() => toggleRoom(room.id)}
                            className={`grid grid-cols-[1fr_1.2fr_1fr_0.8fr_0.8fr] gap-2 px-4 py-3 border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer items-center ${
                              isSelected ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                              }`}>
                                {isSelected && (
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6 9 17l-5-5" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{room.room_name}</span>
                            </div>
                            <span className="text-sm text-gray-600">{room.room_type}</span>
                            <span className="text-sm text-gray-600">{room.bed_type}</span>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium text-gray-700">{room.max_adults} Adult{room.max_adults !== 1 ? "s" : ""}</span>
                              {room.max_children > 0 && <span>, {room.max_children} Child{room.max_children !== 1 ? "ren" : ""}</span>}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{formatAmount(Number(room.base_rate))}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-blue-600" />
              <h3 className="text-base font-semibold text-gray-900">3. Rate & payment</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="online">Online Payment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                <select
                  value={paymentType}
                  onChange={(e) => {
                    setPaymentType(e.target.value)
                    setAdvanceReceived("")
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="full">Full Payment</option>
                  <option value="advance">Advance Payment</option>
                  <option value="checkout">Pay at Checkout</option>
                </select>
              </div>
            </div>

            {paymentType === "advance" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount Received</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">{currency}</span>
                  <input
                    type="number"
                    min="0"
                    max={grandTotal}
                    value={advanceReceived}
                    onChange={(e) => { setAdvanceReceived(e.target.value); clearError("advance") }}
                    className={`w-full pl-14 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.advance ? "border-red-400" : "border-gray-200"}`}
                    placeholder="0.00"
                  />
                </div>
                {errors.advance && <p className="text-xs text-red-500 mt-1">{errors.advance}</p>}
                <p className="text-xs text-gray-500 mt-1">Total: ${formatAmount(grandTotal)}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Room ({nights} nights × {selectedRooms.length} room{selectedRooms.length !== 1 ? "s" : ""})</span>
                <span className="font-medium">${formatAmount(totalRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes & Fees (12%)</span>
                <span className="font-medium">${formatAmount(taxes)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-blue-600">${formatAmount(grandTotal)}</span>
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-2">
                {paymentType === "advance" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Advance Received</span>
                      <span className="font-semibold text-green-600">${formatAmount(advanceReceivedNum)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining Balance</span>
                      <span className={`font-semibold ${remainingAfterAdvance > 0 ? "text-orange-600" : "text-green-600"}`}>
                        ${formatAmount(remainingAfterAdvance)}
                      </span>
                    </div>
                  </>
                )}
                {paymentType === "full" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount to pay now</span>
                    <span className="font-semibold text-green-600">${formatAmount(grandTotal)}</span>
                  </div>
                )}
                {paymentType === "checkout" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount due at checkout</span>
                    <span className="font-semibold text-orange-600">${formatAmount(grandTotal)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Check size={18} className="text-blue-600" />
              <h3 className="text-base font-semibold text-gray-900">4. Review & confirm</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Guest Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User size={16} className="text-blue-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Guest Details</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Full Name</span>
                    <span className="text-gray-900 font-medium">{guestInfo.fullName || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="text-gray-900 font-medium">{guestInfo.email || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span className="text-gray-900 font-medium">{guestInfo.phone ? `${guestInfo.countryCode} ${guestInfo.phone}` : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Country</span>
                    <span className="text-gray-900 font-medium">{guestInfo.country || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Stay & Room */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bed size={16} className="text-blue-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Stay & Room</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Check-in</span>
                    <span className="text-gray-900 font-medium">{stayDetails.checkInDate || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Check-out</span>
                    <span className="text-gray-900 font-medium">{stayDetails.checkOutDate || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nights</span>
                    <span className="text-gray-900 font-medium">{nights > 0 ? nights : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Guests</span>
                    <span className="text-gray-900 font-medium">{stayDetails.adults} Adults{stayDetails.children > 0 ? `, ${stayDetails.children} Children` : ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rooms</span>
                    <span className="text-gray-900 font-medium">{selectedRooms.length > 0 ? selectedRooms.map((id) => availableRooms.find((r) => r.id === id)?.room_name).join(", ") : "—"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={16} className="text-blue-600" />
                <h4 className="text-sm font-semibold text-gray-900">Payment Details</h4>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <span className="text-gray-900 font-medium capitalize">{paymentMethod.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="text-gray-900 font-medium">
                    {paymentType === "full" ? "Full Payment" : paymentType === "advance" ? "Advance Payment" : "Pay at Checkout"}
                  </span>
                </div>
                {paymentType === "advance" && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Advance Received</span>
                    <span className="text-green-600 font-semibold">${formatAmount(advanceReceivedNum)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Pricing Summary</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Room ({nights} nights × {selectedRooms.length} room{selectedRooms.length !== 1 ? "s" : ""})</span>
                <span className="text-gray-900 font-medium">${formatAmount(totalRate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes & Fees (12%)</span>
                <span className="text-gray-900 font-medium">${formatAmount(taxes)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-blue-600">${formatAmount(grandTotal)}</span>
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-2">
                {paymentType === "advance" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Advance Received</span>
                      <span className="font-semibold text-green-600">${formatAmount(advanceReceivedNum)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining Balance</span>
                      <span className={`font-semibold ${remainingAfterAdvance > 0 ? "text-orange-600" : "text-green-600"}`}>
                        ${formatAmount(remainingAfterAdvance)}
                      </span>
                    </div>
                  </>
                )}
                {paymentType === "full" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount to pay now</span>
                    <span className="font-semibold text-green-600">${formatAmount(grandTotal)}</span>
                  </div>
                )}
                {paymentType === "checkout" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount due at checkout</span>
                    <span className="font-semibold text-orange-600">${formatAmount(grandTotal)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check size={16} />
              <span>Instant confirmation upon final step</span>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">New Booking</h2>
          <p className="text-sm text-gray-500 mt-1">Create a reservation with clear guest, stay, room, and payment details.</p>
        </div>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg">×</span>
          Cancel
        </button>
      </div>

      <div className="flex items-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className={`flex flex-col items-center ${currentStep >= step.id ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep > step.id
                  ? "bg-green-500 text-white"
                  : currentStep === step.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}>
                {currentStep > step.id ? (
                  <Check size={18} />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <span className="text-xs font-medium mt-2">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                currentStep > step.id ? "bg-green-500" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className={currentStep === 1 || currentStep === 4 ? "col-span-3" : "col-span-2"}>
          {renderStep()}
        </div>
        
        {currentStep !== 1 && currentStep !== 4 && (
          <div className="border-l border-gray-100 pl-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Reservation Summary</h4>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Guest</span>
                    <span className="text-gray-900 font-medium">{guestInfo.fullName || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phone</span>
                    <span className="text-gray-900 font-medium">{guestInfo.phone ? `${guestInfo.countryCode} ${guestInfo.phone}` : "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Country</span>
                    <span className="text-gray-900 font-medium">{guestInfo.country || "—"}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Check-in</span>
                    <span className="text-gray-900 font-medium">{stayDetails.checkInDate || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Check-out</span>
                    <span className="text-gray-900 font-medium">{stayDetails.checkOutDate || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Nights</span>
                    <span className="text-gray-900 font-medium">{nights > 0 ? nights : "—"}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Adults</span>
                    <span className="text-gray-900 font-medium">{stayDetails.adults}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Children</span>
                    <span className="text-gray-900 font-medium">{stayDetails.children}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2">
                  {selectedRooms.length > 0 ? selectedRooms.map((id) => {
                    const room = availableRooms.find((r) => r.id === id)
                    return room ? (
                      <div key={id} className="flex justify-between text-sm">
                        <span className="text-gray-500">{room.room_name}</span>
                        <span className="text-gray-900 font-medium">{formatAmount(Number(room.base_rate) * nights)}</span>
                      </div>
                    ) : null
                  }) : (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rooms Selected</span>
                      <span className="text-gray-900 font-medium">—</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Room Rate</span>
                    <span className="text-gray-900 font-medium">{totalRate > 0 ? formatAmount(totalRate) : "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Taxes & Fees</span>
                    <span className="text-gray-900 font-medium">{totalRate > 0 ? formatAmount(taxes) : "—"}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">{totalRate > 0 ? formatAmount(totalRate + taxes) : formatAmount(0)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{nights > 0 ? `${nights} nights` : "0 nights"} · taxes included</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-green-600 pt-2">
                  <Check size={14} />
                  <span>Instant confirmation upon final step</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            currentStep === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ChevronLeft size={16} className="inline mr-1" />
          Previous
        </button>
        
        {currentStep < steps.length ? (
          <button
            onClick={nextStep}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Next: {steps[currentStep].label}
            <ChevronRight size={16} className="inline ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Complete Booking"}
            <Check size={16} className="inline ml-1" />
          </button>
        )}
      </div>
      {submitError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {submitError}
        </div>
      )}

      {bookingSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Created Successfully!</h3>
            <p className="text-sm text-gray-500">Redirecting to bookings list...</p>
          </div>
        </div>
      )}
    </div>
  )
}
