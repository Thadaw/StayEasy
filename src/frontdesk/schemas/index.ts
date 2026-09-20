export { guestInfoSchema, guestInfoWithDocsSchema } from "./guestSchema"
export type { GuestInfoFormData, GuestInfoWithDocsFormData } from "./guestSchema"

export {
  stayDetailsSchema,
  createBookingSchema,
  editBookingSchema,
  walkInBookingSchema,
} from "./bookingSchema"
export type {
  StayDetailsFormData,
  CreateBookingFormData,
  EditBookingFormData,
  WalkInBookingFormData,
} from "./bookingSchema"

export { checkoutPaymentSchema, collectPaymentSchema } from "./paymentSchema"
export type { CheckoutPaymentFormData, CollectPaymentFormData } from "./paymentSchema"

export { changePasswordSchema, staffProfileSchema } from "./passwordSchema"
export type { ChangePasswordFormData, StaffProfileFormData } from "./passwordSchema"

export { addChargeSchema, recordPaymentSchema, updateFolioSchema } from "./folioSchema"
export type { AddChargeFormData, RecordPaymentFormData, UpdateFolioFormData } from "./folioSchema"
