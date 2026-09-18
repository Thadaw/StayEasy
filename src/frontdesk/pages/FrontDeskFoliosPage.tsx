import { useMemo, useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import {
  Search,
  Download,
  Plus,
  ChevronRight,
  Check,
  X,
  CreditCard,
  FileText,
  BedDouble,
  Utensils,
  Sparkles,
  CircleDollarSign,
  ArrowLeft,
  WalletCards,
  ReceiptText,
  ExternalLink,
} from "lucide-react"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../services/axios"
import * as XLSX from "xlsx"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"

type FolioStatus = "OPEN" | "SETTLED" | "VOID"

interface Charge {
  id: string
  folio_id?: string
  description: string
  amount: number
  category: string
  posted_by?: string
  posted_by_name?: string
  postedBy: string
  posted_at?: string
  postedAt: string
  icon: "room" | "dining" | "spa" | "tax"
}

interface Folio {
  id: string
  booking_id: string
  bookingId: string
  guest_id?: string
  guestId?: string
  guest: string
  room?: string
  initials?: string
  status: string
  subtotal: number
  tax: number
  discount: number
  total: number
  settled_at?: string
  settledAt?: string
  charges: Charge[]
  created_at?: string
  updated_at?: string
  updatedAt?: string
}

interface ApiCharge {
  id: string
  folio_id: string
  description: string
  amount: string
  category: string
  posted_by: string
  posted_by_name: string
  posted_at: string
}

interface ApiFolio {
  id: string
  booking_id: string
  guest_id: string | null
  guest_name: string
  guest_email?: string
  status: string
  subtotal: string
  tax: string
  discount: string
  total: string
  settled_at?: string
  charges_count?: number
  created_at: string
  updated_at: string
}

function mapChargeIcon(category: string): Charge["icon"] {
  const c = category?.toUpperCase() || ""
  if (c.includes("DINING") || c.includes("MINIBAR") || c.includes("FOOD")) return "dining"
  if (c.includes("SPA") || c.includes("MASSAGE")) return "spa"
  if (c.includes("TAX")) return "tax"
  return "room"
}

function mapApiFolioToFolio(apiFolio: ApiFolio, guestName?: string, roomName?: string): Folio {
  const name = guestName || apiFolio.guest_name || "Guest"
  return {
    id: apiFolio.id,
    booking_id: apiFolio.booking_id,
    bookingId: apiFolio.booking_id,
    guest_id: apiFolio.guest_id || undefined,
    guestId: apiFolio.guest_id || undefined,
    guest: name,
    room: roomName || "",
    initials: name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    status: apiFolio.status?.toUpperCase() as FolioStatus,
    subtotal: Number(apiFolio.subtotal) || 0,
    tax: Number(apiFolio.tax) || 0,
    discount: Number(apiFolio.discount) || 0,
    total: Number(apiFolio.total) || 0,
    settled_at: apiFolio.settled_at,
    settledAt: apiFolio.settled_at,
    charges: [],
    created_at: apiFolio.created_at,
    updated_at: apiFolio.updated_at,
    updatedAt: apiFolio.updated_at,
  }
}

const DEMO_FOLIOS: Folio[] = [
  {
    id: "F-4281",
    booking_id: "BK-19842",
    bookingId: "BK-19842",
    guest_id: "GS-3310",
    guest: "Amelia Thompson",
    room: "Suite 804",
    initials: "AT",
    status: "OPEN",
    subtotal: 1250,
    tax: 125,
    discount: 75,
    total: 1300,
    updated_at: "2026-09-16T09:42:00Z",
    updatedAt: "2026-09-16T09:42:00Z",
    charges: [
      { id: "CH-1", description: "Room · Suite 804", amount: 980, category: "ROOM CHARGE", postedBy: "Elena R.", postedAt: "SEP 16, 09:42", icon: "room" },
      { id: "CH-2", description: "Harvest Table · Dinner", amount: 165, category: "DINING", postedBy: "Marcus L.", postedAt: "Sep 15, 20:18", icon: "dining" },
      { id: "CH-3", description: "In-room massage · 60 min", amount: 105, category: "SPA", postedBy: "Nina P.", postedAt: "Sep 15, 16:05", icon: "spa" },
    ],
  },
  {
    id: "F-4278",
    booking_id: "BK-19835",
    bookingId: "BK-19835",
    guest_id: "GS-3298",
    guest: "Noah Williams",
    room: "Room 412",
    initials: "NW",
    status: "OPEN",
    subtotal: 840,
    tax: 84,
    discount: 0,
    total: 924,
    updated_at: "2026-09-16T08:12:00Z",
    updatedAt: "2026-09-16T08:12:00Z",
    charges: [
      { id: "CH-4", description: "Room · Room 412", amount: 840, category: "ROOM CHARGE", postedBy: "Elena R.", postedAt: "Sep 16, 08:12", icon: "room" },
    ],
  },
  {
    id: "F-4275",
    booking_id: "BK-19821",
    bookingId: "BK-19821",
    guest_id: "GS-3267",
    guest: "Sofia Martinez",
    room: "Garden Villa 2",
    initials: "SM",
    status: "SETTLED",
    subtotal: 2160,
    tax: 216,
    discount: 120,
    total: 2256,
    settledAt: "Sep 15, 18:24",
    updated_at: "2026-09-15T18:24:00Z",
    updatedAt: "2026-09-15T18:24:00Z",
    charges: [
      { id: "CH-5", description: "Garden Villa · 3 nights", amount: 2160, category: "ROOM CHARGE", postedBy: "Ari K.", postedAt: "Sep 15, 16:32", icon: "room" },
    ],
  },
]

function StatusPill({ status }: { status: string }) {
  const s = status?.toUpperCase() || "OPEN"
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
      s === "OPEN" ? "bg-emerald-50 text-emerald-600" :
      s === "SETTLED" ? "bg-gray-100 text-gray-500" :
      "bg-red-100 text-red-600"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        s === "OPEN" ? "bg-emerald-500" :
        s === "SETTLED" ? "bg-gray-400" :
        "bg-red-500"
      }`} />
      {s === "OPEN" ? "Open" : s === "SETTLED" ? "Settled" : "Void"}
    </span>
  )
}

function ChargeIcon({ type }: { type: Charge["icon"] }) {
  return (
    <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${
      type === "dining" ? "bg-amber-50 text-amber-600" :
      type === "spa" ? "bg-purple-50 text-purple-600" :
      type === "tax" ? "bg-blue-50 text-blue-600" :
      "bg-rose-50 text-rose-600"
    }`}>
      {type === "dining" ? <Utensils size={18} /> :
       type === "spa" ? <Sparkles size={18} /> :
       type === "tax" ? <CircleDollarSign size={18} /> :
       <BedDouble size={18} />}
    </span>
  )
}

