import { useState } from "react"
import * as XLSX from "xlsx"
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  FileText,
  Download,
} from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useAuth } from "../../auth/AuthContext"
import { usePropertyStore } from "../../stores/propertyStore"
import { FrontDeskSidebar } from "../components/FrontDeskSidebar"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/axios"
import { getPaymentGateways, getPaymentMethods, getPaymentStatuses } from "../../services/pmsApi"

interface Booking {
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

interface Transaction {
  id: string
  reference_number: string
  guest_name: string
  booking_number: string
  room_number: string
  payment_method: string
  amount: number
  type: "payment" | "refund"
  status: string
  created_at: string
}

type TabKey = "all" | "refunds"

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All transactions" },
  { key: "refunds", label: "Refunds" },
]

const PAGE_SIZE = 10

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

function getStatusStyle(status: string): string {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-50 text-green-700"
    case "pending":
      return "bg-amber-50 text-amber-700"
    case "failed":
      return "bg-red-50 text-red-700"
    case "refunded":
      return "bg-blue-50 text-blue-700"
    default:
      return "bg-gray-50 text-gray-600"
  }
}

function getStatusDot(status: string): string {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-500"
    case "pending":
      return "bg-amber-500"
    case "failed":
      return "bg-red-500"
    case "refunded":
      return "bg-blue-500"
    default:
      return "bg-gray-400"
  }
}

const EMPTY_TRANSACTIONS: Transaction[] = []

