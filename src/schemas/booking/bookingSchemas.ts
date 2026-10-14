import { z } from "zod"

export const guestInformationSchema = z.object({
  name: z.string(),
  email: z.string(),
  phoneCode: z.string(),
  phone: z.string(),
  country: z.string(),
})

export type GuestInformationFormData = z.infer<typeof guestInformationSchema>

export const promoCodeSchema = z.object({
  code: z.string(),
})

export type PromoCodeFormData = z.infer<typeof promoCodeSchema>
