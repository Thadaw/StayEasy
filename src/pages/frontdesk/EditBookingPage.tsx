import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { usePropertyStore } from "@/store/properties/propertyStore"
import { useBookingDetailQuery } from "@/services/queries/frontdesk/frontdeskBookingQueries"
import { useUpdateBookingMutation } from "@/services/mutations/frontdesk/frontdeskBookingMutations"
import { FormField } from "@/components/frontdesk/FormField"
import { editBookingSchema } from "@/schemas/frontdesk/bookingSchema"
import type { EditBookingFormData } from "@/schemas/frontdesk/bookingSchema"

export default function EditBookingPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { currentPropertyId } = usePropertyStore()

  const { data: booking, isLoading, isError } = useBookingDetailQuery(currentPropertyId, id)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditBookingFormData>({
    resolver: zodResolver(editBookingSchema),
  })

  useEffect(() => {
    if (booking) {
      reset({
        checkinDate: booking.checkin_date || "",
        checkoutDate: booking.checkout_date || "",
        adults: booking.number_of_adults || 1,
        children: booking.number_of_children || 0,
        specialRequests: booking.special_requests || "",
        reason: "",
      })
    }
  }, [booking, reset])

  const updateMutation = useUpdateBookingMutation(currentPropertyId, id)

  const handleGoBack = () => {
    navigate(-1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600" />
      </div>
    )
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Booking not found</p>
        <button onClick={handleGoBack} className="text-blue-600 hover:text-blue-700 font-medium">
          Go Back
        </button>
      </div>
    )
  }

  const guest = booking.guest || booking.booking_guest
  const readOnlyInput = "w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-50 text-sm text-gray-500"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Booking</h1>

        <form
          onSubmit={handleSubmit((data) =>
            updateMutation.mutate(data, {
              onSuccess: () => {
                toast.success("Booking updated successfully")
                navigate(-1)
              },
              onError: (error: Error & { response?: { data?: { message?: string; detail?: string } } }) => {
                toast.error(
                  error.response?.data?.detail ||
                    error.response?.data?.message ||
                    "Failed to update booking. Please try again."
                )
              },
            })
          )}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">Guest Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Full Name">
                <input type="text" value={guest?.full_name || "—"} disabled className={readOnlyInput} />
              </FormField>
              <FormField label="Email">
                <input type="text" value={guest?.email || "—"} disabled className={readOnlyInput} />
              </FormField>
              <FormField label="Phone">
                <input type="text" value={guest?.phone || "—"} disabled className={readOnlyInput} />
              </FormField>
              <FormField label="Booking Type">
                <input
                  type="text"
                  value={booking.booking_type?.replace("_", " ") || "—"}
                  disabled
                  className={readOnlyInput}
                />
              </FormField>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">Stay Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Check-In Date" error={errors.checkinDate?.message} required>
                <input
                  type="date"
                  {...register("checkinDate")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </FormField>
              <FormField label="Check-Out Date" error={errors.checkoutDate?.message} required>
                <input
                  type="date"
                  {...register("checkoutDate")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </FormField>
              <FormField label="Adults" error={errors.adults?.message} required>
                <input
                  type="number"
                  min={1}
                  {...register("adults", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </FormField>
              <FormField label="Children" error={errors.children?.message} required>
                <input
                  type="number"
                  min={0}
                  {...register("children", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </FormField>
              <div className="col-span-2">
                <FormField label="Room(s)">
                  <input
                    type="text"
                    value={booking.rooms?.map((r) => r.room_name).join(", ") || "—"}
                    disabled
                    className={readOnlyInput}
                  />
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="Special Requests" error={errors.specialRequests?.message}>
                  <textarea
                    rows={3}
                    {...register("specialRequests")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  />
                </FormField>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">Payment Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label="Total Amount">
                <input type="text" value={booking.total_amount ?? "—"} disabled className={readOnlyInput} />
              </FormField>
              <FormField label="Amount Paid">
                <input type="text" value={booking.amount_paid ?? "—"} disabled className={readOnlyInput} />
              </FormField>
              <FormField label="Amount Due">
                <input type="text" value={booking.amount_due ?? "—"} disabled className={readOnlyInput} />
              </FormField>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">Reason for Change</h3>
            <FormField label="Reason" error={errors.reason?.message} required>
              <textarea
                rows={2}
                {...register("reason")}
                placeholder="Why is this booking being modified?"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleGoBack}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending || !isDirty}
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
        </form>
      </div>
    </div>
  )
}
