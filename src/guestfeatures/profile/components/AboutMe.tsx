import { useState } from 'react'
import { useAuth } from '../../../auth/AuthContext'
import { useUserProfile } from '../hooks/useUserProfile'
import { Camera, X, Star, Calendar, Shield, Mail, Phone, User, MapPin } from 'lucide-react'
import { StatBadge } from '../../../shared/components/StatBadge'

export default function AboutMe() {
  const { user, updateProfile } = useAuth()
  const {
    firstName, lastName, displayInitials,
    photoUrl, showPhotoMenu, setShowPhotoMenu,
    handlePhotoSelected, removePhoto,
    fileInputRef, cameraInputRef,
  } = useUserProfile()
  const [editingProfile, setEditingProfile] = useState(false)
  const [saving, setSaving] = useState(false)

  const [editForm, setEditForm] = useState({
    fullName: user?.full_name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || '',
    phone: user?.phone || '',
    nationality: user?.nationality || '',
  })

  const createdAt = (user as any)?.created_at || (user as any)?.createdAt
  const yearsOnPlatform = createdAt
    ? Math.max(1, Math.floor((Date.now() - new Date(createdAt).getTime()) / (365.25 * 24 * 60 * 60 * 1000)))
    : 0

  const fullNameFallback = user?.full_name || `${firstName} ${lastName}`.trim() || ''
  const handleSaveProfile = async () => {
    setSaving(true)
    await updateProfile({ full_name: editForm.fullName.trim() || fullNameFallback, phone: editForm.phone, nationality: editForm.nationality })
    setEditingProfile(false)
    setSaving(false)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-xl border border-brand-card-border overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            <div className="flex flex-col items-center shrink-0">
              <div className="relative">
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-card" />
                ) : (
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-brand-accent flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-card">
                    {displayInitials}
                  </div>
                )}
                <div
                  onClick={() => setShowPhotoMenu(v => !v)}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-brand-card-border flex items-center justify-center cursor-pointer shadow-sm hover:shadow transition-shadow"
                >
                  <Camera size={14} className="text-brand-text-secondary" />
                </div>
                {showPhotoMenu && (
                  <>
                    <div onClick={() => setShowPhotoMenu(false)} className="fixed inset-0 z-[49]" />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl z-50 min-w-[180px] overflow-hidden border border-brand-card-border shadow-modal">
                      <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-heading hover:bg-brand-secondary-surface transition-colors border-none cursor-pointer text-left">
                        <Camera size={15} className="text-brand-text-secondary" /> Upload from device
                      </button>
                      <button onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-heading hover:bg-brand-secondary-surface transition-colors border-none cursor-pointer text-left">
                        <Camera size={15} className="text-brand-text-secondary" /> Take photo
                      </button>
                      {photoUrl && (
                        <button onClick={removePhoto} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-danger hover:bg-brand-danger-light transition-colors border-none cursor-pointer text-left">
                          <X size={15} /> Remove photo
                        </button>
                      )}
                    </div>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelected} className="hidden" />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoSelected} className="hidden" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-brand-heading mb-1 text-center sm:text-left" style={{ fontFamily: "'Playfair Display', serif" }}>
                {user?.full_name || `${firstName} ${lastName}`}
              </h1>
              <div className="flex items-center gap-3 mb-4 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent-light text-brand-primary">
                  <User size={12} /> Guest
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-brand-text-secondary">
                  <Shield size={12} className="text-brand-success" /> Identity Verified
                </span>
              </div>

              {user?.country && (
                <div className="flex items-center gap-1.5 mb-4 text-sm text-brand-text-secondary justify-center sm:justify-start">
                  {user?.countryFlag && <span>{user.countryFlag}</span>}
                  <span>{user?.country}</span>
                  {user?.joinedDate && (
                    <span>· Member since {new Date(user.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 sm:gap-6 py-3 px-4 sm:px-5 rounded-lg bg-brand-background border border-brand-card-border mb-5 justify-center sm:justify-start">
                <StatBadge icon={Star} value={0} label="Reviews" />
                <div className="w-px h-5 bg-brand-card-border" />
                <StatBadge icon={Calendar} value={yearsOnPlatform} label={yearsOnPlatform === 1 ? 'Year on ServeIQ' : 'Years on ServeIQ'} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User size={15} className="text-brand-text-secondary shrink-0" />
                  <span className="w-16 text-brand-text-secondary">Name</span>
                  {editingProfile ? (
                    <input
                      value={editForm.fullName}
                      onChange={e => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Full name"
                      className="flex-1 max-w-[280px] px-3 py-1.5 text-sm border border-brand-card-border rounded-lg outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-brand-heading"
                    />
                  ) : (
                    <span className="text-brand-heading font-medium">{user?.full_name || `${firstName} ${lastName}`.trim()}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={15} className="text-brand-text-secondary shrink-0" />
                  <span className="w-16 text-brand-text-secondary">Email</span>
                  <span className="text-brand-heading">{user?.email || '—'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={15} className="text-brand-text-secondary shrink-0" />
                  <span className="w-16 text-brand-text-secondary">Phone</span>
                  {editingProfile ? (
                    <input
                      value={editForm.phone}
                      onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      className="flex-1 max-w-[220px] px-3 py-1.5 text-sm border border-brand-card-border rounded-lg outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-brand-heading"
                    />
                  ) : (
                    <span className="text-brand-heading">{user?.phone || <span className="text-brand-placeholder italic">Not provided</span>}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={15} className="text-brand-text-secondary shrink-0" />
                  <span className="w-16 text-brand-text-secondary">Nationality</span>
                  {editingProfile ? (
                    <input
                      value={editForm.nationality}
                      onChange={e => setEditForm(prev => ({ ...prev, nationality: e.target.value }))}
                      placeholder="e.g. Nepali"
                      className="flex-1 max-w-[220px] px-3 py-1.5 text-sm border border-brand-card-border rounded-lg outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-brand-heading"
                    />
                  ) : (
                    <span className="text-brand-heading">{user?.nationality || <span className="text-brand-placeholder italic">Not provided</span>}</span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-2">
                {editingProfile ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingProfile(false); setEditForm({ fullName: fullNameFallback, phone: user?.phone || '', nationality: user?.nationality || '' }) }}
                      className="px-5 py-2 text-sm font-semibold rounded-lg border border-brand-card-border bg-white text-brand-text-secondary hover:bg-brand-secondary-surface transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-5 py-2 text-sm font-semibold rounded-lg border-none text-white bg-brand-primary hover:bg-brand-primary-hover transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditForm({ fullName: fullNameFallback, phone: user?.phone || '', nationality: user?.nationality || '' }); setEditingProfile(true) }}
                    className="px-5 py-2 text-sm font-semibold rounded-lg border border-brand-card-border bg-white text-brand-heading hover:bg-brand-secondary-surface transition-colors cursor-pointer"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
