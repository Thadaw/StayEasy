import { useMemo, useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import {
  Search,
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
  Calendar,
} from "lucide-react"
import toast from "react-hot-toast"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { ExportButton } from "../components/ExportButton"
import { usePropertyStore } from "../../stores/propertyStore"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../services/axios"
import * as XLSX from "xlsx"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addChargeSchema, recordPaymentSchema, updateFolioSchema } from "../schemas/folioSchema"
import type { AddChargeFormData, RecordPaymentFormData, UpdateFolioFormData } from "../schemas/folioSchema"
import { FormField } from "../components/FormField"

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
  guest_email?: string
  room?: string
  initials?: string
  status: string
  subtotal: number
  tax: number
  discount: number
  total: number
  amount_paid?: number
  remaining_balance?: number
  settled_at?: string
  settledAt?: string
  charges_count?: number
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

interface PaymentResponse {
  folio_id: string
  folio_status: string
  folio_total: number
  amount_paid: number
  remaining_balance: number
  payment_status: string
  payment_gateway: string
  message: string
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
    guest_email: apiFolio.guest_email,
    room: roomName || "",
    initials: name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    status: apiFolio.status?.toUpperCase() as FolioStatus,
    subtotal: Number(apiFolio.subtotal) || 0,
    tax: Number(apiFolio.tax) || 0,
    discount: Number(apiFolio.discount) || 0,
    total: Number(apiFolio.total) || 0,
    settled_at: apiFolio.settled_at,
    settledAt: apiFolio.settled_at,
    charges_count: apiFolio.charges_count,
    charges: [],
    created_at: apiFolio.created_at,
    updated_at: apiFolio.updated_at,
    updatedAt: apiFolio.updated_at,
  }
}


