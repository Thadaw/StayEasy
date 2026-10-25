import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useUIStore } from '@/store/ui/uiStore'
import {
  paymentRulesSchema,
  refundSettingsSchema,
  invoiceSettingsSchema,
  type PaymentRulesFormData,
  type RefundSettingsFormData,
  type InvoiceSettingsFormData,
} from '@/schemas/admin/paymentSettingsSchema'
import { usePaymentSettingsStore } from '@/store/admin/paymentSettingsStore'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import {
  CreditCard,
  CheckCircle,
  PauseCircle,
  ShieldCheck,
  Plus,
  Pen,
  MoreVertical,
  Lightbulb,
  Headphones,
  ExternalLink,
  Save,
  Zap,
  Clock,
  FileText,
  Receipt,
  Percent,
  ToggleLeft,
  ToggleRight,
  Ban,
  RotateCcw,
  Settings,
  Hash,
  Building2,
  Download,
  AlertTriangle,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface PaymentMethod {
  id: string
  name: string
  type: string
  status: 'Active' | 'Inactive'
  online: 'Connected' | 'Not Connected' | null
  icon: string
  iconBg: string
  iconColor: string
  description: string
  fee: string
  minAmount: string
  maxAmount: string
}

// ─── Payment Methods Data ────────────────────────────────────────────────────

const paymentMethods: PaymentMethod[] = [
  { id: 'cash', name: 'Cash', type: 'Offline', status: 'Active', online: null, icon: '💵', iconBg: '#D1FAE5', iconColor: '#059669', description: 'Accept cash payments directly at the front desk.', fee: '0%', minAmount: 'NPR 1.00', maxAmount: 'No Limit' },
  { id: 'khalti', name: 'Khalti', type: 'Online Wallet', status: 'Active', online: 'Connected', icon: '𝗞', iconBg: '#EDE9FE', iconColor: 'var(--primary)', description: 'Receive payments securely through Khalti wallet.', fee: '2.00%', minAmount: 'NPR 1.00', maxAmount: 'NPR 50,000.00' },
  { id: 'esewa', name: 'eSewa', type: 'Online Wallet', status: 'Active', online: 'Connected', icon: '𝗘', iconBg: '#D1FAE5', iconColor: '#059669', description: 'Accept eSewa digital wallet payments.', fee: '1.50%', minAmount: 'NPR 1.00', maxAmount: 'NPR 100,000.00' },
  { id: 'fonepay', name: 'Fonepay', type: 'Payment Gateway', status: 'Active', online: 'Connected', icon: '𝗙', iconBg: '#FEE2E2', iconColor: '#DC2626', description: 'Accept Fonepay payment gateway transactions.', fee: '1.50%', minAmount: 'NPR 1.00', maxAmount: 'NPR 100,000.00' },
  { id: 'card', name: 'Credit / Debit Card', type: 'Card', status: 'Active', online: 'Connected', icon: '𝗩', iconBg: '#DBEAFE', iconColor: '#2563EB', description: 'Accept Visa, MasterCard and other major cards.', fee: '2.50%', minAmount: 'NPR 100.00', maxAmount: 'NPR 500,000.00' },
  { id: 'banktransfer', name: 'Bank Transfer', type: 'Offline', status: 'Active', online: null, icon: '🏛️', iconBg: '#DBEAFE', iconColor: '#2563EB', description: 'Accept direct bank transfers to your account.', fee: '0%', minAmount: 'NPR 100.00', maxAmount: 'No Limit' },
  { id: 'paypal', name: 'PayPal', type: 'Payment Gateway', status: 'Inactive', online: 'Not Connected', icon: '𝗣', iconBg: '#EDE9FE', iconColor: 'var(--primary)', description: 'Accept PayPal payments internationally.', fee: '3.50%', minAmount: 'NPR 100.00', maxAmount: 'NPR 200,000.00' },
  { id: 'stripe', name: 'Stripe', type: 'Payment Gateway', status: 'Inactive', online: 'Not Connected', icon: '𝗦', iconBg: '#EDE9FE', iconColor: 'var(--primary)', description: 'Accept card payments via Stripe gateway.', fee: '2.90% + NPR 30', minAmount: 'NPR 50.00', maxAmount: 'NPR 1,000,000.00' },
]

// ─── Tab Definitions ─────────────────────────────────────────────────────────

const tabs = ['Payment Methods', 'Payment Rules', 'Refund Settings', 'Invoice Settings'] as const

// ─── Component ───────────────────────────────────────────────────────────────

export default function PaymentMethodsPage() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const activeTab = usePaymentSettingsStore((s) => s.activeTab)
  const setActiveTab = usePaymentSettingsStore((s) => s.setActiveTab)
  const selectedMethod = usePaymentSettingsStore((s) => s.selectedMethod)
  const setSelectedMethod = usePaymentSettingsStore((s) => s.setSelectedMethod)
  const storedRules = usePaymentSettingsStore((s) => s.rules)
  const storedRefundSettings = usePaymentSettingsStore((s) => s.refundSettings)
  const storedInvoiceSettings = usePaymentSettingsStore((s) => s.invoiceSettings)
  const setRules = usePaymentSettingsStore((s) => s.setRules)
  const setRefundSettings = usePaymentSettingsStore((s) => s.setRefundSettings)
  const setInvoiceSettings = usePaymentSettingsStore((s) => s.setInvoiceSettings)

  const {
    register: registerRule,
    handleSubmit: submitRule,
    watch: watchRule,
    setValue: setRuleValue,
  } = useForm<PaymentRulesFormData>({
    resolver: zodResolver(paymentRulesSchema),
    defaultValues: storedRules,
  })

  const {
    register: registerRefund,
    handleSubmit: submitRefund,
    watch: watchRefund,
    setValue: setRefundValue,
  } = useForm<RefundSettingsFormData>({
    resolver: zodResolver(refundSettingsSchema),
    defaultValues: storedRefundSettings,
  })

  const {
    register: registerInvoice,
    handleSubmit: submitInvoice,
    watch: watchInvoice,
    setValue: setInvoiceValue,
  } = useForm<InvoiceSettingsFormData>({
    resolver: zodResolver(invoiceSettingsSchema),
    defaultValues: storedInvoiceSettings,
  })

  const rules = watchRule()
  const refundSettings = watchRefund()
  const invoiceSettings = watchInvoice()

  const onSaveRules = (data: PaymentRulesFormData) => {
    setRules(data)
    toast.success('Payment rules saved successfully')
  }

  const onSaveRefundSettings = (data: RefundSettingsFormData) => {
    setRefundSettings(data)
    toast.success('Refund settings saved successfully')
  }

  const onSaveInvoiceSettings = (data: InvoiceSettingsFormData) => {
    setInvoiceSettings(data)
    toast.success('Invoice settings saved successfully')
  }

  const selected = paymentMethods.find(m => m.id === selectedMethod) || paymentMethods[1]

  // ─── Stats ───────────────────────────────────────────────────────────────

  const stats = [
    { label: 'Total Methods', sublabel: 'Configured', value: '8', icon: <CreditCard size={22} />, bg: '#EDE9FE', color: 'var(--primary)' },
    { label: 'Active Methods', sublabel: 'Currently enabled', value: '6', icon: <CheckCircle size={22} />, bg: '#D1FAE5', color: '#059669' },
    { label: 'Inactive Methods', sublabel: 'Currently disabled', value: '2', icon: <PauseCircle size={22} />, bg: '#FFF7ED', color: '#EA580C' },
    { label: 'Secure Transactions', sublabel: 'SSL Encrypted', value: '100%', icon: <ShieldCheck size={22} />, bg: '#DBEAFE', color: '#2563EB' },
  ]

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title="Payments" subtitle="Configure payment methods, rules and preferences for your property." />
        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{s.sublabel}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Bar */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #E5E7EB', marginBottom: 24 }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 20px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: activeTab === tab ? 'var(--primary)' : '#6B7280',
                  borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: -2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  whiteSpace: 'nowrap',
                }}
              >
                {tab === 'Payment Methods' && <CreditCard size={16} />}
                {tab === 'Payment Rules' && <Settings size={16} />}
                {tab === 'Refund Settings' && <RotateCcw size={16} />}
                {tab === 'Invoice Settings' && <FileText size={16} />}
                {tab}
              </button>
            ))}
          </div>

          {/* ─── TAB: Payment Methods ─────────────────────────────────────── */}
          {activeTab === 'Payment Methods' && (
            <>
              {/* Main: Table + Panel */}
              <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>
                {/* Table */}
                <div style={{ flex: 1, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
                  {/* Table Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 24px', borderBottom: '1px solid #E5E7EB' }}>
                    <div>
                      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Payment Methods</h2>
                      <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Enable or disable payment methods available for guests.</p>
                    </div>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--primary)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                      <Plus size={16} /> Add Payment Method
                    </button>
                  </div>

                  {/* Table */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#F9FAFB' }}>
                          {['METHOD', 'TYPE', 'STATUS', 'ONLINE', 'ACTIONS'].map(h => (
                            <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paymentMethods.map(method => (
                          <tr
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            style={{
                              cursor: 'pointer',
                              background: selectedMethod === method.id ? '#F5F3FF' : '#fff',
                              borderBottom: '1px solid #F3F4F6',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { if (selectedMethod !== method.id) e.currentTarget.style.background = '#F9FAFB' }}
                            onMouseLeave={e => { if (selectedMethod !== method.id) e.currentTarget.style.background = selectedMethod === method.id ? '#F5F3FF' : '#fff' }}
                          >
                            <td style={{ padding: '14px 20px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: method.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: method.iconColor }}>{method.icon}</div>
                                <span style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>{method.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '14px 20px', fontSize: 14, color: '#374151' }}>{method.type}</td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{
                                display: 'inline-block', padding: '4px 12px', fontSize: 12, fontWeight: 600, borderRadius: 20,
                                background: method.status === 'Active' ? '#D1FAE5' : '#FEE2E2',
                                color: method.status === 'Active' ? '#059669' : '#DC2626',
                              }}>{method.status}</span>
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              {method.online === 'Connected' ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#059669' }}>
                                  <CheckCircle size={14} /> Connected
                                </div>
                              ) : method.online === 'Not Connected' ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#DC2626' }}>
                                  <Ban size={14} /> Not Connected
                                </div>
                              ) : (
                                <span style={{ color: '#9CA3AF', fontSize: 13 }}>–</span>
                              )}
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
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
                  <div style={{ padding: '14px 20px', borderTop: '1px solid #E5E7EB', fontSize: 13, color: '#6B7280' }}>
                    Showing 1 to 8 of 8 entries
                  </div>
                </div>

                {/* Right Panel */}
                <div style={{ width: 340, flexShrink: 0, marginLeft: 24, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Selected Method</h3>
                  </div>

                  <div style={{ padding: 24 }}>
                    {/* Method Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: selected.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: selected.iconColor, flexShrink: 0 }}>{selected.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{selected.name}</span>
                          <span style={{
                            padding: '2px 10px', fontSize: 11, fontWeight: 600, borderRadius: 20,
                            background: selected.status === 'Active' ? '#D1FAE5' : '#FEE2E2',
                            color: selected.status === 'Active' ? '#059669' : '#DC2626',
                          }}>{selected.status}</span>
                        </div>
                        <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{selected.description}</p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>Type</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{selected.type}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>Fee</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{selected.fee}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>Minimum Amount</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{selected.minAmount}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>Maximum Amount</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{selected.maxAmount}</div>
                      </div>
                    </div>

                    {/* Status + Test Connection */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, padding: '12px 16px', background: '#F9FAFB', borderRadius: 8 }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>Status</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: selected.online === 'Connected' ? '#059669' : selected.online === 'Not Connected' ? '#DC2626' : '#6B7280' }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: selected.online === 'Connected' ? '#059669' : selected.online === 'Not Connected' ? '#DC2626' : '#9CA3AF' }} />
                          {selected.online || 'Offline'}
                        </div>
                      </div>
                      {selected.online && (
                        <button style={{ padding: '6px 14px', border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                          Test Connection
                        </button>
                      )}
                    </div>

                    {/* Edit Button */}
                    <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px', border: 'none', borderRadius: 8, background: 'var(--primary)', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer', marginBottom: 24 }}>
                      <Pen size={14} /> Edit Method
                    </button>

                    {/* Tips */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <Lightbulb size={16} color="#D97706" />
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Tips</span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#6B7280', lineHeight: 1.8 }}>
                        <li>Enable only the payment methods you want to accept from guests.</li>
                        <li>Set custom transaction limits and fees if required.</li>
                        <li>Test the connection after making changes.</li>
                      </ul>
                    </div>

                    {/* Need Help */}
                    <div style={{ padding: 16, background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Headphones size={16} color="var(--primary)" />
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Need Help?</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 12px', lineHeight: 1.5 }}>Learn more about payment methods and configuration.</p>
                      <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                        View Documentation <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ─── TAB: Payment Rules ──────────────────────────────────────── */}
          {activeTab === 'Payment Rules' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'flex-start' }}>
              {/* Transaction Limits */}
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EDE9FE', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Hash size={18} /></div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Transaction Limits</h3>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Set minimum and maximum transaction amounts</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Minimum Transaction Amount (NPR)</label>
                    <input {...registerRule('minTransaction')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Maximum Transaction Amount (NPR)</label>
                    <input {...registerRule('maxTransaction')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Daily Transaction Limit (NPR)</label>
                    <input {...registerRule('dailyLimit')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Currency</label>
                    <select {...registerRule('currency')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none', background: '#fff' }}>
                      <option>NPR</option>
                      <option>USD</option>
                      <option>EUR</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Processing & Timeouts */}
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={18} /></div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Processing & Timeouts</h3>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Configure payment processing behavior</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Payment Timeout (minutes)</label>
                    <input {...registerRule('timeout')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Auto-Retry Failed Payments</div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>Automatically retry if a payment fails</div>
                    </div>
                    <button onClick={() => setRuleValue('autoRetry', !rules.autoRetry)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: rules.autoRetry ? 'var(--primary)' : '#D1D5DB' }}>
                      {rules.autoRetry ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                  {rules.autoRetry && (
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Retry Attempts</label>
                      <input {...registerRule('retryAttempts')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Require Payment Confirmation</div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>Require manual confirmation for each payment</div>
                    </div>
                    <button onClick={() => setRuleValue('requireConfirmation', !rules.requireConfirmation)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: rules.requireConfirmation ? 'var(--primary)' : '#D1D5DB' }}>
                      {rules.requireConfirmation ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Receipt Settings */}
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24, gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Receipt size={18} /></div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Receipt Settings</h3>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Configure automatic receipt generation</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F9FAFB', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Auto-Generate Receipts</div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>Send receipts automatically after payment</div>
                    </div>
                    <button onClick={() => setRuleValue('receiptAutoGenerate', !rules.receiptAutoGenerate)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: rules.receiptAutoGenerate ? 'var(--primary)' : '#D1D5DB' }}>
                      {rules.receiptAutoGenerate ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Receipt Format</label>
                    <select {...registerRule('receiptFormat')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none', background: '#fff' }}>
                      <option>PDF</option>
                      <option>Email</option>
                      <option>Both</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Save */}
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={submitRule(onSaveRules)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: 'var(--primary)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                  <Save size={16} /> Save Rules
                </button>
              </div>
            </div>
          )}

          {/* ─── TAB: Refund Settings ────────────────────────────────────── */}
          {activeTab === 'Refund Settings' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'flex-start' }}>
              {/* Refund Policy */}
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EDE9FE', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RotateCcw size={18} /></div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Refund Policy</h3>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Configure refund rules and eligibility</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Allow Refunds</div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>Enable refund processing for bookings</div>
                    </div>
                    <button onClick={() => setRefundValue('allowRefunds', !refundSettings.allowRefunds)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: refundSettings.allowRefunds ? 'var(--primary)' : '#D1D5DB' }}>
                      {refundSettings.allowRefunds ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Refund Window (hours before check-in)</label>
                    <input {...registerRefund('refundWindow')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Allow Partial Refunds</div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>Enable partial refund for multi-night bookings</div>
                    </div>
                    <button onClick={() => setRefundValue('partialRefund', !refundSettings.partialRefund)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: refundSettings.partialRefund ? 'var(--primary)' : '#D1D5DB' }}>
                      {refundSettings.partialRefund ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Cancellation Fees */}
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertTriangle size={18} /></div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Cancellation Fees</h3>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Set cancellation fee rules</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Fee Amount</label>
                      <input {...registerRefund('cancellationFee')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Fee Type</label>
                      <select {...registerRefund('cancellationType')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none', background: '#fff' }}>
                        <option value="percentage">Percentage (%)</option>
                        <option value="flat">Flat Amount (NPR)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Refund Processing Time (business days)</label>
                    <input {...registerRefund('refundProcessingTime')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Refund Method</label>
                    <select {...registerRefund('refundMethod')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none', background: '#fff' }}>
                      <option value="original">Original Payment Method</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="credit">Store Credit</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24, gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={18} /></div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Refund Notifications</h3>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Configure who gets notified about refunds</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F9FAFB', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Notify Guest</div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>Send email on refund processed</div>
                    </div>
                    <button onClick={() => setRefundValue('notifyGuest', !refundSettings.notifyGuest)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: refundSettings.notifyGuest ? 'var(--primary)' : '#D1D5DB' }}>
                      {refundSettings.notifyGuest ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F9FAFB', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Notify Admin</div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>Send alert on refund request</div>
                    </div>
                    <button onClick={() => setRefundValue('notifyAdmin', !refundSettings.notifyAdmin)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: refundSettings.notifyAdmin ? 'var(--primary)' : '#D1D5DB' }}>
                      {refundSettings.notifyAdmin ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F9FAFB', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Peak Season Policy</div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>Stricter rules during peak season</div>
                    </div>
                    <button onClick={() => setRefundValue('peakSeasonPolicy', !refundSettings.peakSeasonPolicy)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: refundSettings.peakSeasonPolicy ? 'var(--primary)' : '#D1D5DB' }}>
                      {refundSettings.peakSeasonPolicy ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Save */}
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={submitRefund(onSaveRefundSettings)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: 'var(--primary)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                  <Save size={16} /> Save Refund Settings
                </button>
              </div>
            </div>
          )}

          {/* ─── TAB: Invoice Settings ───────────────────────────────────── */}
          {activeTab === 'Invoice Settings' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'flex-start' }}>
              {/* Invoice Format */}
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EDE9FE', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={18} /></div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Invoice Format</h3>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Configure invoice generation and numbering</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Auto-Generate Invoices</div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>Create invoices automatically after checkout</div>
                    </div>
                    <button onClick={() => setInvoiceValue('autoGenerate', !invoiceSettings.autoGenerate)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: invoiceSettings.autoGenerate ? 'var(--primary)' : '#D1D5DB' }}>
                      {invoiceSettings.autoGenerate ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Invoice Prefix</label>
                      <input {...registerInvoice('prefix')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Next Invoice Number</label>
                      <input {...registerInvoice('nextNumber')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Invoice Template</label>
                    <select {...registerInvoice('template')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none', background: '#fff' }}>
                      <option value="standard">Standard</option>
                      <option value="minimal">Minimal</option>
                      <option value="detailed">Detailed</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Download Format</label>
                    <select {...registerInvoice('downloadFormat')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none', background: '#fff' }}>
                      <option>PDF</option>
                      <option>HTML</option>
                      <option>Both</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tax Settings */}
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Percent size={18} /></div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Tax Settings</h3>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Configure tax calculation on invoices</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Include Tax on Invoice</div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>Show tax breakdown on invoices</div>
                    </div>
                    <button onClick={() => setInvoiceValue('includeTax', !invoiceSettings.includeTax)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: invoiceSettings.includeTax ? 'var(--primary)' : '#D1D5DB' }}>
                      {invoiceSettings.includeTax ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Tax Rate (%)</label>
                      <input {...registerInvoice('taxRate')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Tax Label</label>
                      <input {...registerInvoice('taxLabel')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Include Logo</div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>Show property logo on invoices</div>
                    </div>
                    <button onClick={() => setInvoiceValue('includeLogo', !invoiceSettings.includeLogo)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: invoiceSettings.includeLogo ? 'var(--primary)' : '#D1D5DB' }}>
                      {invoiceSettings.includeLogo ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Show Payment Method</div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>Display payment method used on invoice</div>
                    </div>
                    <button onClick={() => setInvoiceValue('showPaymentMethod', !invoiceSettings.showPaymentMethod)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: invoiceSettings.showPaymentMethod ? 'var(--primary)' : '#D1D5DB' }}>
                      {invoiceSettings.showPaymentMethod ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={18} /></div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Company Details</h3>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Information shown on invoices</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Company Name</label>
                    <input {...registerInvoice('company_name')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Address</label>
                    <input {...registerInvoice('company_address')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Phone</label>
                      <input {...registerInvoice('company_phone')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
                      <input {...registerInvoice('company_email')} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Footer */}
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Download size={18} /></div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Invoice Footer</h3>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Custom footer text for invoices</p>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Footer Note</label>
                  <textarea {...registerInvoice('footerNote')} rows={4} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
                </div>
              </div>

              {/* Save */}
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={submitInvoice(onSaveInvoiceSettings)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: 'var(--primary)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
                  <Save size={16} /> Save Invoice Settings
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
