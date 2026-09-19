import { useState } from "react"
import { Search, LogIn, CheckCircle, Loader2, X, User, Bed, Calendar, CreditCard, Upload, Camera } from "lucide-react"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { useBookingCheckInStore } from "../stores/bookingCheckInStore"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTodayArrivals, checkInGuest, uploadCitizenshipPhotos } from "../../services/pmsApi"
import type { ArrivalGuest } from "../../types/pms"

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

function getAvatarColor(index: number): string {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-yellow-100 text-yellow-700",
    "bg-green-100 text-green-700",
    "bg-pink-100 text-pink-700",
    "bg-purple-100 text-purple-700",
    "bg-indigo-100 text-indigo-700",
  ]
  return colors[index % colors.length]
}

function getPaymentStatus(booking: ArrivalGuest): "paid_in_full" | "balance_due" {
  if (booking.payment_status?.toLowerCase() === "paid" || booking.payment_status?.toLowerCase() === "completed") return "paid_in_full"
  if (booking.amount_due > 0) return "balance_due"
  return "paid_in_full"
}

function getNights(booking: ArrivalGuest): number {
  const checkin = new Date(booking.checkin_date)
  const checkout = new Date(booking.checkout_date)
  return Math.max(0, Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24)))
}

export default function CheckInListPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<ArrivalGuest | null>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentGateway, setPaymentGateway] = useState("CASH")
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)
  const { checkIn, isCheckedIn } = useBookingCheckInStore()
  const { formatAmount } = usePropertyCurrency()
  const { currentPropertyId } = usePropertyStore()
  const queryClient = useQueryClient()

  const { data: arrivals = [], isLoading } = useQuery({
    queryKey: ["today-arrivals", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return []
      try {
        return await getTodayArrivals(currentPropertyId)
      } catch {
        return []
      }
    },
    enabled: !!currentPropertyId,
  })

  const checkInMutation = useMutation({
    mutationFn: async ({ refNumber, amount, paymentGateway }: { refNumber: string; amount: number; paymentGateway: string }) => {
      const payload: Record<string, unknown> = { idempotency_key: crypto.randomUUID() }
      if (amount > 0) {
        payload.amount = amount
        payload.payment_gateway = paymentGateway
      }
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
      setPaymentAmount("")
      setPaymentGateway("CASH")
      setFrontFile(null)
      setBackFile(null)
      setFrontPreview(null)
      setBackPreview(null)
    },
  })

  const filtered = arrivals.filter(
    (g) =>
      g.guest?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.ref_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.rooms?.some((r) => r.room_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const pendingCount = arrivals.filter((b) => {
    const s = b.status?.toUpperCase() || ""
    return s === "CONFIRMED" || s === "PENDING"
  }).length
  const checkedInCount = arrivals.filter((b) => b.status?.toUpperCase() === "CHECKED_IN").length

  const openModal = (booking: ArrivalGuest) => {
    setSelectedBooking(booking)
    const remaining = booking.amount_due || 0
    setPaymentAmount(String(remaining))
    setPaymentGateway(booking.payment_method === "ONLINE" ? "ONLINE" : "CASH")
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
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {pendingCount} pending
              </span>
            )}
            {checkedInCount > 0 && (
              <span className="bg-green-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {checkedInCount} checked in
              </span>
            )}
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
                        Balance
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
                      const roomNames = booking.rooms?.map((r) => r.room_name).join(", ") || "—"
                      const roomTypes = booking.rooms?.map((r) => r.room_type).join(", ") || ""
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
                                  #{booking.ref_number?.slice(0, 8) || booking.booking_id?.slice(0, 8)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-gray-900 text-sm">
                              {roomNames}
                            </p>
                            <p className="text-xs text-gray-500">{roomTypes}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-900">{nights} nights</p>
                            <p className="text-xs text-gray-500">{booking.checkin_date}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-900">{booking.number_of_adults} Adults</p>
                            {booking.number_of_children > 0 && (
                              <p className="text-xs text-gray-500">{booking.number_of_children} Children</p>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <p
                              className={`text-sm font-semibold ${
                                booking.amount_due > 0
                                  ? "text-orange-600"
                                  : "text-green-600"
                              }`}
                            >
                              {formatAmount(booking.amount_due)}
                            </p>
                            <p className="text-xs text-gray-500">{booking.payment_method || "—"}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                paymentStatus === "paid_in_full"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-orange-50 text-orange-700"
                              }`}
                            >
                              {paymentStatus === "paid_in_full" ? "PAID IN FULL" : "BALANCE DUE"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {isCheckedIn(booking.booking_id) ? (
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

            {!isLoading && filtered.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">
                No arrivals found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </main>

    {/* Check-In Modal */}
    {selectedBooking && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedBooking(null)}>
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
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
            {/* Guest Card */}
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

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <Bed size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Room</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedBooking.rooms?.map((r) => r.room_name).join(", ") || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                  <Calendar size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Stay</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedBooking.checkin_date} → {selectedBooking.checkout_date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <User size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Status</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedBooking.status}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <CreditCard size={16} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total</p>
                  <p className="text-sm font-semibold text-gray-900">{formatAmount(selectedBooking.total_amount || 0)}</p>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            {selectedBooking.amount_due > 0 && (
            <div className="border border-gray-200 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={paymentGateway}
                    onChange={(e) => setPaymentGateway(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="ESEWA">eSewa</option>
                    <option value="KHALTI">Khalti</option>
                    <option value="STRIPE">Stripe</option>
                  </select>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                <span>Balance Due: {formatAmount(selectedBooking.amount_due)}</span>
              </div>
            </div>
            )}

            {/* Valid Document - Citizenship Upload */}
            <div className="border border-gray-200 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Valid Document (Citizenship)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Front Side */}
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
                {/* Back Side */}
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

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!selectedBooking) return
                  checkIn(selectedBooking.booking_id)
                  checkInMutation.mutate({
                    refNumber: selectedBooking.ref_number,
                    amount: parseFloat(paymentAmount) || 0,
                    paymentGateway,
                  })
                }}
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
