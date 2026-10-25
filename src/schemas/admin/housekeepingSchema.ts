import { z } from 'zod'

export const createTaskSchema = z.object({
  room: z.string().min(1, 'Please select a room'),
  taskType: z.enum(['Cleaning', 'Linen Change', 'Deep Cleaning', 'Bathroom Cleaning']),
  priority: z.enum(['High', 'Medium', 'Low']),
  assignedStaff: z.string().min(1, 'Please assign a staff member'),
  dueTime: z.string(),
  notes: z.string(),
})

export type CreateTaskFormData = z.infer<typeof createTaskSchema>

export const assignTaskSchema = z.object({
  staff: z.string().min(1, 'Please assign a staff member'),
  room: z.string(),
  priority: z.enum(['High', 'Medium', 'Low']),
  dueTime: z.string(),
  notes: z.string(),
})

export type AssignTaskFormData = z.infer<typeof assignTaskSchema>

export const reviewMaintenanceSchema = z.object({
  priority: z.enum(['Low', 'Medium', 'Urgent']),
  category: z.string().min(1, 'Category is required'),
  technician: z.string(),
  returnDate: z.string(),
  instructions: z.string(),
  blockRoom: z.boolean(),
})

export type ReviewMaintenanceFormData = z.infer<typeof reviewMaintenanceSchema>

export const bulkAssignRoomSchema = z.object({
  notes: z.string(),
  housekeeperId: z.string(),
  priority: z.enum(['High', 'Medium', 'Low']),
})

export const bulkAssignSchema = z.object({
  taskType: z.string().min(1),
  status: z.string().min(1),
  selectedRoomIds: z.array(z.number()),
  assignments: z.record(z.string(), bulkAssignRoomSchema),
})

export type BulkAssignFormData = z.infer<typeof bulkAssignSchema>
