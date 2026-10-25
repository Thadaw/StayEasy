import api from '@/api/axiosInstance'
import type { User } from '@/types/auth'
import type { GuestProfile } from '@/types/profile'

export async function getGuestProfile(signal?: AbortSignal): Promise<GuestProfile> {
  const { data } = await api.get('/auth/guests/me', { signal })
  return data as GuestProfile
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  const { data: result } = await api.patch<User>('/auth/users/me', data)
  return result
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.post('/auth/user/change-password', { current_password: currentPassword, new_password: newPassword })
}
