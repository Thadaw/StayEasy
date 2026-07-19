export interface ActivityLog {
  id: number
  dateTime: string
  user: {
    name: string
    email: string
    avatar?: string
  }
  module: string
  moduleColor: { bg: string; text: string }
  action: string
  actionColor: { bg: string; text: string }
  description: string
  descriptionLink?: string
  ipAddress: string
  status: 'Success' | 'Warning' | 'Failed'
}

export interface ActivityStat {
  label: string
  value: number
  trend: string
  trendUp: boolean
  subtitle: string
  icon: string
  iconBg: string
  iconColor: string
}

export interface ActivityModule {
  name: string
  count: number
  icon: string
  color: string
}
