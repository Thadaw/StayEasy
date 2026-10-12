import { CheckCircle2 } from 'lucide-react'
import FieldRow from './FieldRow'

interface GuestVerificationCardProps {
  primaryGuest: string
  idPassport: string
  phone: string
  email: string
}

const VERIFICATIONS = ['Identity verified', 'Guest details confirmed', 'Special request reviewed']

export default function GuestVerificationCard({ primaryGuest, idPassport, phone, email }: GuestVerificationCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="m-0 mb-3 text-[15px] font-bold text-gray-900">Guest Verification</h3>

      <FieldRow label="Primary Guest" value={primaryGuest} />
      <FieldRow label="ID / Passport" value={idPassport} />
      <FieldRow label="Phone" value={phone} />
      <FieldRow label="Email" value={email} />

      <div className="mt-4 flex flex-col gap-2">
        {VERIFICATIONS.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2.5 rounded-lg border border-green-100 bg-green-50 px-3.5 py-2.5 text-[13px] font-medium text-green-800"
          >
            <CheckCircle2 size={15} className="shrink-0 text-green-600" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
