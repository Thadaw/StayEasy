import { useState } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import { CreditCard, CheckCircle, Wifi, XCircle, Plus, Pen, MoreVertical, X } from 'lucide-react'

interface PaymentMethod {
  id: string
  name: string
  type: string
  typeColor: string
  icon: string
  iconBg: string
  iconColor: string
  details: string[]
  status: 'Active' | 'Offline'
  fees: string
}

const paymentMethods: PaymentMethod[] = [
  { id: 'cash', name: 'Cash', type: 'Cash', typeColor: '#D1FAE5', icon: '💵', iconBg: '#D1FAE5', iconColor: '#059669', details: ['–'], status: 'Active', fees: 'No Charges' },
  { id: 'card', name: 'Card (Visa / MasterCard)', type: 'Card', typeColor: '#DBEAFE', icon: '💳', iconBg: '#DBEAFE', iconColor: '#2563EB', details: ['Terminal: TID-1001', 'Merchant: 123456789'], status: 'Active', fees: '2.00%' },
  { id: 'esewa', name: 'eSewa', type: 'Digital Wallet', typeColor: '#EDE9FE', icon: '📱', iconBg: '#D1FAE5', iconColor: '#059669', details: ['Merchant ID: 9801234567'], status: 'Active', fees: '1.50%' },
  { id: 'khalti', name: 'Khalti', type: 'Digital Wallet', typeColor: '#EDE9FE', icon: '📲', iconBg: '#EDE9FE', iconColor: '#7C3AED', details: ['Merchant ID: 9812345678'], status: 'Active', fees: '1.50%' },
  { id: 'imepay', name: 'IME Pay', type: 'Digital Wallet', typeColor: '#EDE9FE', icon: '💸', iconBg: '#FEE2E2', iconColor: '#DC2626', details: ['Merchant ID: 9807654321'], status: 'Active', fees: '1.50%' },
  { id: 'banktransfer', name: 'Bank Transfer', type: 'Bank', typeColor: '#DBEAFE', icon: '🏦', iconBg: '#DBEAFE', iconColor: '#2563EB', details: ['Nabil Bank', 'A/C: 00123456789012'], status: 'Active', fees: 'No Charges' },
  { id: 'qrpayment', name: 'QR Payment', type: 'QR', typeColor: '#E0E7FF', icon: '📷', iconBg: '#E0E7FF', iconColor: '#4F46E5', details: ['Terminal: QR-2001'], status: 'Active', fees: '1.00%' },
  { id: 'mealcard', name: 'Meal Card', type: 'Card', typeColor: '#DBEAFE', icon: '🍽️', iconBg: '#FEF3C7', iconColor: '#D97706', details: ['Provider: MealCard Pvt. Ltd.', 'ID: MC-556677'], status: 'Offline', fees: 'No Charges' },
  { id: 'giftcard', name: 'Gift Card', type: 'Gift Card', typeColor: '#FCE7F3', icon: '🎁', iconBg: '#FCE7F3', iconColor: '#DB2777', details: ['Provider: StayEasy Gift', 'ID: GC-998877'], status: 'Active', fees: 'No Charges' },
  { id: 'storecredit', name: 'Store Credit', type: 'Store Credit', typeColor: '#E0E7FF', icon: '🐷', iconBg: '#E0E7FF', iconColor: '#4F46E5', details: ['Internal'], status: 'Offline', fees: 'No Charges' },
]

