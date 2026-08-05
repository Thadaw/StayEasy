import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { User, Heart, CalendarDays, TicketPercent, Star, Bell, LogOut, ChevronRight } from 'lucide-react'
import { Navbar } from '../../../shared/components/Navbar'

const navItems = [
  { to: '/profile/about', icon: User, label: 'About Me' },
  { to: '/profile/favourites', icon: Heart, label: 'Favourite Properties' },
  { to: '/profile/bookings', icon: CalendarDays, label: 'My Bookings' },
  { to: '/profile/coupons', icon: TicketPercent, label: 'My Coupons' },
  { to: '/profile/reviews', icon: Star, label: 'My Reviews' },
  { to: '/profile/notifications', icon: Bell, label: 'Notifications' },
]

export default function ProfilePage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-brand-background font-jakarta">
      <Navbar compact />

      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex min-h-[calc(100vh-68px)]">
          <aside
            className="w-[300px] shrink-0 sticky top-[68px] self-start bg-white border-r border-brand-card-border flex flex-col"
            style={{ minHeight: 'calc(100vh - 68px)' }}
          >
            <div className="px-3 pt-4 pb-2">
              <div className="flex items-center gap-3 mb-6 mt-[-10px]">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center justify-center w-10 h-10 p-0 rounded-lg border border-brand-card-border bg-white cursor-pointer hover:bg-brand-secondary-surface transition-colors"
                  aria-label="Back to home"
                  title="Back to home"
                  style={{ color: 'var(--brand-heading)' }}
                >
                  <span className="text-lg leading-none" aria-hidden>
                    {'<-'}
                  </span>
                </button>

                <h1 className="text-xl font-bold m-0" style={{ color: 'var(--brand-heading)' }}>
                  Profile
                </h1>
              </div>
            </div>

            <nav className="flex-1 px-3 pt-0">
              <div className="flex flex-col gap-1">
                {navItems.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-4 rounded-lg transition-all duration-150 ${
                        isActive ? 'bg-brand-secondary-surface' : 'hover:bg-brand-secondary-surface'
                      }`
                    }
                    style={{ height: 48 }}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div
                            className="absolute left-0 w-1 h-6 bg-brand-accent rounded-r-full"
                          />
                        )}
                        <item.icon
                          size={18}
                          className={
                            isActive
                              ? 'text-brand-accent'
                              : 'text-brand-text-secondary group-hover:text-brand-heading transition-colors duration-150'
                          }
                        />
                        <span
                          className={`text-sm flex-1 transition-colors duration-150 ${
                            isActive
                              ? 'text-brand-heading font-medium'
                              : 'text-brand-text-secondary group-hover:text-brand-heading'
                          }`}
                        >
                          {item.label}
                        </span>
                        {isActive ? <ChevronRight size={14} className="text-brand-accent" /> : null}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </nav>

            <div className="px-3 pb-4 border-t border-brand-card-border pt-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 rounded-lg transition-all duration-150 text-brand-text-secondary hover:text-brand-danger hover:bg-brand-danger-light"
                style={{ height: 48 }}
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </aside>

          <main className="flex-1 p-8">
            <div>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
