import { useState } from 'react'
import toast from 'react-hot-toast'
import { RECENT_TRANSACTIONS, TRANSACTION_TABS, getInitials, type TransactionRow } from './demoBilling'

function TransactionRowItem({ row, last }: { row: TransactionRow; last: boolean }) {
  const amountColor = row.tone === 'danger' ? '#dc2626' : row.tone === 'success' ? '#16a34a' : '#111827'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '13px 0',
        borderBottom: last ? 'none' : '1px solid #f3f4f6',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
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
        {getInitials(row.name)}
      </div>

      <div style={{ flex: 1, minWidth: 120 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{row.name}</div>
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{row.meta}</div>
      </div>

      <div style={{ fontSize: 12, color: '#6b7280', minWidth: 104, textAlign: 'right' }}>{row.method}</div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: amountColor,
          minWidth: 84,
          textAlign: 'right',
        }}
      >
        {row.amount}
      </div>
      <div style={{ fontSize: 11, color: '#9ca3af', minWidth: 68, textAlign: 'right' }}>{row.time}</div>
    </div>
  )
}

export default function RecentTransactionsCard() {
  const [activeTab, setActiveTab] = useState<string>(TRANSACTION_TABS[0])
  const rows = RECENT_TRANSACTIONS[activeTab] ?? []

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        padding: '20px 24px 12px',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Recent Transactions</h3>
        <button
          onClick={() => toast.success('Opening all transactions')}
          style={{
            border: 'none',
            background: 'none',
            fontSize: 13,
            fontWeight: 600,
            color: '#2563eb',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          View All
        </button>
      </div>

      <div className="b-tabs" style={{ marginTop: 14 }}>
        {TRANSACTION_TABS.map((tab) => {
          const active = tab === activeTab
          return (
            <button
              key={tab}
              className="b-tab"
              onClick={() => setActiveTab(tab)}
              style={
                active
                  ? { color: '#2563eb', fontWeight: 600, borderBottomColor: '#2563eb' }
                  : undefined
              }
            >
              {tab}
            </button>
          )
        })}
      </div>

      <div style={{ paddingTop: 4 }}>
        {rows.map((row, index) => (
          <TransactionRowItem key={row.id} row={row} last={index === rows.length - 1} />
        ))}
      </div>
    </div>
  )
}
