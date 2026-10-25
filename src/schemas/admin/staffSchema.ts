import { z } from "zod"

export const roles = ['MANAGER', 'FRONT_DESK', 'HOUSEKEEPING', 'WAITER', 'KITCHEN', 'MAINTENANCE'] as const
export const statuses = ['ACTIVE', 'ON LEAVE', 'INACTIVE'] as const
export const shifts = ['MORNING', 'EVENING', 'NIGHT'] as const

export const staffFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  contactNumber: z.string()
    .min(1, 'Contact number is required')
    .max(20, 'Contact number is too long')
    .regex(/^\d+$/, 'Contact number must contain only digits'),
  jobRole: z.enum(roles),
  monthlySalary: z.string()
    .min(1, 'Monthly salary is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Must be a number with up to 2 decimals')
    .refine((v) => Number(v) > 0 && Number(v) <= 10_000_000, 'Must be greater than 0 and at most 10,000,000'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  status: z.enum(statuses),
  shift: z.enum(shifts),
})

export type StaffFormData = z.infer<typeof staffFormSchema>
