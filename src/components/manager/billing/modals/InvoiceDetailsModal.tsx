import ModalShell from './ModalShell'
import { modalCancelStyle, modalPrimaryStyle } from './modalStyles'
import { STATUS_PILL, formatNpr, type InvoiceRow } from '../demoBilling'

interface InvoiceDetailsModalProps {
  invoice: InvoiceRow
  onClose: () => void
  onDownload: () => void
  onPrint: () => void
}

const sectionTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: '#111827',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  margin: '4px 0 0',
}

const rowLabel: React.CSSProperties = { fontSize: 13, color: '#6b7280' }
const rowValue: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: '#111827', textAlign: 'right' }

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '7px 0',
        borderBottom: '1px dashed #f3f4f6',
      }}
    >
      <span style={rowLabel}>{label}</span>
      <span style={rowValue}>{value}</span>
    </div>
  )
}

export default function InvoiceDetailsModal({ invoice, onClose, onDownload, onPrint }: InvoiceDetailsModalProps) {
  const pill = STATUS_PILL[invoice.status]
  const roomCharges = invoice.amount
  const laundry = 1200
  const airportTransfer = 2400
  const serviceCharges = laundry + airportTransfer
  const vat = Math.round(roomCharges * 0.13)
  const gst = Math.round(roomCharges * 0.1)
  const tax = vat + gst
  const total = roomCharges + serviceCharges + tax
  const paid = invoice.status === 'Paid' ? total : invoice.status === 'Partially Paid' ? Math.round(total / 2) : 0

  const email = `${invoice.guest.toLowerCase().replace(/\s+/g, '.')}@email.com`

  return (
    <ModalShell
      title={`${invoice.invoice} · ${invoice.booking}`}
      subtitle="Invoice breakdown and payment status"
      onClose={onClose}
      width={520}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button onClick={onDownload} style={modalCancelStyle}>
            Download PDF
          </button>
          <button onClick={onPrint} style={modalPrimaryStyle}>
            Print Invoice
          </button>
        </div>
      }
    >
      <div>
        <h4 style={sectionTitle}>Guest Information</h4>
        <InfoRow label="Name" value={invoice.guest} />
        <InfoRow label="Email" value={email} />
      </div>

      <div>
        <h4 style={sectionTitle}>Booking Information</h4>
        <InfoRow label="Booking ID" value={invoice.booking} />
        <InfoRow label="Room" value={invoice.room} />
        <InfoRow label="Invoice Date" value={invoice.invoiceDate} />
        <InfoRow label="Due Date" value={invoice.dueDate} />
      </div>

      <div>
        <h4 style={sectionTitle}>Charge Breakdown</h4>
        <InfoRow label="Room Charges" value={formatNpr(roomCharges)} />
        <InfoRow label="Service Charges" value={formatNpr(serviceCharges)} />
        <InfoRow label="Tax" value={formatNpr(tax)} />
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Total</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{formatNpr(total)}</span>
        </div>
      </div>

      <div>
        <h4 style={sectionTitle}>Service Charges</h4>
        <InfoRow label="Laundry" value={formatNpr(laundry)} />
        <InfoRow label="Airport Transfer" value={formatNpr(airportTransfer)} />
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Total</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{formatNpr(serviceCharges)}</span>
        </div>
      </div>

      <div>
        <h4 style={sectionTitle}>Tax Breakdown</h4>
        <InfoRow label="VAT (13%)" value={formatNpr(vat)} />
        <InfoRow label="GST (10%)" value={formatNpr(gst)} />
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Total</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{formatNpr(tax)}</span>
        </div>
      </div>

      <div>
        <h4 style={sectionTitle}>Payment Status</h4>
        <InfoRow label="Total" value={formatNpr(total)} />
        <InfoRow label="Paid" value={formatNpr(paid)} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0' }}>
          <span style={rowLabel}>Status</span>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              background: pill.background,
              color: pill.color,
            }}
          >
            {invoice.status}
          </span>
        </div>
      </div>
    </ModalShell>
  )
}
