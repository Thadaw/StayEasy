import { z } from "zod"

export const roomSchema = z.object({
  number: z.string().min(1, "Room number is required"),
  type: z.string().min(1, "Room type is required"),
  bedInfo: z.string().min(1, "Bed info is required"),
  floor: z.string().min(1, "Floor is required"),
  status: z.string().min(1, "Status is required"),
  capacity: z.number().min(1, "Capacity must be at least 1").max(10, "Capacity must be at most 10"),
  price: z.string().min(1, "Price is required"),
})

export type RoomFormData = z.infer<typeof roomSchema>
