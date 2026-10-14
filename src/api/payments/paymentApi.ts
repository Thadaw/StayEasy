import api from "@/api/axiosInstance"

export type PaymentIntentMethod = "ADVANCE" | "ONLINE" | "PAY_ON_ARRIVAL"
export type PaymentGateway = "razorpay" | "stripe" | "khalti" | "esewa"

// The payment-intent endpoint has evolved across gateways and the backend wraps
// its payload inconsistently — sometimes flat on the body, sometimes nested under
// `data`. This permissive shape covers every field any gateway has returned and
// the call sites pick whichever variant is present.
export interface PaymentIntentResponse {
  success?: boolean
  message?: string
  detail?: string | { detail?: string }
  data?: PaymentIntentResponse
  client_secret?: string
  payment_intent_id?: string
  intent_id?: string
  pidx?: string
  id?: string
  payment_url?: string
  redirect_url?: string
  checkout_url?: string
  payment_link?: string
  form_url?: string
  form_fields?: Record<string, string>
  order_id?: string
  razorpay_order_id?: string
  amount?: number
  currency?: string
}

export interface CreatePaymentIntentInput {
  refNumber: string
  payment_method: PaymentIntentMethod
  payment_gateway?: PaymentGateway
  advance_amount?: number
  return_url?: string
}

export async function createPaymentIntent(
  input: CreatePaymentIntentInput,
): Promise<PaymentIntentResponse> {
  const { refNumber, ...body } = input
  const { data } = await api.post(`/bookings/${refNumber}/payment-intent`, body)
  return data as PaymentIntentResponse
}

export async function markPayOnArrival(refNumber: string): Promise<void> {
  await api.post(`/bookings/${refNumber}/payment-intent`, {
    payment_method: "PAY_ON_ARRIVAL",
  })
}
