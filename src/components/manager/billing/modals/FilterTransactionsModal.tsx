import { useState } from 'react'
import ModalShell from './ModalShell'
import { modalCancelStyle, modalInputStyle, modalLabelStyle, modalPrimaryStyle } from './modalStyles'
import { INVOICE_METHODS } from '../demoBilling'

interface FilterTransactionsModalProps {
  status: string
  method: string
  invoiceDate: string
  amount: string
  onClose: () => void
  onApply: (status: string, method: string, invoiceDate: string, amount: string) => void
}

const STATUSES = ['All Status', 'Paid', 'Pending', 'Partially Paid', 'Overdue']
const DATE_RANGES = ['Apr 1 – Apr 30', 'Mar 1 – Mar 31', 'Last 7 days', 'Any date']
const AMOUNT_RANGES = ['Any amount', 'Under NPR 10,000', 'NPR 10,000 – 25,000', 'Above NPR 25,000']

export const ANY_DATE = 'Any date'
export const ANY_AMOUNT = 'Any amount'

export default function FilterTransactionsModal({
  status,
  method,
  invoiceDate: initialDate,
  amount: initialAmount,
  onClose,
  onApply,
}: FilterTransactionsModalProps) {
  const [localStatus, setLocalStatus] = useState(status === 'All' ? STATUSES[0] : status)
  const [localMethod, setLocalMethod] = useState(method === 'All' ? 'All Methods' : method)
  const [invoiceDate, setInvoiceDate] = useState(initialDate || DATE_RANGES[3])
  const [amount, setAmount] = useState(initialAmount || AMOUNT_RANGES[0])

  const field = (label: string, value: string, options: string[], onChange: (v: string) => void) => (
    <div>
      <label style={modalLabelStyle}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...modalInputStyle, cursor: 'pointer' }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )

  const clear = () => {
    setLocalStatus(STATUSES[0])
    setLocalMethod('All Methods')
    setInvoiceDate('Any date')
    setAmount(AMOUNT_RANGES[0])
    onApply('All', 'All', 'Any date', AMOUNT_RANGES[0])
  }

  const apply = () => {
    onApply(
      localStatus === STATUSES[0] ? 'All' : localStatus,
      localMethod === 'All Methods' ? 'All' : localMethod,
      invoiceDate,
      amount,
    )
  }

  return (
    <ModalShell
      title="Filter Transactions"
      subtitle="Narrow down invoice records"
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button onClick={clear} style={modalCancelStyle}>
            Clear
          </button>
          <button onClick={apply} style={modalPrimaryStyle}>
            Apply Filters
          </button>
        </div>
      }
    >
      {field('Status', localStatus, STATUSES, setLocalStatus)}
      {field('Payment Method', localMethod, ['All Methods', ...INVOICE_METHODS], setLocalMethod)}
      {field('Invoice Date', invoiceDate, DATE_RANGES, setInvoiceDate)}
      {field('Amount', amount, AMOUNT_RANGES, setAmount)}
    </ModalShell>
  )
}
