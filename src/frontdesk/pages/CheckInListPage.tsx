import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Search, LogIn, CheckCircle, Loader2, X, User, Bed, Calendar, CreditCard, Upload, Camera, Phone, Globe, FileText, Users } from "lucide-react"
import toast from "react-hot-toast"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { FormField } from "../components/FormField"
import { useBookingCheckInStore } from "../stores/bookingCheckInStore"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTodayArrivals, checkInGuest, uploadCitizenshipPhotos } from "../../services/pmsApi"
import { collectPaymentSchema } from "../schemas/paymentSchema"
import type { ArrivalGuest } from "../../types/pms"

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-yellow-100 text-yellow-700",
  "bg-green-100 text-green-700",
  "bg-pink-100 text-pink-700",
  "bg-purple-100 text-purple-700",
  "bg-indigo-100 text-indigo-700",
]

function getAvatarColor(index: number): string {
  return avatarColors[index % avatarColors.length]
}

function getPaymentStatus(booking: ArrivalGuest): "paid_in_full" | "balance_due" {
  const status = booking.payment_status?.toLowerCase()
  if (status === "paid" || status === "completed") {
    return "paid_in_full"
  }
  if (booking.amount_due > 0) {
    return "balance_due"
  }
  return "paid_in_full"
}

function getNights(booking: ArrivalGuest): number {
  const checkin = new Date(booking.checkin_date)
  const checkout = new Date(booking.checkout_date)
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.max(0, Math.ceil((checkout.getTime() - checkin.getTime()) / msPerDay))
}

