// Canonical role identifiers used across auth, routing and route guards.

export const ROLES = {
  GUEST: 'guest',
  HOST: 'host',
  STAFF: 'staff',
  MANAGER: 'manager',
} as const

export type AuthRole = (typeof ROLES)[keyof typeof ROLES]
