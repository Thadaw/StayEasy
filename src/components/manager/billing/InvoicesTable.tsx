import { useEffect, useMemo, useState } from 'react'
import { Eye, Pencil, Download, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import TableFooter from './TableFooter'
import { STATUS_PILL, getInitials, formatNpr, type InvoiceRow } from './demoBilling'

const ITEMS_PER_PAGE = 6

interface InvoicesTableProps {
  rows: InvoiceRow[]
  onViewInvoice?: (row: InvoiceRow) => void
}

export default function InvoicesTable({ rows, onViewInvoice }: InvoicesTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(rows.length / ITEMS_PER_PAGE))
  const page = Math.min(currentPage, pageCount)

  useEffect(() => {
    setCurrentPage(1)
  }, [rows])

  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const pageRows = useMemo(
    () => rows.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [rows, startIndex],
  )

  const headerStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 700,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e5e7eb',
    whiteSpace: 'nowrap',
  }

  const cellStyle: React.CSSProperties = {
    padding: '13px 16px',
    fontSize: 13,
    color: '#374151',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
  }

  const from = rows.length === 0 ? 0 : startIndex + 1
  const to = Math.min(startIndex + ITEMS_PER_PAGE, rows.length)

  const renderAction = (
    key: string,
    icon: React.ReactNode,
    label: string,
    message: string,
    hoverBg = '#f3f4f6',
    hoverColor = '#374151',
    onClick?: () => void,
  ) => (
    <button
      key={key}
      title={label}
      onClick={onClick ?? (() => toast.success(message))}
      style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        border: 'none',
        background: 'transparent',
        color: '#9ca3af',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hoverBg
        e.currentTarget.style.color = hoverColor
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = '#9ca3af'
      }}
    >
      {icon}
    </button>
  )

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ padding: '20px 24px 16px' }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>
          Guest Invoices &amp; Payments
        </h3>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
          Manage and track all guest billing transactions
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1120 }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={headerStyle}>Invoice</th>
              <th style={headerStyle}>Booking</th>
              <th style={headerStyle}>Guest Name</th>
              <th style={headerStyle}>Room</th>
              <th style={headerStyle}>Amount</th>
              <th style={headerStyle}>Payment Method</th>
              <th style={headerStyle}>Status</th>
              <th style={headerStyle}>Invoice Date</th>
              <th style={headerStyle}>Due Date</th>
              <th style={headerStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => {
              const pill = STATUS_PILL[row.status]
              return (
                <tr
                  key={row.id}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ ...cellStyle, fontWeight: 600, color: '#111827' }}>{row.invoice}</td>
                  <td style={{ ...cellStyle, color: '#6b7280' }}>{row.booking}</td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          background: row.avatarColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(row.guest)}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{row.guest}</span>
                    </div>
                  </td>
                  <td style={cellStyle}>{row.room}</td>
                  <td style={{ ...cellStyle, fontWeight: 600, color: '#111827' }}>{formatNpr(row.amount)}</td>
                  <td style={cellStyle}>{row.method}</td>
                  <td style={cellStyle}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        background: pill.background,
                        color: pill.color,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, color: '#6b7280' }}>{row.invoiceDate}</td>
                  <td style={{ ...cellStyle, color: '#6b7280' }}>{row.dueDate}</td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {renderAction(
                        'view',
                        <Eye size={15} />,
                        'View',
                        `Opening ${row.invoice}`,
                        '#f3f4f6',
                        '#374151',
                        () => onViewInvoice?.(row),
                      )}
                      {renderAction('edit', <Pencil size={15} />, 'Edit', `Editing ${row.invoice}`)}
                      {renderAction('download', <Download size={15} />, 'Download', `${row.invoice} downloaded`)}
                      {renderAction('delete', <Trash2 size={15} />, 'Delete', `${row.invoice} deleted`, '#fee2e2', '#dc2626')}
                    </div>
                  </td>
                </tr>
              )
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={10} style={{ ...cellStyle, textAlign: 'center', padding: '32px 16px', color: '#9ca3af' }}>
                  No invoices match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TableFooter
        from={from}
        to={to}
        total={rows.length}
        unit="invoices"
        page={page}
        pageCount={pageCount}
        onPage={setCurrentPage}
      />
    </div>
  )
}
