import { useState } from 'react'
import {
  Percent,
  CheckCircle,
  ClipboardCheck,
  FileCheck,
  Plus,
  Pen,
  MoreVertical,
  Eye,
  ChevronLeft,
  ChevronRight,
  Headphones,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Receipt,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface TaxRule {
  id: string
  name: string
  code: string
  type: 'Percentage' | 'Fixed'
  rate: string
  appliesTo: string
  status: 'Active' | 'Inactive'
}

interface Policy {
  id: string
  name: string
  category: string
  categoryColor: string
  lastUpdated: string
  status: 'Published' | 'Draft'
}

// ─── Data ────────────────────────────────────────────────────────────────────

const taxRules: TaxRule[] = [
  { id: 'vat', name: 'VAT (Value Added Tax)', code: 'VAT10', type: 'Percentage', rate: '10%', appliesTo: 'Room Charges, Restaurant, Extras', status: 'Active' },
  { id: 'service', name: 'Service Charge', code: 'SC10', type: 'Percentage', rate: '10%', appliesTo: 'Room Charges, Restaurant', status: 'Active' },
  { id: 'tourism', name: 'Tourism Tax', code: 'TT5', type: 'Percentage', rate: '5%', appliesTo: 'Room Charges', status: 'Active' },
  { id: 'government', name: 'Government Tax', code: 'GT2', type: 'Percentage', rate: '2%', appliesTo: 'Room Charges, Restaurant, Extras', status: 'Active' },
  { id: 'luxury', name: 'Luxury Tax', code: 'LX5', type: 'Percentage', rate: '5%', appliesTo: 'Room Charges', status: 'Inactive' },
  { id: 'municipal', name: 'Municipal Tax', code: 'MT1', type: 'Fixed', rate: 'NPR 50', appliesTo: 'Per Room / Per Stay', status: 'Active' },
]

const policies: Policy[] = [
  { id: 'cancellation', name: 'Cancellation Policy', category: 'Booking', categoryColor: 'var(--primary)', lastUpdated: 'May 20, 2025', status: 'Published' },
  { id: 'checkin', name: 'Check-in / Check-out Policy', category: 'Stay', categoryColor: '#059669', lastUpdated: 'May 18, 2025', status: 'Published' },
  { id: 'child', name: 'Child Policy', category: 'Guests', categoryColor: '#2563EB', lastUpdated: 'May 15, 2025', status: 'Published' },
  { id: 'pet', name: 'Pet Policy', category: 'Property', categoryColor: '#EA580C', lastUpdated: 'May 10, 2025', status: 'Published' },
  { id: 'payment', name: 'Payment Policy', category: 'Payment', categoryColor: 'var(--primary)', lastUpdated: 'May 08, 2025', status: 'Published' },
  { id: 'refund', name: 'Refund Policy', category: 'Booking', categoryColor: 'var(--primary)', lastUpdated: 'May 05, 2025', status: 'Published' },
  { id: 'noise', name: 'Noise Policy', category: 'Property', categoryColor: '#EA580C', lastUpdated: 'May 01, 2025', status: 'Published' },
  { id: 'smoking', name: 'Smoking Policy', category: 'Property', categoryColor: '#EA580C', lastUpdated: 'Apr 28, 2025', status: 'Draft' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function TaxesSettingsTab() {
  const [activeSubTab, setActiveSubTab] = useState<'Taxes' | 'Policies'>('Taxes')
  const [showPoliciesDuringBooking, setShowPoliciesDuringBooking] = useState(true)
  const [requirePolicyAcceptance, setRequirePolicyAcceptance] = useState(true)

  const activeTaxes = taxRules.filter(t => t.status === 'Active').length
  const inactiveTaxes = taxRules.filter(t => t.status === 'Inactive').length
  const publishedPolicies = policies.filter(p => p.status === 'Published').length

  // Donut chart values
  const activePercent = Math.round((activeTaxes / taxRules.length) * 100)
  const inactivePercent = 100 - activePercent

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* Left - Main Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Sub-tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #E5E7EB', marginBottom: 24 }}>
          {(['Taxes', 'Policies'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: 'transparent',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                color: activeSubTab === tab ? 'var(--primary)' : '#6B7280',
                borderBottom: activeSubTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                marginBottom: -2,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Taxes', sub: 'Tax rules created', value: '6', icon: <Percent size={22} />, bg: '#EDE9FE', color: 'var(--primary)' },
            { label: 'Active Taxes', sub: 'Currently active', value: '5', icon: <CheckCircle size={22} />, bg: '#D1FAE5', color: '#059669' },
            { label: 'Total Policies', sub: 'Policies created', value: '8', icon: <ClipboardCheck size={22} />, bg: '#EDE9FE', color: 'var(--primary)' },
            { label: 'Published Policies', sub: 'Currently published', value: '8', icon: <FileCheck size={22} />, bg: '#D1FAE5', color: '#059669' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tax Rules Table */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 24px', borderBottom: '1px solid #E5E7EB' }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Tax Rules</h2>
              <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Create and manage taxes that will be applied to bookings, rooms and other charges.</p>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--primary)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
              <Plus size={16} /> Add Tax Rule
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['TAX NAME', 'CODE', 'TYPE', 'RATE', 'APPLIES TO', 'STATUS', 'ACTIONS'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {taxRules.map(tax => (
                  <tr key={tax.id} style={{ borderBottom: '1px solid #F3F4F6' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#111827', fontSize: 14 }}>{tax.name}</td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: '#374151', fontFamily: 'monospace' }}>{tax.code}</td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: '#374151' }}>{tax.type}</td>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#111827' }}>{tax.rate}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#6B7280', maxWidth: 200 }}>{tax.appliesTo}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-block', padding: '4px 12px', fontSize: 12, fontWeight: 600, borderRadius: 20,
                        background: tax.status === 'Active' ? '#D1FAE5' : '#FEE2E2',
                        color: tax.status === 'Active' ? '#059669' : '#DC2626',
                      }}>{tax.status}</span>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: 13, color: '#6B7280' }}>Showing 1 to 6 of 6 entries</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><ChevronLeft size={14} /></button>
              <button style={{ width: 32, height: 32, border: '1px solid var(--primary)', borderRadius: 6, background: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>1</button>
              <button style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>

        {/* Policies Table */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 24px', borderBottom: '1px solid #E5E7EB' }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Policies</h2>
              <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Manage hotel policies and rules that are shown to guests during booking.</p>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--primary)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
              <Plus size={16} /> Add Policy
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['POLICY NAME', 'CATEGORY', 'LAST UPDATED', 'STATUS', 'ACTIONS'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {policies.slice(0, 5).map(policy => (
                  <tr key={policy.id} style={{ borderBottom: '1px solid #F3F4F6' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#111827', fontSize: 14 }}>{policy.name}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-block', padding: '4px 10px', fontSize: 12, fontWeight: 600, borderRadius: 6,
                        background: policy.categoryColor + '15',
                        color: policy.categoryColor,
                      }}>{policy.category}</span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: '#6B7280' }}>{policy.lastUpdated}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-block', padding: '4px 12px', fontSize: 12, fontWeight: 600, borderRadius: 20,
                        background: policy.status === 'Published' ? '#D1FAE5' : '#FEF3C7',
                        color: policy.status === 'Published' ? '#059669' : '#D97706',
                      }}>{policy.status}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <button style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><Eye size={14} /></button>
                        <button style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><Pen size={14} /></button>
                        <button style={{ width: 32, height: 32, border: 'none', borderRadius: 6, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><MoreVertical size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: 13, color: '#6B7280' }}>Showing 1 to 5 of 8 entries</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><ChevronLeft size={14} /></button>
              <button style={{ width: 32, height: 32, border: '1px solid var(--primary)', borderRadius: 6, background: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>1</button>
              <button style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', fontWeight: 500 }}>2</button>
              <button style={{ width: 32, height: 32, border: '1px solid #E5E7EB', borderRadius: 6, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div style={{ width: 300, flexShrink: 0 }}>
        {/* Tax Overview */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 20px' }}>Tax Overview</h3>
          {/* Donut Chart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 0 }}>
            <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#FEE2E2" strokeWidth="16" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#059669" strokeWidth="16"
                  strokeDasharray={`${(activePercent / 100) * 314.16} 314.16`}
                  strokeDashoffset="0"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>6</span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>Total</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#059669' }} />
                <span style={{ fontSize: 13, color: '#374151' }}>Active</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginLeft: 'auto' }}>{activeTaxes} ({activePercent}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#DC2626' }} />
                <span style={{ fontSize: 13, color: '#374151' }}>Inactive</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginLeft: 'auto' }}>{inactiveTaxes} ({inactivePercent}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Calculation Example */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Tax Calculation Example</h3>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px' }}>Example for a room charge of NPR 10,000</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#374151' }}>Room Charge</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>NPR 10,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#374151' }}>VAT (10%)</span>
              <span style={{ color: '#059669' }}>+ NPR 1,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#374151' }}>Service Charge (10%)</span>
              <span style={{ color: '#059669' }}>+ NPR 1,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#374151' }}>Tourism Tax (5%)</span>
              <span style={{ color: '#059669' }}>+ NPR 500</span>
            </div>
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#374151' }}>Total Tax</span>
              <span style={{ fontWeight: 600, color: '#111827' }}>NPR 2,500</span>
            </div>
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
              <span style={{ fontWeight: 700, color: '#111827' }}>Grand Total</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 16 }}>NPR 12,500</span>
            </div>
          </div>
        </div>

        {/* Policy Settings */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Policy Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Show policies during booking</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>Display policies to guests during booking process</div>
              </div>
              <button onClick={() => setShowPoliciesDuringBooking(!showPoliciesDuringBooking)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: showPoliciesDuringBooking ? 'var(--primary)' : '#D1D5DB', flexShrink: 0, marginTop: 2 }}>
                {showPoliciesDuringBooking ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Require policy acceptance</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>Guests must accept policies to confirm booking</div>
              </div>
              <button onClick={() => setRequirePolicyAcceptance(!requirePolicyAcceptance)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: requirePolicyAcceptance ? 'var(--primary)' : '#D1D5DB', flexShrink: 0, marginTop: 2 }}>
                {requirePolicyAcceptance ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Headphones size={18} color="var(--primary)" />
            <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Need Help?</span>
          </div>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 14px', lineHeight: 1.5 }}>Learn more about taxes, policies and how they are applied.</p>
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
            View Documentation <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
