import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { getGuestProfile } from "@/api/users/userApi"
import { userKeys } from "@/lib/queryKeys"

export type { GuestProfile } from "@/types/profile"

export function useGuestProfile() {
  const { user } = useAuth()

  const query = useQuery({
    queryKey: userKeys.profile(user?.id),
    queryFn: ({ signal }) => getGuestProfile(signal),
    enabled: !!user,
    staleTime: 5 * 60_000,
    retry: false,
  })

  // When the profile fetch fails, fall back to the authenticated user's basic
  // details so the UI still has something to render (matches previous behaviour).
  const fallback = user
    ? {
        full_name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "",
        email: user.email || "",
        phone: "",
        nationality: "",
        id: "",
        created_at: "",
      }
    : null

  const profile = query.data ?? (query.isError ? fallback : null)

  return {
    profile,
    loading: query.isLoading,
    error: query.error ? query.error.message : null,
  }
}
