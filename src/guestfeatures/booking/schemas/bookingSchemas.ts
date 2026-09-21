import { z } from "zod"

export const guestInformationSchema = z.object({
  name: z.string().default(""),
  email: z.string().default(""),
  phoneCode: z.string().default("+977"),
  phone: z.string().default(""),
  country: z.string().default(""),
})

export type GuestInformationFormData = z.infer<typeof guestInformationSchema>

export const promoCodeSchema = z.object({
  code: z.string().default(""),
})

export type PromoCodeFormData = z.infer<typeof promoCodeSchema>
