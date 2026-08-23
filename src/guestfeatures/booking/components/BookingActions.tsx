import { useEffect, useRef, useState } from "react"
import { Copy, Share2, Download, QrCode, ArrowRight } from "lucide-react"
import QRCodeLib from "qrcode"
import { Card, Button } from "../../../shared/ui"

interface BookingActionsProps {
  refNumber: string
  shareText: string
  qrData: string
  copied: boolean
  onCopyCode: () => void
  onShare: () => void
  onDownloadReceipt: () => void
  onDone: () => void
}

export function BookingActions({
  refNumber,
  shareText,
  qrData,
  copied,
  onCopyCode,
  onShare,
  onDownloadReceipt,
  onDone,
}: BookingActionsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrGenerated, setQrGenerated] = useState(false)
  const [localCopied, setLocalCopied] = useState(false)

  useEffect(() => {
    if (canvasRef.current && !qrGenerated) {
      QRCodeLib.toCanvas(canvasRef.current, qrData || refNumber, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      }).then(() => {
        setQrGenerated(true)
      })
    }
  }, [qrData, refNumber, qrGenerated])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrData || refNumber)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = qrData || refNumber
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setLocalCopied(true)
    setTimeout(() => setLocalCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Booking Details',
          text: qrData || shareText,
        })
      } catch {}
    } else {
      onShare()
    }
  }

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleCopy}>
            <Copy size={14} /> {localCopied ? "Copied" : "Copy"}
          </Button>
          <Button variant="outline" onClick={handleShare}>
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
            <canvas ref={canvasRef} className="h-36 w-36 rounded-xl" />
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
