import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { usePropertyStore } from '@/store/properties/propertyStore'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import { Camera, Upload, Building2, AlertTriangle } from 'lucide-react'
import { mapStaffMemberToCreatePayload } from '@/types/staff'
import { useAdminPropertiesQuery } from '@/services/queries/admin/staffQueries'
import { useCreateStaff } from '@/services/mutations/admin/staffMutations'
import { staffFormSchema, type StaffFormData, roles, statuses, shifts } from '@/schemas/admin/staffSchema'

function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string } | undefined
    return data?.error || data?.message || error.message
  }
  return error instanceof Error ? error.message : 'Unknown error'
}

function isSubscriptionError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 403 &&
    /subscription/i.test(getApiErrorMessage(error))
}

export default function AddStaffPage() {
  const navigate = useNavigate()
  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const setCurrentPropertyId = usePropertyStore((s) => s.setCurrentPropertyId)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const { data: allProperties = [] } = useAdminPropertiesQuery()
  const properties = allProperties.filter((p) => p.is_active !== false)

  const selectedProperty = properties.find((p) => p.id === currentPropertyId) ?? null
  const citizenshipFrontRef = useRef<HTMLInputElement>(null)
  const citizenshipBackRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      contactNumber: '',
      jobRole: 'MANAGER',
      monthlySalary: '',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      shift: 'MORNING',
    },
  })

  const formValues = watch()

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [citizenshipFrontFile, setCitizenshipFrontFile] = useState<File | null>(null)
  const [citizenshipBackFile, setCitizenshipBackFile] = useState<File | null>(null)

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [citizenshipFrontPreview, setCitizenshipFrontPreview] = useState<string | null>(null)
  const [citizenshipBackPreview, setCitizenshipBackPreview] = useState<string | null>(null)
  const [subscriptionError, setSubscriptionError] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
      if (citizenshipFrontPreview) URL.revokeObjectURL(citizenshipFrontPreview)
      if (citizenshipBackPreview) URL.revokeObjectURL(citizenshipBackPreview)
    }
  }, [photoPreview, citizenshipFrontPreview, citizenshipBackPreview])

  const { createStaff, isCreating } = useCreateStaff(currentPropertyId)

  const handleChange = (field: keyof StaffFormData, value: string) => {
    setValue(field, value as never, { shouldValidate: true })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setFile: (f: File | null) => void, setPreview: (p: string | null) => void, oldPreview: string | null) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }
    if (oldPreview) URL.revokeObjectURL(oldPreview)
    setFile(file)
    setPreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  const handleRemovePhoto = (setFile: (f: File | null) => void, setPreview: (p: string | null) => void, preview: string | null) => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #E5E7EB',
    background: '#fff',
    fontSize: 14,
    color: '#374151',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
    display: 'block',
  }

  const uploadBoxStyle: React.CSSProperties = {
    border: '2px dashed #D1D5DB',
    borderRadius: 10,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    background: '#FAFAFA',
    minHeight: 140,
    transition: 'border-color 0.15s',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader title="Staff" subtitle="Add New Staff" />

        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>Add New Staff</h2>
              <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0' }}>
                Create accounts for Receptionists, Kitchen Staff, etc. for the ServeIQ ecosystem.
              </p>
            </div>
            <button
              onClick={() => navigate('/host/staff')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                background: '#fff',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                color: '#374151',
              }}
            >
              ← Back to List
            </button>
          </div>

          {/* Subscription Required Banner */}
          {subscriptionError && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px',
              borderRadius: 10, border: '1px solid #FDE68A', background: '#FFFBEB', marginBottom: 24,
            }}>
              <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#92400E' }}>
                  No active subscription found
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#A16207' }}>
                  Please subscribe to a plan to add staff members.
                </p>
              </div>
              <button
                onClick={() => navigate('/host/pricing')}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: 'none', background: '#D97706',
                  color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                }}
              >
                View Plans
              </button>
            </div>
          )}

          {/* Generic Create Error */}
          {createError && !subscriptionError && (
            <div style={{
              padding: '12px 18px', borderRadius: 10, border: '1px solid #FECACA',
              background: '#FEF2F2', marginBottom: 24, fontSize: 13, color: '#B91C1C',
            }}>
              Failed to create staff: {createError}
            </div>
          )}

          {/* Select Property Section */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={18} color="#2563EB" />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Select Property</h3>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>Choose the property this staff member will be assigned to</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
              <div>
                <label style={labelStyle}>Property</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={currentPropertyId ?? ''}
                  onChange={e => setCurrentPropertyId(e.target.value || null)}
                >
                  <option value="" disabled>Select a property</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}{p.city ? ` — ${p.city}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Property Location</label>
                <input
                  style={{ ...inputStyle, background: '#F9FAFB', color: '#6B7280' }}
                  value={selectedProperty?.city ?? '—'}
                  readOnly
                  tabIndex={-1}
                />
              </div>
            </div>
            {properties.length === 0 && (
              <p style={{ fontSize: 12, color: '#DC2626', marginTop: 10 }}>No active properties found. Please add a property first.</p>
            )}
          </div>

          {/* Main Form Card */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 32, marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
              {/* Full Name */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Ram Tamang"
                  {...register('fullName')}
                />
                {errors.fullName && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.fullName.message}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  style={inputStyle}
                  type="email"
                  placeholder="john.doe@email.com"
                  {...register('email')}
                />
                {errors.email && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.email.message}</p>}
              </div>

              {/* Contact Number */}
              <div>
                <label style={labelStyle}>Contact Number</label>
                <input
                  style={inputStyle}
                  placeholder="9848908675"
                  {...register('contactNumber')}
                />
                {errors.contactNumber && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.contactNumber.message}</p>}
              </div>

              {/* Job Role */}
              <div>
                <label style={labelStyle}>Job Role</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={formValues.jobRole}
                  onChange={e => handleChange('jobRole', e.target.value)}
                >
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.jobRole && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.jobRole.message}</p>}
              </div>

              {/* Monthly Salary */}
              <div>
                <label style={labelStyle}>Monthly Salary ($)</label>
                <input
                  style={inputStyle}
                  type="number"
                  placeholder="3200"
                  {...register('monthlySalary')}
                />
                {errors.monthlySalary && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.monthlySalary.message}</p>}
              </div>

              {/* Joining Date */}
              <div>
                <label style={labelStyle}>Joining Date</label>
                <input
                  style={inputStyle}
                  type="date"
                  value={formValues.joiningDate}
                  onChange={e => handleChange('joiningDate', e.target.value)}
                />
                {errors.joiningDate && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.joiningDate.message}</p>}
              </div>

              {/* Status */}
              <div>
                <label style={labelStyle}>Status</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={formValues.status}
                  onChange={e => handleChange('status', e.target.value)}
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.status && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.status.message}</p>}
              </div>

              {/* Shift */}
              <div>
                <label style={labelStyle}>Shift</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={formValues.shift}
                  onChange={e => handleChange('shift', e.target.value)}
                >
                  {shifts.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.shift && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.shift.message}</p>}
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 32, marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 24px' }}>Documents</h3>

            {/* Photo Upload */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ ...labelStyle, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>PHOTO</label>
              {photoPreview ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                  <img src={photoPreview} alt="Staff" style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover', border: '1px solid #E5E7EB' }} />
                  <div>
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#374151', marginRight: 8 }}
                    >
                      Replace Photo
                    </button>
                    <button
                      onClick={() => handleRemovePhoto(setPhotoFile, setPhotoPreview, photoPreview)}
                      style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #FEE2E2', background: '#FEF2F2', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#DC2626' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => photoInputRef.current?.click()}
                  style={uploadBoxStyle}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#9CA3AF'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#D1D5DB'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', marginBottom: 12, fontSize: 13, fontWeight: 500, color: '#374151' }}>
                    <Upload size={14} /> Add Photo
                  </div>
                  <Camera size={28} color="#D1D5DB" />
                </div>
              )}
              <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 10 }}>ℹ</span> Image size should be less than 5MB
              </p>
              <input ref={photoInputRef} type="file" accept="image/*" onChange={e => handleFileUpload(e, setPhotoFile, setPhotoPreview, photoPreview)} style={{ display: 'none' }} />
            </div>

            {/* Citizenship Front & Back */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Citizenship Front */}
              <div>
                <label style={{ ...labelStyle, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>CITIZENSHIP FRONT</label>
                {citizenshipFrontPreview ? (
                  <div style={{ marginTop: 8 }}>
                    <img src={citizenshipFrontPreview} alt="Citizenship Front" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid #E5E7EB' }} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button
                        onClick={() => citizenshipFrontRef.current?.click()}
                        style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#374151' }}
                      >
                        Replace Image
                      </button>
                      <button
                        onClick={() => handleRemovePhoto(setCitizenshipFrontFile, setCitizenshipFrontPreview, citizenshipFrontPreview)}
                        style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #FEE2E2', background: '#FEF2F2', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#DC2626' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => citizenshipFrontRef.current?.click()}
                    style={{ ...uploadBoxStyle, minHeight: 120 }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#9CA3AF'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#D1D5DB'}
                  >
                    <div style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', marginBottom: 8, fontSize: 12, fontWeight: 500, color: '#374151' }}>
                      Add Citizenship Front
                    </div>
                    <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Not added</p>
                  </div>
                )}
                <input ref={citizenshipFrontRef} type="file" accept="image/*" onChange={e => handleFileUpload(e, setCitizenshipFrontFile, setCitizenshipFrontPreview, citizenshipFrontPreview)} style={{ display: 'none' }} />
              </div>

              {/* Citizenship Back */}
              <div>
                <label style={{ ...labelStyle, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>CITIZENSHIP BACK</label>
                {citizenshipBackPreview ? (
                  <div style={{ marginTop: 8 }}>
                    <img src={citizenshipBackPreview} alt="Citizenship Back" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid #E5E7EB' }} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button
                        onClick={() => citizenshipBackRef.current?.click()}
                        style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#374151' }}
                      >
                        Replace Image
                      </button>
                      <button
                        onClick={() => handleRemovePhoto(setCitizenshipBackFile, setCitizenshipBackPreview, citizenshipBackPreview)}
                        style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #FEE2E2', background: '#FEF2F2', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#DC2626' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => citizenshipBackRef.current?.click()}
                    style={{ ...uploadBoxStyle, minHeight: 120 }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#9CA3AF'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#D1D5DB'}
                  >
                    <div style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', marginBottom: 8, fontSize: 12, fontWeight: 500, color: '#374151' }}>
                      Add Citizenship Back
                    </div>
                    <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Not added</p>
                  </div>
                )}
                <input ref={citizenshipBackRef} type="file" accept="image/*" onChange={e => handleFileUpload(e, setCitizenshipBackFile, setCitizenshipBackPreview, citizenshipBackPreview)} style={{ display: 'none' }} />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              onClick={() => navigate('/host/staff')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 20px',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                background: '#fff',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                color: '#374151',
              }}
            >
              Discard Changes
            </button>
            <button
              onClick={handleSubmit(async (data) => {
                if (!currentPropertyId) {
                  alert('No property selected')
                  return
                }
                setSubscriptionError(false)
                setCreateError(null)
                try {
                  const payload = mapStaffMemberToCreatePayload({
                    name: data.fullName,
                    email: data.email,
                    contact: data.contactNumber,
                    role: data.jobRole,
                    monthlySalary: data.monthlySalary ? Number(data.monthlySalary) : 0,
                    joiningDate: data.joiningDate,
                    status: data.status === 'ACTIVE' ? 'Active' : data.status === 'ON LEAVE' ? 'On Leave' : 'Inactive',
                    shift: data.shift,
                    photo: undefined,
                    citizenshipFront: undefined,
                    citizenshipBack: undefined,
                  })
                  await createStaff(payload, {
                    photo: photoFile,
                    front: citizenshipFrontFile,
                    back: citizenshipBackFile,
                  })
                  navigate('/host/staff')
                } catch (error: unknown) {
                  if (isSubscriptionError(error)) {
                    setSubscriptionError(true)
                    setCreateError(null)
                    return
                  }
                  setCreateError(getApiErrorMessage(error))
                  setSubscriptionError(false)
                }
              })}
              disabled={isCreating}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 24px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--primary)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: '#fff',
                opacity: isCreating ? 0.6 : 1,
              }}
            >
              {isCreating ? 'Creating...' : 'Create New Staff'}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
