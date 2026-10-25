import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { bulkAssignTasks, completeTask, createTask, deleteTask, updateTask } from "@/api/pms/pmsApi"
import { housekeepingKeys } from "@/lib/queryKeys"
import type { BulkAssignTaskItem, CreateTaskRequest, UpdateTaskRequest } from "@/types/housekeeping"

export function useCreateHousekeepingTask(propertyId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => createTask(propertyId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.tasks(propertyId!) })
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.staffWorkSummary(propertyId!) })
      toast.success('Task created successfully')
    },
    onError: () => toast.error('Failed to create task'),
  })
}

export function useDeleteHousekeepingTask(propertyId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(propertyId!, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.tasks(propertyId!) })
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.staffWorkSummary(propertyId!) })
    },
    onError: () => toast.error('Failed to remove the original unassigned task'),
  })
}

export function useUpdateHousekeepingTask(propertyId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskRequest }) =>
      updateTask(propertyId!, taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.tasks(propertyId!) })
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.staffWorkSummary(propertyId!) })
      toast.success('Task updated successfully')
    },
    onError: () => toast.error('Failed to update task'),
  })
}

export function useCompleteHousekeepingTask(propertyId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => completeTask(propertyId!, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.tasks(propertyId!) })
      toast.success('Task completed')
    },
    onError: () => toast.error('Failed to complete task'),
  })
}

export function useBulkAssignHousekeepingTasks(propertyId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tasks: BulkAssignTaskItem[]) => bulkAssignTasks(propertyId!, tasks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.tasks(propertyId!) })
      toast.success('Bulk assignments applied')
    },
    onError: () => toast.error('Failed to apply bulk assignments'),
  })
}
