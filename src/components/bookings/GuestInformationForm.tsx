import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BedDouble } from "lucide-react"
import { allCountries } from "@/data/static/countries"
import { phoneCodes } from "@/data/static/phoneCodes"
import { guestInformationSchema, type GuestInformationFormData } from "@/schemas/booking/bookingSchemas"

export const GUEST_INFO_FORM_ID = "guest-information-form"

interface GuestInformationFormProps {
  guest: GuestInformationFormData
  onSubmit: (data: GuestInformationFormData) => void
  roomNames: string
}

export function GuestInformationForm({
  guest,
  onSubmit,
  roomNames,
}: GuestInformationFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GuestInformationFormData>({
    resolver: zodResolver(guestInformationSchema),
    defaultValues: guest,
    mode: "onTouched",
  })

  // Re-sync the form whenever the prefill (e.g. the guest profile) arrives.
  useEffect(() => {
    reset(guest)
  }, [guest, reset])

  const errorClass = "text-xs text-red-500 mt-1"

  return (
    <form
      id={GUEST_INFO_FORM_ID}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl border border-gray-200 p-5"
    >
      <p className="text-sm text-gray-500 mb-5">
        Almost done! Just fill in the <span className="text-red-500">*</span> required info
      </p>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Full name *
        </label>
        <input
          type="text"
          {...register("name")}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2E86AB] transition-colors text-gray-900"
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Email address *
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="Watch out for typos..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2E86AB] transition-colors text-gray-900 placeholder:text-gray-400"
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div className="mb-5">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Telephone (mobile number preferred) *
        </label>
        <div className="flex gap-2">
          <select
            {...register("phoneCode")}
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
            {...register("phone", {
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, "")
              },
            })}
            placeholder="+977"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2E86AB] transition-colors text-gray-900"
          />
        </div>
        {(errors.phoneCode || errors.phone) && (
          <p className={errorClass}>{errors.phone?.message || errors.phoneCode?.message}</p>
        )}
      </div>

      <div className="mb-5">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Country / Region *
        </label>
        <select
          {...register("country")}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2E86AB] transition-colors text-gray-900 bg-white"
        >
          <option value="">Select a country</option>
          {allCountries.map(c => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
        {errors.country && <p className={errorClass}>{errors.country.message}</p>}
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
    </form>
  )
}
