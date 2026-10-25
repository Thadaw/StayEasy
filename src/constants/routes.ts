// Shared route paths referenced by guards, redirects and navigation.

export const ROUTES = {
  home: '/',
  login: '/login',
  hostLogin: '/host/login',
  frontDesk: '/frontdesk',
  managerDashboard: '/manager/dashboard',
  hostOverallDashboard: '/host/overall-dashboard',
  staffChangePassword: '/frontdesk/change-password',
  hostChangePassword: '/host/change-password',
  hostTenantSetup: '/host/tenant-setup',
} as const
