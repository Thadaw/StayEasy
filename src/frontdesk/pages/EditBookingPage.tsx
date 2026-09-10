import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { usePropertyStore } from "../../stores/propertyStore"
import api from "../../services/axios"

interface BookingDetail {
  id: string
  ref_number: string
  guest: {
    full_name: string
    email: string
    phone: string
    nationality?: string
  }
  rooms: { room_name: string; room_type: string; base_rate: string }[]
  checkin_date: string
  checkout_date: string
  number_of_adults: number
  number_of_children: number
  status: string
  payment_status: string
  booking_type: string
  total_amount: string
  amount_paid: string
  amount_due: string
}

export default function EditBookingPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { currentPropertyId } = usePropertyStore()
  const queryClient = useQueryClient()

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking-detail", id],
    queryFn: async () => {
      if (!currentPropertyId || !id) return null
      try {
        const { data: result } = await api.get(`/properties/${currentPropertyId}/bookings/${id}`)
        const wrapped = result as { data?: BookingDetail }
        return (wrapped?.data ?? result) as BookingDetail
      } catch {
        return null
      }
    },
    enabled: !!currentPropertyId && !!id,
  })

  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phone: "",
    checkinDate: "",
    checkoutDate: "",
    adults: 1,
    children: 0,
    specialRequests: "",
  })

  useEffect(() => {
    if (booking) {
      setFormData({
        guestName: booking.guest?.full_name || "",
        email: booking.guest?.email || "",
        phone: booking.guest?.phone || "",
        checkinDate: booking.checkin_date || "",
        checkoutDate: booking.checkout_date || "",
        adults: booking.number_of_adults || 1,
        children: booking.number_of_children || 0,
        specialRequests: "",
      })
    }
  }, [booking])

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!currentPropertyId || !id) throw new Error("Missing params")
      const payload = {
        guest_name: data.guestName,
        email: data.email,
        phone: data.phone,
        checkin_date: data.checkinDate,
        checkout_date: data.checkoutDate,
        number_of_adults: data.adults,
        number_of_children: data.children,
        special_requests: data.specialRequests,
      }
      const { data: result } = await api.patch(`/properties/${currentPropertyId}/bookings/${id}`, payload)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-detail", id] })
      queryClient.invalidateQueries({ queryKey: ["frontdesk-bookings", currentPropertyId] })
      navigate(-1)
    },
  })

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Booking not found</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-700 font-medium">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Booking</h1>

        <div className="space-y-6">
          {/* Guest Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">Guest Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.guestName}
                  onChange={(e) => handleChange("guestName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Booking Type</label>
                <input
                  type="text"
                  value={booking.booking_type?.replace("_", " ") || "—"}
                  disabled
                  className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-50 text-sm text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">Stay Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Check-In Date</label>
                <input
                  type="date"
                  value={formData.checkinDate}
                  onChange={(e) => handleChange("checkinDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Check-Out Date</label>
                <input
                  type="date"
                  value={formData.checkoutDate}
                  onChange={(e) => handleChange("checkoutDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Adults</label>
                <input
                  type="number"
                  min={1}
                  value={formData.adults}
                  onChange={(e) => handleChange("adults", parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Children</label>
                <input
                  type="number"
                  min={0}
                  value={formData.children}
                  onChange={(e) => handleChange("children", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Room(s)</label>
                <input
                  type="text"
                  value={booking.rooms?.map((r) => r.room_name).join(", ") || "—"}
                  disabled
                  className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-50 text-sm text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">Payment Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Total Amount</label>
                <input
                  type="text"
                  value={booking.total_amount || "—"}
                  disabled
                  className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-50 text-sm text-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Amount Paid</label>
                <input
                  type="text"
                  value={booking.amount_paid || "—"}
                  disabled
                  className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-50 text-sm text-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Amount Due</label>
                <input
                  type="text"
                  value={booking.amount_due || "—"}
                  disabled
                  className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-50 text-sm text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => updateMutation.mutate(formData)}
              disabled={updateMutation.isPending}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
