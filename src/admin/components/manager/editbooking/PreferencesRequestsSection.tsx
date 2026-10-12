import Field from './Field'
import { inputCls } from './fieldStyles'
import type { EditFormState } from './editForm'

interface PreferencesRequestsSectionProps {
  data: EditFormState
  onChange: (patch: Partial<EditFormState>) => void
}

export default function PreferencesRequestsSection({ data, onChange }: PreferencesRequestsSectionProps) {
  return (
    <section className="mb-5 rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="m-0 text-base font-semibold text-gray-900">Preferences &amp; Requests</h3>
      <p className="mt-1 mb-4 text-xs text-gray-500">Optional notes for operations and guest experience.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Special Requests">
          <input
            type="text"
            className={inputCls}
            placeholder="Airport pickup, high floor, dietary notes..."
            value={data.specialRequests}
            onChange={(e) => onChange({ specialRequests: e.target.value })}
          />
        </Field>

        <Field label="Internal Note">
          <input
            type="text"
            className={inputCls}
            placeholder="Visible to staff only"
            value={data.internalNote}
            onChange={(e) => onChange({ internalNote: e.target.value })}
          />
        </Field>
      </div>
    </section>
  )
}
