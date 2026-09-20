import { Printer, FileText, X } from "lucide-react"
import { usePropertyCurrency } from "../hooks/usePropertyCurrency"

export interface InvoiceGuestInfo {
  name: string
  email: string
  phone?: string
  nationality?: string
}

export interface InvoiceRoomCharge {
  room_name: string
  nights: number
  rate: number
}

export interface InvoiceCharge {
  id: string
  description: string
  amount: number
  category?: string
  date?: string
}

export interface InvoicePayment {
  date: string
  description: string
  method?: string
  amount: number
}

export interface InvoiceSummaryItem {
  label: string
  value: number
  type?: "normal" | "bold" | "discount" | "highlight" | "status"
  statusLabel?: string
  statusColor?: string
}

export interface InvoiceReceiptProps {
  propertyName?: string
  invoiceNumber: string
  invoiceDate: string
  title?: string
  printLabel?: string
  guestInfo?: InvoiceGuestInfo
  rooms?: string
  checkinDate?: string
  checkoutDate?: string
  summaryTitle?: string
  summary: InvoiceSummaryItem[]
  charges: InvoiceCharge[]
  payments?: InvoicePayment[]
  footerMessage?: string
  footerSubMessage?: string
  onPrint?: () => void
  onClose?: () => void
}

export function InvoiceReceipt({
  propertyName,
  invoiceNumber,
  invoiceDate,
  title = "INVOICE",
  printLabel = "Print Invoice",
  guestInfo,
  rooms,
  checkinDate,
  checkoutDate,
  summaryTitle = "Summary",
  summary,
  charges,
  payments,
  footerMessage = "Thank you for staying with us!",
  footerSubMessage = "We hope to see you again soon.",
  onPrint,
  onClose,
}: InvoiceReceiptProps) {
  const { formatAmount } = usePropertyCurrency()

  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      window.print()
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      window.close()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="print:hidden flex justify-center gap-3 py-4">
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Printer size={16} />
          {printLabel}
        </button>
        <button
          onClick={handleClose}
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
              <span className="text-xl font-bold text-gray-900">{propertyName || "StayEasy"}</span>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500">#{invoiceNumber}</p>
              <p className="text-sm text-gray-500">{invoiceDate}</p>
            </div>
          </div>

          {/* Guest Info + Summary */}
          <div className="grid grid-cols-2 gap-8 mb-8 items-start">
            <div className="space-y-3">
              {guestInfo?.name && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Guest Name</span>
                  <span className="text-sm font-semibold text-gray-900">{guestInfo.name}</span>
                </div>
              )}
              {guestInfo?.email && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-semibold text-gray-900">{guestInfo.email}</span>
                </div>
              )}
              {guestInfo?.phone && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Phone</span>
                  <span className="text-sm font-semibold text-gray-900">{guestInfo.phone}</span>
                </div>
              )}
              {guestInfo?.nationality && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Nationality</span>
                  <span className="text-sm font-semibold text-gray-900">{guestInfo.nationality}</span>
                </div>
              )}
              {rooms && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Room</span>
                  <span className="text-sm font-semibold text-gray-900">{rooms}</span>
                </div>
              )}
              {checkinDate && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Check-in</span>
                  <span className="text-sm font-semibold text-gray-900">{checkinDate}</span>
                </div>
              )}
              {checkoutDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Check-out</span>
                  <span className="text-sm font-semibold text-gray-900">{checkoutDate}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">{summaryTitle}</h4>
              {summary.map((item, i) => {
                if (item.type === "highlight") {
                  return (
                    <div key={i} className={`flex justify-between px-3 py-2 rounded-lg mt-1 ${
                      item.label.toLowerCase().includes("balance") ? "bg-green-50" : "bg-gray-50"
                    }`}>
                      <span className={`font-bold ${
                        item.label.toLowerCase().includes("balance") ? "text-green-700" : "text-gray-700"
                      }`}>{item.label}</span>
                      <span className={`font-bold ${
                        item.label.toLowerCase().includes("balance") ? "text-green-700" : "text-gray-700"
                      }`}>{formatAmount(item.value)}</span>
                    </div>
                  )
                }
                if (item.type === "status") {
                  return (
                    <div key={i} className="flex justify-between bg-gray-50 px-3 py-2 rounded-lg mt-1">
                      <span className="font-bold text-gray-700">{item.label}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${item.statusColor || "bg-blue-100 text-blue-700"}`}>
                        {item.statusLabel || item.label}
                      </span>
                    </div>
                  )
                }
                const isBold = item.type === "bold"
                const isDiscount = item.type === "discount"
                return (
                  <div key={i} className={`flex justify-between text-sm ${i === summary.length - 1 || isBold ? "border-t border-gray-100 pt-2" : ""}`}>
                    <span className={isBold ? "font-bold text-gray-900" : "text-gray-600"}>{item.label}</span>
                    <span className={`font-semibold ${isBold ? "text-gray-900" : isDiscount ? "text-red-600" : "text-gray-900"}`}>
                      {isDiscount ? "-" : ""}{formatAmount(item.value)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="border-t border-gray-200 my-6" />

          {/* Charges */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-900 mb-3">Charges</h4>
            <div className="space-y-2">
              {charges.map((charge) => (
                <div key={charge.id} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                  <div>
                    <span className="text-gray-600">{charge.description}</span>
                    {charge.category && (
                      <span className="text-xs text-gray-400 ml-2">({charge.category?.replace("_", " ")})</span>
                    )}
                    {charge.date && (
                      <span className="text-xs text-gray-400 ml-2">{charge.date}</span>
                    )}
                  </div>
                  <span className="font-semibold text-gray-900">{formatAmount(charge.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          {payments && payments.length > 0 && (
            <div className="mb-8">
              <h4 className="font-bold text-gray-900 mb-3">Payment History</h4>
              <div className="space-y-3">
                {payments.map((payment, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="shrink-0 text-center min-w-[70px]">
                      <p className="text-xs font-bold text-gray-900">{payment.date}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{payment.description}{payment.method ? ` · ${payment.method}` : ""}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-green-600">+{formatAmount(payment.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-dashed border-gray-200 mt-6 pt-4 text-center">
            <p className="font-bold text-gray-900 text-sm">{footerMessage}</p>
            <p className="text-sm text-gray-500">{footerSubMessage}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
