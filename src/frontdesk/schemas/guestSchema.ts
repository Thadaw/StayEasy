import { z } from "zod"

export const guestInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  countryCode: z.string().default("+977"),
  country: z.string().min(1, "Country is required"),
})

export type GuestInfoFormData = z.infer<typeof guestInfoSchema>

export const guestInfoWithDocsSchema = guestInfoSchema.extend({
  verificationDocFront: z.instanceof(File).nullable().optional(),
  verificationDocBack: z.instanceof(File).nullable().optional(),
})

export type GuestInfoWithDocsFormData = z.infer<typeof guestInfoWithDocsSchema>
