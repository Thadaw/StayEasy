import { useQuery } from "@tanstack/react-query"
import {
  getAllProperties,
  getHousekeepingRooms,
  getHousekeepingStaffOptions,
  getRoomStatusSummary,
  getStaffWorkSummary,
  getTaskRoomOptions,
  getTaskTypes,
  getTasks,
} from "@/api/pms/pmsApi"
import { housekeepingKeys, propertyKeys } from "@/lib/queryKeys"
import type {
  ApiRoomOption,
  ApiRoomStatus,
  ApiRoomStatusSummary,
  ApiStaffOption,
  ApiStaffWorkSummary,
  ApiTaskListItem,
  ApiTaskTypeOption,
} from "@/types/housekeeping"
import type { GeneralInfoResponse } from "@/types/pms"

// -- Properties (portfolio) --
export function useHousekeepingPropertiesQuery() {
  return useQuery<GeneralInfoResponse[]>({
    queryKey: propertyKeys.all,
    queryFn: getAllProperties,
  })
}

// -- Room status board --
export function useHousekeepingRoomsQuery(propertyId: string | null | undefined) {
  return useQuery<ApiRoomStatus[]>({
    queryKey: housekeepingKeys.rooms(propertyId || ""),
    queryFn: () => getHousekeepingRooms(propertyId!),
    enabled: !!propertyId,
  })
}

export function useRoomStatusSummaryQuery(propertyId: string | null | undefined) {
  return useQuery<ApiRoomStatusSummary>({
    queryKey: housekeepingKeys.roomSummary(propertyId || ""),
    queryFn: () => getRoomStatusSummary(propertyId!),
    enabled: !!propertyId,
  })
}

// -- Tasks --
export function useHousekeepingTasksQuery(propertyId: string | null | undefined) {
  return useQuery<ApiTaskListItem[]>({
    queryKey: housekeepingKeys.tasks(propertyId || ""),
    queryFn: () => getTasks(propertyId!, { limit: 50 }),
    enabled: !!propertyId,
  })
}

// -- Task form dropdowns --
export function useHousekeepingStaffOptionsQuery(propertyId: string | null | undefined) {
  return useQuery<ApiStaffOption[]>({
    queryKey: housekeepingKeys.staffOptions(propertyId || ""),
    queryFn: () => getHousekeepingStaffOptions(propertyId!),
    enabled: !!propertyId,
  })
}

export function useTaskRoomOptionsQuery(propertyId: string | null | undefined) {
  return useQuery<ApiRoomOption[]>({
    queryKey: housekeepingKeys.roomOptions(propertyId || ""),
    queryFn: () => getTaskRoomOptions(propertyId!),
    enabled: !!propertyId,
  })
}

export function useStaffWorkSummaryQuery(propertyId: string | null | undefined) {
  return useQuery<ApiStaffWorkSummary[]>({
    queryKey: housekeepingKeys.staffWorkSummary(propertyId || ""),
    queryFn: () => getStaffWorkSummary(propertyId!),
    enabled: !!propertyId,
  })
}

export function useTaskTypesQuery(propertyId: string | null | undefined) {
  return useQuery<ApiTaskTypeOption[]>({
    queryKey: housekeepingKeys.taskTypes(propertyId || ""),
    queryFn: () => getTaskTypes(propertyId!),
    enabled: !!propertyId,
  })
}
