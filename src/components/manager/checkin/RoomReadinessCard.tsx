import { KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'
import FieldRow from './FieldRow'

interface RoomReadinessCardProps {
  roomStatus: string
  housekeeping: string
  paymentLabel: string
  paymentReady: boolean
  balanceLabel: string
  balanceDue: boolean
  keyCards: string
}

export default function RoomReadinessCard({
  roomStatus,
  housekeeping,
  paymentLabel,
  paymentReady,
  balanceLabel,
  balanceDue,
  keyCards,
}: RoomReadinessCardProps) {
  const ready = 'text-green-600'

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="m-0 mb-3 text-[15px] font-bold text-gray-900">Room &amp; Payment Readiness</h3>

      <FieldRow label="Room Status" value={roomStatus} valueClassName={ready} />
      <FieldRow label="Housekeeping" value={housekeeping} valueClassName={ready} />
      <FieldRow label="Payment" value={paymentLabel} valueClassName={paymentReady ? ready : 'text-amber-600'} />
      <FieldRow label="Balance Due" value={balanceLabel} valueClassName={balanceDue ? 'text-red-600' : 'text-gray-900'} />
      <FieldRow label="Key Cards" value={keyCards} />

      <div className="-mx-5 -mb-5 mt-4 flex items-center justify-between gap-3 rounded-b-xl border-t border-gray-100 bg-gray-50 px-5 py-3.5">
        <span className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-gray-700">
          <KeyRound size={14} className="shrink-0 text-gray-500" />
          Assign key cards / access
        </span>
        <button
          type="button"
          onClick={() => toast.success(`${keyCards} issued`)}
          className="shrink-0 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100"
        >
          {keyCards.replace(' cards', ' Cards').replace(' card', ' Card')}
        </button>
      </div>
    </div>
  )
}
