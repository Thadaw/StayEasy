import { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useUserProfile } from '../hooks/useUserProfile'
import { Camera, Pencil, Check, X, Star, Calendar, Shield, Mail, Phone, User, MapPin } from 'lucide-react'
import { StatBadge } from '../../../shared/components/StatBadge'
import api from '../../../services/axios'

interface GuestProfile {
  full_name: string
  email: string
  phone: string
  nationality: string
  id: string
  created_at: string
}

export default function AboutMe() {
  const { user, updateProfile } = useAuth()
  const {
    firstName, lastName, displayInitials,
    photoUrl, showPhotoMenu, setShowPhotoMenu,
    handlePhotoSelected, removePhoto,
    fileInputRef, cameraInputRef,
  } = useUserProfile()
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingBio, setEditingBio] = useState(false)
  const [aboutText, setAboutText] = useState(user?.aboutMe || '')
  const [saving, setSaving] = useState(false)
  const [guestProfile, setGuestProfile] = useState<GuestProfile | null>(null)

  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  })

  const yearsOnPlatform = user?.joinedDate
    ? Math.max(1, Math.floor((Date.now() - new Date(user.joinedDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)))
    : 0

  useEffect(() => {
    setAboutText(user?.aboutMe || '')
  }, [user?.aboutMe])

  useEffect(() => {
    const loadGuestProfile = async () => {
      try {
        const { data } = await api.get<GuestProfile>('/auth/guests/me')
        setGuestProfile(data)
      } catch (error) {
        console.error('Failed to load guest profile:', error)
      }
    }
    loadGuestProfile()
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    const first = editForm.firstName.trim()
    const last = editForm.lastName.trim()
    await updateProfile({ first_name: first || firstName, last_name: last || lastName, phone: editForm.phone })
    setEditingProfile(false)
    setSaving(false)
  }

  const handleSaveBio = async () => {
    setSaving(true)
    await updateProfile({ aboutMe: aboutText })
    setEditingBio(false)
    setSaving(false)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-xl border border-brand-card-border overflow-hidden">
        <div className="p-8">
          <div className="flex items-start gap-8">
            <div className="flex flex-col items-center shrink-0">
              <div className="relative">
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-card" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-brand-accent flex items-center justify-center text-3xl font-bold text-white shadow-card">
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
              <h1 className="text-2xl font-bold text-brand-heading mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {guestProfile?.full_name || `${firstName} ${lastName}`}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent-light text-brand-primary">
                  <User size={12} /> Guest
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-brand-text-secondary">
                  <Shield size={12} className="text-brand-success" /> Identity Verified
                </span>
              </div>

              {(guestProfile?.nationality || user?.country) && (
                <div className="flex items-center gap-1.5 mb-4 text-sm text-brand-text-secondary">
                  {user?.countryFlag && <span>{user.countryFlag}</span>}
                  <span>{guestProfile?.nationality || user?.country}</span>
                  {(guestProfile?.created_at || user?.joinedDate) && (
                    <span>· Member since {new Date(guestProfile?.created_at || user?.joinedDate || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-6 py-3 px-5 rounded-lg bg-brand-background border border-brand-card-border mb-5">
                <StatBadge icon={Star} value={0} label="Reviews" />
                <div className="w-px h-5 bg-brand-card-border" />
                <StatBadge icon={Calendar} value={yearsOnPlatform} label={yearsOnPlatform === 1 ? 'Year on StayEasy' : 'Years on StayEasy'} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User size={15} className="text-brand-text-secondary shrink-0" />
                  <span className="w-16 text-brand-text-secondary">Name</span>
                  {editingProfile ? (
                    <div className="flex gap-2 flex-1">
                      <input
                        value={editForm.firstName}
                        onChange={e => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="First name"
                        className="flex-1 px-3 py-1.5 text-sm border border-brand-card-border rounded-lg outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-brand-heading"
                      />
                      <input
                        value={editForm.lastName}
                        onChange={e => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Last name"
                        className="flex-1 px-3 py-1.5 text-sm border border-brand-card-border rounded-lg outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-brand-heading"
                      />
                    </div>
                  ) : (
                    <span className="text-brand-heading font-medium">{guestProfile?.full_name || firstName} {lastName}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={15} className="text-brand-text-secondary shrink-0" />
                  <span className="w-16 text-brand-text-secondary">Email</span>
                  <span className="text-brand-heading">{guestProfile?.email || user?.email || '—'}</span>
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
                    <span className="text-brand-heading">{guestProfile?.phone || user?.phone || <span className="text-brand-placeholder italic">Not provided</span>}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={15} className="text-brand-text-secondary shrink-0" />
                  <span className="w-16 text-brand-text-secondary">Nationality</span>
                  <span className="text-brand-heading">{guestProfile?.nationality || <span className="text-brand-placeholder italic">Not provided</span>}</span>
                </div>
              </div>

              <div className="mt-6">
                {editingProfile ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingProfile(false); setEditForm({ firstName, lastName, phone: user?.phone || '' }) }}
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
                    onClick={() => { setEditForm({ firstName, lastName, phone: user?.phone || '' }); setEditingProfile(true) }}
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

      <div className="bg-white rounded-xl border border-brand-card-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-card-border">
          <div className="flex items-center gap-2">
            <Pencil size={15} className="text-brand-text-secondary" />
            <h2 className="text-base font-semibold text-brand-heading">About Me</h2>
          </div>
          {!editingBio && (
            <button
              onClick={() => { setAboutText(user?.aboutMe || ''); setEditingBio(true) }}
              className="text-sm font-semibold border-none bg-transparent cursor-pointer text-brand-accent hover:text-brand-accent-hover transition-colors"
            >
              {user?.aboutMe ? 'Edit' : 'Add bio'}
            </button>
          )}
        </div>
        <div className="px-6 py-5">
          {editingBio ? (
            <div>
              <textarea
                value={aboutText}
                onChange={e => setAboutText(e.target.value)}
                placeholder="Tell guests about yourself..."
                maxLength={500}
                className="w-full min-h-[120px] px-4 py-3 text-sm border border-brand-card-border rounded-lg outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent text-brand-heading resize-y"
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-brand-placeholder">{aboutText.length}/500</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingBio(false); setAboutText(user?.aboutMe || '') }}
                    className="px-4 py-2 text-sm font-semibold rounded-lg border border-brand-card-border bg-white text-brand-text-secondary hover:bg-brand-secondary-surface transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button
                    onClick={handleSaveBio}
                    disabled={saving}
                    className="px-4 py-2 text-sm font-semibold rounded-lg border-none text-white bg-brand-accent hover:bg-brand-accent-hover transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Check size={14} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {user?.aboutMe ? (
                <p className="text-sm text-brand-heading leading-relaxed whitespace-pre-wrap">{user.aboutMe}</p>
              ) : (
                <p className="text-sm text-brand-placeholder italic">No bio added yet. Share a bit about yourself.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
