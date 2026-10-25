import { z } from "zod"

export const newBookingSchema = z
  .object({
    roomIds: z.array(z.string()).min(1, "Select at least one room"),
    checkIn: z.string().min(1, "Check-in date is required"),
    checkOut: z.string().min(1, "Check-out date is required"),
    adults: z.number().min(1, "At least 1 adult is required"),
    children: z.number().min(0),
  })
  .refine((data) => !data.checkIn || !data.checkOut || data.checkOut > data.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  })

export type NewBookingFormData = z.infer<typeof newBookingSchema>
