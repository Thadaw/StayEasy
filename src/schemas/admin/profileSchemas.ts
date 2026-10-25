 import { z } from 'zod'

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  altEmail: z.string().email('Invalid alternative email address').optional(),
  phoneCode: z.string(),
  phoneNumber: z.string().min(6, 'Phone number is required'),
  timezone: z.string(),
  role: z.string(),
  dateFormat: z.string(),
  language: z.string(),
  timeFormat: z.string(),
})

export type ProfileFormData = z.infer<typeof profileSchema>

export const passwordSchema = z
  .object({
    current: z.string().min(1, 'Current password is required'),
    newPass: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPass === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

export type PasswordFormData = z.infer<typeof passwordSchema>

export const hostProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number is required'),
  timezone: z.string(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
})

export type HostProfileFormData = z.infer<typeof hostProfileSchema>
