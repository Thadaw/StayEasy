export interface StripePaymentIntentResponse {
  client_secret: string
  amount: number
  currency: string
  payment_intent_id?: string
}

export interface StripeCardFormProps {
  refNumber: string
  amount: number
  currency?: string
  guestName?: string
  guestEmail?: string
  hotelName?: string
  clientSecret?: string | null
  intentLoading?: boolean
  intentError?: string | null
  onRetry?: () => void
  paymentPlan?: "full" | "advance" | "arrival" | null
  /** Called when Stripe confirms a payment in-place (no redirect, e.g. plain card payments) */
  onPaymentIntentConfirmed?: (paymentIntentId: string) => void
}
