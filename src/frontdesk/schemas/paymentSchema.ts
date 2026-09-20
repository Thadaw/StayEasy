import { z } from "zod"

export const checkoutPaymentSchema = z.object({
  paymentGateway: z.string().min(1, "Payment method is required"),
  discount: z.string().optional(),
  paymentAmount: z.string().min(1, "Payment amount is required"),
  roomStatus: z.string().default("needs_cleaning"),
})

export type CheckoutPaymentFormData = z.infer<typeof checkoutPaymentSchema>

export const collectPaymentSchema = z.object({
  paymentAmount: z.string().min(1, "Amount is required"),
  paymentGateway: z.string().min(1, "Payment method is required"),
  transactionId: z.string().optional(),
})

export type CollectPaymentFormData = z.infer<typeof collectPaymentSchema>
