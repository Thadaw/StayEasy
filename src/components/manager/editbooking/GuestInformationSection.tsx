import Field from './Field'
import { inputCls } from './fieldStyles'
import { NATIONALITIES, GUEST_TYPES, type EditFormState } from './editForm'

interface GuestInformationSectionProps {
  data: EditFormState
  errors: Record<string, string>
  onChange: (patch: Partial<EditFormState>) => void
}

export default function GuestInformationSection({ data, errors, onChange }: GuestInformationSectionProps) {
  return (
    <section className="mb-5 rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="m-0 text-base font-semibold text-gray-900">Guest Information</h3>
      <p className="mt-1 mb-4 text-xs text-gray-500">Use an existing guest or create a new profile.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Guest" error={errors.guestName}>
          <input
            type="text"
            className={`${inputCls} ${errors.guestName ? 'border-red-500' : ''}`}
            placeholder="Search guest or enter name"
            value={data.guestName}
            onChange={(e) => onChange({ guestName: e.target.value })}
          />
        </Field>

        <Field label="Email" error={errors.guestEmail}>
          <input
            type="email"
            className={`${inputCls} ${errors.guestEmail ? 'border-red-500' : ''}`}
            placeholder="guest@example.com"
            value={data.guestEmail}
            onChange={(e) => onChange({ guestEmail: e.target.value })}
          />
        </Field>

        <Field label="Phone" error={errors.guestPhone}>
          <input
            type="tel"
            className={`${inputCls} ${errors.guestPhone ? 'border-red-500' : ''}`}
            placeholder="+977 98XXXXXXX"
            value={data.guestPhone}
            onChange={(e) => onChange({ guestPhone: e.target.value })}
          />
        </Field>

        <Field label="ID / Passport">
          <input
            type="text"
            className={inputCls}
            placeholder="Enter document number"
            value={data.idPassport}
            onChange={(e) => onChange({ idPassport: e.target.value })}
          />
        </Field>

        <Field label="Nationality">
          <select
            className={inputCls}
            value={data.nationality}
            onChange={(e) => onChange({ nationality: e.target.value })}
          >
            {NATIONALITIES.map((n) => <option key={n}>{n}</option>)}
          </select>
        </Field>

        <Field label="Guest Type">
          <select
            className={inputCls}
            value={data.guestType}
            onChange={(e) => onChange({ guestType: e.target.value })}
          >
            {GUEST_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
      </div>
    </section>
  )
}
