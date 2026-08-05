import api from '../../../services/axios'
import type { User } from '../types'

export async function loginApi(email: string, password: string) {
  const params = new URLSearchParams()
  params.append('grant_type', 'password')
  params.append('username', email)
  params.append('password', password)
  const res = await api.post('auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return res.data.access_token
}

export async function fetchCurrentUser(userType: 'host' | 'guest' = 'guest') {
  const endpoint = userType === 'host' ? '/auth/users/me' : '/auth/guests/me'
  const { data } = await api.get<User>(endpoint)
  return data
}

export async function registerGuest(payload: {
  full_name: string
  email: string
  phone: string
  password: string
  nationality: string
}) {
  await api.post('/auth/guests/register', payload)
}

export async function registerHost(payload: {
  full_name: string
  email: string
  phone: string
  password: string
}) {
  await api.post('/auth/users/register', payload)
}

export async function verifyOtp(email: string, otp: string, userType: 'host' | 'guest' = 'guest') {
  const basePath = userType === 'host' ? '/auth/users' : '/auth/guests'
  await api.post(`${basePath}/verify-otp`, { email, otp })
}

export async function resendOtp(email: string, userType: 'host' | 'guest' = 'guest') {
  const basePath = userType === 'host' ? '/auth/users' : '/auth/guests'
  await api.post(`${basePath}/resend-otp`, { email })
}

export async function updateProfileApi(data: Partial<User>) {
  const userType = localStorage.getItem('userType') || 'guest'
  const endpoint = userType === 'host' ? '/auth/users/me' : '/auth/guests/me'
  const { data: updated } = await api.patch<User>(endpoint, data)
  return updated
}
