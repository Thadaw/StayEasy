import { useState, useEffect } from "react"
import { User, Mail, Phone, Lock, Bell, Save, Camera, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "../../auth/AuthContext"
import { FrontDeskSidebar, FrontDeskSidebarProvider, MobileMenuButton } from "../components/FrontDeskSidebar"
import { FormField } from "../components/FormField"
import { changePasswordSchema, staffProfileSchema } from "../schemas/passwordSchema"
import type { ChangePasswordFormData, StaffProfileFormData } from "../schemas/passwordSchema"

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

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<StaffProfileFormData>({
    resolver: zodResolver(staffProfileSchema),
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
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

  const newPassword = watchPassword("newPassword")
  const confirmPassword = watchPassword("confirmPassword")

  useEffect(() => {
    if (user) {
      resetProfile({
        firstName: user.firstName || user.first_name || "",
        lastName: user.lastName || user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
    }
  }, [user, resetProfile])

  const handleNotificationChange = (field: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSaveProfile = async (data: StaffProfileFormData) => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    setPasswordError("")
    setSaving(true)
    const result = await changePassword(data.currentPassword, data.newPassword)
    setSaving(false)
    if (result.success) {
      resetPassword()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } else {
      setPasswordError(result.error || "Failed to change password")
    }
  }

  const handleSaveNotifications = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
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
                        {(user?.firstName?.[0] || user?.first_name?.[0] || "S")}
                        {(user?.lastName?.[0] || user?.last_name?.[0] || "")}
                      </div>
                      <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50">
                        <Camera size={12} className="text-gray-600" />
                      </button>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user?.firstName || user?.first_name} {user?.lastName || user?.last_name}</p>
                      <p className="text-xs text-gray-500">{user?.role?.replace("_", " ") || "Staff"}</p>
                    </div>
                  </div>

                  <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === "profile" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <User size={18} />
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveTab("password")}
                      className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === "password" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Lock size={18} />
                      Password
                    </button>
                    <button
                      onClick={() => setActiveTab("notifications")}
                      className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === "notifications" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
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
                    <form onSubmit={handleSubmitProfile(handleSaveProfile)} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="First Name" error={profileErrors.firstName?.message} required>
                          <input
                            type="text"
                            {...registerProfile("firstName")}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormField>
                        <FormField label="Last Name" error={profileErrors.lastName?.message} required>
                          <input
                            type="text"
                            {...registerProfile("lastName")}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </FormField>
                      </div>

                      <FormField label="Email Address" error={profileErrors.email?.message} required>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            {...registerProfile("email")}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </FormField>

                      <FormField label="Phone Number" error={profileErrors.phone?.message}>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            {...registerProfile("phone")}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </FormField>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="Role">
                          <input
                            type="text"
                            value={user?.role?.replace("_", " ") || "Staff"}
                            disabled
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                          />
                        </FormField>
                        <FormField label="Department">
                          <input
                            type="text"
                            value="Front Office"
                            disabled
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                          />
                        </FormField>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          <Save size={16} />
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === "password" && (
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
                    <form onSubmit={handleSubmitPassword(handleChangePassword)} className="max-w-md space-y-5">
                      <FormField label="Current Password" error={passwordErrors.currentPassword?.message} required>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type={showPasswords.current ? "text" : "password"}
                            {...registerPassword("currentPassword")}
                            className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormField>

                      <FormField label="New Password" error={passwordErrors.newPassword?.message} required>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type={showPasswords.new ? "text" : "password"}
                            {...registerPassword("newPassword")}
                            className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                      </FormField>

                      <FormField label="Confirm New Password" error={passwordErrors.confirmPassword?.message} required>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type={showPasswords.confirm ? "text" : "password"}
                            {...registerPassword("confirmPassword")}
                            className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormField>

                      {passwordError && (
                        <div className="flex items-center gap-2 text-sm text-red-600 p-3 bg-red-50 rounded-lg">
                          <AlertCircle size={14} className="shrink-0" />
                          <span>{passwordError}</span>
                        </div>
                      )}

                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          <Lock size={16} />
                          {saving ? "Updating..." : "Update Password"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>

                    <div className="space-y-4">
                      {(
                        [
                          { key: "emailNotifications" as const, title: "Email Notifications", desc: "Receive updates via email" },
                          { key: "pushNotifications" as const, title: "Push Notifications", desc: "Receive push notifications on your device" },
                          { key: "bookingAlerts" as const, title: "Booking Alerts", desc: "Get notified for new bookings and cancellations" },
                          { key: "taskAssignments" as const, title: "Task Assignments", desc: "Get notified when tasks are assigned to you" },
                          { key: "shiftReminders" as const, title: "Shift Reminders", desc: "Receive reminders before your shift starts" },
                        ] as const
                      ).map(({ key, title, desc }) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{title}</p>
                            <p className="text-sm text-gray-500">{desc}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleNotificationChange(key)}
                            className={`w-12 h-6 rounded-full transition-colors ${
                              notifications[key] ? "bg-blue-600" : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                                notifications[key] ? "translate-x-6" : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </div>
                      ))}
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