function StatusPill({ settledAt }: { settledAt?: string }) {
  const isSettled = !!settledAt
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
      isSettled ? "bg-gray-100 text-gray-500" : "bg-emerald-50 text-emerald-600"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isSettled ? "bg-gray-400" : "bg-emerald-500"}`} />
      {isSettled ? "Settled" : "Open"}
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

const avatarColorMap: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-700",
  N: "bg-blue-100 text-blue-700",
  S: "bg-amber-100 text-amber-700",
  T: "bg-purple-100 text-purple-700",
  O: "bg-rose-100 text-rose-700",
}

function getAvatarColor(initial: string) {
  return avatarColorMap[initial] || "bg-gray-100 text-gray-700"
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
  const [categorySearch, setCategorySearch] = useState("Dining")
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null)
  const [editCategorySearch, setEditCategorySearch] = useState("Dining")
  const [editCategoryOpen, setEditCategoryOpen] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showUpdateFolio, setShowUpdateFolio] = useState(false)

  const addChargeForm = useForm<AddChargeFormData>({
    resolver: zodResolver(addChargeSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "DINING",
    },
  })

  const editChargeForm = useForm<AddChargeFormData>({
    resolver: zodResolver(addChargeSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "DINING",
    },
  })

  const paymentForm = useForm<RecordPaymentFormData>({
    resolver: zodResolver(recordPaymentSchema),
    defaultValues: {
      amount: "",
      paymentGateway: "CASH",
    },
  })

  const updateFolioForm = useForm<UpdateFolioFormData>({
    resolver: zodResolver(updateFolioSchema),
    defaultValues: {
      tax: "",
      discount: "",
    },
  })

  const addChargeCategory = addChargeForm.watch("category")
  const editChargeCategoryValue = editChargeForm.watch("category")
  const updateTaxValue = updateFolioForm.watch("tax")
  const updateDiscountValue = updateFolioForm.watch("discount")

  const categoryOptions = [
    { value: "DINING", label: "Dining" },
    { value: "ROOM_CHARGE", label: "Room Charge" },
    { value: "SPA", label: "Spa" },
    { value: "LAUNDRY", label: "Laundry" },
    { value: "MINIBAR", label: "Minibar" },
    { value: "TRANSPORT", label: "Transport" },
    { value: "OTHER", label: "Other" },
  ]

  const categorySearchLower = categorySearch.toLowerCase()
  const filteredCategories = categoryOptions.filter((cat) =>
    cat.label.toLowerCase().includes(categorySearchLower)
  )

  const editCategorySearchLower = editCategorySearch.toLowerCase()
  const filteredEditCategories = categoryOptions.filter((cat) =>
    cat.label.toLowerCase().includes(editCategorySearchLower)
  )

  const [selectedBookingRef, setSelectedBookingRef] = useState("")
  const [newTax, setNewTax] = useState("0.00")
  const [newDiscount, setNewDiscount] = useState("0.00")
  const { formatAmount: formatCurrency, currency } = usePropertyCurrency()

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

  const { data: bookingsList = [] } = useQuery({
    queryKey: ["bookings-for-folio-link", currentPropertyId],
    queryFn: async () => {
      if (!currentPropertyId) return []
      try {
        let all: Array<{ id: string; booking_number: string }> = []
        let skip = 0
        let hasMore = true
        while (hasMore) {
          const { data: result } = await api.get(`/properties/${currentPropertyId}/bookings`, {
            params: { limit: 50, skip },
          })
          const wrapped = result as { data?: Array<{ id: string; booking_number: string }>; meta?: { has_more?: boolean } }
          const batch = wrapped?.data || []
          all = [...all, ...batch]
          hasMore = wrapped?.meta?.has_more ?? batch.length === 50
          skip += 50
        }
        return all
      } catch {
        return []
      }
    },
    enabled: !!currentPropertyId,
  })

  const bookingIdToNumber = useMemo(() => {
    const map: Record<string, string> = {}
    for (const b of bookingsList) {
      if (b.id && b.booking_number) {
        map[b.id] = b.booking_number
      }
    }
    return map
  }, [bookingsList])

  const eligibleBookings = useMemo(() => {
    return bookingGuests.filter((b) => !!b.ref_number)
  }, [bookingGuests])

  const bookingLookup = useMemo(() => {
    const map: Record<string, { checkin_date: string; checkout_date: string; ref_number: string }> = {}
    for (const g of bookingGuests) {
      if (g.ref_number) {
        map[g.ref_number] = { checkin_date: g.checkin_date, checkout_date: g.checkout_date, ref_number: g.ref_number }
      }
    }
    return map
  }, [bookingGuests])

  const displayFolios = useMemo(() => {
    const list = Array.isArray(apiFolios) ? apiFolios : []
    return list.map((f) => {
      const booking = bookingLookup[f.booking_id]
      return {
        ...f,
        guest: f.guest || "Guest",
        initials: (f.guest || "Guest").split(/\s+/).map((w: string) => w[0]).join("").slice(0, 2).toUpperCase(),
        checkin_date: booking?.checkin_date,
        checkout_date: booking?.checkout_date,
      }
    })
  }, [apiFolios, bookingLookup])

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
            amount_paid?: number
            remaining_balance?: number
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
          const mappedCharges = (d.charges || []).map((c) => ({
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
          }))
          const computedSubtotal = mappedCharges.reduce((sum, c) => sum + c.amount, 0)
          const tax = Number(d.tax) || 0
          const discount = Number(d.discount) || 0
          return {
            ...selected,
            subtotal: computedSubtotal,
            tax,
            discount,
            total: computedSubtotal + tax - discount,
            amount_paid: d.amount_paid ?? 0,
            remaining_balance: d.remaining_balance ?? (computedSubtotal + tax - discount),
            status: d.status?.toUpperCase() as FolioStatus,
            settled_at: d.settled_at,
            settledAt: d.settled_at,
            charges: mappedCharges,
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

  const displaySelected = folioDetail ? {
    ...folioDetail,
    booking_number: bookingIdToNumber[folioDetail.bookingId || folioDetail.booking_id] || folioDetail.bookingId || folioDetail.booking_id,
  } : selected ? {
    ...selected,
    booking_number: bookingIdToNumber[selected.bookingId || selected.booking_id] || selected.bookingId || selected.booking_id,
  } : null

  const filteredFolios = useMemo(() => {
    const normalized = search.toLowerCase()
    return displayFolios.filter((folio) => {
      const isSettled = !!folio.settled_at
      const matchesTab = activeTab === "All" ||
        (activeTab === "OPEN" && !isSettled) ||
        (activeTab === "SETTLED" && isSettled)
      const matchesSearch = !normalized || [folio.id, folio.guest, folio.guest_email, folio.room, folio.bookingId, folio.booking_id].some((field) =>
        field?.toLowerCase().includes(normalized)
      )
      return matchesTab && matchesSearch
    })
  }, [activeTab, displayFolios, search])

  const counts = {
    all: displayFolios.length,
    open: displayFolios.filter((f) => !f.settled_at).length,
    settled: displayFolios.filter((f) => !!f.settled_at).length,
  }

  const outstandingBalance = useMemo(() => {
    return displayFolios
      .filter((f) => !f.settled_at)
      .reduce((sum, f) => sum + f.total, 0)
  }, [displayFolios])

  const notify = (message: string, isError = false) => {
    if (isError) {
      toast.error(message)
    } else {
      toast.success(message)
    }
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
      notify(msg, true)
    },
  })

  const recordPaymentMutation = useMutation({
    mutationFn: async (payload: { folioId: string; amount: number; paymentGateway: string }) => {
      const { data: result } = await api.post(
        `/staff/folios/${payload.folioId}/payments`,
        {
          amount: payload.amount,
          payment_gateway: payload.paymentGateway,
        }
      )
      const wrapped = result as { data?: PaymentResponse }
      return wrapped?.data ?? (result as PaymentResponse)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["frontdesk-folios", currentPropertyId] })
      queryClient.invalidateQueries({ queryKey: ["folio-detail", currentPropertyId] })
      setShowPaymentModal(false)
      paymentForm.reset()
      const msg = data?.message || "Payment recorded successfully"
      toast.success(msg, { duration: 4000 })
    },
    onError: (error: Error) => {
      console.error("Failed to record payment:", error)
      notify("Failed to record payment", true)
    },
  })

  const updateFolioMutation = useMutation({
    mutationFn: async (payload: { folioId: string; tax: number; discount: number }) => {
      const { data: result } = await api.patch(
        `/staff/folios/${payload.folioId}`,
        { tax: payload.tax, discount: payload.discount }
      )
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["frontdesk-folios", currentPropertyId] })
      queryClient.invalidateQueries({ queryKey: ["folio-detail", currentPropertyId] })
      setShowUpdateFolio(false)
      notify("Folio updated successfully")
    },
    onError: (error: Error) => {
      console.error("Failed to update folio:", error)
      notify("Failed to update folio", true)
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
      addChargeForm.reset()
      notify("Charge added to folio")
    },
    onError: (error: Error) => {
      console.error("Failed to add charge:", error)
      notify("Failed to add charge", true)
    },
  })

  const updateChargeMutation = useMutation({
    mutationFn: async (payload: { folioId: string; chargeId: string; description: string; amount: number; category: string }) => {
      const { data: result } = await api.patch(
        `/staff/folios/${payload.folioId}/charges/${payload.chargeId}`,
        {
          description: payload.description,
          amount: payload.amount.toFixed(2),
          category: payload.category,
        }
      )
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["frontdesk-folios", currentPropertyId] })
      queryClient.invalidateQueries({ queryKey: ["folio-detail", currentPropertyId] })
      setEditingCharge(null)
      editChargeForm.reset({ description: "", amount: "", category: "DINING" })
      setEditCategorySearch("Dining")
      notify("Charge updated successfully")
    },
    onError: (error: Error) => {
      console.error("Failed to update charge:", error)
      notify("Failed to update charge", true)
    },
  })

  const deleteChargeMutation = useMutation({
    mutationFn: async (payload: { folioId: string; chargeId: string }) => {
      const { data: result } = await api.delete(
        `/staff/folios/${payload.folioId}/charges/${payload.chargeId}`
      )
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["frontdesk-folios", currentPropertyId] })
      queryClient.invalidateQueries({ queryKey: ["folio-detail", currentPropertyId] })
      notify("Charge deleted successfully")
    },
    onError: (error: Error) => {
      console.error("Failed to delete charge:", error)
      notify("Failed to delete charge", true)
    },
  })

  const handleUpdateCharge = editChargeForm.handleSubmit((data) => {
    if (!displaySelected || !editingCharge) return
    updateChargeMutation.mutate({
      folioId: displaySelected.id,
      chargeId: editingCharge.id,
      description: data.description.trim(),
      amount: Number(data.amount),
      category: data.category,
    })
  })

  const handleDeleteCharge = (chargeId: string) => {
    if (!displaySelected) return
    if (!confirm("Are you sure you want to delete this charge?")) return
    deleteChargeMutation.mutate({
      folioId: displaySelected.id,
      chargeId,
    })
  }

  const openEditCharge = (charge: Charge) => {
    setEditingCharge(charge)
    editChargeForm.reset({
      description: charge.description,
      amount: String(charge.amount),
      category: charge.category?.toUpperCase().replace(/ /g, "_") || "DINING",
    })
    setEditCategorySearch(charge.category || "Dining")
  }

  const handleCreateFolio = () => {
    if (!selectedBookingRef.trim()) {
      notify("Select a booking", true)
      return
    }
    const selectedBooking = bookingGuests.find((b) => b.ref_number === selectedBookingRef.trim())
    if (selectedBooking && !selectedBooking.full_name) {
      notify("This booking has no linked guest. Please update the booking first.", true)
      return
    }
    createFolioMutation.mutate({
      refNumber: selectedBookingRef.trim(),
      tax: newTax || "0.00",
      discount: newDiscount || "0.00",
    })
  }

  const handleRecordPayment = () => {
    if (!selected) return
    if (selected.status?.toUpperCase() === "SETTLED") {
      notify("This folio is already settled", true)
      return
    }
    paymentForm.reset({ amount: "", paymentGateway: "CASH" })
    setShowPaymentModal(true)
  }

  const confirmRecordPayment = paymentForm.handleSubmit((data) => {
    if (!selected) return
    recordPaymentMutation.mutate({
      folioId: selected.id,
      amount: Number(data.amount),
      paymentGateway: data.paymentGateway,
    })
  })

  const handleOpenUpdateFolio = () => {
    if (!displaySelected) return
    const subtotal = displaySelected.subtotal ?? 0
    const currentTax = Number(displaySelected.tax ?? 0)
    const currentDiscount = Number(displaySelected.discount ?? 0)
    updateFolioForm.reset({
      tax: subtotal > 0 ? String(Math.round((currentTax / subtotal) * 100 * 100) / 100) : "0",
      discount: subtotal > 0 ? String(Math.round((currentDiscount / subtotal) * 100 * 100) / 100) : "0",
    })
    setShowUpdateFolio(true)
  }

  const handleUpdateFolio = updateFolioForm.handleSubmit((data) => {
    if (!selected) return
    const taxPct = Number(data.tax || "0")
    const discountPct = Number(data.discount || "0")
    const subtotal = displaySelected?.subtotal ?? 0
    const tax = Math.round(subtotal * taxPct / 100 * 100) / 100
    const discount = Math.round(subtotal * discountPct / 100 * 100) / 100
    updateFolioMutation.mutate({ folioId: selected.id, tax, discount })
  })

  const handleAddCharge = addChargeForm.handleSubmit((data) => {
    if (!selected) return
    addChargeMutation.mutate({
      folioId: selected.id,
      description: data.description.trim(),
      amount: Number(data.amount),
      category: data.category,
    })
  })

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
        notify("No folios to export", true)
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
                  <ExportButton onClick={handleExport} />
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
                        { key: "All" as const, label: "All", count: counts.all, color: "bg-blue-100 text-blue-700" },
                        { key: "OPEN" as const, label: "Open", count: counts.open, color: "bg-amber-100 text-amber-700" },
                        { key: "SETTLED" as const, label: "Settled", count: counts.settled, color: "bg-green-100 text-green-700" },
                      ]).map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === tab.key
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {tab.label} <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${tab.color}`}>{tab.count}</span>
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
                              <StatusPill settledAt={folio.settled_at} />
                            </div>
                            {folio.guest_email && (
                              <div className="text-xs text-gray-500 mt-0.5">{folio.guest_email}</div>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                              {folio.checkin_date && folio.checkout_date && (
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                                  {folio.checkin_date} → {folio.checkout_date}
                                </span>
                              )}
                              {folio.charges_count != null && (
                                <span>{folio.charges_count} charge{folio.charges_count !== 1 ? 's' : ''}</span>
                              )}
                            </div>
                            {folio.room && (
                              <div className="text-xs text-gray-500 mt-0.5">{folio.room}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0 text-right">
                            <div>
                              <div className="text-sm font-bold text-gray-900">{formatCurrency(folio.total)}</div>
                              <div className="text-[10px] text-gray-400 mt-0.5">#{folio.id.slice(0, 8)}</div>
                            </div>
                            <ChevronRight size={16} className="text-gray-300" />
                          </div>
                        </button>
                      ))}
                      {filteredFolios.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <FileText size={20} className="text-gray-400" />
                          </div>
                          <p className="text-gray-700 font-semibold">No folios found</p>
                          <p className="text-sm text-gray-500">Try a different search or create a new folio.</p>
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
                          <span className="text-sm font-bold text-rose-500">Folio #{displaySelected.id.slice(0, 8)}</span>
                          <span className="text-gray-400">·</span>
                          <StatusPill settledAt={displaySelected.settled_at} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {displaySelected.guest_email && (
                    <div className="text-sm text-gray-500 mb-2">{displaySelected.guest_email}</div>
                  )}

                  {displaySelected.checkin_date && displaySelected.checkout_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span>{displaySelected.checkin_date} → {displaySelected.checkout_date}</span>
                    </div>
                  )}

                  {displaySelected.room && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <BedDouble size={14} />
                      <span>{displaySelected.room}</span>
                    </div>
                  )}

                  {displaySelected.booking_number && (
                    <button
                      onClick={() => navigate(`/frontdesk/bookings?booking=${displaySelected.booking_number}`)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mt-2"
                    >
                      Booking {displaySelected.booking_number.slice(0, 8)}
                      <ExternalLink size={12} />
                    </button>
                  )}
                </div>

                {/* Balance Card */}
                {(() => {
                  const computedSubtotal = displaySelected.charges?.reduce((sum: number, c: Charge) => sum + (Number(c.amount) || 0), 0) ?? 0
                  const computedTotal = computedSubtotal + (displaySelected.tax || 0) - (displaySelected.discount || 0)
                  const amountPaid = displaySelected.amount_paid ?? 0
                  const remaining = displaySelected.remaining_balance ?? computedTotal
                  const status = displaySelected.status?.toUpperCase()
                  return (
                    <div className={`border rounded-2xl p-6 ${
                      status === "SETTLED" ? "bg-emerald-50 border-emerald-100" :
                      status === "PARTIALLY_PAID" ? "bg-amber-50 border-amber-100" :
                      "bg-emerald-50 border-emerald-100"
                    }`}>
                      <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                        status === "SETTLED" ? "text-emerald-600" :
                        status === "PARTIALLY_PAID" ? "text-amber-600" :
                        "text-emerald-600"
                      }`}>Current Balance</div>
                      <div className="text-4xl font-bold text-gray-900">{formatCurrency(computedTotal)}</div>
                      {amountPaid > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Paid</span>
                            <span className="font-semibold text-emerald-600">{formatCurrency(amountPaid)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Remaining</span>
                            <span className={`font-semibold ${remaining > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                              {formatCurrency(remaining)}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
                        <span>Updated {displaySelected.updatedAt ? new Date(displaySelected.updatedAt).toLocaleDateString() : ""}</span>
                      </div>
                    </div>
                  )
                })()}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleRecordPayment}
                    disabled={displaySelected.status?.toUpperCase() === "SETTLED"}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <WalletCards size={18} />
                    {displaySelected.status?.toUpperCase() === "SETTLED" ? "Settled" : "Payment"}
                  </button>
                  <button
                    onClick={() => window.open(`/frontdesk/folio/${displaySelected.booking_number || displaySelected.id}/invoice`, "_blank")}
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
                      onClick={() => {
                        addChargeForm.reset({ description: "", amount: "", category: "DINING" })
                        setCategorySearch("Dining")
                        setShowAddCharge(true)
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Plus size={16} />
                      Add Charge
                    </button>
                    <button
                      onClick={handleOpenUpdateFolio}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <ReceiptText size={16} />
                      Update Folio
                    </button>
                  </div>
                  <div className="space-y-3">
                    {displaySelected.charges.map((charge: Charge) => (
                      <div key={charge.id} className="flex items-center gap-4 p-3.5 bg-gray-50 rounded-xl group">
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
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openEditCharge(charge)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit charge"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                          </button>
                          <button
                            onClick={() => handleDeleteCharge(charge.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete charge"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    {displaySelected.charges.length === 0 && (
                      <div className="text-center py-8 text-sm text-gray-400">No charges yet</div>
                    )}
                  </div>
                </div>

                {/* Totals */}
                {(() => {
                  const computedSubtotal = displaySelected.charges?.reduce((sum: number, c: Charge) => sum + (Number(c.amount) || 0), 0) ?? 0
                  const tax = displaySelected.tax || 0
                  const discount = displaySelected.discount || 0
                  const computedTotal = computedSubtotal + tax - discount
                  const amountPaid = displaySelected.amount_paid ?? 0
                  const remaining = displaySelected.remaining_balance ?? computedTotal
                  const status = displaySelected.status?.toUpperCase()
                  return (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-4">Summary</h3>
                      <div className="space-y-2.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Subtotal</span>
                          <span className="font-medium text-gray-900">{formatCurrency(computedSubtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Tax</span>
                          <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Discount</span>
                            <span className="font-medium text-emerald-600">-{formatCurrency(discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-3">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">{formatCurrency(computedTotal)}</span>
                        </div>
                        {amountPaid > 0 && (
                          <>
                            <div className="flex justify-between text-sm border-t border-gray-100 pt-2.5">
                              <span className="text-gray-500">Amount Paid</span>
                              <span className="font-medium text-emerald-600">{formatCurrency(amountPaid)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Remaining Balance</span>
                              <span className={`font-medium ${remaining > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                                {formatCurrency(remaining)}
                              </span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between text-sm border-t border-gray-100 pt-2.5">
                          <span className="text-gray-500">Status</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            status === "SETTLED" ? "bg-emerald-50 text-emerald-700" :
                            status === "PARTIALLY_PAID" ? "bg-amber-50 text-amber-700" :
                            status === "VOID" ? "bg-red-50 text-red-700" :
                            "bg-blue-50 text-blue-700"
                          }`}>
                            {status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })()}
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
            <form onSubmit={handleAddCharge} className="space-y-4">
              <FormField label="Description" required error={addChargeForm.formState.errors.description?.message} htmlFor="add-charge-desc">
                <input
                  id="add-charge-desc"
                  type="text"
                  {...addChargeForm.register("description")}
                  placeholder="e.g. Late checkout"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Amount" required error={addChargeForm.formState.errors.amount?.message} htmlFor="add-charge-amount">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{currency}</span>
                    <input
                      id="add-charge-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      {...addChargeForm.register("amount")}
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </FormField>
                <FormField label="Category" required error={addChargeForm.formState.errors.category?.message} htmlFor="add-charge-category">
                  <div className="relative">
                    <input
                      id="add-charge-category"
                      type="text"
                      value={categorySearch}
                      onChange={(e) => {
                        setCategorySearch(e.target.value)
                        setCategoryOpen(true)
                      }}
                      onFocus={() => setCategoryOpen(true)}
                      onBlur={() => setTimeout(() => setCategoryOpen(false), 150)}
                      placeholder="Type to search..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    {categoryOpen && filteredCategories.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-auto text-sm">
                        {filteredCategories.map((cat) => (
                          <li
                            key={cat.value}
                            onMouseDown={() => {
                              addChargeForm.setValue("category", cat.value, { shouldValidate: true })
                              setCategorySearch(cat.label)
                              setCategoryOpen(false)
                            }}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${addChargeCategory === cat.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                          >
                            {cat.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </FormField>
              </div>
            </form>
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

      {showPaymentModal && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">Record Payment</p>
                <h3 className="text-lg font-bold text-gray-900">Add payment to folio</h3>
                <p className="text-sm text-gray-500">Enter payment amount and gateway.</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={confirmRecordPayment} className="space-y-4">
              <FormField label="Amount" required error={paymentForm.formState.errors.amount?.message} htmlFor="payment-amount">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{currency}</span>
                  <input
                    id="payment-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    {...paymentForm.register("amount")}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </FormField>
              <FormField label="Payment Gateway" required error={paymentForm.formState.errors.paymentGateway?.message} htmlFor="payment-gateway">
                <select
                  id="payment-gateway"
                  {...paymentForm.register("paymentGateway")}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="ONLINE">Online</option>
                  <option value="OTHER">Other</option>
                </select>
              </FormField>
            </form>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={confirmRecordPayment}
                disabled={recordPaymentMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 disabled:opacity-50"
              >
                {recordPaymentMutation.isPending ? "Processing..." : "Record payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateFolio && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowUpdateFolio(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Update Folio</p>
                <h3 className="text-lg font-bold text-gray-900">Edit tax & discount</h3>
                <p className="text-sm text-gray-500">Set tax and discount as percentages of the subtotal.</p>
              </div>
              <button onClick={() => setShowUpdateFolio(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleUpdateFolio} className="space-y-4">
              <FormField label="Tax (%)" error={updateFolioForm.formState.errors.tax?.message} htmlFor="update-tax">
                <div className="relative">
                  <input
                    id="update-tax"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    {...updateFolioForm.register("tax")}
                    placeholder="0"
                    className="w-full px-4 pr-8 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
                {displaySelected && (
                  <p className="text-xs text-gray-400 mt-1">= {formatCurrency((displaySelected.subtotal ?? 0) * Number(updateTaxValue || "0") / 100)}</p>
                )}
              </FormField>
              <FormField label="Discount (%)" error={updateFolioForm.formState.errors.discount?.message} htmlFor="update-discount">
                <div className="relative">
                  <input
                    id="update-discount"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    {...updateFolioForm.register("discount")}
                    placeholder="0"
                    className="w-full px-4 pr-8 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
                {displaySelected && (
                  <p className="text-xs text-gray-400 mt-1">= {formatCurrency((displaySelected.subtotal ?? 0) * Number(updateDiscountValue || "0") / 100)}</p>
                )}
              </FormField>
            </form>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowUpdateFolio(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleUpdateFolio}
                disabled={updateFolioMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {updateFolioMutation.isPending ? "Updating..." : "Update folio"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingCharge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditingCharge(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Edit Charge</p>
                <h3 className="text-lg font-bold text-gray-900">Update charge</h3>
                <p className="text-sm text-gray-500">Modify the charge details below.</p>
              </div>
              <button onClick={() => setEditingCharge(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleUpdateCharge} className="space-y-4">
              <FormField label="Description" required error={editChargeForm.formState.errors.description?.message} htmlFor="edit-charge-desc">
                <input
                  id="edit-charge-desc"
                  type="text"
                  {...editChargeForm.register("description")}
                  placeholder="e.g. Late checkout"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Amount" required error={editChargeForm.formState.errors.amount?.message} htmlFor="edit-charge-amount">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{currency}</span>
                    <input
                      id="edit-charge-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      {...editChargeForm.register("amount")}
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </FormField>
                <FormField label="Category" required error={editChargeForm.formState.errors.category?.message} htmlFor="edit-charge-category">
                  <div className="relative">
                    <input
                      id="edit-charge-category"
                      type="text"
                      value={editCategorySearch}
                      onChange={(e) => {
                        setEditCategorySearch(e.target.value)
                        setEditCategoryOpen(true)
                      }}
                      onFocus={() => setEditCategoryOpen(true)}
                      onBlur={() => setTimeout(() => setEditCategoryOpen(false), 150)}
                      placeholder="Type to search..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    {editCategoryOpen && filteredEditCategories.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-auto text-sm">
                        {filteredEditCategories.map((cat) => (
                          <li
                            key={cat.value}
                            onMouseDown={() => {
                              editChargeForm.setValue("category", cat.value, { shouldValidate: true })
                              setEditCategorySearch(cat.label)
                              setEditCategoryOpen(false)
                            }}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${editChargeCategoryValue === cat.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                          >
                            {cat.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </FormField>
              </div>
            </form>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingCharge(null)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleUpdateCharge}
                disabled={updateChargeMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {updateChargeMutation.isPending ? "Updating..." : "Update charge"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tax (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={newTax}
                      onChange={(e) => setNewTax(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 pr-8 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={newDiscount}
                      onChange={(e) => setNewDiscount(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 pr-8 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400">Percentages will be applied when charges are added.</p>
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
    </div>
    </FrontDeskSidebarProvider>
  )
}
