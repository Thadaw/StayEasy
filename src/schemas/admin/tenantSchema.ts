import { z } from 'zod'

// Mirrors the inline validate() TenantSetup used before moving to RHF/Zod:
// the first failing rule wins so the form still shows exactly one message.
export const tenantNameSchema = z.object({
  name: z.string().superRefine((value, ctx) => {
    const trimmed = value.trim()

    if (!trimmed) {
      ctx.addIssue({ code: 'custom', message: 'Tenant / brand name is required.' })
      return
    }
    if (/^\d+$/.test(trimmed)) {
      ctx.addIssue({ code: 'custom', message: 'Tenant name cannot contain only numbers.' })
      return
    }
    if (trimmed.length < 2) {
      ctx.addIssue({ code: 'custom', message: 'Tenant name must be at least 2 characters.' })
      return
    }
    if (trimmed.length > 50) {
      ctx.addIssue({ code: 'custom', message: 'Tenant name must be 50 characters or less.' })
    }
  }),
})

export type TenantNameFormData = z.infer<typeof tenantNameSchema>
