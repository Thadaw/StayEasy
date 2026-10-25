import { z } from "zod"

export const paymentRulesSchema = z.object({
  minTransaction: z.string().min(1, 'Minimum transaction amount is required'),
  maxTransaction: z.string().min(1, 'Maximum transaction amount is required'),
  dailyLimit: z.string().min(1, 'Daily transaction limit is required'),
  currency: z.string(),
  timeout: z.string().min(1, 'Payment timeout is required'),
  autoRetry: z.boolean(),
  retryAttempts: z.string().min(1, 'Retry attempts are required when auto-retry is enabled'),
  receiptAutoGenerate: z.boolean(),
  receiptFormat: z.string(),
  requireConfirmation: z.boolean(),
})

export const refundSettingsSchema = z.object({
  allowRefunds: z.boolean(),
  refundWindow: z.string().min(1, 'Refund window is required'),
  autoRefund: z.boolean(),
  partialRefund: z.boolean(),
  cancellationFee: z.string().min(1, 'Cancellation fee is required'),
  cancellationType: z.enum(['percentage', 'flat']),
  refundProcessingTime: z.string().min(1, 'Refund processing time is required'),
  notifyGuest: z.boolean(),
  notifyAdmin: z.boolean(),
  refundMethod: z.enum(['original', 'bank', 'credit']),
  nonRefundableDeposits: z.boolean(),
  peakSeasonPolicy: z.boolean(),
})

export const invoiceSettingsSchema = z.object({
  autoGenerate: z.boolean(),
  template: z.string(),
  prefix: z.string().min(1, 'Invoice prefix is required'),
  nextNumber: z.string().min(1, 'Next invoice number is required'),
  includeTax: z.boolean(),
  taxRate: z.string().min(1, 'Tax rate is required'),
  taxLabel: z.string(),
  company_name: z.string().min(1, 'Company name is required'),
  company_address: z.string().min(1, 'Company address is required'),
  company_phone: z.string().min(1, 'Company phone is required'),
  company_email: z.string().email('Invalid company email address'),
  footerNote: z.string(),
  downloadFormat: z.string(),
  includeLogo: z.boolean(),
  showPaymentMethod: z.boolean(),
})

export type PaymentRulesFormData = z.infer<typeof paymentRulesSchema>
export type RefundSettingsFormData = z.infer<typeof refundSettingsSchema>
export type InvoiceSettingsFormData = z.infer<typeof invoiceSettingsSchema>