const methodDetails: Record<string, { subtitle: string; details: Record<string, string>; about: string }> = {
  cash: { subtitle: 'Cash Payment', details: { Type: 'Cash', Status: 'Active', 'Terminal ID': '–', 'Merchant ID': '–', Provider: '–', 'Settlement Period': 'Immediate', Currency: 'NPR', 'Minimum Amount': 'NPR 1.00', 'Maximum Amount': 'No Limit', 'Created On': 'Jan 05, 2025, 09:00 AM', 'Last Updated': 'Jan 05, 2025, 09:00 AM' }, about: 'Accepts cash payments directly. No processing fees apply.' },
  card: { subtitle: 'Card Payment', details: { Type: 'Card', Status: 'Active', 'Terminal ID': 'TID-1001', 'Merchant ID': '123456789', Provider: 'Global Payments', 'Settlement Period': 'T+1 (Next Day)', Currency: 'NPR', 'Minimum Amount': 'NPR 1.00', 'Maximum Amount': 'NPR 200,000.00', 'Created On': 'Jan 10, 2025, 10:30 AM', 'Last Updated': 'May 20, 2026, 02:15 PM' }, about: 'Accepts Visa, MasterCard and other major credit/debit cards.' },
  esewa: { subtitle: 'Digital Wallet', details: { Type: 'Digital Wallet', Status: 'Active', 'Terminal ID': '–', 'Merchant ID': '9801234567', Provider: 'eSewa', 'Settlement Period': 'T+1 (Next Day)', Currency: 'NPR', 'Minimum Amount': 'NPR 1.00', 'Maximum Amount': 'NPR 100,000.00', 'Created On': 'Feb 15, 2025, 11:45 AM', 'Last Updated': 'Apr 10, 2026, 03:20 PM' }, about: 'Accepts eSewa digital wallet payments for quick and easy transactions.' },
  khalti: { subtitle: 'Digital Wallet', details: { Type: 'Digital Wallet', Status: 'Active', 'Terminal ID': '–', 'Merchant ID': '9812345678', Provider: 'Khalti', 'Settlement Period': 'T+1 (Next Day)', Currency: 'NPR', 'Minimum Amount': 'NPR 1.00', 'Maximum Amount': 'NPR 100,000.00', 'Created On': 'Mar 20, 2025, 02:15 PM', 'Last Updated': 'May 05, 2026, 10:30 AM' }, about: 'Accepts Khalti digital wallet payments for seamless mobile transactions.' },
  imepay: { subtitle: 'Digital Wallet', details: { Type: 'Digital Wallet', Status: 'Active', 'Terminal ID': '–', 'Merchant ID': '9807654321', Provider: 'IME Pay', 'Settlement Period': 'T+1 (Next Day)', Currency: 'NPR', 'Minimum Amount': 'NPR 1.00', 'Maximum Amount': 'NPR 50,000.00', 'Created On': 'Apr 05, 2025, 04:30 PM', 'Last Updated': 'Jun 01, 2026, 09:15 AM' }, about: 'Accepts IME Pay digital wallet payments for secure money transfers.' },
  banktransfer: { subtitle: 'Bank Payment', details: { Type: 'Bank', Status: 'Active', 'Terminal ID': '–', 'Merchant ID': '–', Provider: 'Nabil Bank', 'Settlement Period': 'T+2', Currency: 'NPR', 'Minimum Amount': 'NPR 100.00', 'Maximum Amount': 'No Limit', 'Created On': 'Jan 20, 2025, 08:00 AM', 'Last Updated': 'Mar 15, 2026, 11:45 AM' }, about: 'Accepts direct bank transfers. A/C: 00123456789012 at Nabil Bank.' },
  qrpayment: { subtitle: 'QR Code Payment', details: { Type: 'QR', Status: 'Active', 'Terminal ID': 'QR-2001', 'Merchant ID': '–', Provider: 'NCHL', 'Settlement Period': 'T+1 (Next Day)', Currency: 'NPR', 'Minimum Amount': 'NPR 1.00', 'Maximum Amount': 'NPR 50,000.00', 'Created On': 'May 10, 2025, 01:00 PM', 'Last Updated': 'Jun 05, 2026, 04:30 PM' }, about: 'Accepts QR code payments via connectIPS and other QR-based systems.' },
  mealcard: { subtitle: 'Card Payment', details: { Type: 'Card', Status: 'Offline', 'Terminal ID': '–', 'Merchant ID': 'MC-556677', Provider: 'MealCard Pvt. Ltd.', 'Settlement Period': 'T+3', Currency: 'NPR', 'Minimum Amount': 'NPR 10.00', 'Maximum Amount': 'NPR 10,000.00', 'Created On': 'Jun 01, 2025, 10:00 AM', 'Last Updated': 'May 28, 2026, 02:00 PM' }, about: 'Accepts meal cards from MealCard Pvt. Ltd. Currently offline for maintenance.' },
  giftcard: { subtitle: 'Gift Card Payment', details: { Type: 'Gift Card', Status: 'Active', 'Terminal ID': '–', 'Merchant ID': 'GC-998877', Provider: 'StayEasy Gift', 'Settlement Period': 'Immediate', Currency: 'NPR', 'Minimum Amount': 'NPR 1.00', 'Maximum Amount': 'NPR 50,000.00', 'Created On': 'Jul 15, 2025, 09:30 AM', 'Last Updated': 'Jun 02, 2026, 11:00 AM' }, about: 'Accepts StayEasy branded gift cards for customer rewards and promotions.' },
  storecredit: { subtitle: 'Store Credit Payment', details: { Type: 'Store Credit', Status: 'Offline', 'Terminal ID': '–', 'Merchant ID': '–', Provider: 'Internal', 'Settlement Period': 'Immediate', Currency: 'NPR', 'Minimum Amount': 'NPR 1.00', 'Maximum Amount': 'Based on Balance', 'Created On': 'Aug 01, 2025, 08:00 AM', 'Last Updated': 'May 30, 2026, 05:00 PM' }, about: 'Accepts store credit for customer returns and loyalty rewards. Currently offline.' },
}

const detailTabs = ['Overview', 'Fees & Charges', 'Settings']

