import { BedDouble } from "lucide-react"
import { allCountries } from "../../../data/countries"
import { phoneCodes } from "../../../data/phoneCodes"

interface GuestFormData {
  name: string
  email: string
  phoneCode: string
  phone: string
  country: string
}

interface GuestInformationFormProps {
  guest: GuestFormData
  onGuestChange: (guest: GuestFormData) => void
  roomNames: string
}

export function GuestInformationForm({
  guest,
  onGuestChange,
  roomNames,
}: GuestInformationFormProps) {
  const updateField = (field: keyof GuestFormData, value: string) => {
    onGuestChange({ ...guest, [field]: value })
  }

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
          value={guest.name}
          onChange={e => updateField("name", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2E86AB] transition-colors text-gray-900"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Email address *
        </label>
        <input
          type="email"
          value={guest.email}
          onChange={e => updateField("email", e.target.value)}
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
            value={guest.phoneCode}
            onChange={e => updateField("phoneCode", e.target.value)}
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
            value={guest.phone}
            onChange={e => updateField("phone", e.target.value.replace(/\D/g, ""))}
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
          value={guest.country}
          onChange={e => updateField("country", e.target.value)}
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
            {roomNames && (
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  </span>
                  Non-refundable
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
