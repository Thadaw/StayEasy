import { useMemo, useState } from 'react'
import ModalShell from './ModalShell'
import { modalCancelStyle, modalInputStyle, modalLabelStyle, modalPrimaryStyle } from './modalStyles'
import { DEMO_INVOICES, formatNpr } from '../demoBilling'

interface GenerateInvoiceModalProps {
  onClose: () => void
  onSubmit: () => void
}

export default function GenerateInvoiceModal({ onClose, onSubmit }: GenerateInvoiceModalProps) {
  const options = useMemo(() => DEMO_INVOICES.slice(0, 20), [])
  const [bookingKey, setBookingKey] = useState(options[0].id)

  const [roomCharges, setRoomCharges] = useState(String(options[0].amount))
  const [serviceCharges, setServiceCharges] = useState('1200')
  const [tax, setTax] = useState('570')
  const [discount, setDiscount] = useState('0')
  const [dueDate, setDueDate] = useState('Apr 30, 2025')

  const total =
    (Number(roomCharges) || 0) + (Number(serviceCharges) || 0) + (Number(tax) || 0) - (Number(discount) || 0)

  const onBookingChange = (id: string) => {
    setBookingKey(id)
    const row = options.find((r) => r.id === id)
    if (row) setRoomCharges(String(row.amount))
  }

  const field = (label: string, value: string, onChange: (v: string) => void, prefix?: string) => (
    <div>
      <label style={modalLabelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        {prefix && (
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
            {prefix}
          </span>
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...modalInputStyle, paddingLeft: prefix ? 44 : 12 }}
        />
      </div>
    </div>
  )

  return (
    <ModalShell
      title="Generate Invoice"
      subtitle="Create a new guest invoice"
      onClose={onClose}
      footer={
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 8,
              padding: '12px 16px',
              borderRadius: 8,
              background: '#dcfce7',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>Invoice Total</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#16a34a' }}>{formatNpr(total)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <button onClick={onClose} style={modalCancelStyle}>
              Cancel
            </button>
            <button onClick={onSubmit} style={modalPrimaryStyle}>
              Generate Invoice
            </button>
          </div>
        </>
      }
    >
      <div>
        <label style={modalLabelStyle}>Booking</label>
        <select
          value={bookingKey}
          onChange={(e) => onBookingChange(e.target.value)}
          style={{ ...modalInputStyle, cursor: 'pointer' }}
        >
          {options.map((row) => (
            <option key={row.id} value={row.id}>
              {`${row.booking} · ${row.guest}`}
            </option>
          ))}
        </select>
      </div>

      {field('Room Charges', roomCharges, setRoomCharges, 'NPR')}
      {field('Service Charges', serviceCharges, setServiceCharges, 'NPR')}
      {field('Tax', tax, setTax, 'NPR')}
      {field('Discount', discount, setDiscount, 'NPR')}

      <div>
        <label style={modalLabelStyle}>Due Date</label>
        <select
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ ...modalInputStyle, cursor: 'pointer' }}
        >
          <option>Apr 30, 2025</option>
          <option>May 07, 2025</option>
          <option>May 14, 2025</option>
        </select>
      </div>
    </ModalShell>
  )
}
