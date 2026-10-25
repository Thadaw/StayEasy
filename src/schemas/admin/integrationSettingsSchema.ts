import { z } from 'zod'

export const integrationSettingsSchema = z.object({
  syncFrequency: z.string().min(1, 'Sync frequency is required'),
  autoSync: z.boolean(),
})

export type IntegrationSettingsFormData = z.infer<typeof integrationSettingsSchema>
