import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePropertyActivation } from "@/api/pms/pmsApi"
import { propertyKeys } from "@/lib/queryKeys"

export function useUpdatePropertyActivationMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (propertyId: string) => updatePropertyActivation(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
    },
  })

  return {
    updatePropertyActivation: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
    mutate: mutation.mutate,
  }
}
