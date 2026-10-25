import { z } from "zod"

export const portalPropertyStepSchema = z.object({
  name: z.string().refine((v) => v.trim().length >= 1, "Property name is required before continuing."),
  phone: z.string().refine((v) => v.replace(/\D/g, "").length === 10, "Phone number must be exactly 10 digits."),
  email: z.string().refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), "A valid email address is required."),
  type: z.string().min(1, "Please select a property type."),
  totalRooms: z.number().min(1, "Total rooms must be at least 1."),
})

export const portalLocationStepSchema = z.object({
  country: z.string().refine((v) => v.trim().length >= 2, "Country must be at least 2 characters before continuing."),
  state: z.string().refine((v) => v.trim().length >= 2, "State/Province must be at least 2 characters before continuing."),
  city: z.string().refine((v) => v.trim().length >= 2, "City must be at least 2 characters before continuing."),
  zip: z.string().refine((v) => v.trim().length >= 2, "ZIP/Postal Code must be at least 2 characters before continuing."),
  street: z.string().refine((v) => v.trim().length >= 2, "Street Address must be at least 2 characters before continuing."),
})

export const portalLocalizationStepSchema = z
  .object({
    allowAlwaysCheckIn: z.boolean(),
    checkInTime: z.string(),
    checkOutTime: z.string(),
  })
  .refine((d) => d.allowAlwaysCheckIn || d.checkInTime.trim().length >= 2, {
    message: "Check-in Time must be at least 2 characters before continuing.",
    path: ["checkInTime"],
  })
  .refine((d) => d.allowAlwaysCheckIn || d.checkOutTime.trim().length >= 2, {
    message: "Check-out Time must be at least 2 characters before continuing.",
    path: ["checkOutTime"],
  })

export const portalRoomsBasicSchema = z
  .object({
    rooms: z.array(z.object({ name: z.string() }).passthrough()),
  })
  .refine((d) => d.rooms.length > 0, {
    message: "At least one room is required before continuing.",
    path: ["rooms"],
  })
  .refine((d) => !d.rooms.some((r) => !r.name.trim()), {
    message: "All rooms must have a name before continuing.",
    path: ["rooms"],
  })

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const portalRoomsTypeSchema = z
  .object({
    rooms: z.array(z.object({ name: z.string(), type: z.string(), bedType: z.string() }).passthrough()),
  })
  .superRefine((d, ctx) => {
    const missingType = d.rooms.find((r) => !UUID_RE.test(r.type))
    if (missingType) {
      ctx.addIssue({
        code: "custom",
        path: ["rooms"],
        message: `Room "${missingType.name || "Unnamed"}" must have a valid room type selected before continuing.`,
      })
      return
    }
    const missingBedType = d.rooms.find((r) => !UUID_RE.test(r.bedType))
    if (missingBedType) {
      ctx.addIssue({
        code: "custom",
        path: ["rooms"],
        message: `Room "${missingBedType.name || "Unnamed"}" must have a valid bed type selected before continuing.`,
      })
    }
  })
