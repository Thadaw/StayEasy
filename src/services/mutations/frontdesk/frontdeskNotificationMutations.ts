import { useMutation, useQueryClient } from "@tanstack/react-query"
import { markNotificationRead, markAllNotificationsRead } from "@/api/pms/pmsApi"
import { frontdeskKeys } from "@/lib/queryKeys"

function useInvalidateNotifications(propertyId: string | null | undefined) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: frontdeskKeys.notificationsDropdown(propertyId || "") })
    queryClient.invalidateQueries({ queryKey: frontdeskKeys.notifications(propertyId || "") })
    queryClient.invalidateQueries({ queryKey: frontdeskKeys.unreadCount(propertyId || "") })
  }
}

// -- Mark a single notification as read --
export function useMarkNotificationReadMutation(propertyId: string | null | undefined) {
  const invalidate = useInvalidateNotifications(propertyId)
  return useMutation({
    mutationFn: ({ notificationId }: { notificationId: string }) =>
      markNotificationRead({ notificationId, propertyId: propertyId! }),
    onSuccess: invalidate,
  })
}

// -- Mark all notifications as read --
export function useMarkAllNotificationsReadMutation(propertyId: string | null | undefined) {
  const invalidate = useInvalidateNotifications(propertyId)
  return useMutation({
    mutationFn: async () => {
      if (!propertyId) return
      return markAllNotificationsRead(propertyId)
    },
    onSuccess: invalidate,
  })
}
