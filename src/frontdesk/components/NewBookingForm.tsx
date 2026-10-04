import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, Check, User, Bed, Calendar, CreditCard, AlertCircle, Upload, X } from "lucide-react"
import { getRooms, getRoomTypes, getBedTypes, getAvailableRooms, getRoomCalendar, createWalkinBooking } from "../../services/pmsApi"
import { usePropertyStore } from "../../stores/propertyStore"
import { createBookingSchema } from "../schemas/bookingSchema"
import type { CreateBookingFormData } from "../schemas/bookingSchema"
import type { AvailableRoom, RoomCalendarRoom } from "../../types/pms"

interface NewBookingFormProps {
  onComplete?: (booking: CreateBookingFormData) => void
  onCancel?: () => void
  formatAmount?: (amount: number) => string
  currency?: string
  initialRoomId?: string | null
  initialCheckinDate?: string | null
  initialCheckoutDate?: string | null
}

const steps = [
  { id: 1, label: "Stay & room", icon: Bed },
  { id: 2, label: "Guest details", icon: User },
  { id: 3, label: "Rate & payment", icon: CreditCard },
  { id: 4, label: "Review & confirm", icon: Check },
]

export function NewBookingForm({ onComplete, onCancel, formatAmount = (n: number) => `${n}`, currency = "NPR", initialRoomId, initialCheckinDate, initialCheckoutDate }: NewBookingFormProps) {
  const navigate = useNavigate()
  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const formatDate = (d: Date) => d.toISOString().split("T")[0]

  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([])
  const [calendarRooms, setCalendarRooms] = useState<RoomCalendarRoom[]>([])
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [roomsError, setRoomsError] = useState("")
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [submitError, setSubmitError] = useState("")
  const [docFront, setDocFront] = useState<string | null>(null)
  const [docBack, setDocBack] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CreateBookingFormData>({
    resolver: zodResolver(createBookingSchema) as any,
    defaultValues: {
      stay: {
        checkInDate: initialCheckinDate || formatDate(today),
        checkOutDate: initialCheckoutDate || formatDate(tomorrow),
        adults: 2,
        children: 0,
        roomType: "standard",
        specialRequests: "",
      },
      guest: {
        fullName: "",
        email: "",
        phone: "",
        countryCode: "+977",
        country: "Nepal",
      },
      paymentMethod: "cash",
      paymentType: "full",
      advanceReceived: "",
      discount: "",
      selectedRooms: [],
    },
  })

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string | null) => void) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setter(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const stayDetails = watch("stay")
  const guestInfo = watch("guest")
  const paymentMethod = watch("paymentMethod")
  const paymentType = watch("paymentType")
  const advanceReceived = watch("advanceReceived")
  const discount = watch("discount")

  useEffect(() => {
    if (!currentPropertyId) {
      setAvailableRooms([])
      setCalendarRooms([])
      setSelectedRooms([])
      return
    }
    let cancelled = false
    setRoomsLoading(true)
    setRoomsError("")

    const loadRooms = async () => {
      try {
        const [rawRooms, roomTypes, bedTypes] = await Promise.all([
          getRooms(currentPropertyId),
          getRoomTypes(currentPropertyId),
          getBedTypes(currentPropertyId),
        ])
        if (cancelled) return

        const rtMap = Object.fromEntries(roomTypes.map((rt) => [rt.id, rt.room_type_name]))
        const btMap = Object.fromEntries(bedTypes.map((bt) => [bt.id, bt.bed_name]))

        const rooms: AvailableRoom[] = rawRooms.map((r) => ({
          id: r.id,
          room_name: r.room_name,
          room_type: rtMap[r.room_type_id] || r.room_type_id,
          bed_type: btMap[r.bed_type_id] || r.bed_type_id,
          base_rate: String(r.base_rate),
          photos: r.photos || { cover: null, gallery: [] },
          max_adults: r.max_adults,
          max_children: r.max_children,
          status: r.status || "AVAILABLE",
          floor_number: r.floor_number,
          cancellation_policy: r.cancellation_policy || "",
          cancellation_title: r.cancellation_title || null,
          cancellation_description: r.cancellation_description || null,
          system_amenities: [],
          custom_amenities: (r.custom_amenities || []).map((a) => ({ name: a.name, icon: a.icon ?? null })),
        }))

        setAvailableRooms(rooms)
      } catch {
        if (!cancelled) setRoomsError("Failed to load rooms")
      }
    }

    loadRooms().finally(() => { if (!cancelled) setRoomsLoading(false) })
    return () => { cancelled = true }
  }, [currentPropertyId])

  useEffect(() => {
    if (!currentPropertyId || !stayDetails.checkInDate || !stayDetails.checkOutDate) {
      setCalendarRooms([])
      return
    }
    let cancelled = false
    getRoomCalendar(currentPropertyId, stayDetails.checkInDate, stayDetails.checkOutDate)
      .then((calendar) => { if (!cancelled) setCalendarRooms(calendar) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [currentPropertyId, stayDetails.checkInDate, stayDetails.checkOutDate])

  useEffect(() => {
    if (initialRoomId && availableRooms.length > 0 && selectedRooms.length === 0) {
      const room = availableRooms.find((r) => r.id === initialRoomId)
      if (room) {
        setSelectedRooms([initialRoomId])
        setValue("selectedRooms", [initialRoomId])
      }
    }
  }, [initialRoomId, availableRooms])

  const groupedByFloor = availableRooms.reduce((acc, room) => {
    const floor = room.floor_number
    if (!acc[floor]) acc[floor] = []
    acc[floor].push(room)
    return acc
  }, {} as Record<number, AvailableRoom[]>)

  const toggleRoom = (id: string) => {
    setSelectedRooms((prev) => {
      const next = prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
      setValue("selectedRooms", next)
      return next
    })
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

  const nextStep = async () => {
    let fieldsToValidate: (keyof CreateBookingFormData)[] = []
    if (currentStep === 1) fieldsToValidate = ["stay", "selectedRooms"]
    if (currentStep === 2) fieldsToValidate = ["guest"]

    const valid = await trigger(fieldsToValidate)
    if (!valid) return

    if (currentStep === 1 && selectedRooms.length === 0) return
    if (currentStep === 1 && capacityError) return

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: CreateBookingFormData) => {
    if (!currentPropertyId) return
    setSubmitError("")
    try {
      const totalRate = selectedRooms.reduce((sum, id) => {
        const room = availableRooms.find((r) => r.id === id)
        return sum + (room ? Number(room.base_rate) * nights : 0)
      }, 0)
      const discountNum = parseFloat(data.discount || "0") || 0
      const grandTotal = totalRate - discountNum
      const advanceReceivedNum = parseFloat(data.advanceReceived || "0") || 0

      const payload = {
        idempotency_key: crypto.randomUUID(),
        property_id: currentPropertyId,
        room_ids: selectedRooms,
        check_in: data.stay.checkInDate,
        check_out: data.stay.checkOutDate,
        adults: data.stay.adults,
        children: data.stay.children,
        guest_full_name: data.guest.fullName,
        guest_email: data.guest.email,
        guest_phone: `${data.guest.countryCode} ${data.guest.phone}`,
        guest_nationality: data.guest.country,
        payment_method: data.paymentMethod === "cash" ? "PAY_ON_ARRIVAL" : data.paymentMethod.toUpperCase(),
        amount_paid: data.paymentType === "full" ? grandTotal : advanceReceivedNum,
        advance_amount: advanceReceivedNum,
        special_requests: data.stay.specialRequests || undefined,
        discount: discountNum || undefined,
      }
      await createWalkinBooking(payload)
      setBookingSuccess(true)
      setTimeout(() => {
        navigate("/frontdesk/bookings")
      }, 2000)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      setSubmitError(error?.response?.data?.detail || "Failed to create booking. Please try again.")
    }
  }

  const nights = stayDetails.checkInDate && stayDetails.checkOutDate
    ? Math.max(0, Math.ceil((new Date(stayDetails.checkOutDate).getTime() - new Date(stayDetails.checkInDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 0

  const stayDates: string[] = (() => {
    if (!stayDetails.checkInDate || !stayDetails.checkOutDate) return []
    const dates: string[] = []
    const d = new Date(stayDetails.checkInDate)
    const end = new Date(stayDetails.checkOutDate)
    while (d < end) {
      dates.push(d.toISOString().slice(0, 10))
      d.setDate(d.getDate() + 1)
    }
    return dates
  })()

  const getCalendarDay = (roomId: string, date: string) => {
    const cal = calendarRooms.find((r) => r.room_id === roomId)
    return cal?.days.find((d) => d.date === date)
  }

  const totalRate = selectedRooms.reduce((sum, id) => {
    const room = availableRooms.find((r) => r.id === id)
    return sum + (room ? Number(room.base_rate) * nights : 0)
  }, 0)

  const discountNum = parseFloat(discount || "0") || 0
  const grandTotal = totalRate - discountNum
  const advanceReceivedNum = parseFloat(advanceReceived || "0") || 0
  const remainingAfterAdvance = grandTotal - advanceReceivedNum

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Bed size={18} className="text-blue-600" />
              <h3 className="text-base font-semibold text-gray-900">1. Stay & room</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-In Date *</label>
                <input
                  type="date"
                  {...register("stay.checkInDate")}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.stay?.checkInDate ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.stay?.checkInDate && <p className="text-xs text-red-500 mt-1">{errors.stay.checkInDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out Date *</label>
                <input
                  type="date"
                  {...register("stay.checkOutDate")}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.stay?.checkOutDate ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.stay?.checkOutDate && <p className="text-xs text-red-500 mt-1">{errors.stay.checkOutDate.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setValue("stay.adults", Math.max(1, stayDetails.adults - 1))}
                    className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 text-sm font-medium"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-lg font-semibold">{stayDetails.adults}</span>
                  <button
                    type="button"
                    onClick={() => setValue("stay.adults", stayDetails.adults + 1)}
                    className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 text-sm font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setValue("stay.children", Math.max(0, stayDetails.children - 1))}
                    className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 text-sm font-medium"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-lg font-semibold">{stayDetails.children}</span>
                  <button
                    type="button"
                    onClick={() => setValue("stay.children", stayDetails.children + 1)}
                    className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 text-sm font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                <label className="text-sm font-medium text-gray-700">Available Rooms</label>
                <span className="text-xs text-gray-500">{availableRooms.length} rooms available · {selectedRooms.length} selected</span>
              </div>
              {errors.selectedRooms && <p className="text-xs text-red-500 mb-2">{errors.selectedRooms.message}</p>}
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
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-600 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 mb-3">
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
                  {calendarRooms.length > 0 && (
                    <>
                      <div className="w-px h-3 bg-blue-200" />
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Available</span>
                        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Booked/Occupied</span>
                      </div>
                    </>
                  )}
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
                      <div
                        className="overflow-x-auto"
                      >
                      <div
                        className="grid gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider min-w-[600px]"
                        style={{ gridTemplateColumns: stayDates.length > 0 ? `1fr 1fr 1fr 0.8fr repeat(${stayDates.length}, minmax(0, 1fr)) 0.8fr` : "1fr 1.2fr 1fr 0.8fr 0.8fr" }}
                      >                          <div>Room</div>
                        <div>Type</div>
                        <div>Bed</div>
                        <div>Guests</div>
                        {stayDates.length > 0 ? stayDates.map((date) => (
                          <div key={date} className="text-center">{new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}</div>
                        )) : null}
                        <div>Rate</div>
                      </div>
                      {rooms.map((room) => {
                        const isSelected = selectedRooms.includes(room.id)
                        const allDaysAvailable = stayDates.length > 0 && stayDates.every((date) => {
                          const day = getCalendarDay(room.id, date)
                          return !day || (day.booking_ref === null && day.guest_name === null)
                        })
                        return (
                          <div
                            key={room.id}
                            onClick={() => allDaysAvailable && toggleRoom(room.id)}
                            className={`grid gap-2 px-4 py-3 border-b border-gray-50 transition-colors items-center ${
                              isSelected ? "bg-blue-50" : allDaysAvailable ? "hover:bg-blue-50/50 cursor-pointer" : "bg-gray-50 opacity-60"
                            }`}
                            style={{ gridTemplateColumns: stayDates.length > 0 ? `1fr 1fr 1fr 0.8fr repeat(${stayDates.length}, minmax(0, 1fr)) 0.8fr` : "1fr 1.2fr 1fr 0.8fr 0.8fr" }}
                          >
                            <div className="flex items-center gap-2">
                              {allDaysAvailable && (
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                                  isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                                }`}>
                                  {isSelected && (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  )}
                                </div>
                              )}
                              <span className="text-sm font-semibold text-gray-900">{room.room_name}</span>
                            </div>
                            <span className="text-sm text-gray-600">{room.room_type}</span>
                            <span className="text-sm text-gray-600">{room.bed_type}</span>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium text-gray-700">{room.max_adults}A</span>
                              {room.max_children > 0 && <span className="font-medium text-gray-700">/{room.max_children}C</span>}
                            </div>
                            {stayDates.length > 0 ? stayDates.map((date) => {
                              const day = getCalendarDay(room.id, date)
                              const isAvailable = !day || (day.booking_ref === null && day.guest_name === null)
                              return (
                                <div key={date} className="flex justify-center">
                                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded text-[10px] font-semibold ${
                                    isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                  }`}>
                                    {isAvailable ? "AVA" : day?.status?.slice(0, 3) || "—"}
                                  </span>
                                </div>
                              )
                            }) : null}
                            <span className="text-sm font-medium text-gray-900">{formatAmount(Number(room.base_rate))}</span>
                          </div>
                        )
                      })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User size={18} className="text-blue-600" />
              <h3 className="text-base font-semibold text-gray-900">2. Guest details</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
              <input
                type="text"
                {...register("guest.fullName")}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.guest?.fullName ? "border-red-400" : "border-gray-200"}`}
                placeholder="e.g. Ram Sharma"
              />
              {errors.guest?.fullName && <p className="text-xs text-red-500 mt-1">{errors.guest.fullName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address *</label>
              <input
                type="email"
                {...register("guest.email")}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.guest?.email ? "border-red-400" : "border-gray-200"}`}
                placeholder="ram.sharma@email.com"
              />
              {errors.guest?.email && <p className="text-xs text-red-500 mt-1">{errors.guest.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
              <div className="flex gap-2">
                <select
                  {...register("guest.countryCode")}
                  className="w-20 sm:w-28 px-2 sm:px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="+977">NP +977</option>
                  <option value="+1">US +1</option>
                  <option value="+44">UK +44</option>
                  <option value="+91">IN +91</option>
                </select>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  {...register("guest.phone")}
                  onKeyDown={(e) => {
                    if (e.key.length === 1 && !/\d/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                      e.preventDefault()
                    }
                  }}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData("text")
                    if (!/^\d+$/.test(pasted)) e.preventDefault()
                  }}
                  className={`flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.guest?.phone ? "border-red-400" : "border-gray-200"}`}
                  placeholder="e.g. 9841234567"
                  maxLength={15}
                />
              </div>
              {errors.guest?.phone && <p className="text-xs text-red-500 mt-1">{errors.guest.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country / Region *</label>
              <select
                {...register("guest.country")}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Document</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="min-h-[120px]">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Front</p>
                  {docFront ? (
                    <div className="relative border border-gray-200 rounded-lg overflow-hidden h-[120px]">
                      <img src={docFront} alt="Document front" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setDocFront(null)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-1.5 h-[120px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
                      <Upload size={16} className="text-gray-400" />
                      <span className="text-xs text-gray-600">Upload front</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleDocUpload(e, setDocFront)}
                      />
                    </label>
                  )}
                </div>
                <div className="min-h-[120px]">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Back</p>
                  {docBack ? (
                    <div className="relative border border-gray-200 rounded-lg overflow-hidden h-[120px]">
                      <img src={docBack} alt="Document back" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setDocBack(null)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-1.5 h-[120px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
                      <Upload size={16} className="text-gray-400" />
                      <span className="text-xs text-gray-600">Upload back</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleDocUpload(e, setDocBack)}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
              <textarea
                {...register("stay.specialRequests")}
                placeholder="Any special requests or notes..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  {...register("paymentMethod")}
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
                  {...register("paymentType")}
                  onChange={(e) => {
                    setValue("paymentType", e.target.value as "full" | "advance" | "checkout")
                    if (e.target.value !== "advance") setValue("advanceReceived", "")
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
                    {...register("advanceReceived")}
                    className={`w-full pl-14 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.advanceReceived ? "border-red-400" : "border-gray-200"}`}
                    placeholder="0.00"
                  />
                </div>
                {errors.advanceReceived && <p className="text-xs text-red-500 mt-1">{errors.advanceReceived.message}</p>}
                <p className="text-xs text-gray-500 mt-1">Total: {formatAmount(grandTotal)}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount ({currency})</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">{currency}</span>
                <input
                  type="number"
                  min="0"
                  max={totalRate}
                  {...register("discount")}
                  className="w-full pl-14 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Room ({nights} nights × {selectedRooms.length} room{selectedRooms.length !== 1 ? "s" : ""}, incl. tax)</span>
                <span className="font-medium">{formatAmount(totalRate)}</span>
              </div>
              {discountNum > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-red-600">-{formatAmount(discountNum)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-blue-600">{formatAmount(grandTotal)}</span>
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-2">
                {paymentType === "advance" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Advance Received</span>
                      <span className="font-semibold text-green-600">{formatAmount(advanceReceivedNum)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining Balance</span>
                      <span className={`font-semibold ${remainingAfterAdvance > 0 ? "text-orange-600" : "text-green-600"}`}>
                        {formatAmount(remainingAfterAdvance)}
                      </span>
                    </div>
                  </>
                )}
                {paymentType === "full" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount to pay now</span>
                    <span className="font-semibold text-green-600">{formatAmount(grandTotal)}</span>
                  </div>
                )}
                {paymentType === "checkout" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount due at checkout</span>
                    <span className="font-semibold text-orange-600">{formatAmount(grandTotal)}</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  {stayDetails.specialRequests && (
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-gray-500 text-xs">Special Requests</span>
                      <p className="text-gray-900 text-sm mt-0.5">{stayDetails.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>

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

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={16} className="text-blue-600" />
                <h4 className="text-sm font-semibold text-gray-900">Payment Details</h4>
              </div>
              <div className={`grid gap-4 text-sm ${paymentType === "advance" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
                <div>
                  <span className="text-gray-500">Method</span>
                  <p className="text-gray-900 font-medium capitalize">{paymentMethod.replace("_", " ")}</p>
                </div>
                <div>
                  <span className="text-gray-500">Type</span>
                  <p className="text-gray-900 font-medium">
                    {paymentType === "full" ? "Full Payment" : paymentType === "advance" ? "Advance Payment" : "Pay at Checkout"}
                  </p>
                </div>
                {paymentType === "advance" && (
                  <div>
                    <span className="text-gray-500">Advance Received</span>
                    <p className="text-green-600 font-semibold">{formatAmount(advanceReceivedNum)}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Pricing Summary</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Room ({nights} nights × {selectedRooms.length} room{selectedRooms.length !== 1 ? "s" : ""}, incl. tax)</span>
                <span className="text-gray-900 font-medium">{formatAmount(totalRate)}</span>
              </div>
              {discountNum > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-red-600 font-medium">-{formatAmount(discountNum)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total (incl. tax)</span>
                <span className="text-xl font-bold text-blue-600">{formatAmount(grandTotal)}</span>
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-2">
                {paymentType === "advance" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Advance Received</span>
                      <span className="font-semibold text-green-600">{formatAmount(advanceReceivedNum)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining Balance</span>
                      <span className={`font-semibold ${remainingAfterAdvance > 0 ? "text-orange-600" : "text-green-600"}`}>
                        {formatAmount(remainingAfterAdvance)}
                      </span>
                    </div>
                  </>
                )}
                {paymentType === "full" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount to pay now</span>
                    <span className="font-semibold text-green-600">{formatAmount(grandTotal)}</span>
                  </div>
                )}
                {paymentType === "checkout" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount due at checkout</span>
                    <span className="font-semibold text-orange-600">{formatAmount(grandTotal)}</span>
                  </div>
                )}
              </div>
            </div>


          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">New Booking</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">Create a reservation with clear guest, stay, room, and payment details.</p>
        </div>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          Cancel
        </button>
      </div>

      <div className="flex items-center mb-6 sm:mb-8 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            <div className={`flex flex-col items-center ${currentStep >= step.id ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                currentStep > step.id
                  ? "bg-green-500 text-white"
                  : currentStep === step.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}>
                {currentStep > step.id ? (
                  <Check size={16} />
                ) : (
                  <span className="text-xs sm:text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <span className="text-[10px] sm:text-xs font-medium mt-1.5 sm:mt-2 whitespace-nowrap hidden sm:block">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
                currentStep > step.id ? "bg-green-500" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className={currentStep === 4 ? "col-span-1 lg:col-span-3" : "col-span-1 lg:col-span-2"}>
          {renderStep()}
        </div>
        
        {currentStep !== 4 && (
          <div className="border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
            <div className="sticky top-4 bg-gray-50 rounded-lg p-4">
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
                        <span className="text-gray-500">{room.room_name} (incl. tax)</span>
                        <span className="text-gray-900 font-medium">{formatAmount(Number(room.base_rate) * nights)}</span>
                      </div>
                    ) : null
                  }) : (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rooms Selected</span>
                      <span className="text-gray-900 font-medium">—</span>
                    </div>
                  )}
                  {discountNum > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-red-600 font-medium">-{formatAmount(discountNum)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total</span>
                    <span className="text-gray-900 font-medium">{totalRate > 0 ? formatAmount(grandTotal) : "—"}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">{totalRate > 0 ? formatAmount(grandTotal) : formatAmount(0)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{nights > 0 ? `${nights} nights` : "0 nights"} · taxes included</p>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-5 sm:px-6 py-2.5 rounded-lg font-medium transition-colors ${
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
            className="px-5 sm:px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Next
            <span className="hidden sm:inline">: {steps[currentStep].label}</span>
            <ChevronRight size={16} className="inline ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmit(onSubmit as any)}
            disabled={isSubmitting}
            className="px-5 sm:px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Complete Booking"}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl text-center max-w-sm w-full animate-in fade-in zoom-in duration-200">
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
