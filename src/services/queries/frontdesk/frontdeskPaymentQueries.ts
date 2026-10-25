import { useQuery } from "@tanstack/react-query"
import api from "@/api/axiosInstance"
import { frontdeskKeys } from "@/lib/queryKeys"

// Shape of a booking row used to build the transactions feed
export interface PaymentBooking {
  id: string
  guest_name: string
  guest_email: string
  booking_number: string
  room_names: string[]
  checkin_date: string
  checkout_date: string
  status: string
  payment_gateway: string
  payment_method?: string
  payment_status?: string
  booking_type?: string
  subtotal: string
  total_amount: string
  amount_paid?: string
  amount_due?: string
  created_at: string
}

export interface Transaction {
  id: string
  reference_number: string
  guest_name: string
  guest_email: string
  booking_number: string
  room_number: string
  payment_method: string
  payment_gateway: string
  booking_type: string
  amount: number
  type: "payment" | "refund"
  status: string
  checkin_date: string
  checkout_date: string
  subtotal: number
  total_amount: number
  amount_paid: number
  amount_due: number
  created_at: string
}

export interface TransactionFilters {
  activeTab?: string
  searchQuery?: string
  methodFilter?: string
  gatewayFilter?: string
  statusFilter?: string
  dateRange?: [Date | null, Date | null]
  currentPage?: number
}

const PAGE_SIZE = 10
const EMPTY_TRANSACTIONS: Transaction[] = []

// -- Transactions feed (payments page) --
export function useFrontdeskTransactionsQuery(
  propertyId: string | null | undefined,
  filters: TransactionFilters = {}
) {
  const {
    activeTab = "all",
    searchQuery = "",
    methodFilter = "",
    gatewayFilter = "",
    statusFilter = "",
    dateRange = [null, null],
    currentPage = 1,
  } = filters

  return useQuery({
    queryKey: [
      ...frontdeskKeys.payments(propertyId || ""),
      activeTab,
      searchQuery,
      methodFilter,
      gatewayFilter,
      statusFilter,
      dateRange,
      currentPage,
    ],
    queryFn: async () => {
      if (!propertyId) {
        return { data: EMPTY_TRANSACTIONS, total: 0, has_more: false }
      }
      const skip = (currentPage - 1) * PAGE_SIZE
      const params: Record<string, string> = {
        limit: String(PAGE_SIZE),
        skip: String(skip),
      }
      if (searchQuery.trim()) params.search = searchQuery.trim()
      if (methodFilter) params.payment_method = methodFilter
      if (gatewayFilter) params.payment_gateway = gatewayFilter
      if (statusFilter) params.payment_status = statusFilter
      if (dateRange[0]) params.start_date = dateRange[0].toISOString().split("T")[0]
      if (dateRange[1]) params.end_date = dateRange[1].toISOString().split("T")[0]

      const { data: result } = await api.get(`/properties/${propertyId}/bookings`, { params })
      const wrapped = result as {
        data?: PaymentBooking[]
        meta?: { total?: number; has_more?: boolean }
        total?: number
        has_more?: boolean
      }
      const apiData = (wrapped?.data ?? result) as PaymentBooking[]
      const total = wrapped?.meta?.total ?? wrapped?.total ?? apiData.length
      const has_more = wrapped?.meta?.has_more ?? wrapped?.has_more ?? false

      let filtered = apiData
      if (activeTab === "refunds") {
        filtered = apiData.filter((b) => b.payment_status === "refunded")
      }

      const transactions: Transaction[] = filtered.map((b) => ({
        id: b.id,
        reference_number: b.booking_number,
        guest_name: b.guest_name,
        guest_email: b.guest_email,
        booking_number: b.booking_number,
        room_number: b.room_names?.[0] || "—",
        payment_method: b.payment_method || "—",
        payment_gateway: b.payment_gateway || "—",
        booking_type: b.booking_type || "—",
        amount: parseFloat(b.total_amount) || 0,
        type: b.payment_status === "refunded" ? ("refund" as const) : ("payment" as const),
        status: b.payment_status || "pending",
        checkin_date: b.checkin_date,
        checkout_date: b.checkout_date,
        subtotal: parseFloat(b.subtotal) || 0,
        total_amount: parseFloat(b.total_amount) || 0,
        amount_paid: parseFloat(b.amount_paid || "0") || 0,
        amount_due: parseFloat(b.amount_due || "0") || 0,
        created_at: b.created_at,
      }))

      return { data: transactions, total, has_more }
    },
    enabled: !!propertyId,
  })
}
