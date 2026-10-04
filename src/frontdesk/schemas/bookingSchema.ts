import { z } from "zod"

export const stayDetailsSchema = z.object({
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  adults: z.number().min(1, "At least 1 adult required"),
  children: z.number().min(0),
  roomType: z.string().default("standard"),
  specialRequests: z.string().optional(),
})

export const createBookingSchema = z.object({
  stay: stayDetailsSchema,
  guest: z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\d+$/, "Phone number must contain only digits")
      .refine((val) => val.length >= 7 && val.length <= 15, "Phone number must be between 7 and 15 digits"),
    countryCode: z.string().default("+977"),
    country: z.string().min(1, "Country is required"),
  }),
  paymentMethod: z.string().min(1, "Payment method is required"),
  paymentType: z.enum(["full", "advance", "checkout"]).default("full"),
  advanceReceived: z.string().optional(),
  discount: z.string().optional(),
  selectedRooms: z.array(z.string()).min(1, "Select at least one room"),
})

export type StayDetailsFormData = z.infer<typeof stayDetailsSchema>
export type CreateBookingFormData = z.infer<typeof createBookingSchema>

export const editBookingSchema = z.object({
  guestName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  checkinDate: z.string().min(1, "Check-in date is required"),
  checkoutDate: z.string().min(1, "Check-out date is required"),
  adults: z.number().min(1, "At least 1 adult required"),
  children: z.number().min(0),
  specialRequests: z.string().optional(),
})

export type EditBookingFormData = z.infer<typeof editBookingSchema>

export const walkInBookingSchema = z.object({
  guestName: z.string().min(1, "Guest name is required"),
  phone: z.string().optional(),
  nationality: z.string().optional(),
  adults: z.number().min(1, "At least 1 adult required"),
  children: z.number().min(0),
  checkoutDate: z.string().min(1, "Check-out date is required"),
  paymentMethod: z.string().default("CASH"),
  paymentGateway: z.string().optional(),
  amountPaid: z.string().optional(),
  advanceAmount: z.string().optional(),
  couponCode: z.string().optional(),
  specialRequests: z.string().optional(),
})

export type WalkInBookingFormData = z.infer<typeof walkInBookingSchema>
