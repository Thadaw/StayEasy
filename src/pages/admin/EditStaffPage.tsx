import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePropertyStore } from '@/store/properties/propertyStore'
import Sidebar from '@/components/admin/dashboard/Sidebar'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import { Camera, Upload } from 'lucide-react'
import { mapApiStaffToStaffMember, toApiJobRole, toApiStatus } from '@/types/staff'
import { useStaffDetailQuery } from '@/services/queries/admin/staffQueries'
import { useUpdateStaff } from '@/services/mutations/admin/staffMutations'
import { staffFormSchema, type StaffFormData, roles, statuses, shifts } from '@/schemas/admin/staffSchema'

export default function EditStaffPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const currentPropertyId = usePropertyStore((s) => s.currentPropertyId)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const citizenshipFrontRef = useRef<HTMLInputElement>(null)
  const citizenshipBackRef = useRef<HTMLInputElement>(null)

  const { data: apiStaff, isLoading } = useStaffDetailQuery(currentPropertyId, id)

  const staffMember = useMemo(
    () => (apiStaff ? mapApiStaffToStaffMember(apiStaff) : null),
    [apiStaff]
  )

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
      joiningDate: '',
      status: 'ACTIVE',
      shift: 'MORNING',
    },
  })

  const [isActive, setIsActive] = useState(true)
  const [photo, setPhoto] = useState<string | File | null>(null)
  const [citizenshipFront, setCitizenshipFront] = useState<string | File | null>(null)
  const [citizenshipBack, setCitizenshipBack] = useState<string | File | null>(null)

  useEffect(() => {
    if (staffMember && apiStaff) {
      const apiStatus = apiStaff.status ?? 'ACTIVE'
      setValue('fullName', staffMember.name)
      setValue('email', staffMember.email)
      setValue('contactNumber', staffMember.contact)
      setValue('jobRole', apiStaff.job_role as StaffFormData['jobRole'])
      setValue('monthlySalary', staffMember.monthlySalary?.toString() ?? '')
      setValue('joiningDate', apiStaff.joining_date)
      setValue('status', (apiStatus === 'ON_LEAVE' ? 'ON LEAVE' : apiStatus) as StaffFormData['status'])
      setValue('shift', (apiStaff.shift ?? 'MORNING') as StaffFormData['shift'])
      setIsActive(apiStatus === 'ACTIVE')
      setPhoto(staffMember.photo ?? null)
      setCitizenshipFront(staffMember.citizenshipFront ?? null)
      setCitizenshipBack(staffMember.citizenshipBack ?? null)
    }
  }, [staffMember, apiStaff, setValue])

  useEffect(() => {
    return () => {
      if (photo instanceof File) URL.revokeObjectURL(URL.createObjectURL(photo))
      if (citizenshipFront instanceof File) URL.revokeObjectURL(URL.createObjectURL(citizenshipFront))
      if (citizenshipBack instanceof File) URL.revokeObjectURL(URL.createObjectURL(citizenshipBack))
    }
  }, [])

  const { updateStaff, isUpdating } = useUpdateStaff(currentPropertyId, id)

  const handleChange = (field: keyof StaffFormData, value: string) => {
    setValue(field, value as never, { shouldValidate: true })
  }

  const getPreviewUrl = (val: string | File | null): string | null => {
    if (!val) return null
    if (typeof val === 'string') return val
    return URL.createObjectURL(val)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | File | null) => void) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }
    setter(file)
    e.target.value = ''
  }

  const handleRemovePhoto = (setter: (val: string | File | null) => void) => {
    setter(null)
  }

  const onSubmit = async (data: StaffFormData) => {
    try {
      await updateStaff({
        full_name: data.fullName,
        phone_number: data.contactNumber,
        job_role: toApiJobRole(data.jobRole),
        monthly_salary: data.monthlySalary ? Number(data.monthlySalary) : 0,
        joining_date: data.joiningDate,
        status: toApiStatus(data.status === 'ACTIVE' ? 'Active' : data.status === 'ON LEAVE' ? 'On Leave' : 'Inactive'),
        shift: data.shift,
        photos: null,
      }, {
        photo: photo instanceof File ? photo : undefined,
        front: citizenshipFront instanceof File ? citizenshipFront : undefined,
        back: citizenshipBack instanceof File ? citizenshipBack : undefined,
      })
      navigate('/host/staff')
    } catch (error: unknown) {
      alert(`Failed to update staff: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
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

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 20px',
    paddingBottom: 12,
    borderBottom: '1px solid #F3F4F6',
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

  if (isLoading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <DashboardHeader title="Staff" subtitle="Edit Employee" />
          <main style={{ padding: 24, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', fontSize: 14 }}>
            Loading staff details...
          </main>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <DashboardHeader title="Staff" subtitle="Edit Employee" />

        <main style={{ padding: 24, flex: 1, overflow: 'auto' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>Edit Employee</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: '#6B7280' }}>Active</span>
              <div
                onClick={() => {
                  setIsActive(v => !v)
                   setValue('status', isActive ? 'INACTIVE' : 'ACTIVE')
                 }}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: isActive ? '#6366f1' : '#D1D5DB',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: 3,
                  left: isActive ? 23 : 3,
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }} />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 32, marginBottom: 24 }}>
            <h3 style={sectionTitleStyle}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Full Name</label>
                <input style={inputStyle} {...register('fullName')} />
                {errors.fullName && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.fullName.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input style={inputStyle} type="email" {...register('email')} />
                {errors.email && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.email.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Contact Number</label>
                <input style={inputStyle} {...register('contactNumber')} />
                {errors.contactNumber && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.contactNumber.message}</p>}
              </div>
            </div>
          </div>

          {/* Job & Salary */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 32, marginBottom: 24 }}>
            <h3 style={sectionTitleStyle}>Job & Salary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>
              <div>
                <label style={labelStyle}>Job Role</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={watch('jobRole')} onChange={e => handleChange('jobRole', e.target.value)}>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.jobRole && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.jobRole.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Monthly Salary ($)</label>
                <input style={inputStyle} type="number" {...register('monthlySalary')} />
                {errors.monthlySalary && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.monthlySalary.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Joining Date</label>
                <input style={inputStyle} type="date" value={watch('joiningDate')} onChange={e => handleChange('joiningDate', e.target.value)} />
                {errors.joiningDate && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.joiningDate.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={watch('status')}
                  onChange={e => { handleChange('status', e.target.value); setIsActive(e.target.value === 'ACTIVE') }}
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.status && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.status.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Shift</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={watch('shift')} onChange={e => handleChange('shift', e.target.value)}>
                  {shifts.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.shift && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.shift.message}</p>}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 32, marginBottom: 24 }}>
            <h3 style={sectionTitleStyle}>Documents</h3>

            {/* Photo */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ ...labelStyle, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>PHOTO</label>
              {getPreviewUrl(photo) ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                  <img src={getPreviewUrl(photo)!} alt="Staff" style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover', border: '1px solid #E5E7EB' }} />
                  <div>
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#374151', marginRight: 8 }}
                    >
                      Replace Photo
                    </button>
                    <button
                      onClick={() => handleRemovePhoto(setPhoto)}
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
              <input ref={photoInputRef} type="file" accept="image/*" onChange={e => handleFileUpload(e, setPhoto)} style={{ display: 'none' }} />
            </div>

            {/* Citizenship */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ ...labelStyle, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>CITIZENSHIP FRONT</label>
                {getPreviewUrl(citizenshipFront) ? (
                  <div style={{ marginTop: 8 }}>
                    <img src={getPreviewUrl(citizenshipFront)!} alt="Citizenship Front" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid #E5E7EB' }} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button onClick={() => citizenshipFrontRef.current?.click()} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#374151' }}>Replace Image</button>
                      <button onClick={() => handleRemovePhoto(setCitizenshipFront)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #FEE2E2', background: '#FEF2F2', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#DC2626' }}>Remove</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => citizenshipFrontRef.current?.click()} style={{ ...uploadBoxStyle, minHeight: 120 }} onMouseEnter={e => e.currentTarget.style.borderColor = '#9CA3AF'} onMouseLeave={e => e.currentTarget.style.borderColor = '#D1D5DB'}>
                    <div style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', marginBottom: 8, fontSize: 12, fontWeight: 500, color: '#374151' }}>Add Citizenship Front</div>
                    <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Not added</p>
                  </div>
                )}
                <input ref={citizenshipFrontRef} type="file" accept="image/*" onChange={e => handleFileUpload(e, setCitizenshipFront)} style={{ display: 'none' }} />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>CITIZENSHIP BACK</label>
                {getPreviewUrl(citizenshipBack) ? (
                  <div style={{ marginTop: 8 }}>
                    <img src={getPreviewUrl(citizenshipBack)!} alt="Citizenship Back" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid #E5E7EB' }} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button onClick={() => citizenshipBackRef.current?.click()} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#374151' }}>Replace Image</button>
                      <button onClick={() => handleRemovePhoto(setCitizenshipBack)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #FEE2E2', background: '#FEF2F2', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#DC2626' }}>Remove</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => citizenshipBackRef.current?.click()} style={{ ...uploadBoxStyle, minHeight: 120 }} onMouseEnter={e => e.currentTarget.style.borderColor = '#9CA3AF'} onMouseLeave={e => e.currentTarget.style.borderColor = '#D1D5DB'}>
                    <div style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', marginBottom: 8, fontSize: 12, fontWeight: 500, color: '#374151' }}>Add Citizenship Back</div>
                    <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Not added</p>
                  </div>
                )}
                <input ref={citizenshipBackRef} type="file" accept="image/*" onChange={e => handleFileUpload(e, setCitizenshipBack)} style={{ display: 'none' }} />
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
                onClick={handleSubmit(onSubmit)}
                disabled={isUpdating}
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
                  opacity: isUpdating ? 0.6 : 1,
                }}
              >
                {isUpdating ? 'Updating...' : 'Update Changes'}
              </button>
          </div>
        </main>
      </div>
    </div>
  )
}
