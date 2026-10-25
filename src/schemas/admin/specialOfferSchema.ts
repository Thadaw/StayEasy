import { z } from 'zod'

export const specialOfferFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Title must be at least 2 characters')
      .max(100, 'Title must be at most 100 characters'),
    description: z.string().max(1000, 'Description must be at most 1000 characters'),
    discountPercentage: z
      .string()
      .min(1, 'Discount percentage is required')
      .regex(/^\d+(\.\d{1,2})?$/, 'Must be a number with up to 2 decimals')
      .refine((v) => Number(v) >= 0 && Number(v) <= 100, 'Must be between 0 and 100'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    isActive: z.boolean(),
  })
  .refine((data) => !data.startDate || !data.endDate || data.startDate < data.endDate, {
    message: 'Start date must be before end date',
    path: ['endDate'],
  })

export type SpecialOfferFormData = z.infer<typeof specialOfferFormSchema>

export const todayISO = () => new Date().toISOString().split('T')[0]
