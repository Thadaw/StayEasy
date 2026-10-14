import api from "@/api/axiosInstance"
import type { GuestProfile } from "@/types/profile"

export async function getGuestProfile(signal?: AbortSignal): Promise<GuestProfile> {
  const { data } = await api.get("/auth/guests/me", { signal })
  return data as GuestProfile
}
