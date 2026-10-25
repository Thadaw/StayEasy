import { create } from 'zustand'

export interface PaymentRulesFormData {
  minTransaction: string
  maxTransaction: string
  dailyLimit: string
  currency: string
  timeout: string
  autoRetry: boolean
  retryAttempts: string
  receiptAutoGenerate: boolean
  receiptFormat: string
  requireConfirmation: boolean
}

export interface RefundSettingsFormData {
  allowRefunds: boolean
  refundWindow: string
  autoRefund: boolean
  partialRefund: boolean
  cancellationFee: string
  cancellationType: 'percentage' | 'flat'
  refundProcessingTime: string
  notifyGuest: boolean
  notifyAdmin: boolean
  refundMethod: 'original' | 'bank' | 'credit'
  nonRefundableDeposits: boolean
  peakSeasonPolicy: boolean
}

export interface InvoiceSettingsFormData {
  autoGenerate: boolean
  template: string
  prefix: string
  nextNumber: string
  includeTax: boolean
  taxRate: string
  taxLabel: string
  company_name: string
  company_address: string
  company_phone: string
  company_email: string
  footerNote: string
  downloadFormat: string
  includeLogo: boolean
  showPaymentMethod: boolean
}

interface PaymentSettingsState {
  activeTab: string
  selectedMethod: string
  rules: PaymentRulesFormData
  refundSettings: RefundSettingsFormData
  invoiceSettings: InvoiceSettingsFormData

  setActiveTab: (tab: string) => void
  setSelectedMethod: (id: string) => void
  setRules: (values: Partial<PaymentRulesFormData>) => void
  setRefundSettings: (values: Partial<RefundSettingsFormData>) => void
  setInvoiceSettings: (values: Partial<InvoiceSettingsFormData>) => void
  resetToDefaults: () => void
}

const defaultRules: PaymentRulesFormData = {
  minTransaction: '100',
  maxTransaction: '500000',
  dailyLimit: '2000000',
  currency: 'NPR',
  timeout: '15',
  autoRetry: true,
  retryAttempts: '3',
  receiptAutoGenerate: true,
  receiptFormat: 'PDF',
  requireConfirmation: false,
}

const defaultRefundSettings: RefundSettingsFormData = {
  allowRefunds: true,
  refundWindow: '48',
  autoRefund: false,
  partialRefund: true,
  cancellationFee: '10',
  cancellationType: 'percentage',
  refundProcessingTime: '5-7',
  notifyGuest: true,
  notifyAdmin: true,
  refundMethod: 'original',
  nonRefundableDeposits: false,
  peakSeasonPolicy: true,
}

const defaultInvoiceSettings: InvoiceSettingsFormData = {
  autoGenerate: true,
  template: 'standard',
  prefix: 'INV',
  nextNumber: '1001',
  includeTax: true,
  taxRate: '13',
  taxLabel: 'VAT',
  company_name: 'ServeIQ Hotel',
  company_address: 'Lazimpat, Kathmandu, Nepal',
  company_phone: '+977 1 4567890',
  company_email: 'billing@serveiq.com',
  footerNote: 'Thank you for staying with us!',
  downloadFormat: 'PDF',
  includeLogo: true,
  showPaymentMethod: true,
}

export const usePaymentSettingsStore = create<PaymentSettingsState>((set) => ({
  activeTab: 'Payment Methods',
  selectedMethod: 'khalti',
  rules: defaultRules,
  refundSettings: defaultRefundSettings,
  invoiceSettings: defaultInvoiceSettings,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedMethod: (id) => set({ selectedMethod: id }),
  setRules: (values) => set((s) => ({ rules: { ...s.rules, ...values } })),
  setRefundSettings: (values) => set((s) => ({ refundSettings: { ...s.refundSettings, ...values } })),
  setInvoiceSettings: (values) => set((s) => ({ invoiceSettings: { ...s.invoiceSettings, ...values } })),
  resetToDefaults: () => set({ rules: defaultRules, refundSettings: defaultRefundSettings, invoiceSettings: defaultInvoiceSettings }),
}))
