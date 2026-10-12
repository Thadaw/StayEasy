import {
  User,
  Building2,
  Bell,
  Shield,
  SlidersHorizontal,
  Users,
  Info,
  type LucideIcon,
} from 'lucide-react'

export const SETTINGS_TABS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'profile', label: 'Profile Settings', icon: User },
  { id: 'hotel', label: 'Hotel Information', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { id: 'roles', label: 'Role & Access', icon: Users },
  { id: 'system', label: 'System Information', icon: Info },
]

export const PROFILE_DEFAULTS = {
  fullName: 'Alex Carter',
  email: 'alex.carter@serveiqhotel.com',
  phone: '+977 9801234567',
  position: 'Hotel Manager',
}
