export interface User {
  id?: number
  first_name: string
  last_name: string
  full_name?: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  role?: string
  avatar?: string
  countryFlag?: string
  country?: string
  phone?: string
  joinedDate?: string
  aboutMe?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  first_name: string
  last_name: string
  email: string
  password: string
}
