import { Copy, Share2, Download, QrCode, ArrowRight } from "lucide-react"
import { Card, Button } from "../../../shared/ui"

interface BookingActionsProps {
  refNumber: string
  shareText: string
  copied: boolean
  onCopyCode: () => void
  onShare: () => void
  onDownloadReceipt: () => void
  onDone: () => void
}

export function BookingActions({
  refNumber,
  shareText,
  copied,
  onCopyCode,
  onShare,
  onDownloadReceipt,
  onDone,
}: BookingActionsProps) {
  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onCopyCode}>
            <Copy size={14} /> {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="outline" onClick={onShare}>
            <Share2 size={14} /> Share
          </Button>
          <Button variant="outline" onClick={onDownloadReceipt}>
            <Download size={14} /> Receipt
          </Button>
        </div>
      </div>

      <div className="p-5">
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
          <div className="flex items-center gap-2 text-gray-900">
            <QrCode size={15} />
            <h3 className="text-sm font-bold">Reservation QR</h3>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareText || refNumber)}`}
              alt="Reservation QR code"
              className="h-36 w-36 rounded-xl"
            />
            <p className="mt-3 text-center text-xs text-gray-500">Scan to view booking details.</p>
          </div>
        </div>
        <Button variant="primary" onClick={onDone} className="mt-5 w-full justify-center">
          Done <ArrowRight size={16} />
        </Button>
      </div>
    </Card>
  )
}
