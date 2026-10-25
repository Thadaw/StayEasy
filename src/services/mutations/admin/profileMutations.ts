import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile, changePassword } from '@/api/users/userApi'
import { userKeys } from '@/lib/queryKeys'
import type { User } from '@/types/auth'

export interface ProfileFormData {
  fullName: string
  username: string
  email: string
  altEmail: string
  phoneCode: string
  phoneNumber: string
  timezone: string
  role: string
  dateFormat: string
  language: string
  timeFormat: string
}

export interface PasswordFormData {
  current: string
  newPass: string
  confirm: string
}

function throwIfForbidden(error: unknown): never {
  if (error instanceof Error && error.message.includes('403') && error.message.includes('Forbidden')) {
    throw new Error('This change is not allowed for your account.')
  }
  throw error
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProfileFormData) => {
      const payload: Partial<User> = {}
      if (data.fullName?.trim()) {
        payload.full_name = data.fullName.trim()
      }
      const phoneDigits = (data.phoneNumber || '').replace(/\D/g, '')
      if (phoneDigits.length === 10) {
        payload.phone = phoneDigits
      }
      return updateProfile(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
    onError: (err) => {
      throwIfForbidden(err)
      throw err
    },
  })
}

export function useUpdatePasswordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ current, newPass }: PasswordFormData) => changePassword(current, newPass),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
    onError: (err) => {
      throwIfForbidden(err)
      throw err
    },
  })
}
