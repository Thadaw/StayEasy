import { useState, useRef, useEffect } from "react"
import { ChevronDown, LogOut, User } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { LanguagePicker } from "./LanguagePicker"
import { useAuth } from "../../context/AuthContext"
import { useUserProfile } from "../../features/profile/hooks/useUserProfile"
import logo1 from "../../assets/logo1.png"

export function Navbar({ compact }: { compact?: boolean }) {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { firstName, lastName, displayInitials, photoUrl } = useUserProfile()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const displayName = firstName || user?.email?.split("@")[0] || ""
  const userEmail = user?.email || ""

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-white/30 backdrop-blur-lg border-b border-transparent"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 h-[56px] sm:h-[60px] md:h-[68px] flex items-center gap-2 md:gap-4">

        <Link to="/" className="shrink-0 flex items-center gap-1.5 md:gap-2 group">
          <img src={logo1} alt="StayEasy" className="h-[30px] sm:h-[34px] w-auto transition-transform duration-300 group-hover:scale-105" />
          <span className="font-brand font-extrabold text-brand-primary tracking-tight leading-none" style={{ fontSize: "clamp(18px, 3vw, 26px)" }}>
            Stay<span className="text-brand-accent">Easy</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
          {!compact && (
            <div className="ml-2">
              <LanguagePicker />
            </div>
          )}

          {!compact && (
            <Link
              to="/host/login"
              className={`hidden lg:block px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95 whitespace-nowrap ${scrolled ? "text-foreground" : "text-brand-dark"}`}
            >
              {t("becomeAHost")}
            </Link>
          )}

          <div ref={menuRef} className="relative">
            <button
              onClick={() => { if (user) { navigate('/profile'); } else { setMenuOpen(v => !v); } }}
              className={`flex items-center gap-1.5 sm:gap-2 border rounded-full px-2 sm:px-3 py-1.5 sm:py-2 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 ${
                scrolled ? "border-border bg-white" : "border-white/30 bg-white/15 backdrop-blur-sm"
              }`}
            >
              {user ? (
                <>
                  {photoUrl ? (
                    <img src={photoUrl} alt="" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white bg-brand-accent">
                      {displayInitials}
                    </div>
                  )}
                  <span className={`hidden md:block text-sm font-semibold max-w-[100px] truncate ${scrolled ? "text-brand-dark" : "text-brand-dark"}`}>
                    {displayName}
                  </span>
                  <ChevronDown size={12} className={`transition-transform hidden sm:block ${menuOpen ? "rotate-180" : ""} ${scrolled ? "text-muted-foreground" : "text-white/70"}`} />
                </>
              ) : (
                <>
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center ${scrolled ? "bg-muted" : "bg-white/20"}`}>
                    <User size={14} className="text-muted-foreground" />
                  </div>
                  <span className={`hidden sm:block text-sm font-medium ${scrolled ? "text-foreground" : "text-foreground"}`}>{t("account")}</span>
                  <ChevronDown size={12} className={`transition-transform hidden sm:block ${menuOpen ? "rotate-180" : ""} ${scrolled ? "text-muted-foreground" : "text-white/70"}`} />
                </>
              )}
            </button>

            {menuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 sm:w-60 bg-white rounded-xl shadow-2xl border border-border overflow-hidden z-50">
                {user ? (
                  <>
                    <div className="px-4 py-4 border-b border-border bg-accent">
                      <div className="flex items-center gap-3">
                        {photoUrl ? (
                          <img src={photoUrl} alt="" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-primary" />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-primary bg-brand-accent">
                            {displayInitials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold truncate text-sm sm:text-base text-brand-dark">
                            {displayName}{lastName ? ` ${lastName}` : ""}
                          </p>
                          <p className="text-xs truncate text-muted-foreground">{userEmail}</p>
                          {user.countryFlag && user.country && (
                            <p className="text-xs flex items-center gap-1 mt-0.5 text-primary">
                              <span>{user.countryFlag}</span><span>{user.country}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { navigate("/profile"); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent">
                        <User size={15} className="text-primary" />{t("profile")}
                      </button>
                      <div className="my-1 border-t border-border" />
                      <button onClick={() => { logout(); navigate("/"); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent">
                        <LogOut size={15} className="text-muted-foreground" />{t("logout")}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-1">
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="flex px-4 py-3 text-sm font-bold text-brand-dark transition-colors hover:bg-accent">{t("login")}</Link>
                    <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent">{t("signUp")}</Link>
                    <div className="my-1 border-t border-border" />
                    <Link to="/host/login" onClick={() => setMenuOpen(false)} className="flex px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent">{t("becomeAHost")}</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