export default function CheckInListPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<ArrivalGuest | null>(null)
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)
  const { checkIn, isCheckedIn } = useBookingCheckInStore()
  const { formatAmount } = usePropertyCurrency()
  const { currentPropertyId } = usePropertyStore()
  const queryClient = useQueryClient()

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(collectPaymentSchema),
    defaultValues: {
      paymentAmount: "",
      paymentGateway: "CASH",
      transactionId: "",
    },
  })

  const paymentAmount = watch("paymentAmount")
  const paymentGateway = watch("paymentGateway")

  const { data: arrivals = [], isLoading, isError } = useQuery({
    queryKey: ["today-arrivals", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return []
      return await getTodayArrivals(currentPropertyId)
    },
    enabled: !!currentPropertyId,
  })

  const checkInMutation = useMutation({
    mutationFn: async ({ refNumber, amount, paymentGateway }: { refNumber: string; amount: number; paymentGateway: string }) => {
      await checkInGuest(refNumber)
      if (frontFile || backFile) {
        await uploadCitizenshipPhotos(refNumber, frontFile, backFile)
      }
      return { refNumber, amount, paymentGateway }
    },
    onSuccess: (_data, { refNumber }) => {
      queryClient.invalidateQueries({ queryKey: ["today-arrivals", currentPropertyId] })
      queryClient.invalidateQueries({ queryKey: ["front-desk-summary", currentPropertyId] })
      if (selectedBooking) checkIn(selectedBooking.booking_id)
      setSelectedBooking(null)
      reset({ paymentAmount: "", paymentGateway: "CASH", transactionId: "" })
      setFrontFile(null)
      setBackFile(null)
      setFrontPreview(null)
      setBackPreview(null)
    },
    onError: (error: Error & { response?: { data?: { message?: string; detail?: string } } }) => {
      const msg = error.response?.data?.detail || error.response?.data?.message || "Check-in failed. Please try again."
      toast.error(msg)
      setSelectedBooking(null)
    },
  })

  const search = searchQuery.trim().toLowerCase()
  const filtered = arrivals.filter((departure) => {
    const guestName = departure.guest?.full_name?.toLowerCase() || ""
    const refNumber = departure.ref_number?.toLowerCase() || ""
    return (
      guestName.includes(search) ||
      refNumber.includes(search) ||
      departure.rooms?.some((room) => room.room_name?.toLowerCase().includes(search))
    )
  })

  const pendingCount = arrivals.filter((b) => {
    const s = b.status?.toUpperCase() || ""
    return s === "CONFIRMED" || s === "PENDING"
  }).length
  const checkedInCount = arrivals.filter((b) => b.status?.toUpperCase() === "CHECKED_IN").length

  const openModal = (booking: ArrivalGuest) => {
    setSelectedBooking(booking)
    const remaining = booking.amount_due || 0
    reset({
      paymentAmount: String(remaining),
      paymentGateway: booking.payment_method === "ONLINE" ? "ONLINE" : "CASH",
      transactionId: "",
    })
    setFrontFile(null)
    setBackFile(null)
    setFrontPreview(null)
    setBackPreview(null)
  }

  const handleFileSelect = (file: File | null, side: "front" | "back") => {
    if (!file) return
    const preview = URL.createObjectURL(file)
    if (side === "front") {
      setFrontFile(file)
      setFrontPreview(preview)
    } else {
      setBackFile(file)
      setBackPreview(preview)
    }
  }

  const onCheckIn = () => {
    if (!selectedBooking) return
    checkIn(selectedBooking.booking_id)
    checkInMutation.mutate({
      refNumber: selectedBooking.ref_number,
      amount: parseFloat(paymentAmount) || 0,
      paymentGateway,
    })
  }

  return (
    <FrontDeskSidebarProvider>
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />

      <main className="flex-1 overflow-auto">
        <MobileMenuButton />
        <div className="p-4 lg:p-6 pt-14 lg:pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
            <LogIn size={22} className="text-green-600" />
            <h1 className="text-xl font-bold text-gray-900">Check-In</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                {checkedInCount}
              </span>
            <div className="sm:flex-1" />
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : isError ? (
              <div className="text-center py-16">
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 inline-block">
                  Failed to load arrivals. Please try again.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                        Guest
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                        Room
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                        Stay
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                        Guests
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                        Amount
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                        Status
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((booking, index) => {
                      const paymentStatus = getPaymentStatus(booking)
                      const nights = getNights(booking)
                      const rooms = booking.rooms || []
                      const visibleRooms = rooms.slice(0, 2)
                      const remainingCount = rooms.length - 2
                      const roomNames = visibleRooms.length > 0 
                        ? visibleRooms.map((r) => r.room_name).join(", ") + (remainingCount > 0 ? ` +${remainingCount} more` : "")
                        : "—"
                      const roomDetails = visibleRooms.length > 0
                        ? visibleRooms.map((r) => `${r.room_type} • ${r.bed_type}`).join(", ") + (remainingCount > 0 ? ` +${remainingCount} more` : "")
                        : ""
                      return (
                        <tr
                          key={booking.booking_id}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${getAvatarColor(index)}`}
                              >
                                {getInitials(booking.guest?.full_name || "")}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">
                                  {booking.guest?.full_name || "—"}
                                </p>
                                <p className="text-xs text-gray-400">
                                  #{booking.ref_number}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-gray-900 text-sm">
                              {roomNames}
                            </p>
                            <p className="text-xs text-gray-500">{roomDetails}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-900">{nights} night{nights !== 1 ? "s" : ""}</p>
                            <p className="text-xs text-gray-500">{booking.checkin_date}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-900">{booking.number_of_adults} Adult{booking.number_of_adults !== 1 ? "s" : ""}</p>
                            {booking.number_of_children > 0 && (
                              <p className="text-xs text-gray-500">{booking.number_of_children} Child{booking.number_of_children !== 1 ? "ren" : ""}</p>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-gray-900">{formatAmount(booking.total_amount || 0)}</p>
                            {booking.amount_due > 0 && (
                              <p className="text-xs text-orange-600">Due: {formatAmount(booking.amount_due)}</p>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                paymentStatus === "paid_in_full"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-orange-50 text-orange-700"
                              }`}
                            >
                              {paymentStatus === "paid_in_full" ? "PAID" : "DUE"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {isCheckedIn(booking.booking_id) || booking.status?.toUpperCase() === "CHECKED_IN" ? (
                              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                                <CheckCircle size={16} />
                                Checked In
                              </span>
                            ) : (
                              <button
                                onClick={() => openModal(booking)}
                                className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                              >
                                Check In
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoading && arrivals.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <LogIn size={20} className="text-gray-400" />
                </div>
                <p className="text-gray-700 font-semibold">No arrivals today</p>
                <p className="text-sm text-gray-500">Guests arriving today will appear here.</p>
              </div>
            )}

            {!isLoading && arrivals.length > 0 && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <p className="text-gray-500 text-sm">No arrivals match your search.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

    {selectedBooking && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedBooking(null)}>
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between pb-0">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Check-In</p>
              <h3 className="text-lg font-bold text-gray-900">Confirm Guest Check-In</h3>
            </div>
            <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          <div className="mt-5">
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${getAvatarColor(0)}`}>
                  {getInitials(selectedBooking.guest?.full_name || "Guest")}
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-gray-900">{selectedBooking.guest?.full_name || "—"}</h4>
                  <p className="text-sm text-gray-500">{selectedBooking.guest?.email || "—"}</p>
                  <p className="text-xs text-gray-400">#{selectedBooking.ref_number}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedBooking.guest?.phone || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                  <Globe size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Nationality</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedBooking.guest?.nationality || "—"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <Bed size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Room(s)</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedBooking.rooms && selectedBooking.rooms.length > 0 ? (
                      <>
                        {selectedBooking.rooms.slice(0, 2).map((r) => r.room_name).join(", ")}
                        {selectedBooking.rooms.length > 2 && (
                          <span className="text-gray-500 font-normal"> +{selectedBooking.rooms.length - 2} more</span>
                        )}
                      </>
                    ) : "—"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedBooking.rooms && selectedBooking.rooms.length > 0 ? (
                      <>
                        {selectedBooking.rooms.slice(0, 2).map((r) => `${r.room_type} - ${r.bed_type}`).join(", ")}
                        {selectedBooking.rooms.length > 2 && (
                          <span className="text-gray-400"> +{selectedBooking.rooms.length - 2} more</span>
                        )}
                      </>
                    ) : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Calendar size={16} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Stay</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedBooking.checkin_date} → {selectedBooking.checkout_date}
                  </p>
                  <p className="text-xs text-gray-500">{getNights(selectedBooking)} night(s)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                  <Users size={16} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Guests</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedBooking.number_of_adults} Adult{selectedBooking.number_of_adults !== 1 ? "s" : ""}
                    {selectedBooking.number_of_children > 0 && `, ${selectedBooking.number_of_children} Child${selectedBooking.number_of_children !== 1 ? "ren" : ""}`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Booking Type</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedBooking.booking_type?.replace("_", " ") || "—"}</p>
                </div>
              </div>
            </div>

            {selectedBooking.special_requests && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Special Requests</p>
                <p className="text-sm text-amber-800">{selectedBooking.special_requests}</p>
              </div>
            )}

            <div className="border border-gray-200 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment Summary</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold text-gray-900">{formatAmount(selectedBooking.total_amount || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-semibold text-green-600">{formatAmount(selectedBooking.amount_paid || 0)}</span>
                </div>
                {selectedBooking.amount_due > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Balance Due</span>
                    <span className="font-semibold text-orange-600">{formatAmount(selectedBooking.amount_due)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-semibold text-gray-900">{selectedBooking.payment_method?.replace("_", " ") || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-semibold ${selectedBooking.payment_status === "PAID" ? "text-green-600" : "text-orange-600"}`}>
                    {selectedBooking.payment_status || "—"}
                  </span>
                </div>
              </div>
            </div>

            {selectedBooking.amount_due > 0 && (
            <div className="border border-gray-200 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Collect Payment</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Amount" error={errors.paymentAmount?.message} htmlFor="paymentAmount" required>
                  <input
                    id="paymentAmount"
                    type="number"
                    min="0"
                    {...register("paymentAmount")}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </FormField>
                <FormField label="Payment Method" error={errors.paymentGateway?.message} htmlFor="paymentGateway" required>
                  <select
                    id="paymentGateway"
                    {...register("paymentGateway")}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="ESEWA">eSewa</option>
                    <option value="KHALTI">Khalti</option>
                    <option value="STRIPE">Stripe</option>
                  </select>
                </FormField>
              </div>
            </div>
            )}

            <div className="border border-gray-200 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Valid Document (Citizenship)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Front Side</label>
                  {frontPreview ? (
                    <div className="relative group">
                      <img
                        src={frontPreview}
                        alt="Citizenship front"
                        className="w-full h-24 object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        onClick={() => { setFrontFile(null); setFrontPreview(null) }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-colors">
                      <Upload size={18} className="text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Upload front</span>
                      <span className="text-[10px] text-gray-400">JPG, PNG up to 5MB</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null, "front")}
                      />
                    </label>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Back Side</label>
                  {backPreview ? (
                    <div className="relative group">
                      <img
                        src={backPreview}
                        alt="Citizenship back"
                        className="w-full h-24 object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        onClick={() => { setBackFile(null); setBackPreview(null) }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-colors">
                      <Camera size={18} className="text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Upload back</span>
                      <span className="text-[10px] text-gray-400">JPG, PNG up to 5MB</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null, "back")}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onCheckIn}
                disabled={checkInMutation.isPending || isCheckedIn(selectedBooking.booking_id)}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checkInMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Checking In...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Check In Guest
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
    </FrontDeskSidebarProvider>
  )
}
