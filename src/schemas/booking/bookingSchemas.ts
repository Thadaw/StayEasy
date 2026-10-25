import { z } from "zod"

export const guestInformationSchema = z.object({
  name: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  phoneCode: z.string().min(1, "Country code is required"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .refine((val) => val.length >= 7 && val.length <= 15, "Phone number must be between 7 and 15 digits"),
  country: z.string().min(1, "Country is required"),
})

export type GuestInformationFormData = z.infer<typeof guestInformationSchema>

export const promoCodeSchema = z.object({
  code: z.string(),
})

export type PromoCodeFormData = z.infer<typeof promoCodeSchema>
