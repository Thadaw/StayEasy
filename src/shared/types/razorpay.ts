export interface RazorpayOrderResponse {
  orderId: string
  amount: number
  currency: string
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export interface RazorpayCheckoutOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id?: string
  handler: (response: RazorpayPaymentResponse) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
    vpa?: string
    bank?: string
  }
  theme?: {
    color?: string
  }
  modal?: {
    ondismiss?: () => void
  }
  config?: {
    display?: {
      blocks?: Record<string, {
        name?: string
        instruments?: Array<{ method: string }>
      }>
      sequence?: string[]
      preferences?: {
        show_default_blocks?: boolean
      }
    }
  }
}

export interface RazorpayPayOptions {
  type: 'upi' | 'card' | 'netbanking'
  upiId?: string
  bank?: string
}

export interface RazorpayFailureResponse {
  error: {
    code: string
    description: string
    source: string
    step: string
    reason: string
    metadata?: {
      order_id?: string
      payment_id?: string
    }
  }
}

export interface HostBankDetails {
  accountHolderName: string
  accountNumber: string
  ifscCode: string
  bankName: string
  upiId?: string
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayCheckoutOptions) => { open: () => void }
  }
}
