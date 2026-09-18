import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Printer, FileText, X } from "lucide-react"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/axios"

interface Charge {
  id: string
  folio_id: string
  description: string
  amount: number
  category: string
  posted_by_name: string
  posted_at: string
}

interface FolioDetail {
  id: string
  booking_id: string
  guest_id: string | null
  guest_name: string
  guest_email: string
  status: string
  subtotal: number
  tax: number
  discount: number
  total: number
  settled_at: string | null
  charges: Charge[]
  created_at: string
  updated_at: string
}

export default function FolioInvoicePage() {
  const { id } = useParams()
  const { formatAmount } = usePropertyCurrency()
  const { currentPropertyId } = usePropertyStore()

  const { data: folio, isLoading } = useQuery({
    queryKey: ["folio-invoice", currentPropertyId, id],
    queryFn: async (): Promise<FolioDetail | null> => {
      if (!id) return null
      try {
        const { data: result } = await api.get(`/staff/folios/${id}`)
        const wrapped = result as { success?: boolean; data?: {
          id: string
          booking_id: string
          guest_id: string | null
          guest_name?: string
          guest_email?: string
          status: string
          subtotal: string
          tax: string
          discount: string
          total: string
          settled_at: string | null
          charges: Array<{
            id: string
            folio_id: string
            description: string
            amount: string
            category: string
            posted_by_name: string
            posted_at: string
          }>
          created_at: string
          updated_at: string
        } }
        if (wrapped?.success && wrapped.data) {
          const d = wrapped.data
          return {
            id: d.id,
            booking_id: d.booking_id,
            guest_id: d.guest_id,
            guest_name: d.guest_name || "",
            guest_email: d.guest_email || "",
            status: d.status,
            subtotal: Number(d.subtotal) || 0,
            tax: Number(d.tax) || 0,
            discount: Number(d.discount) || 0,
            total: Number(d.total) || 0,
            settled_at: d.settled_at,
            charges: (d.charges || []).map((c) => ({
              ...c,
              amount: Number(c.amount) || 0,
            })),
            created_at: d.created_at,
            updated_at: d.updated_at,
          }
        }
        return null
      } catch {
        return null
      }
    },
    enabled: !!id,
  })

  const { data: guestFolio } = useQuery({
    queryKey: ["guest-folio-invoice", currentPropertyId, folio?.booking_id],
    queryFn: async () => {
      if (!currentPropertyId || !folio?.booking_id) return null
      try {
        const { data: result } = await api.get(
          `/staff/properties/${currentPropertyId}/bookings/${folio.booking_id}/guest-folio`
        )
        const wrapped = result as { data?: {
          ref_number?: string
          guest_name?: string
          guest_email?: string
          checkin_date?: string
          checkout_date?: string
          rooms?: Array<{ room_name: string; room_type: string; base_rate: number }>
        } }
        return wrapped?.data || null
      } catch {
        return null
      }
    },
    enabled: !!currentPropertyId && !!folio?.booking_id,
  })

  useEffect(() => {
    if (folio) window.print()
  }, [folio])

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!folio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Folio not found</p>
      </div>
    )
  }

  const roomCharges = folio.charges.filter((c) => c.category?.toUpperCase() === "ROOM_CHARGE")
  const additionalCharges = folio.charges.filter((c) => c.category?.toUpperCase() !== "ROOM_CHARGE")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="print:hidden flex justify-center gap-3 py-4">
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Printer size={16} />
          Print Invoice
        </button>
        <button
          onClick={() => window.close()}
          className="px-3 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8" id="receipt-content">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">StayEasy</span>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-900">INVOICE</h2>
              <p className="text-sm text-gray-500">Folio #{folio.id.slice(0, 8)}...</p>
              {guestFolio?.ref_number && (
                <p className="text-sm text-gray-500">Booking #{guestFolio.ref_number}</p>
              )}
              <p className="text-sm text-gray-500">{new Date(folio.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Guest Info */}
          <div className="grid grid-cols-2 gap-8 mb-8 items-start">
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">Guest Information</h4>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Name</span>
                <span className="text-sm font-semibold text-gray-900">{guestFolio?.guest_name || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-semibold text-gray-900">{guestFolio?.guest_email || "—"}</span>
              </div>
              {guestFolio?.rooms && guestFolio.rooms.length > 0 && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Room</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {guestFolio.rooms.map((r) => r.room_name).join(", ")} · {guestFolio.rooms.map((r) => r.room_type).join(", ")}
                  </span>
                </div>
              )}
              {guestFolio?.checkin_date && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Check-in</span>
                  <span className="text-sm font-semibold text-gray-900">{guestFolio.checkin_date}</span>
                </div>
              )}
              {guestFolio?.checkout_date && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Check-out</span>
                  <span className="text-sm font-semibold text-gray-900">{guestFolio.checkout_date}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">Folio Summary</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">{formatAmount(folio.subtotal)}</span>
              </div>
              {folio.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">{formatAmount(folio.tax)}</span>
                </div>
              )}
              {folio.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold text-gray-900">-{formatAmount(folio.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900">{formatAmount(folio.total)}</span>
              </div>
              <div className="flex justify-between bg-blue-50 px-3 py-2 rounded-lg mt-1">
                <span className="font-bold text-blue-700">Status</span>
                <span className="font-bold text-blue-700">{folio.status?.replace("_", " ")}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6" />

          {/* Room Charges */}
          {roomCharges.length > 0 && (
            <div className="mb-8">
              <h4 className="font-bold text-gray-900 mb-3">Room Charges</h4>
              <div className="space-y-2">
                {roomCharges.map((charge) => (
                  <div key={charge.id} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                    <div>
                      <span className="text-gray-600">{charge.description}</span>
                      <span className="text-xs text-gray-400 ml-2">{new Date(charge.posted_at).toLocaleDateString()}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatAmount(charge.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Charges */}
          {additionalCharges.length > 0 && (
            <div className="mb-8">
              <h4 className="font-bold text-gray-900 mb-3">Additional Charges</h4>
              <div className="space-y-2">
                {additionalCharges.map((charge) => (
                  <div key={charge.id} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                    <div>
                      <span className="text-gray-600">{charge.description}</span>
                      <span className="text-xs text-gray-400 ml-2">({charge.category})</span>
                      <span className="text-xs text-gray-400 ml-2">{new Date(charge.posted_at).toLocaleDateString()}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatAmount(charge.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Charges Table */}
          {folio.charges.length > 0 && (
            <div className="mb-8">
              <h4 className="font-bold text-gray-900 mb-3">All Charges</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_100px_100px] gap-4 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <div>Description</div>
                  <div className="text-center">Category</div>
                  <div className="text-right">Amount</div>
                </div>
                <div className="divide-y divide-gray-50">
                  {folio.charges.map((charge) => (
                    <div key={charge.id} className="grid grid-cols-[1fr_100px_100px] gap-4 px-4 py-3 items-center">
                      <div>
                        <span className="text-sm text-gray-900">{charge.description}</span>
                        <p className="text-xs text-gray-400">By {charge.posted_by_name} · {new Date(charge.posted_at).toLocaleDateString()}</p>
                      </div>
                      <span className="text-sm text-gray-600 text-center">{charge.category?.replace("_", " ")}</span>
                      <span className="text-sm font-semibold text-gray-900 text-right">{formatAmount(charge.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-3 px-4">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900">{formatAmount(folio.total)}</span>
              </div>
            </div>
          )}

          <div className="border-t border-dashed border-gray-200 mt-6 pt-4 text-center">
            <p className="font-bold text-gray-900 text-sm">Thank you for staying with us!</p>
            <p className="text-sm text-gray-500">We hope to see you again soon.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
