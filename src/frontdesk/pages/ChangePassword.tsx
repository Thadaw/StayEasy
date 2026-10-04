import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, CheckCircle, Shield } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../auth/AuthContext'
import { FormField } from '../components/FormField'
import { changePasswordSchema } from '../schemas/passwordSchema'
import type { ChangePasswordFormData } from '../schemas/passwordSchema'

export default function ChangePassword() {
  const navigate = useNavigate()
  const { changePassword, tempPassword, user, clearMustChangePassword, logout } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: tempPassword || '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (navigateTimerRef.current) clearTimeout(navigateTimerRef.current)
    }
  }, [])
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: ChangePasswordFormData) => {
    setError('')
    if (data.newPassword === data.currentPassword) {
      setError('New password must be different from current password.')
      return
    }

    setLoading(true)
    const result = await changePassword(data.currentPassword, data.newPassword)
    setLoading(false)

    if (result.success) {
      setSuccess(true)
      navigateTimerRef.current = setTimeout(() => {
        navigate('/frontdesk')
      }, 1500)
    } else {
      setError(result.error || 'Failed to change password. Please try again.')
    }
  }

  const handleLogout = () => {
    clearMustChangePassword()
    logout()
    // Staff log in through the host section — /staff/login is a guest-mode
    // form that can never authenticate users-table staff credentials.
    navigate('/host/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-[var(--brand-primary,#1e3a5f)] px-8 py-6 text-center">
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <FormField label="Current Password" error={errors.currentPassword?.message} required>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        {...register('currentPassword')}
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
                  </FormField>

                  <FormField label="New Password" error={errors.newPassword?.message} required>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showNew ? 'text' : 'password'}
                        {...register('newPassword')}
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
                  </FormField>

                  <FormField label="Confirm New Password" error={errors.confirmPassword?.message} required>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        {...register('confirmPassword')}
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
                  </FormField>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 p-3 bg-red-50 rounded-lg">
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-[var(--brand-primary,#1e3a5f)] text-white rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>

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
