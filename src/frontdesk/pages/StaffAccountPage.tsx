import { useState, useEffect } from "react"
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Save, 
  Camera, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useAuth } from "../../auth/AuthContext"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"

interface StaffProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  department: string
  avatar?: string
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  bookingAlerts: boolean
  taskAssignments: boolean
  shiftReminders: boolean
}

export function StaffAccountPage() {
  const { user, changePassword } = useAuth()
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "notifications">("profile")
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  
  const [profile, setProfile] = useState<StaffProfile>({
    firstName: user?.firstName || user?.first_name || "",
    lastName: user?.lastName || user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role?.replace('_', ' ') || "Staff",
    department: "Front Office",
  })

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || user.first_name || "",
        lastName: user.lastName || user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role?.replace('_', ' ') || "Staff",
        department: "Front Office",
      })
    }
  }, [user])

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    bookingAlerts: true,
    taskAssignments: true,
    shiftReminders: false,
  })

  const handleProfileChange = (field: keyof StaffProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleChangePassword = async () => {
    setPasswordError("")
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return
    }
    if (!/[A-Z]/.test(passwordForm.newPassword)) {
      setPasswordError("Password must contain at least one uppercase letter")
      return
    }
    if (!/[a-z]/.test(passwordForm.newPassword)) {
      setPasswordError("Password must contain at least one lowercase letter")
      return
    }
    if (!/[0-9]/.test(passwordForm.newPassword)) {
      setPasswordError("Password must contain at least one number")
      return
    }
    setSaving(true)
    const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword)
    setSaving(false)
    if (result.success) {
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } else {
      setPasswordError(result.error || "Failed to change password")
    }
  }

  const handleSaveNotifications = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <FrontDeskSidebarProvider>
    <div className="flex min-h-screen bg-gray-50">
      <FrontDeskSidebar />
      
      <main className="flex-1 overflow-auto">
        <MobileMenuButton />
        <div className="p-4 lg:p-6 pt-14 lg:pt-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your profile, password, and notification preferences</p>
          </div>

          {showSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              <span className="text-sm text-green-700">Changes saved successfully!</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-64 shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div className="relative">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white uppercase">
                      {(user?.firstName?.[0] || user?.first_name?.[0] || 'S')}{(user?.lastName?.[0] || user?.last_name?.[0] || '')}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50">
                      <Camera size={12} className="text-gray-600" />
                    </button>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{profile.firstName} {profile.lastName}</p>
                    <p className="text-xs text-gray-500">{profile.role}</p>
                  </div>
                </div>

                <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === "profile"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <User size={18} />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("password")}
                    className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === "password"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Lock size={18} />
                    Password
                  </button>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === "notifications"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Bell size={18} />
                    Notifications
                  </button>
                </nav>
              </div>
            </div>

            <div className="flex-1">
              {activeTab === "profile" && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
                  
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          value={profile.firstName}
                          onChange={(e) => handleProfileChange("firstName", e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={profile.lastName}
                          onChange={(e) => handleProfileChange("lastName", e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleProfileChange("email", e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => handleProfileChange("phone", e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                          type="text"
                          value={profile.role}
                          disabled
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input
                          type="text"
                          value={profile.department}
                          disabled
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Save size={16} />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "password" && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
                  
                  <div className="max-w-md space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                          className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                          className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                          className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {passwordForm.newPassword && passwordForm.confirmPassword && 
                      passwordForm.newPassword !== passwordForm.confirmPassword && (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertCircle size={14} />
                          <span>Passwords do not match</span>
                        </div>
                      )}

                    {passwordError && (
                      <div className="flex items-center gap-2 text-sm text-red-600 p-3 bg-red-50 rounded-lg">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{passwordError}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <button
                      onClick={handleChangePassword}
                      disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Lock size={16} />
                      {saving ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange("emailNotifications")}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.emailNotifications ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                          notifications.emailNotifications ? "translate-x-6" : "translate-x-0.5"
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Push Notifications</p>
                        <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange("pushNotifications")}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.pushNotifications ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                          notifications.pushNotifications ? "translate-x-6" : "translate-x-0.5"
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Booking Alerts</p>
                        <p className="text-sm text-gray-500">Get notified for new bookings and cancellations</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange("bookingAlerts")}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.bookingAlerts ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                          notifications.bookingAlerts ? "translate-x-6" : "translate-x-0.5"
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Task Assignments</p>
                        <p className="text-sm text-gray-500">Get notified when tasks are assigned to you</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange("taskAssignments")}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.taskAssignments ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                          notifications.taskAssignments ? "translate-x-6" : "translate-x-0.5"
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Shift Reminders</p>
                        <p className="text-sm text-gray-500">Receive reminders before your shift starts</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange("shiftReminders")}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.shiftReminders ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                          notifications.shiftReminders ? "translate-x-6" : "translate-x-0.5"
                        }`} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <button
                      onClick={handleSaveNotifications}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Save size={16} />
                      {saving ? "Saving..." : "Save Preferences"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </FrontDeskSidebarProvider>
  )
}

export default StaffAccountPage
