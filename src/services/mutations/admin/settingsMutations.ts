import { useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyKeys } from '@/lib/queryKeys'
import { useSettingsStore } from '@/store/admin/settingsStore'

export function useSaveSettingsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => Promise.resolve(undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all })
      useSettingsStore.getState().markSaved()
    },
  })
}