export default function PaymentMethodsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string>('card')
  const [activeDetailTab, setActiveDetailTab] = useState('Overview')

  const selected = paymentMethods.find(m => m.id === selectedMethod) || paymentMethods[1]
  const details = methodDetails[selectedMethod] || methodDetails.card

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Payment Methods" />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total Methods', value: '10', icon: <CreditCard size={22} />, bg: '#EDE9FE', color: '#7C3AED' },
              { label: 'Active Methods', value: '8', icon: <CheckCircle size={22} />, bg: '#D1FAE5', color: '#059669' },
              { label: 'Offline Methods', value: '2', icon: <Wifi size={22} />, bg: '#FFF7ED', color: '#EA580C' },
              { label: 'Disabled Methods', value: '0', icon: <XCircle size={22} />, bg: '#FEE2E2', color: '#DC2626' },
            ].map((stat) => (
              <div key={stat.label} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 2 }}>{stat.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content: Table + Details Panel */}
          <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>
            {/* Left - Table */}
            <div style={{ flex: 1, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', marginRight: selectedMethod ? 0 : 0 }}>
              {/* Table Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 24px', borderBottom: '1px solid #E5E7EB' }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>All Payment Methods</h2>
                  <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Manage payment methods accepted in your restaurant.</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#7C3AED', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                  <Plus size={16} /> Add Method
                </button>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F9FAFB' }}>
                      {['METHOD NAME', 'TYPE', 'ACCOUNT / DETAILS', 'STATUS', 'FEES / CHARGES', 'ACTIONS'].map(h => (
                        <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paymentMethods.map((method) => (
                      <tr
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        style={{
                          cursor: 'pointer',
                          background: selectedMethod === method.id ? '#F5F3FF' : '#fff',
                          borderBottom: '1px solid #F3F4F6',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => { if (selectedMethod !== method.id) e.currentTarget.style.background = '#F9FAFB' }}
                        onMouseLeave={(e) => { if (selectedMethod !== method.id) e.currentTarget.style.background = '#fff' }}
                      >
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 8, background: method.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{method.icon}</div>
                            <span style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>{method.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ display: 'inline-block', padding: '4px 10px', fontSize: 12, fontWeight: 500, borderRadius: 6, background: method.typeColor, color: method.iconColor }}>{method.type}</span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {method.details.map((d, i) => (
                              <span key={i} style={{ fontSize: 13, color: '#6B7280' }}>{d}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            display: 'inline-block', padding: '4px 12px', fontSize: 12, fontWeight: 600, borderRadius: 20,
                            background: method.status === 'Active' ? '#D1FAE5' : '#FEF3C7',
                            color: method.status === 'Active' ? '#059669' : '#D97706',
                          }}>{method.status}</span>
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: 14, color: '#374151' }}>{method.fees}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><Pen size={14} /></button>
                            <button style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><MoreVertical size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div style={{ padding: '14px 20px', borderTop: '1px solid #E5E7EB', fontSize: 14, color: '#6B7280' }}>
                Showing 1 to 10 of 10 methods
              </div>
            </div>

            {/* Right - Details Panel */}
            {selectedMethod && (
              <div style={{ width: 400, flexShrink: 0, background: '#fff', borderLeft: '1px solid #E5E7EB', height: 'calc(100vh - 180px)', overflowY: 'auto', position: 'sticky', top: 80 }}>
                {/* Panel Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #E5E7EB' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Payment Method Details</h3>
                  <button onClick={() => setSelectedMethod('')} style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><X size={18} /></button>
                </div>

                <div style={{ padding: 24 }}>
                  {/* Method Info */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 12, background: selected.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{selected.icon}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{selected.name}</span>
                        <span style={{
                          padding: '2px 10px', fontSize: 12, fontWeight: 600, borderRadius: 20,
                          background: selected.status === 'Active' ? '#D1FAE5' : '#FEF3C7',
                          color: selected.status === 'Active' ? '#059669' : '#D97706',
                        }}>{selected.status}</span>
                      </div>
                      <div style={{ fontSize: 14, color: '#6B7280' }}>{details.subtitle}</div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E5E7EB', marginBottom: 24 }}>
                    {detailTabs.map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveDetailTab(tab)}
                        style={{
                          padding: '10px 14px', border: 'none', background: 'transparent',
                          fontSize: 14, fontWeight: 500, cursor: 'pointer',
                          color: activeDetailTab === tab ? '#7C3AED' : '#6B7280',
                          borderBottom: activeDetailTab === tab ? '2px solid #7C3AED' : '2px solid transparent',
                          marginBottom: -1,
                        }}
                      >{tab}</button>
                    ))}
                  </div>

                  {/* Detail Rows */}
                  <div style={{ marginBottom: 24 }}>
                    {Object.entries(details.details).map(([label, value]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                        <span style={{ fontSize: 14, color: '#6B7280' }}>{label}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* About */}
                  <div style={{ background: '#F9FAFB', borderRadius: 8, padding: 16, marginBottom: 24 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 8px' }}>About this method</h4>
                    <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>{details.about}</p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'transparent', fontSize: 14, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                      <Pen size={14} /> Edit Method
                    </button>
                    <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px', border: '1px solid #FCA5A5', borderRadius: 8, background: 'transparent', fontSize: 14, fontWeight: 600, color: '#DC2626', cursor: 'pointer' }}>
                      <XCircle size={14} /> Disable Method
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
