import { useQuery } from '@tanstack/react-query'
import api from '@/api/axiosInstance'
import type { User } from '@/types/auth'
import { userKeys } from '@/lib/queryKeys'
import type { AuthRequestConfig } from '@/api/axiosInstance'

export function useUserQuery() {
  return useQuery<User>({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const response = await api.get<User>('/auth/users/me', { skipAuthRedirect: true } as AuthRequestConfig)
      return response.data
    },
  })
}