function getAvatarColor(initial: string) {
  const colors: Record<string, string> = {
    A: "bg-emerald-100 text-emerald-700",
    N: "bg-blue-100 text-blue-700",
    S: "bg-amber-100 text-amber-700",
    T: "bg-purple-100 text-purple-700",
    O: "bg-rose-100 text-rose-700",
  }
  return colors[initial] || "bg-gray-100 text-gray-700"
}

export default function FrontDeskFoliosPage() {
  const { currentPropertyId } = usePropertyStore()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"All" | FolioStatus>("All")
  const [search, setSearch] = useState("")
  const [showAddCharge, setShowAddCharge] = useState(false)
  const [showCreateFolio, setShowCreateFolio] = useState(false)
  const [toast, setToast] = useState("")
  const [chargeDescription, setChargeDescription] = useState("")
  const [chargeAmount, setChargeAmount] = useState("")
  const [chargeCategory, setChargeCategory] = useState("DINING")
  const [selectedBookingRef, setSelectedBookingRef] = useState("")
  const [newTax, setNewTax] = useState("0.00")
  const [newDiscount, setNewDiscount] = useState("0.00")
  const { formatAmount: formatCurrency } = usePropertyCurrency()

  const bookingFilter = searchParams.get("booking") || ""

  useEffect(() => {
    if (bookingFilter) {
      setSearch(bookingFilter)
    }
  }, [bookingFilter])

  const { data: apiFolios, isLoading } = useQuery({
    queryKey: ["frontdesk-folios", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return null
      try {
        const { data: result } = await api.get(
          `/staff/properties/${currentPropertyId}/folios`
        )
        const apiResult = result as { success?: boolean; data?: { folios?: ApiFolio[]; total?: number } }
        if (apiResult.success && apiResult.data?.folios) {
          return apiResult.data.folios.map((f) => mapApiFolioToFolio(f))
        }
        return null
      } catch (error) {
        console.error("Failed to fetch folios:", error)
        return null
      }
    },
    enabled: !!currentPropertyId,
  })

  const { data: bookingGuests = [] } = useQuery({
    queryKey: ["booking-guests-for-folio", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return []
      try {
        const { data: result } = await api.get(`/staff/properties/${currentPropertyId}/booking-guests`, {
          params: { skip: 0, limit: 100 },
        })
        const wrapped = result as { data?: Array<{ guest_id: string; ref_number: string; full_name: string; email: string; phone: string; nationality: string; checkin_date: string; checkout_date: string }> }
        return wrapped?.data || []
      } catch {
        return []
      }
    },
    enabled: !!currentPropertyId,
    refetchOnMount: true,
  })

  const guestLookup = useMemo(() => {
    const map: Record<string, string> = {}
    for (const g of bookingGuests) {
      if (g.guest_id && g.full_name) {
        map[g.guest_id] = g.full_name
      }
    }
    return map
  }, [bookingGuests])

  const eligibleBookings = useMemo(() => {
    return bookingGuests.filter((b) => !!b.ref_number)
  }, [bookingGuests])

  const displayFolios = useMemo(() => {
    const list = Array.isArray(apiFolios) ? apiFolios : []
    return list.map((f) => ({
      ...f,
      guest: f.guest || "Guest",
      initials: (f.guest || "Guest").split(/\s+/).map((w: string) => w[0]).join("").slice(0, 2).toUpperCase(),
    }))
  }, [apiFolios])

  const selected = useMemo(() => {
    if (selectedId) {
      return displayFolios.find((f) => f.id === selectedId) ?? null
    }
    return displayFolios[0] ?? null
  }, [selectedId, displayFolios])

  const { data: folioDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["folio-detail", currentPropertyId, selected?.id],
    queryFn: async () => {
      if (!currentPropertyId || !selected?.id) return null
      try {
        const { data: result } = await api.get(
          `/staff/folios/${selected.id}`
        )
        const apiResult = result as {
          success?: boolean
          data?: {
            id: string
            booking_id: string
            guest_id: string | null
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
              posted_by: string
              posted_by_name: string
              posted_at: string
            }>
            created_at: string
            updated_at: string
          }
        }
        if (apiResult.success && apiResult.data) {
          const d = apiResult.data
          return {
            ...selected,
            subtotal: Number(d.subtotal) || 0,
            tax: Number(d.tax) || 0,
            discount: Number(d.discount) || 0,
            total: Number(d.total) || 0,
            status: d.status?.toUpperCase() as FolioStatus,
            settled_at: d.settled_at,
            settledAt: d.settled_at,
            charges: (d.charges || []).map((c) => ({
              id: c.id,
              folio_id: c.folio_id,
              description: c.description,
              amount: Number(c.amount) || 0,
              category: c.category,
              posted_by: c.posted_by,
              posted_by_name: c.posted_by_name,
              postedBy: c.posted_by_name || "Staff",
              posted_at: c.posted_at,
              postedAt: c.posted_at,
              icon: mapChargeIcon(c.category),
            })),
          }
        }
        return null
      } catch {
        return null
      }
    },
    enabled: !!currentPropertyId && !!selected?.id,
    refetchOnMount: true,
  })

  const displaySelected = folioDetail || selected

  const filteredFolios = useMemo(() => {
    const normalized = search.toLowerCase()
    return displayFolios.filter((folio) => {
      const matchesTab = activeTab === "All" || folio.status === activeTab
      const matchesSearch = !normalized || [folio.id, folio.guest, folio.room, folio.bookingId, folio.booking_id].some((field) =>
        field?.toLowerCase().includes(normalized)
      )
      return matchesTab && matchesSearch
    })
  }, [activeTab, displayFolios, search])

  const counts = {
    all: displayFolios.length,
    open: displayFolios.filter((f) => f.status?.toUpperCase() === "OPEN").length,
    settled: displayFolios.filter((f) => f.status?.toUpperCase() === "SETTLED").length,
  }

  const outstandingBalance = useMemo(() => {
    return displayFolios
      .filter((f) => f.status?.toUpperCase() === "OPEN")
      .reduce((sum, f) => sum + f.total, 0)
  }, [displayFolios])

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 2600)
  }

  const createFolioMutation = useMutation({
    mutationFn: async (payload: { refNumber: string; tax: string; discount: string }) => {
      const { data: result } = await api.post(
        `/staff/properties/${currentPropertyId}/bookings/${payload.refNumber}/folio`,
        { tax: payload.tax, discount: payload.discount, idempotency_key: crypto.randomUUID() }
      )
      return result
    },
    onSuccess: async (result) => {
      const apiResult = result as { success?: boolean; data?: ApiFolio }
      setShowCreateFolio(false)
      setSelectedBookingRef("")
      setNewTax("0.00")
      setNewDiscount("0.00")
      await queryClient.invalidateQueries({ queryKey: ["frontdesk-folios", currentPropertyId] })
      if (apiResult.success && apiResult.data) {
        setSelectedId(apiResult.data.id)
      }
      notify("Folio created successfully")
    },
    onError: (error: Error & { response?: { data?: unknown } }) => {
      console.error("Failed to create folio:", error.response?.data || error)
      const msg = (error.response?.data as { message?: string })?.message || "Failed to create folio. Check the booking reference number."
      notify(msg)
    },
  })

  const settleFolioMutation = useMutation({
    mutationFn: async (folioId: string) => {
      const { data: result } = await api.post(
        `/staff/folios/${folioId}/settle`,
        { idempotency_key: crypto.randomUUID() }
      )
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["frontdesk-folios", currentPropertyId] })
      queryClient.invalidateQueries({ queryKey: ["folio-detail", currentPropertyId] })
      notify("Folio settled successfully")
    },
    onError: (error: Error) => {
      console.error("Failed to settle folio:", error)
      notify("Failed to settle folio")
    },
  })

  const addChargeMutation = useMutation({
    mutationFn: async (payload: { folioId: string; description: string; amount: number; category: string }) => {
      const body: Record<string, unknown> = {
        description: payload.description,
        amount: payload.amount.toFixed(2),
        category: payload.category,
        payment_method: "CASH",
        payment_gateway: "CASH",
        idempotency_key: crypto.randomUUID(),
      }
      const { data: result } = await api.post(
        `/staff/folios/${payload.folioId}/charges`,
        body
      )
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["frontdesk-folios", currentPropertyId] })
      queryClient.invalidateQueries({ queryKey: ["folio-detail", currentPropertyId] })
      setShowAddCharge(false)
      setChargeDescription("")
      setChargeAmount("")
      notify("Charge added to folio")
    },
    onError: (error: Error) => {
      console.error("Failed to add charge:", error)
      notify("Failed to add charge")
    },
  })

  const handleCreateFolio = () => {
    if (!selectedBookingRef.trim()) {
      notify("Select a booking")
      return
    }
    const selectedBooking = bookingGuests.find((b) => b.ref_number === selectedBookingRef.trim())
    if (selectedBooking && !selectedBooking.full_name) {
      notify("This booking has no linked guest. Please update the booking first.")
      return
    }
    createFolioMutation.mutate({
      refNumber: selectedBookingRef.trim(),
      tax: newTax || "0.00",
      discount: newDiscount || "0.00",
    })
  }

  const handleSettleFolio = () => {
    if (!selected) return
    if (selected.status?.toUpperCase() === "SETTLED") {
      notify("This folio is already settled")
      return
    }
    settleFolioMutation.mutate(selected.id)
  }

  const handleAddCharge = () => {
    if (!selected) return
    const amount = Number(chargeAmount)
    if (!chargeDescription.trim() || !amount || amount <= 0) {
      notify("Add a description and a valid amount")
      return
    }
    addChargeMutation.mutate({
      folioId: selected.id,
      description: chargeDescription.trim(),
      amount,
      category: chargeCategory,
    })
  }

  const goToBooking = (bookingId: string) => {
    if (bookingId) {
      navigate(`/frontdesk/booking/${bookingId}`)
    }
  }

  const handleExport = () => {
    try {
      const exportData = displayFolios.map((f) => ({
        "Folio ID": f.id,
        "Guest": f.guest,
        "Room": f.room || "",
        "Status": f.status || "",
        "Subtotal": f.subtotal,
        "Tax": f.tax,
        "Discount": f.discount,
        "Total": f.total,
        "Created At": f.created_at ? new Date(f.created_at).toLocaleDateString() : "",
        "Updated At": f.updatedAt ? new Date(f.updatedAt).toLocaleDateString() : "",
        "Charges Count": f.charges?.length || 0,
      }))

      if (exportData.length === 0) {
        notify("No folios to export")
        return
      }

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Folios")

      ws["!cols"] = [
        { wch: 14 }, { wch: 22 }, { wch: 14 }, { wch: 10 },
        { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 12 },
        { wch: 12 }, { wch: 12 }, { wch: 14 },
      ]

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
      const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `folios-${new Date().toISOString().split("T")[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export failed:", err)
    }
  }

  return (
    <FrontDeskSidebarProvider>
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />
      <main className="flex-1 min-w-0">
        <MobileMenuButton />
        <div className="p-4 lg:p-6 pt-14 lg:pt-6">
          {/* ── List View ── */}
          {!selectedId ? (
            <>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                    Guest Accounting
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">Folios</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Track open balances, add charges, and close the books with confidence.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Download size={14} />
                    Export
                  </button>
                  <button
                    onClick={() => setShowCreateFolio(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={14} />
                    New Folio
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Outstanding balance</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(outstandingBalance)}</p>
                  </div>
                  <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center">
                    <WalletCards size={18} className="text-rose-500" />
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Open folios</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{counts.open}<small className="text-lg text-gray-400 font-normal"> / {counts.all}</small></p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <ReceiptText size={18} className="text-emerald-500" />
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Settled</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{counts.settled}</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Check size={18} className="text-amber-500" />
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total folios</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{counts.all}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <CircleDollarSign size={18} className="text-purple-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-5 pb-0">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Recent folios</h3>
                      <p className="text-sm text-gray-500">{filteredFolios.length} of {counts.all} records</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search guest or folio..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
                      />
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-xl p-1">
                      {([
                        { key: "All", label: `All ${counts.all}` },
                        { key: "OPEN", label: `Open ${counts.open}` },
                        { key: "SETTLED", label: `Settled ${counts.settled}` },
                      ] as const).map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === tab.key
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                  ) : (
                    <>
                      {filteredFolios.map((folio) => (
                        <button
                          key={folio.id}
                          onClick={() => setSelectedId(folio.id)}
                          className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-b-0"
                        >
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${getAvatarColor(folio.initials?.[0] || "G")}`}>
                            {folio.initials || "G"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900">{folio.guest}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                              <span>{folio.id.slice(0, 8)}...</span>
                              {folio.room && <><span>·</span><span>{folio.room}</span></>}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <StatusPill status={folio.status} />
                            <div className="text-right min-w-[90px]">
                              <div className="text-sm font-bold text-gray-900">{formatCurrency(folio.total)}</div>
                              <div className="text-xs text-gray-400">{folio.updatedAt ? new Date(folio.updatedAt).toLocaleDateString() : ""}</div>
                            </div>
                            <ChevronRight size={16} className="text-gray-300" />
                          </div>
                        </button>
                      ))}
                      {filteredFolios.length === 0 && (
                        <div className="px-6 py-16 text-center">
                          <Search size={24} className="mx-auto text-gray-300 mb-3" />
                          <p className="text-sm font-medium text-gray-500">No folios found</p>
                          <p className="text-xs text-gray-400 mt-1">Try a different search or create a new folio.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Showing {filteredFolios.length} of {counts.all}</span>
                </div>
              </div>
            </>
          ) : selected && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setSelectedId(null)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Folios
              </button>
            </div>

            {isLoadingDetail ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600" />
              </div>
            ) : displaySelected && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Header + Balance + Booking + Actions */}
              <div className="lg:col-span-1 space-y-5">
                {/* Header Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${getAvatarColor(displaySelected.initials?.[0] || "G")}`}>
                        {displaySelected.initials || "G"}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{displaySelected.guest}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-bold text-rose-500">{displaySelected.id.slice(0, 8)}...</span>
                          <span className="text-gray-400">·</span>
                          <StatusPill status={displaySelected.status} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {displaySelected.room && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <BedDouble size={14} />
                      <span>{displaySelected.room}</span>
                    </div>
                  )}
                  {displaySelected.bookingId && (
                    <button
                      onClick={() => navigate("/frontdesk/bookings")}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mt-2"
                    >
                      Booking {displaySelected.bookingId}
                      <ExternalLink size={12} />
                    </button>
                  )}
                </div>

                {/* Balance Card */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                  <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Current Balance</div>
                  <div className="text-4xl font-bold text-gray-900">{formatCurrency(displaySelected.total)}</div>
                  <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
                    <span>Updated {displaySelected.updatedAt ? new Date(displaySelected.updatedAt).toLocaleDateString() : ""}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleSettleFolio}
                    disabled={displaySelected.status?.toUpperCase() === "SETTLED" || settleFolioMutation.isPending}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard size={18} />
                    {displaySelected.status?.toUpperCase() === "SETTLED" ? "Settled" : settleFolioMutation.isPending ? "Settling..." : "Settle folio"}
                  </button>
                  <button
                    onClick={() => window.open(`/frontdesk/folio/${displaySelected.id}/invoice`, "_blank")}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <FileText size={18} />
                    Invoice
                  </button>
                </div>
              </div>

              {/* Right Column: Charges + Summary */}
              <div className="lg:col-span-2 space-y-5">
                {/* Charges */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Charges</h3>
                      <p className="text-sm text-gray-500">{displaySelected.charges.length} line items</p>
                    </div>
                    <button
                      onClick={() => setShowAddCharge(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Plus size={16} />
                      Add Charge
                    </button>
                  </div>
                  <div className="space-y-3">
                    {displaySelected.charges.map((charge: Charge) => (
                      <div key={charge.id} className="flex items-center gap-4 p-3.5 bg-gray-50 rounded-xl">
                        <ChargeIcon type={charge.icon} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900">{charge.description}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{charge.category}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{charge.postedAt}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-gray-900">{formatCurrency(charge.amount)}</div>
                          <div className="text-xs text-gray-500">{charge.postedBy}</div>
                        </div>
                      </div>
                    ))}
                    {displaySelected.charges.length === 0 && (
                      <div className="text-center py-8 text-sm text-gray-400">No charges yet</div>
                    )}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Summary</h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium text-gray-900">{formatCurrency(displaySelected.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span className="font-medium text-gray-900">{formatCurrency(displaySelected.tax)}</span>
                    </div>
                    {displaySelected.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Discount</span>
                        <span className="font-medium text-emerald-600">-{formatCurrency(displaySelected.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-3">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">{formatCurrency(displaySelected.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </>
          )}
        </div>
      </main>

      {showAddCharge && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddCharge(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider mb-1">New Line Item</p>
                <h3 className="text-lg font-bold text-gray-900">Add charge</h3>
                <p className="text-sm text-gray-500">Post a new charge to {displaySelected?.id.slice(0, 8)} for {displaySelected?.guest}.</p>
              </div>
              <button onClick={() => setShowAddCharge(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <input
                  type="text"
                  value={chargeDescription}
                  onChange={(e) => setChargeDescription(e.target.value)}
                  placeholder="e.g. Late checkout"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={chargeAmount}
                      onChange={(e) => setChargeAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select
                    value={chargeCategory}
                    onChange={(e) => setChargeCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="DINING">Dining</option>
                    <option value="ROOM_CHARGE">Room Charge</option>
                    <option value="SPA">Spa</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddCharge(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleAddCharge}
                disabled={addChargeMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600 disabled:opacity-50"
              >
                {addChargeMutation.isPending ? "Posting..." : "Post charge"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateFolio && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateFolio(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider mb-1">Guest Accounting</p>
                <h3 className="text-lg font-bold text-gray-900">Create folio</h3>
                <p className="text-sm text-gray-500">Link a folio to an existing booking reference number.</p>
              </div>
              <button onClick={() => setShowCreateFolio(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Booking *</label>
                {eligibleBookings.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm font-medium text-amber-800">No eligible bookings found</p>
                    <p className="text-xs text-amber-600 mt-1">No checked-in guests available for folio creation. Check in a guest first.</p>
                  </div>
                ) : (
                  <select
                    value={selectedBookingRef}
                    onChange={(e) => setSelectedBookingRef(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select a booking...</option>
                    {eligibleBookings.map((b) => (
                      <option key={b.ref_number} value={b.ref_number}>
                        {b.full_name || "Guest"} ({b.ref_number})
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-gray-400 mt-1">Select a checked-in guest to create a folio</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tax</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newTax}
                      onChange={(e) => setNewTax(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newDiscount}
                      onChange={(e) => setNewDiscount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreateFolio(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleCreateFolio}
                disabled={createFolioMutation.isPending || eligibleBookings.length === 0}
                className="flex-1 px-4 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createFolioMutation.isPending ? "Creating..." : "Create folio"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-medium z-50">
          <Check size={16} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
    </FrontDeskSidebarProvider>
  )
}
