import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePropertyStore } from '../stores/propertyStore'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import { Camera, Upload } from 'lucide-react'
import { createStaff, uploadStaffImage } from '../services/pmsApi'
import { staffKeys } from '../lib/queryKeys'
import { mapStaffMemberToCreatePayload } from '../types/staff'

const roles = ['MANAGER', 'FRONT_DESK', 'HOUSEKEEPING', 'WAITER', 'KITCHEN', 'MAINTENANCE']
const statuses = ['ACTIVE', 'ON LEAVE', 'INACTIVE'] as const
const shifts = ['MORNING', 'EVENING', 'NIGHT'] as const

export default function AddStaffPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const citizenshipFrontRef = useRef<HTMLInputElement>(null)
  const citizenshipBackRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    jobRole: 'MANAGER',
    monthlySalary: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE' as typeof statuses[number],
    shift: 'MORNING' as typeof shifts[number],
  })

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [citizenshipFrontFile, setCitizenshipFrontFile] = useState<File | null>(null)
  const [citizenshipBackFile, setCitizenshipBackFile] = useState<File | null>(null)

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [citizenshipFrontPreview, setCitizenshipFrontPreview] = useState<string | null>(null)
  const [citizenshipBackPreview, setCitizenshipBackPreview] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
      if (citizenshipFrontPreview) URL.revokeObjectURL(citizenshipFrontPreview)
      if (citizenshipBackPreview) URL.revokeObjectURL(citizenshipBackPreview)
    }
  }, [photoPreview, citizenshipFrontPreview, citizenshipBackPreview])

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!currentPropertyId) throw new Error('No property selected')

      let profileUrl = null
      let frontUrl = null
      let backUrl = null

      if (photoFile) profileUrl = await uploadStaffImage(currentPropertyId, photoFile)
      if (citizenshipFrontFile) frontUrl = await uploadStaffImage(currentPropertyId, citizenshipFrontFile)
      if (citizenshipBackFile) backUrl = await uploadStaffImage(currentPropertyId, citizenshipBackFile)

      const payload = mapStaffMemberToCreatePayload({
        name: form.fullName,
        email: form.email,
        contact: form.contactNumber,
        role: form.jobRole,
        monthlySalary: form.monthlySalary ? Number(form.monthlySalary) : 0,
        joiningDate: form.joiningDate,
        status: form.status === 'ACTIVE' ? 'Active' : form.status === 'ON LEAVE' ? 'On Leave' : 'Inactive',
        shift: form.shift,
        photo: profileUrl ?? undefined,
        citizenshipFront: frontUrl ?? undefined,
        citizenshipBack: backUrl ?? undefined,
      })
      return createStaff(currentPropertyId, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all })
      navigate('/host/staff')
    },
    onError: (error: Error) => {
      alert(`Failed to create staff: ${error.message}`)
    },
  })

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
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
                Create accounts for Receptionists, Kitchen Staff, etc. for the StayEasy ecosystem.
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

          {/* Main Form Card */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 32, marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
              {/* Full Name */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Ram Tamang"
                  value={form.fullName}
                  onChange={e => handleChange('fullName', e.target.value)}
                />
              </div>

              {/* Email Address */}
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  style={inputStyle}
                  type="email"
                  placeholder="john.doe@email.com"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                />
              </div>

              {/* Contact Number */}
              <div>
                <label style={labelStyle}>Contact Number</label>
                <input
                  style={inputStyle}
                  placeholder="9848908675"
                  value={form.contactNumber}
                  onChange={e => handleChange('contactNumber', e.target.value)}
                />
              </div>

              {/* Job Role */}
              <div>
                <label style={labelStyle}>Job Role</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={form.jobRole}
                  onChange={e => handleChange('jobRole', e.target.value)}
                >
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Monthly Salary */}
              <div>
                <label style={labelStyle}>Monthly Salary ($)</label>
                <input
                  style={inputStyle}
                  type="number"
                  placeholder="3200"
                  value={form.monthlySalary}
                  onChange={e => handleChange('monthlySalary', e.target.value)}
                />
              </div>

              {/* Joining Date */}
              <div>
                <label style={labelStyle}>Joining Date</label>
                <input
                  style={inputStyle}
                  type="date"
                  value={form.joiningDate}
                  onChange={e => handleChange('joiningDate', e.target.value)}
                />
              </div>

              {/* Status */}
              <div>
                <label style={labelStyle}>Status</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={form.status}
                  onChange={e => handleChange('status', e.target.value)}
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Shift */}
              <div>
                <label style={labelStyle}>Shift</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={form.shift}
                  onChange={e => handleChange('shift', e.target.value)}
                >
                  {shifts.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
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
              onClick={() => {
                if (!form.fullName || !form.email) {
                  alert('Please fill in Full Name and Email Address')
                  return
                }
                if (!currentPropertyId) {
                  alert('No property selected')
                  return
                }
                createMutation.mutate()
              }}
              disabled={createMutation.isPending}
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
                opacity: createMutation.isPending ? 0.6 : 1,
              }}
            >
              {createMutation.isPending ? 'Creating...' : 'Create New Staff'}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
