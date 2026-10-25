import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createStaff, deleteStaff, updateStaff, uploadStaffImage } from "@/api/pms/pmsApi"
import { housekeepingKeys, staffKeys } from "@/lib/queryKeys"
import type { CreateStaffPayload, StaffMember, UpdateStaffPayload } from "@/types/staff"
import { toApiStatus } from "@/types/staff"

interface UseDeleteStaffReturn {
  deleteStaff: (staffId: string) => Promise<void>
  isDeleting: boolean
  error: unknown
}

export function useDeleteStaff(propertyId: string | null | undefined): UseDeleteStaffReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (staffId: string) => deleteStaff(propertyId!, staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all })
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.staffOptions(propertyId || "") })
    },
  })

  return {
    deleteStaff: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  }
}

interface UseUpdateStaffStatusReturn {
  updateStaffStatus: (staffId: string, status: StaffMember["status"]) => Promise<unknown>
  isUpdating: boolean
  error: unknown
}

export function useUpdateStaffStatus(propertyId: string | null | undefined): UseUpdateStaffStatusReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ staffId, status }: { staffId: string; status: StaffMember["status"] }) =>
      updateStaff(propertyId!, staffId, { status: toApiStatus(status) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all })
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.staffOptions(propertyId || "") })
    },
  })

  return {
    updateStaffStatus: (staffId: string, status: StaffMember["status"]) => mutation.mutateAsync({ staffId, status }),
    isUpdating: mutation.isPending,
    error: mutation.error,
  }
}

interface UseCreateStaffReturn {
  createStaff: (payload: CreateStaffPayload, files?: { photo?: File | null; front?: File | null; back?: File | null }) => Promise<unknown>
  isCreating: boolean
  error: unknown
}

export function useCreateStaff(propertyId: string | null | undefined): UseCreateStaffReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ payload, files }: { payload: CreateStaffPayload; files?: { photo?: File | null; front?: File | null; back?: File | null } }) => {
      if (!propertyId) throw new Error("No property selected")
      let profileUrl = payload.photos?.profile ?? null
      let frontUrl = payload.photos?.citizenship_front ?? null
      let backUrl = payload.photos?.citizenship_back ?? null

      if (files?.photo) profileUrl = await uploadStaffImage(propertyId, files.photo)
      if (files?.front) frontUrl = await uploadStaffImage(propertyId, files.front)
      if (files?.back) backUrl = await uploadStaffImage(propertyId, files.back)

      const finalPayload: CreateStaffPayload = {
        ...payload,
        photos: (profileUrl || frontUrl || backUrl)
          ? {
              profile: profileUrl,
              citizenship_front: frontUrl,
              citizenship_back: backUrl,
            }
          : payload.photos ?? null,
      }
      return createStaff(propertyId, finalPayload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.list(propertyId || "") })
      queryClient.invalidateQueries({ queryKey: staffKeys.all })
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.staffOptions(propertyId || "") })
    },
  })

  return {
    createStaff: (payload, files) => mutation.mutateAsync({ payload, files }),
    isCreating: mutation.isPending,
    error: mutation.error,
  }
}

interface UseUpdateStaffReturn {
  updateStaff: (payload: UpdateStaffPayload, files?: { photo?: File | null; front?: File | null; back?: File | null }) => Promise<unknown>
  isUpdating: boolean
  error: unknown
}

export function useUpdateStaff(propertyId: string | null | undefined, staffId: string | null | undefined): UseUpdateStaffReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ payload, files }: { payload: UpdateStaffPayload; files?: { photo?: File | null; front?: File | null; back?: File | null } }) => {
      if (!propertyId || !staffId) throw new Error("Missing property or staff ID")
      let profileUrl = payload.photos?.profile ?? null
      let frontUrl = payload.photos?.citizenship_front ?? null
      let backUrl = payload.photos?.citizenship_back ?? null

      if (files?.photo) profileUrl = await uploadStaffImage(propertyId, files.photo)
      if (files?.front) frontUrl = await uploadStaffImage(propertyId, files.front)
      if (files?.back) backUrl = await uploadStaffImage(propertyId, files.back)

      const finalPayload: UpdateStaffPayload = {
        ...payload,
        photos: (profileUrl || frontUrl || backUrl)
          ? {
              profile: profileUrl,
              citizenship_front: frontUrl,
              citizenship_back: backUrl,
            }
          : payload.photos ?? null,
      }
      return updateStaff(propertyId, staffId, finalPayload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(propertyId || "", staffId || "") })
      queryClient.invalidateQueries({ queryKey: staffKeys.list(propertyId || "") })
      queryClient.invalidateQueries({ queryKey: staffKeys.all })
      queryClient.invalidateQueries({ queryKey: housekeepingKeys.staffOptions(propertyId || "") })
    },
  })

  return {
    updateStaff: (payload, files) => mutation.mutateAsync({ payload, files }),
    isUpdating: mutation.isPending,
    error: mutation.error,
  }
}
