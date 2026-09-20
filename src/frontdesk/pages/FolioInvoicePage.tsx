import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/axios"
import { InvoiceReceipt } from "../components/InvoiceReceipt"

export default function FolioInvoicePage() {
  const { id } = useParams()
  const { currentPropertyId } = usePropertyStore()

  const { data: property } = useQuery({
    queryKey: ["property", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return null
      try {
        const { data } = await api.get(`/properties/${currentPropertyId}`)
        return data?.data || data
      } catch {
        return null
      }
    },
    enabled: !!currentPropertyId,
  })

  const { data: folio, isLoading } = useQuery({
    queryKey: ["folio-invoice", id],
    queryFn: async () => {
      if (!id) return null
      try {
        const { data: result } = await api.get(`/staff/folios/${id}`)
        const envelope = result as { success?: boolean; data?: Record<string, unknown> }
        const d = (envelope?.data ?? result) as Record<string, unknown> | null
        if (!d || !d.id) return null
        const chargesRaw = Array.isArray(d.charges) ? d.charges as Array<Record<string, unknown>> : []
        const charges = chargesRaw.map((c) => ({
          id: String(c.id ?? ""),
          folio_id: String(c.folio_id ?? ""),
          description: String(c.description ?? ""),
          amount: Number(c.amount) || 0,
          category: String(c.category ?? ""),
          posted_by_name: String(c.posted_by_name ?? "Staff"),
          posted_at: String(c.posted_at ?? ""),
        }))
        const subtotal = charges.reduce((sum, c) => sum + c.amount, 0)
        const tax = Number(d.tax) || 0
        const discount = Number(d.discount) || 0
        return {
          id: String(d.id),
          booking_id: String(d.booking_id ?? ""),
          guest_id: String(d.guest_id ?? ""),
          guest_name: String(d.guest_name ?? ""),
          guest_email: String(d.guest_email ?? ""),
          status: String(d.status ?? "OPEN"),
          subtotal,
          tax,
          discount,
          total: subtotal + tax - discount,
          amount_paid: Number(d.amount_paid) || 0,
          remaining_balance: Number(d.remaining_balance) || (subtotal + tax - discount),
          settled_at: d.settled_at as string | null,
          charges,
          created_at: String(d.created_at ?? ""),
          updated_at: String(d.updated_at ?? ""),
        }
      } catch {
        return null
      }
    },
    enabled: !!id,
  })

  const { data: guestInfo } = useQuery({
    queryKey: ["invoice-guest", currentPropertyId, folio?.booking_id],
    queryFn: async () => {
      if (!currentPropertyId || !folio?.booking_id) return null
      try {
        const { data: result } = await api.get(
          `/staff/properties/${currentPropertyId}/booking-guests`,
          { params: { skip: 0, limit: 100 } }
        )
        const envelope = result as { success?: boolean; data?: Array<Record<string, unknown>> }
        const guests = envelope?.data ?? (result as unknown as Array<Record<string, unknown>>)
        if (!Array.isArray(guests) || guests.length === 0) return null
        const match = guests.find((g) => g.ref_number === folio.booking_id || g.guest_id === folio.guest_id) ?? guests[0]
        return {
          guest_name: String(match.full_name ?? ""),
          guest_email: String(match.email ?? ""),
          guest_phone: String(match.phone ?? ""),
          checkin_date: String(match.checkin_date ?? ""),
          checkout_date: String(match.checkout_date ?? ""),
        }
      } catch {
        return null
      }
    },
    enabled: !!currentPropertyId && !!folio?.booking_id,
  })

  useEffect(() => {
    if (folio) window.print()
  }, [folio])

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

  const guestName = guestInfo?.guest_name || "—"
  const guestEmail = guestInfo?.guest_email || "—"

  const summaryItems = [
    { label: "Subtotal", value: folio.subtotal },
    ...(folio.tax > 0 ? [{ label: "Tax", value: folio.tax }] : []),
    ...(folio.discount > 0 ? [{ label: "Discount", value: folio.discount, type: "discount" as const }] : []),
    { label: "Total", value: folio.total, type: "bold" as const },
    ...(folio.amount_paid > 0 ? [
      { label: "Amount Paid", value: folio.amount_paid },
      { label: "Remaining Balance", value: folio.remaining_balance },
    ] : []),
    {
      label: "Status",
      value: 0,
      type: "status" as const,
      statusLabel: folio.status?.toUpperCase() === "SETTLED" ? "Paid" :
                   folio.status?.toUpperCase() === "PARTIALLY_PAID" ? "Partially Paid" :
                   folio.status,
      statusColor: folio.status?.toUpperCase() === "SETTLED" ? "bg-emerald-100 text-emerald-700" :
                   folio.status?.toUpperCase() === "PARTIALLY_PAID" ? "bg-amber-100 text-amber-700" :
                   "bg-blue-100 text-blue-700",
    },
  ]

  return (
    <InvoiceReceipt
      propertyName={property?.name}
      invoiceNumber={folio.id.slice(0, 8)}
      invoiceDate={new Date(folio.created_at).toLocaleDateString()}
      title="INVOICE"
      printLabel="Print Invoice"
      guestInfo={{
        name: guestName,
        email: guestEmail,
      }}
      rooms="—"
      checkinDate={guestInfo?.checkin_date}
      checkoutDate={guestInfo?.checkout_date}
      summaryTitle="Folio Summary"
      summary={summaryItems}
      charges={folio.charges.map((charge) => ({
        id: charge.id,
        description: charge.description,
        amount: charge.amount,
        category: charge.category,
        date: new Date(charge.posted_at).toLocaleDateString(),
      }))}
    />
  )
}
