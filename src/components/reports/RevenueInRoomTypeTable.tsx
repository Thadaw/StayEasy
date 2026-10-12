import { ArrowRight } from 'lucide-react'
import type { RevenueInRoomTypeRow } from '../../types/reports'

interface RevenueInRoomTypeTableProps {
  data: RevenueInRoomTypeRow[]
  totalNights: number
  totalAdr: number
  totalRevenue: number
}

export default function RevenueInRoomTypeTable({ data, totalNights, totalAdr, totalRevenue }: RevenueInRoomTypeTableProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E2E8F0',
        padding: '20px',
        marginBottom: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Revenue In Room Type</h3>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: 'none',
            color: '#2E86AB',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          View full report
          <ArrowRight size={14} />
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
            <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Room Type</th>
            <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Room Nights</th>
            <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>ADR (Avg.)</th>
            <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Room Revenue</th>
            <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>% of Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.roomType} style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '12px', fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{row.roomType}</td>
              <td style={{ padding: '12px', fontSize: 13, color: '#334155' }}>{row.roomNights}</td>
              <td style={{ padding: '12px', fontSize: 13, color: '#334155' }}>${row.adr.toFixed(2)}</td>
              <td style={{ padding: '12px', fontSize: 13, color: '#334155' }}>${row.roomRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td style={{ padding: '12px', fontSize: 13, color: '#334155', textAlign: 'right' }}>{row.percentOfTotal}%</td>
            </tr>
          ))}
          <tr style={{ fontWeight: 700, borderTop: '2px solid #E2E8F0' }}>
            <td style={{ padding: '12px', fontSize: 13, color: '#0F172A' }}>Total</td>
            <td style={{ padding: '12px', fontSize: 13, color: '#0F172A' }}>{totalNights}</td>
            <td style={{ padding: '12px', fontSize: 13, color: '#0F172A' }}>${totalAdr.toFixed(2)}</td>
            <td style={{ padding: '12px', fontSize: 13, color: '#0F172A' }}>${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td style={{ padding: '12px', fontSize: 13, color: '#0F172A', textAlign: 'right' }}>100%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
