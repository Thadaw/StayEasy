import { useMemo, useState } from 'react'
import ModalShell from './ModalShell'
import { modalCancelStyle, modalInputStyle, modalLabelStyle, modalPrimaryStyle } from './modalStyles'
import { DEMO_INVOICES, INVOICE_METHODS, formatNpr } from '../demoBilling'

interface RecordPaymentModalProps {
  onClose: () => void
  onSubmit: () => void
}

export default function RecordPaymentModal({ onClose, onSubmit }: RecordPaymentModalProps) {
  const options = useMemo(() => DEMO_INVOICES.slice(0, 20), [])
  const [invoiceKey, setInvoiceKey] = useState(options[0].id)
  const selected = options.find((row) => row.id === invoiceKey) ?? options[0]
  const [amount, setAmount] = useState(String(options[0].amount))
  const [paymentDate, setPaymentDate] = useState('Apr 26, 2025')
  const [method, setMethod] = useState<string>(INVOICE_METHODS[1])

  const onInvoiceChange = (id: string) => {
    setInvoiceKey(id)
    const row = options.find((r) => r.id === id)
    if (row) setAmount(String(row.amount))
  }

  return (
    <ModalShell
      title="Record Payment"
      subtitle="Log a payment against an invoice"
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={modalCancelStyle}>
            Cancel
          </button>
          <button onClick={onSubmit} style={modalPrimaryStyle}>
            Record Payment
          </button>
        </div>
      }
    >
      <div>
        <label style={modalLabelStyle}>Invoice</label>
        <select
          value={invoiceKey}
          onChange={(e) => onInvoiceChange(e.target.value)}
          style={{ ...modalInputStyle, cursor: 'pointer' }}
        >
          {options.map((row) => (
            <option key={row.id} value={row.id}>
              {`${row.invoice} · ${row.guest}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={modalLabelStyle}>Amount</label>
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 13,
              color: '#9ca3af',
              pointerEvents: 'none',
            }}
          >
            NPR
          </span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ ...modalInputStyle, paddingLeft: 44 }}
          />
        </div>
        <p style={{ margin: '6px 0 0', fontSize: 12, color: '#9ca3af' }}>
          Outstanding: {formatNpr(selected.amount)}
        </p>
      </div>

      <div>
        <label style={modalLabelStyle}>Payment Date</label>
        <select
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          style={{ ...modalInputStyle, cursor: 'pointer' }}
        >
          <option>Apr 26, 2025</option>
          <option>Apr 27, 2025</option>
          <option>Apr 28, 2025</option>
          <option>Apr 29, 2025</option>
        </select>
      </div>

      <div>
        <label style={modalLabelStyle}>Payment Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={{ ...modalInputStyle, cursor: 'pointer' }}
        >
          {[...INVOICE_METHODS, 'Card'].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </ModalShell>
  )
}