export default function FrontDeskPaymentsPage() {
  const { user } = useAuth()
  const { currentPropertyId } = usePropertyStore()
  const { formatAmount } = usePropertyCurrency()

  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [methodFilter, setMethodFilter] = useState("")
  const [gatewayFilter, setGatewayFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const { data: paymentMethodOptions = [] } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: getPaymentMethods,
  })

  const { data: paymentGatewayOptions = [] } = useQuery({
    queryKey: ["payment-gateways"],
    queryFn: getPaymentGateways,
  })

  const { data: paymentStatusOptions = [] } = useQuery({
    queryKey: ["payment-statuses"],
    queryFn: getPaymentStatuses,
  })

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: [
      "frontdesk-transactions",
      currentPropertyId,
      activeTab,
      searchQuery,
      methodFilter,
      gatewayFilter,
      statusFilter,
      dateRange,
      currentPage,
    ],
    queryFn: async () => {
      if (!currentPropertyId) {
        return { data: EMPTY_TRANSACTIONS, total: 0, has_more: false }
      }
      try {
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

        const { data: result } = await api.get(
          `/properties/${currentPropertyId}/bookings`,
          { params }
        )
        const wrapped = result as {
          data?: Booking[]
          meta?: { total?: number; has_more?: boolean }
          total?: number
          has_more?: boolean
        }
        const apiData = (wrapped?.data ?? result) as Booking[]
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
          booking_number: b.booking_number,
          room_number: b.room_names?.[0] || "—",
          payment_method: b.payment_method || b.payment_gateway || "—",
          amount: parseFloat(b.total_amount) || 0,
          type: b.payment_status === "refunded" ? "refund" as const : "payment" as const,
          status: b.payment_status || "pending",
          created_at: b.created_at,
        }))

        return { data: transactions, total, has_more }
      } catch {
        return { data: EMPTY_TRANSACTIONS, total: 0, has_more: false }
      }
    },
    enabled: !!currentPropertyId,
    placeholderData: { data: EMPTY_TRANSACTIONS, total: 0, has_more: false },
  })

  const transactions = transactionsData?.data ?? EMPTY_TRANSACTIONS
  const totalTransactions = transactionsData?.total ?? transactions.length
  const hasMore = transactionsData?.has_more ?? false
  const totalPages = Math.max(1, Math.ceil(totalTransactions / PAGE_SIZE))

  const handleReset = () => {
    setSearchInput("")
    setSearchQuery("")
    setDateRange([null, null])
    setMethodFilter("")
    setGatewayFilter("")
    setStatusFilter("")
    setCurrentPage(1)
  }

  const handleExportCSV = async () => {
    if (!currentPropertyId) return
    try {
      let allBookings: Booking[] = []
      let skip = 0
      let hasMore = true

      while (hasMore) {
        const params: Record<string, string> = { limit: "50", skip: String(skip) }
        if (searchQuery.trim()) params.search = searchQuery.trim()
        if (methodFilter) params.payment_method = methodFilter
        if (gatewayFilter) params.payment_gateway = gatewayFilter
        if (statusFilter) params.payment_status = statusFilter
        if (dateRange[0]) params.start_date = dateRange[0].toISOString().split("T")[0]
        if (dateRange[1]) params.end_date = dateRange[1].toISOString().split("T")[0]

        const { data: result } = await api.get(
          `/properties/${currentPropertyId}/bookings`,
          { params }
        )
        const wrapped = result as {
          data?: Booking[]
          meta?: { has_more?: boolean }
          has_more?: boolean
        }
        const apiData = (wrapped?.data ?? result) as Booking[]
        allBookings = [...allBookings, ...apiData]
        hasMore = wrapped?.meta?.has_more ?? wrapped?.has_more ?? false
        skip += 50
      }

      const exportData = allBookings.map((b) => ({
        "Booking Number": b.booking_number,
        "Guest Name": b.guest_name,
        "Guest Email": b.guest_email,
        "Room(s)": b.room_names?.join(", ") || "",
        "Check-in": b.checkin_date,
        "Check-out": b.checkout_date,
        "Payment Method": b.payment_method || b.payment_gateway || "",
        "Payment Status": b.payment_status || "",
        "Subtotal": b.subtotal,
        "Total Amount": b.total_amount,
        "Amount Paid": b.amount_paid || "",
        "Amount Due": b.amount_due || "",
        "Created At": b.created_at,
      }))

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Payments")
      XLSX.writeFile(wb, `payments_export_${new Date().toISOString().split("T")[0]}.csv`)
    } catch (err) {
      console.error("Export failed:", err)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Payment History Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment history</h1>
              <p className="text-sm text-gray-500 mt-1">Track guest payments, refunds, and receipts.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-8">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key)
                    setCurrentPage(1)
                  }}
                  className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-[1px] ${
                    activeTab === tab.key
                      ? "border-blue-600 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.key === "all"
                    ? `All transactions (${totalTransactions})`
                    : tab.key === "refunds"
                    ? `Refunds (${transactions.filter((t) => t.type === "refund" || t.status === "refunded").length})`
                    : tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search guest, booking or reference"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchQuery(searchInput)
                    setCurrentPage(1)
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
              />
            </div>

            <div className="relative">
              <DatePicker
                selectsRange
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={(update) => setDateRange(update as [Date | null, Date | null])}
                placeholderText="Date range"
                className="pl-3 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white w-44"
                isClearable
              />
            </div>

            <div className="relative">
              <select
                value={methodFilter}
                onChange={(e) => {
                  setMethodFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white cursor-pointer"
              >
                <option value="">All methods</option>
                {paymentMethodOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            <div className="relative">
              <select
                value={gatewayFilter}
                onChange={(e) => {
                  setGatewayFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white cursor-pointer"
              >
                <option value="">All gateways</option>
                {paymentGatewayOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white cursor-pointer"
              >
                <option value="">All statuses</option>
                {paymentStatusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Transaction Count */}
          <p className="text-sm text-gray-500 mb-4">
            {totalTransactions} transaction{totalTransactions !== 1 ? "s" : ""}
          </p>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-16">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No transactions found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery ? "Try a different search term" : "No transactions yet"}
                </p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="grid grid-cols-[1.5fr_1.5fr_0.8fr_1fr_1fr_0.8fr_0.8fr] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div>Transaction / Date</div>
                  <div>Guest / Booking</div>
                  <div>Room</div>
                  <div>Method</div>
                  <div className="text-right">Amount</div>
                  <div>Status</div>
                  <div className="text-right">Actions</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-50">
                  {transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="grid grid-cols-[1.5fr_1.5fr_0.8fr_1fr_1fr_0.8fr_0.8fr] gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                    >
                      {/* Transaction / Date */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {txn.reference_number}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(txn.created_at)}, {formatTime(txn.created_at)}
                        </p>
                      </div>

                      {/* Guest / Booking */}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {txn.guest_name}
                        </p>
                        <p className="text-xs text-gray-500">{txn.booking_number}</p>
                      </div>

                      {/* Room */}
                      <div>
                        <p className="text-sm text-gray-900">{txn.room_number}</p>
                      </div>

                      {/* Method */}
                      <div>
                        <p className="text-sm text-gray-700">{txn.payment_method}</p>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <span
                          className={`text-sm font-semibold ${
                            txn.type === "refund" ? "text-gray-700" : "text-gray-900"
                          }`}
                        >
                          {txn.type === "refund" ? "- " : "+ "}
                          {formatAmount(txn.amount)}
                        </span>
                      </div>

                      {/* Status */}
                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            txn.status
                          )}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${getStatusDot(
                              txn.status
                            )}`}
                          />
                          {txn.status?.charAt(0).toUpperCase() +
                            txn.status?.slice(1).toLowerCase()}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Receipt"
                          >
                            <FileText size={15} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing 1–{transactions.length} of {totalTransactions} transactions
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg transition-colors ${
                        currentPage === 1
                          ? "opacity-40 cursor-not-allowed text-gray-400"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white text-sm font-semibold rounded-lg">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg transition-colors ${
                        currentPage >= totalPages
                          ? "opacity-40 cursor-not-allowed text-gray-400"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
