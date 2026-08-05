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
  guestPhone?: string
  clientSecret?: string | null
  intentLoading?: boolean
  intentError?: string | null
  onRetry?: () => void
  onSuccess: (paymentIntentId: string, clientSecret: string, createdAt: number) => void
}
