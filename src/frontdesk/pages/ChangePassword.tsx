import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle, Shield } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'

export default function ChangePassword() {
  const navigate = useNavigate()
  const { changePassword, tempPassword, user, clearMustChangePassword, logout } = useAuth()

  const [currentPassword, setCurrentPassword] = useState(tempPassword || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const passwordValid = (pw: string) => {
    if (pw.length < 8) return 'Password must be at least 8 characters long.'
    if (!/[A-Z]/.test(pw)) return 'Password must contain at least one uppercase letter.'
    if (!/[a-z]/.test(pw)) return 'Password must contain at least one lowercase letter.'
    if (!/[0-9]/.test(pw)) return 'Password must contain at least one number.'
    return null
  }

  const handleSubmit = async () => {
    setError('')

    if (!currentPassword) {
      setError('Current password is required.')
      return
    }
    if (!newPassword) {
      setError('New password is required.')
      return
    }
    const pwError = passwordValid(newPassword)
    if (pwError) {
      setError(pwError)
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from current password.')
      return
    }

    setLoading(true)
    const result = await changePassword(currentPassword, newPassword)
    setLoading(false)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        navigate('/frontdesk')
      }, 1500)
    } else {
      setError(result.error || 'Failed to change password. Please try again.')
    }
  }

  const handleLogout = () => {
    clearMustChangePassword()
    logout()
    navigate('/staff/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#1e3a5f] px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Change Your Password</h1>
            <p className="text-sm text-white/70 mt-1">
              {tempPassword
                ? 'You logged in with a temporary password. Please set a new one.'
                : 'For security, please update your password.'}
            </p>
          </div>

          <div className="px-8 py-6">
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Password Changed!</h2>
                <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
              </div>
            ) : (
              <>
                {user?.email && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600">
                      Signed in as <span className="font-medium">{user.email}</span>
                    </p>
                  </div>
                )}

                {/* Current Password */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Min 8 chars, 1 uppercase, 1 lowercase, 1 number
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <div className="flex items-center gap-2 text-sm text-red-600 mb-4">
                    <AlertCircle size={14} />
                    <span>Passwords do not match</span>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 mb-4 p-3 bg-red-50 rounded-lg">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full py-2.5 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#162d4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full mt-3 py-2.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                  Sign out instead
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
