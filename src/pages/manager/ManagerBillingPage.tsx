import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import ManagerLayout from '../../components/manager/ManagerLayout'
import BillingStatsRow from '../../components/manager/billing/BillingStatsRow'
import BillingToolbar from '../../components/manager/billing/BillingToolbar'
import InvoicesTable from '../../components/manager/billing/InvoicesTable'
import PaymentRecordsView from '../../components/manager/billing/PaymentRecordsView'
import RefundRequestsView from '../../components/manager/billing/RefundRequestsView'
import RevenueAnalyticsCard from '../../components/manager/billing/RevenueAnalyticsCard'
import PaymentMethodCard from '../../components/manager/billing/PaymentMethodCard'
import RevenueByRoomTypeCard from '../../components/manager/billing/RevenueByRoomTypeCard'
import RecentTransactionsCard from '../../components/manager/billing/RecentTransactionsCard'
import FinancialSummaryCard from '../../components/manager/billing/FinancialSummaryCard'
import GenerateInvoiceModal from '../../components/manager/billing/modals/GenerateInvoiceModal'
import RecordPaymentModal from '../../components/manager/billing/modals/RecordPaymentModal'
import ExportBillingReportModal from '../../components/manager/billing/modals/ExportBillingReportModal'
import FilterTransactionsModal from '../../components/manager/billing/modals/FilterTransactionsModal'
import InvoiceDetailsModal from '../../components/manager/billing/modals/InvoiceDetailsModal'
import { DEMO_INVOICES, type InvoiceRow } from '../../components/manager/billing/demoBilling'
import '../../styles/manager-billing.css'

type BillingModal = 'generate' | 'record' | 'export' | 'filter' | 'details'

function matchInvoiceDate(invoiceDate: string, range: string): boolean {
  if (range === 'Any date' || range === 'Apr 1 – Apr 30') return invoiceDate.startsWith('Apr')
  if (range === 'Mar 1 – Mar 31') return invoiceDate.startsWith('Mar')
  if (range === 'Last 7 days') {
    const day = Number.parseInt(invoiceDate.split(' ')[1] ?? '', 10)
    return invoiceDate.startsWith('Apr') && Number.isFinite(day) && day >= 24
  }
  return true
}

function matchInvoiceAmount(amount: number, range: string): boolean {
  if (range === 'Under NPR 10,000') return amount < 10000
  if (range === 'NPR 10,000 – 25,000') return amount >= 10000 && amount <= 25000
  if (range === 'Above NPR 25,000') return amount > 25000
  return true
}

export default function ManagerBillingPage() {
  const { pathname } = useLocation()
  const section = pathname.endsWith('/payments')
    ? 'payments'
    : pathname.endsWith('/refunds')
      ? 'refunds'
      : 'invoices'

  const [status, setStatus] = useState('All')
  const [method, setMethod] = useState('All')
  const [dateRange, setDateRange] = useState('Apr 1 – Apr 30')
  const [amountRange, setAmountRange] = useState('Any amount')
  const [modal, setModal] = useState<BillingModal | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRow | null>(null)

  const closeModal = () => setModal(null)

  const filteredInvoices = useMemo(() => {
    return DEMO_INVOICES.filter((row) => {
      const matchStatus = status === 'All' || row.status === status
      const matchMethod = method === 'All' || row.method === method
      const matchDate = matchInvoiceDate(row.invoiceDate, dateRange)
      const matchAmount = matchInvoiceAmount(row.amount, amountRange)
      return matchStatus && matchMethod && matchDate && matchAmount
    })
  }, [status, method, dateRange, amountRange])

  return (
    <ManagerLayout
      title="Billing & Payments"
      subtitle="Manage invoices, payments and financial transactions"
      breadcrumb="Dashboard  /  Billing & Payments"
      searchPlaceholder="Search Invoice ID, Guest Name, Booking ID..."
    >
      <BillingStatsRow />

      <BillingToolbar
        status={status}
        method={method}
        dateRange={dateRange}
        onStatusChange={setStatus}
        onMethodChange={setMethod}
        onDateRangeChange={setDateRange}
        onGenerateInvoice={() => setModal('generate')}
        onRecordPayment={() => setModal('record')}
        onExport={() => setModal('export')}
        onFilter={() => setModal('filter')}
      />

      {section === 'invoices' && (
        <InvoicesTable
          rows={filteredInvoices}
          onViewInvoice={(row) => {
            setSelectedInvoice(row)
            setModal('details')
          }}
        />
      )}
      {section === 'payments' && <PaymentRecordsView />}
      {section === 'refunds' && <RefundRequestsView />}

      <div className="b-main">
        <RevenueAnalyticsCard />
        <div className="b-side-col">
          <PaymentMethodCard />
          <RevenueByRoomTypeCard />
        </div>
      </div>

      <div className="b-bottom">
        <RecentTransactionsCard />
        <FinancialSummaryCard />
      </div>

      {modal === 'generate' && (
        <GenerateInvoiceModal
          onClose={closeModal}
          onSubmit={() => {
            toast.success('Invoice INV-0542 generated')
            closeModal()
          }}
        />
      )}
      {modal === 'record' && (
        <RecordPaymentModal
          onClose={closeModal}
          onSubmit={() => {
            toast.success('Payment recorded successfully')
            closeModal()
          }}
        />
      )}
      {modal === 'export' && (
        <ExportBillingReportModal
          onClose={closeModal}
          onSubmit={(format) => {
            toast.success(`Billing report exported as ${format}`)
            closeModal()
          }}
        />
      )}
      {modal === 'filter' && (
        <FilterTransactionsModal
          status={status}
          method={method}
          invoiceDate={dateRange}
          amount={amountRange}
          onClose={closeModal}
          onApply={(nextStatus, nextMethod, nextDate, nextAmount) => {
            setStatus(nextStatus)
            setMethod(nextMethod)
            setDateRange(nextDate)
            setAmountRange(nextAmount)
            toast.success('Filters applied')
            closeModal()
          }}
        />
      )}
      {modal === 'details' && selectedInvoice && (
        <InvoiceDetailsModal
          invoice={selectedInvoice}
          onClose={closeModal}
          onDownload={() => toast.success(`${selectedInvoice.invoice} downloaded`)}
          onPrint={() => toast.success(`${selectedInvoice.invoice} sent to printer`)}
        />
      )}
    </ManagerLayout>
  )
}
