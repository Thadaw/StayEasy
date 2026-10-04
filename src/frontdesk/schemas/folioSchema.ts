import { z } from "zod"

export const addChargeSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
})

export type AddChargeFormData = z.infer<typeof addChargeSchema>

export const recordPaymentSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  paymentGateway: z.string().min(1, "Payment gateway is required"),
})

export type RecordPaymentFormData = z.infer<typeof recordPaymentSchema>

export const updateFolioSchema = z.object({
  tax: z.string().optional(),
  discount: z.string().optional(),
})

export type UpdateFolioFormData = z.infer<typeof updateFolioSchema>
