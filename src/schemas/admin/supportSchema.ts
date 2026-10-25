import { z } from 'zod'

export const supportTicketSchema = z.object({
  summary: z
    .string()
    .min(1, 'Please provide a summary of the issue')
    .max(100, 'Summary must be 100 characters or less'),
  description: z
    .string()
    .min(1, 'Please describe what happened')
    .max(1000, 'Description must be 1000 characters or less'),
})

export type SupportTicketFormData = z.infer<typeof supportTicketSchema>
