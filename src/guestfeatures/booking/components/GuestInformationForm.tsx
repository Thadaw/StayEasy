import { useEffect, useRef } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BedDouble } from "lucide-react"
import { allCountries } from "../../../data/countries"
import { phoneCodes } from "../../../data/phoneCodes"
import { guestInformationSchema, type GuestInformationFormData } from "../schemas/bookingSchemas"

interface GuestInformationFormProps {
  guest: GuestInformationFormData
  onGuestChange: (guest: GuestInformationFormData) => void
  roomNames: string
}

export function GuestInformationForm({
  guest,
  onGuestChange,
  roomNames,
}: GuestInformationFormProps) {
  const { control, setValue, reset } = useForm<GuestInformationFormData>({
    resolver: zodResolver(guestInformationSchema),
    defaultValues: guest,
  })

  const watched = useWatch({ control })

  const isInitialMount = useRef(true)
  const isResettingFromParent = useRef(false)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (isResettingFromParent.current) return
    onGuestChange(watched as GuestInformationFormData)
  }, [watched, onGuestChange])

  useEffect(() => {
    isResettingFromParent.current = true
    reset(guest)
    requestAnimationFrame(() => {
      isResettingFromParent.current = false
    })
  }, [guest.name, guest.email, guest.phoneCode, guest.phone, guest.country, reset])

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-5">
        Almost done! Just fill in the <span className="text-red-500">*</span> required info
      </p>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Full name *
        </label>
        <input
          type="text"
          value={watched.name}
          onChange={e => setValue("name", e.target.value, { shouldDirty: true })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2E86AB] transition-colors text-gray-900"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Email address *
        </label>
        <input
          type="email"
          value={watched.email}
          onChange={e => setValue("email", e.target.value, { shouldDirty: true })}
          placeholder="Watch out for typos..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2E86AB] transition-colors text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div className="mb-5">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Telephone (mobile number preferred) *
        </label>
        <div className="flex gap-2">
          <select
            value={watched.phoneCode}
            onChange={e => setValue("phoneCode", e.target.value, { shouldDirty: true })}
            className="w-[120px] border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2E86AB] transition-colors text-gray-900 bg-white shrink-0"
          >
            {Object.entries(phoneCodes).map(([code, dial]) => (
              <option key={code} value={dial}>
                {code} {dial}
              </option>
            ))}
          </select>
          <input
            type="tel"
            value={watched.phone}
            onChange={e => setValue("phone", e.target.value.replace(/\D/g, ""), { shouldDirty: true })}
            placeholder="+977"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2E86AB] transition-colors text-gray-900"
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Country / Region *
        </label>
        <select
          value={watched.country}
          onChange={e => setValue("country", e.target.value, { shouldDirty: true })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2E86AB] transition-colors text-gray-900 bg-white"
        >
          <option value="">Select a country</option>
          {allCountries.map(c => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-gray-200 pt-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <BedDouble size={18} className="text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {roomNames || "No room selected"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
