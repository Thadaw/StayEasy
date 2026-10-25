import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createRooms, updateRoom, deleteRoom } from "@/api/pms/pmsApi"
import { roomKeys } from "@/lib/queryKeys"
import type { RoomBase, RoomResponse } from "@/types/pms"

interface UseDeleteAdminRoomReturn {
  deleteRoom: (roomId: string) => void
  isDeleting: boolean
  error: unknown
}

export function useDeleteAdminRoom(propertyId: string | null | undefined): UseDeleteAdminRoomReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (roomId: string) => deleteRoom(propertyId!, roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.byProperty(propertyId || "") })
    },
  })

  return {
    deleteRoom: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error,
  }
}

interface UseCreateAdminRoomReturn {
  createRoom: (data: RoomBase) => Promise<{ rooms: RoomResponse[] }>
  isCreating: boolean
  error: unknown
}

export function useCreateAdminRoom(propertyId: string | null | undefined): UseCreateAdminRoomReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: RoomBase) => createRooms(propertyId!, { rooms: [data] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.byProperty(propertyId || "") })
    },
  })

  return {
    createRoom: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  }
}

interface UseUpdateAdminRoomReturn {
  updateRoom: (roomId: string, data: Partial<RoomBase>) => Promise<RoomResponse>
  isUpdating: boolean
  error: unknown
}

export function useUpdateAdminRoom(propertyId: string | null | undefined): UseUpdateAdminRoomReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ roomId, data }: { roomId: string; data: Partial<RoomBase> }) => updateRoom(propertyId!, roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.byProperty(propertyId || "") })
    },
  })

  return {
    updateRoom: (roomId, data) => mutation.mutateAsync({ roomId, data }),
    isUpdating: mutation.isPending,
    error: mutation.error,
  }
}
