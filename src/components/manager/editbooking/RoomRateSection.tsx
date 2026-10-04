import Field from './Field'
import { inputCls, readOnlyCls } from './fieldStyles'
import { ROOM_TYPES, RATE_PLANS, roomOptionsFor, type EditFormState } from './editForm'
import { formatNPR } from '../bookings/demoBookings'

interface RoomRateSectionProps {
  data: EditFormState
  errors: Record<string, string>
  onChange: (patch: Partial<EditFormState>) => void
  rate: { nightly: number; taxes: number; total: number; nights: number }
}

export default function RoomRateSection({ data, errors, onChange, rate }: RoomRateSectionProps) {
  const rooms = roomOptionsFor(data.roomType, data.room)
  const stayCost = rate.nights > 0

  return (
    <section className="mb-5 rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="m-0 text-base font-semibold text-gray-900">Room &amp; Rate</h3>
      <p className="mt-1 mb-4 text-xs text-gray-500">Assign an available room and rate plan.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Room Type" error={errors.roomType}>
          <select
            className={`${inputCls} ${errors.roomType ? 'border-red-500' : ''}`}
            value={data.roomType}
            onChange={(e) => onChange({ roomType: e.target.value })}
          >
            <option value="">Select room type</option>
            {ROOM_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>

        <Field label="Available Room" error={errors.room}>
          <select
            className={`${inputCls} ${errors.room ? 'border-red-500' : ''}`}
            value={data.room}
            disabled={!data.roomType}
            onChange={(e) => onChange({ room: e.target.value })}
          >
            <option value="">{data.roomType ? 'Select room' : 'Select room type first'}</option>
            {rooms.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>

        <Field label="Rate Plan">
          <select
            className={inputCls}
            value={data.ratePlan}
            onChange={(e) => onChange({ ratePlan: e.target.value })}
          >
            {RATE_PLANS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>

        <Field label="Nightly Rate">
          <input type="text" readOnly className={readOnlyCls} value={formatNPR(rate.nightly)} />
        </Field>

        <Field label="Taxes &amp; Fees">
          <input type="text" readOnly className={readOnlyCls} value={stayCost ? formatNPR(rate.taxes) : '—'} />
        </Field>

        <Field label="Estimated Total">
          <input type="text" readOnly className={readOnlyCls} value={stayCost ? formatNPR(rate.total) : '—'} />
        </Field>
      </div>
    </section>
  )
}
