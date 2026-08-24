import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import {
  User,
  Shield,
  Bell,
  Clock,
  Camera,
  Calendar,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Lock,
  ChevronRight,
  CheckCircle2,
  Smartphone,
  Monitor,
  Globe,
  MapPin,
} from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Profile Information', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

const recentLogins = [
  { date: 'May 30, 2025 10:30 AM', location: 'Kathmandu, Nepal', browser: 'Chrome on Windows', current: true },
  { date: 'May 29, 2025 06:15 PM', location: 'Kathmandu, Nepal', browser: 'Chrome on Windows', current: false },
  { date: 'May 29, 2025 09:22 AM', location: 'Pokhara, Nepal', browser: 'Safari on iPhone', current: false },
  { date: 'May 28, 2025 08:10 PM', location: 'Butwal, Nepal', browser: 'Chrome on Windows', current: false },
]

export default function AdminProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const firstName = user?.firstName || user?.first_name || 'Admin'
  const lastName = user?.lastName || user?.last_name || ''
  const initials = (firstName?.[0] || '') + (lastName?.[0] || '')
  const displayInitials = initials.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'

  const [activeTab, setActiveTab] = useState('profile')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    fullName: `${firstName} ${lastName}`.trim() || 'Admin',
    username: firstName.toLowerCase(),
    email: user?.email || 'admin@stayeasy.com',
    altEmail: 'admin.contact@stayeasy.com',
    phoneCode: '+977',
    phoneNumber: '9841234567',
    timezone: '(GMT+05:45) Asia/Kathmandu',
    role: user?.role || 'Super Administrator',
    dateFormat: 'May 24, 2025 (MMM DD, YYYY)',
    language: 'English',
    timeFormat: '10:30 AM (12 Hours)',
  })

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  })

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader
          title="Admin Profile"
          subtitle={
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => navigate('/host/overall-dashboard')}>Dashboard</span>
              <ChevronRight size={14} color="#9ca3af" />
              <span>Admin Profile</span>
            </span>
          }
        />

        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            {/* Left - Main Content */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* Profile Header Card */}
              <div style={{
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                padding: 32,
                marginBottom: 24,
                display: 'flex',
                gap: 28,
                alignItems: 'flex-start',
              }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 100,
                    height: 100,
                    borderRadius: 12,
                    overflow: 'hidden',
                    background: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt={`${firstName} ${lastName}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 36, fontWeight: 700, color: '#0ea5e9' }}>{displayInitials}</span>
                    )}
                  </div>
                  <button style={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  }} title="Change profile picture">
                    <Camera size={14} color="#6b7280" />
                  </button>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#111827' }}>
                      {firstName} {lastName}
                    </h2>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: '#dcfce7',
                      color: '#16a34a',
                    }}>
                      {formData.role}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 12px' }}>
                    {formData.email}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: '#6b7280' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={14} />
                      Joined on Jan 15, 2024
                    </span>
                    <span style={{ color: '#d1d5db' }}>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={14} />
                      Last login: May 30, 2025 10:30 AM
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                marginBottom: 24,
                overflow: 'hidden',
              }}>
                <div style={{
                  display: 'flex',
                  borderBottom: '1px solid #e5e7eb',
                  overflowX: 'auto',
                }}>
                  {tabs.map(tab => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '14px 20px',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontSize: 13,
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? '#6366f1' : '#6b7280',
                          borderBottom: isActive ? '2px solid #6366f1' : '2px solid transparent',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s',
                        }}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                {/* Tab Content */}
                <div style={{ padding: 32 }}>
                  {activeTab === 'profile' && (
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                        Profile Information
                      </h3>
                      <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 28px' }}>
                        Update your personal information and account details.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
                        {/* Full Name */}
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleFormChange('fullName', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: 8,
                              border: '1px solid #e5e7eb',
                              background: '#fff',
                              fontSize: 14,
                              color: '#111827',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>

                        {/* Username */}
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                            Username
                          </label>
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleFormChange('username', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: 8,
                              border: '1px solid #e5e7eb',
                              background: '#fff',
                              fontSize: 14,
                              color: '#111827',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>

                        {/* Email Address */}
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleFormChange('email', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: 8,
                              border: '1px solid #e5e7eb',
                              background: '#fff',
                              fontSize: 14,
                              color: '#111827',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>

                        {/* Alternative Email */}
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                            Alternative Email (Optional)
                          </label>
                          <input
                            type="email"
                            value={formData.altEmail}
                            onChange={(e) => handleFormChange('altEmail', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: 8,
                              border: '1px solid #e5e7eb',
                              background: '#fff',
                              fontSize: 14,
                              color: '#111827',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                            Phone Number
                          </label>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <select
                              value={formData.phoneCode}
                              onChange={(e) => handleFormChange('phoneCode', e.target.value)}
                              style={{
                                padding: '10px 12px',
                                borderRadius: 8,
                                border: '1px solid #e5e7eb',
                                background: '#fff',
                                fontSize: 14,
                                color: '#111827',
                                outline: 'none',
                                cursor: 'pointer',
                                minWidth: 90,
                              }}
                            >
                              <option value="+977">+977</option>
                              <option value="+1">+1</option>
                              <option value="+44">+44</option>
                              <option value="+91">+91</option>
                              <option value="+61">+61</option>
                            </select>
                            <input
                              type="tel"
                              value={formData.phoneNumber}
                              onChange={(e) => handleFormChange('phoneNumber', e.target.value)}
                              style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: 8,
                                border: '1px solid #e5e7eb',
                                background: '#fff',
                                fontSize: 14,
                                color: '#111827',
                                outline: 'none',
                                boxSizing: 'border-box',
                              }}
                            />
                          </div>
                        </div>

                        {/* Timezone */}
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                            Timezone
                          </label>
                          <select
                            value={formData.timezone}
                            onChange={(e) => handleFormChange('timezone', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: 8,
                              border: '1px solid #e5e7eb',
                              background: '#fff',
                              fontSize: 14,
                              color: '#111827',
                              outline: 'none',
                              cursor: 'pointer',
                              boxSizing: 'border-box',
                            }}
                          >
                            <option>(GMT+05:45) Asia/Kathmandu</option>
                            <option>(GMT+00:00) London</option>
                            <option>(GMT-05:00) New York</option>
                            <option>(GMT+05:30) India</option>
                            <option>(GMT+08:00) Singapore</option>
                          </select>
                        </div>

                        {/* Role */}
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                            Role
                          </label>
                          <input
                            type="text"
                            value={formData.role}
                            disabled
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: 8,
                              border: '1px solid #e5e7eb',
                              background: '#f9fafb',
                              fontSize: 14,
                              color: '#6b7280',
                              outline: 'none',
                              boxSizing: 'border-box',
                              cursor: 'not-allowed',
                            }}
                          />
                        </div>

                        {/* Date Format */}
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                            Date Format
                          </label>
                          <select
                            value={formData.dateFormat}
                            onChange={(e) => handleFormChange('dateFormat', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: 8,
                              border: '1px solid #e5e7eb',
                              background: '#fff',
                              fontSize: 14,
                              color: '#111827',
                              outline: 'none',
                              cursor: 'pointer',
                              boxSizing: 'border-box',
                            }}
                          >
                            <option>May 24, 2025 (MMM DD, YYYY)</option>
                            <option>24 May 2025 (DD MMM YYYY)</option>
                            <option>2025-05-24 (YYYY-MM-DD)</option>
                            <option>05/24/2025 (MM/DD/YYYY)</option>
                          </select>
                        </div>

                        {/* Language */}
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                            Language
                          </label>
                          <select
                            value={formData.language}
                            onChange={(e) => handleFormChange('language', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: 8,
                              border: '1px solid #e5e7eb',
                              background: '#fff',
                              fontSize: 14,
                              color: '#111827',
                              outline: 'none',
                              cursor: 'pointer',
                              boxSizing: 'border-box',
                            }}
                          >
                            <option>English</option>
                            <option>Nepali</option>
                            <option>Hindi</option>
                          </select>
                        </div>

                        {/* Time Format */}
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                            Time Format
                          </label>
                          <select
                            value={formData.timeFormat}
                            onChange={(e) => handleFormChange('timeFormat', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: 8,
                              border: '1px solid #e5e7eb',
                              background: '#fff',
                              fontSize: 14,
                              color: '#111827',
                              outline: 'none',
                              cursor: 'pointer',
                              boxSizing: 'border-box',
                            }}
                          >
                            <option>10:30 AM (12 Hours)</option>
                            <option>10:30 (24 Hours)</option>
                          </select>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 32 }}>
                        <button style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 24px',
                          borderRadius: 8,
                          border: 'none',
                          background: '#6366f1',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: 14,
                          fontWeight: 600,
                        }}>
                          <Save size={16} />
                          Save Changes
                        </button>
                        <button style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 24px',
                          borderRadius: 8,
                          border: '1px solid #e5e7eb',
                          background: '#fff',
                          color: '#374151',
                          cursor: 'pointer',
                          fontSize: 14,
                          fontWeight: 500,
                        }}>
                          <RotateCcw size={16} />
                          Reset
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                      {/* Two-Factor Authentication */}
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                          Two-Factor Authentication
                        </h3>
                        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 20px' }}>
                          Add an extra layer of security to your account by enabling two-factor authentication.
                        </p>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px 20px',
                          background: '#f9fafb',
                          borderRadius: 10,
                          border: '1px solid #e5e7eb',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{
                              width: 40,
                              height: 40,
                              borderRadius: 10,
                              background: '#ede9fe',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <Smartphone size={20} color="#7c3aed" />
                            </div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Authenticator App</div>
                              <div style={{ fontSize: 13, color: '#6b7280' }}>Use an authenticator app to generate one-time codes</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 600,
                              background: '#fef3c7',
                              color: '#d97706',
                            }}>
                              Not Enabled
                            </span>
                            <button style={{
                              padding: '8px 16px',
                              borderRadius: 8,
                              border: 'none',
                              background: '#6366f1',
                              color: '#fff',
                              cursor: 'pointer',
                              fontSize: 13,
                              fontWeight: 600,
                            }}>
                              Set Up
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Login Alerts */}
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                          Login Alerts
                        </h3>
                        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 20px' }}>
                          Choose how you want to be notified about new sign-ins to your account.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                          {[
                            { label: 'Email notifications for new logins', desc: 'Receive an email when a new device signs into your account', enabled: true },
                            { label: 'SMS alerts for suspicious activity', desc: 'Get text messages for unusual sign-in attempts', enabled: false },
                            { label: 'Push notifications', desc: 'Receive push notifications on your mobile device', enabled: true },
                          ].map((alert, i) => (
                            <div
                              key={i}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '16px 20px',
                                background: '#f9fafb',
                                borderBottom: i < 2 ? '1px solid #e5e7eb' : 'none',
                                borderRadius: i === 0 ? '10px 10px 0 0' : i === 2 ? '0 0 10px 10px' : 0,
                              }}
                            >
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{alert.label}</div>
                                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{alert.desc}</div>
                              </div>
                              <div
                                style={{
                                  width: 44,
                                  height: 24,
                                  borderRadius: 12,
                                  background: alert.enabled ? '#6366f1' : '#d1d5db',
                                  position: 'relative',
                                  cursor: 'pointer',
                                  transition: 'background 0.2s',
                                  flexShrink: 0,
                                }}
                              >
                                <div style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: '50%',
                                  background: '#fff',
                                  position: 'absolute',
                                  top: 3,
                                  left: alert.enabled ? 23 : 3,
                                  transition: 'left 0.2s',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                                }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Active Sessions */}
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                          Active Sessions
                        </h3>
                        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 20px' }}>
                          Devices that are currently signed in to your account. Revoke any session you don't recognize.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                          {[
                            {
                              icon: Monitor,
                              device: 'Chrome on Windows',
                              location: 'Kathmandu, Nepal',
                              ip: '192.168.1.1',
                              lastActive: 'Active now',
                              current: true,
                            },
                            {
                              icon: Smartphone,
                              device: 'Safari on iPhone',
                              location: 'Pokhara, Nepal',
                              ip: '10.0.0.42',
                              lastActive: '2 hours ago',
                              current: false,
                            },
                            {
                              icon: Globe,
                              device: 'Firefox on macOS',
                              location: 'Lalitpur, Nepal',
                              ip: '172.16.0.8',
                              lastActive: '1 day ago',
                              current: false,
                            },
                          ].map((session, i) => {
                            const Icon = session.icon
                            return (
                              <div
                                key={i}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '16px 20px',
                                  background: '#f9fafb',
                                  borderBottom: i < 2 ? '1px solid #e5e7eb' : 'none',
                                  borderRadius: i === 0 ? '10px 10px 0 0' : i === 2 ? '0 0 10px 10px' : 0,
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                  <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                    background: session.current ? '#dcfce7' : '#f3f4f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                    <Icon size={20} color={session.current ? '#16a34a' : '#6b7280'} />
                                  </div>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{session.device}</span>
                                      {session.current && (
                                        <span style={{
                                          padding: '2px 8px',
                                          borderRadius: 10,
                                          fontSize: 10,
                                          fontWeight: 600,
                                          background: '#dcfce7',
                                          color: '#16a34a',
                                        }}>
                                          Current Session
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <MapPin size={12} />
                                      {session.location} · {session.ip} · {session.lastActive}
                                    </div>
                                  </div>
                                </div>
                                {!session.current && (
                                  <button style={{
                                    padding: '6px 14px',
                                    borderRadius: 8,
                                    border: '1px solid #e5e7eb',
                                    background: '#fff',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    fontSize: 12,
                                    fontWeight: 600,
                                  }}>
                                    Revoke
                                  </button>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
                      <Bell size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
                      <p style={{ fontSize: 15, fontWeight: 500 }}>This section is coming soon.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Change Password Card */}
              <div style={{
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                padding: 32,
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                  Change Password
                </h3>
                <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px' }}>
                  Ensure your account is using a long, random password to stay secure.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                  {/* Current Password */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                      Current Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwords.current}
                        onChange={(e) => handlePasswordChange('current', e.target.value)}
                        placeholder="Enter current password"
                        style={{
                          width: '100%',
                          padding: '10px 40px 10px 14px',
                          borderRadius: 8,
                          border: '1px solid #e5e7eb',
                          background: '#fff',
                          fontSize: 14,
                          color: '#111827',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      <button
                        onClick={() => setShowCurrentPassword(v => !v)}
                        style={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#9ca3af',
                          padding: 4,
                          display: 'flex',
                        }}
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwords.newPass}
                        onChange={(e) => handlePasswordChange('newPass', e.target.value)}
                        placeholder="Enter new password"
                        style={{
                          width: '100%',
                          padding: '10px 40px 10px 14px',
                          borderRadius: 8,
                          border: '1px solid #e5e7eb',
                          background: '#fff',
                          fontSize: 14,
                          color: '#111827',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      <button
                        onClick={() => setShowNewPassword(v => !v)}
                        style={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#9ca3af',
                          padding: 4,
                          display: 'flex',
                        }}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                      Confirm New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwords.confirm}
                        onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                        placeholder="Confirm new password"
                        style={{
                          width: '100%',
                          padding: '10px 40px 10px 14px',
                          borderRadius: 8,
                          border: '1px solid #e5e7eb',
                          background: '#fff',
                          fontSize: 14,
                          color: '#111827',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      <button
                        onClick={() => setShowConfirmPassword(v => !v)}
                        style={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#9ca3af',
                          padding: 4,
                          display: 'flex',
                        }}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 24px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#6366f1',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  marginTop: 24,
                }}>
                  <Lock size={16} />
                  Update Password
                </button>
              </div>
            </div>

            {/* Right Sidebar */}
            <div style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Account Overview */}
              <div style={{
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                padding: 24,
              }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 20px' }}>
                  Account Overview
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>Account Type</span>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      background: '#ede9fe',
                      color: '#7c3aed',
                    }}>
                      Super Administrator
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>Status</span>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      background: '#dcfce7',
                      color: '#16a34a',
                    }}>
                      Active
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>Email Verified</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500, color: '#111827' }}>
                      <CheckCircle2 size={16} color="#22c55e" />
                      Yes
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>Phone Verified</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500, color: '#111827' }}>
                      <CheckCircle2 size={16} color="#22c55e" />
                      Yes
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>Two-Factor Authentication</span>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      background: '#f3f4f6',
                      color: '#6b7280',
                    }}>
                      Disabled
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>Total Properties Access</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>4 Properties</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>Staff Managed</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>32 Staff Members</span>
                  </div>
                </div>
              </div>

              {/* Recent Login Activity */}
              <div style={{
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                padding: 24,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>
                    Recent Login Activity
                  </h4>
                  <span style={{ fontSize: 13, color: '#6366f1', cursor: 'pointer', fontWeight: 500 }}>
                    View All
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {recentLogins.map((login, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '14px 0',
                        borderBottom: i < recentLogins.length - 1 ? '1px solid #f3f4f6' : 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#dcfce7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <CheckCircle2 size={16} color="#22c55e" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>
                            {login.date}
                          </span>
                          {login.current && (
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: 10,
                              fontSize: 10,
                              fontWeight: 600,
                              background: '#dcfce7',
                              color: '#16a34a',
                            }}>
                              Current Session
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>
                          {login.location} • {login.browser}
                        </div>
                      </div>
                      <ChevronRight size={16} color="#d1d5db" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
