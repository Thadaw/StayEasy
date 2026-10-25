import { useQuery } from "@tanstack/react-query"
import { getNotifications, getUnreadNotificationCount } from "@/api/pms/pmsApi"
import { frontdeskKeys } from "@/lib/queryKeys"

// -- Small dropdown list (dashboard bell) --
export function useNotificationsDropdownQuery(propertyId: string | null | undefined) {
  return useQuery({
    queryKey: frontdeskKeys.notificationsDropdown(propertyId || ""),
    queryFn: async () => {
      if (!propertyId) return []
      const res = await getNotifications({ property_id: propertyId, limit: 10 })
      return res?.notifications ?? []
    },
    enabled: !!propertyId,
    refetchInterval: 30000,
  })
}

// -- Unread badge count --
export function useUnreadNotificationCountQuery(propertyId: string | null | undefined) {
  return useQuery({
    queryKey: frontdeskKeys.unreadCount(propertyId || ""),
    queryFn: async () => {
      if (!propertyId) return 0
      return await getUnreadNotificationCount(propertyId)
    },
    enabled: !!propertyId,
    refetchInterval: 30000,
  })
}

// -- Full paginated/filtered list (notifications page) --
export interface NotificationListParams {
  skip?: number
  limit?: number
  unread_only?: boolean
  notif_type?: string | null
}

export function useNotificationsQuery(
  propertyId: string | null | undefined,
  params: NotificationListParams = {},
  options?: { refetchInterval?: number },
) {
  return useQuery({
    queryKey: [...frontdeskKeys.notifications(propertyId || ""), params],
    queryFn: async () => {
      if (!propertyId) return { notifications: [], total: 0, unread_count: 0 }
      return await getNotifications({ property_id: propertyId, ...params })
    },
    enabled: !!propertyId,
    refetchInterval: options?.refetchInterval,
  })
}
