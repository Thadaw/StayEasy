import Field from './Field'
import { inputCls } from './fieldStyles'
import { BOOKING_SOURCES, ARRIVAL_TIMES, type EditFormState } from './editForm'

interface StayDetailsSectionProps {
  data: EditFormState
  errors: Record<string, string>
  onChange: (patch: Partial<EditFormState>) => void
}

export default function StayDetailsSection({ data, errors, onChange }: StayDetailsSectionProps) {
  return (
    <section className="mb-5 rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="m-0 text-base font-semibold text-gray-900">Stay Details</h3>
      <p className="mt-1 mb-4 text-xs text-gray-500">Choose stay dates, occupancy and booking source.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Check-in" error={errors.checkIn}>
          <input
            type="date"
            className={`${inputCls} ${errors.checkIn ? 'border-red-500' : ''}`}
            value={data.checkIn}
            onChange={(e) => onChange({ checkIn: e.target.value })}
          />
        </Field>

        <Field label="Check-out" error={errors.checkOut}>
          <input
            type="date"
            min={data.checkIn}
            className={`${inputCls} ${errors.checkOut ? 'border-red-500' : ''}`}
            value={data.checkOut}
            onChange={(e) => onChange({ checkOut: e.target.value })}
          />
        </Field>

        <Field label="Adults" error={errors.adults}>
          <input
            type="number"
            min={1}
            max={30}
            className={`${inputCls} ${errors.adults ? 'border-red-500' : ''}`}
            value={data.adults}
            onChange={(e) => onChange({ adults: parseInt(e.target.value) || 1 })}
          />
        </Field>

        <Field label="Children">
          <input
            type="number"
            min={0}
            max={15}
            className={inputCls}
            value={data.children}
            onChange={(e) => onChange({ children: parseInt(e.target.value) || 0 })}
          />
        </Field>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Booking Source">
          <select
            className={inputCls}
            value={data.bookingSource}
            onChange={(e) => onChange({ bookingSource: e.target.value })}
          >
            {BOOKING_SOURCES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>

        <Field label="Arrival Time">
          <select
            className={inputCls}
            value={data.arrivalTime}
            onChange={(e) => onChange({ arrivalTime: e.target.value })}
          >
            {ARRIVAL_TIMES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>

        <Field label="Promo / Corporate Code">
          <input
            type="text"
            className={inputCls}
            placeholder="Optional"
            value={data.promoCode}
            onChange={(e) => onChange({ promoCode: e.target.value })}
          />
        </Field>
      </div>
    </section>
  )
}
