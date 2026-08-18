import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, Download, Share2, QrCode, ArrowRight } from 'lucide-react'
import QRCodeLib from 'qrcode'
import { parseBookingDate } from '../../../shared/utils/time'

interface BookingRoom {
  room_name: string
  nights: number
  subtotal: number
}

interface ReserveSummaryCardProps {
  propertyName: string
  roomNames: string
  propertyCity: string
  propertyCountry: string
  confirmationCode: string
  checkIn: string
  checkOut: string
  nights: number
  totalGuests: number
  rooms: BookingRoom[]
  currency: string
  couponCode?: string | null
  couponDiscount?: number
  specialOfferDiscount?: number
  totalAmount: number
  paymentStatus?: string | null
  shareText: string
  qrData: string
  copied: boolean
  shareMessage: string
  onCopyCode: () => void
  onShare: () => void
  onDownloadReceipt: () => void
}

function fmtShort(d: string) {
  return parseBookingDate(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ReserveSummaryCard({
  propertyName,
  roomNames,
  propertyCity,
  propertyCountry,
  confirmationCode,
  checkIn,
  checkOut,
  nights,
  totalGuests,
  rooms,
  currency,
  couponCode,
  couponDiscount,
  specialOfferDiscount,
  totalAmount,
  paymentStatus,
  shareText,
  qrData,
  copied,
  shareMessage,
  onCopyCode,
  onShare,
  onDownloadReceipt,
}: ReserveSummaryCardProps) {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [localCopied, setLocalCopied] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      QRCodeLib.toCanvas(canvasRef.current, qrData || confirmationCode, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
    }
  }, [qrData, confirmationCode])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrData || confirmationCode)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = qrData || confirmationCode
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
        await navigator.share({ text: qrData || shareText })
      } catch {}
    } else {
      onShare()
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-xl bg-[#EAF2F8] flex items-center justify-center text-[#1A3C5E] font-bold text-sm shrink-0">
            {propertyName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate">{propertyName}</h3>
            <p className="text-sm text-gray-500">{roomNames}</p>
            <p className="text-sm text-gray-500">{propertyCity}, {propertyCountry}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-500 mb-1">Confirmation code</p>
        <p className="text-sm font-bold text-gray-900 tracking-[0.16em]">{confirmationCode}</p>
      </div>

      <div className="px-5 py-4 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-500 mb-1">Dates</p>
        <p className="text-sm font-semibold text-gray-900">
          {fmtShort(checkIn)} – {fmtShort(checkOut)}, {parseBookingDate(checkOut).getFullYear()}
        </p>
        <p className="text-xs text-gray-500 mt-1">{nights} night{nights > 1 ? 's' : ''}</p>
      </div>

      <div className="px-5 py-4 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-500 mb-1">Guests</p>
        <p className="text-sm font-semibold text-gray-900">{totalGuests} guest{totalGuests > 1 ? 's' : ''}</p>
      </div>

      <div className="px-5 py-4 border-b border-gray-200">
        <p className="text-sm font-bold text-gray-900 mb-3">Price details</p>
        {couponCode && couponDiscount && couponDiscount > 0 && (
          <div className="mb-3 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-green-700">{couponCode}</span>
              <span className="font-bold text-green-700">-{currency}{couponDiscount.toFixed(2)}</span>
            </div>
            <p className="mt-1 text-[11px] text-green-600">Coupon applied to this reservation.</p>
          </div>
        )}
        {specialOfferDiscount && specialOfferDiscount > 0 && (
          <div className="mb-3 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-green-700">Special offer</span>
              <span className="font-bold text-green-700">-{currency}{specialOfferDiscount.toFixed(2)}</span>
            </div>
          </div>
        )}
        <div className="space-y-2 text-sm">
          {rooms?.map((r, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-gray-600">{r.room_name} × {r.nights} night{r.nights > 1 ? 's' : ''}</span>
              <span className="font-medium text-gray-900">{currency}{r.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm font-bold text-gray-900">Total paid</span>
          <span className="text-lg font-bold text-gray-900">{currency}{totalAmount.toFixed(2)}</span>
        </div>
        {paymentStatus && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${paymentStatus === 'completed' ? 'bg-green-500' : paymentStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <span className="text-xs font-medium text-gray-600 capitalize">Payment {paymentStatus}</span>
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button onClick={handleCopy} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:border-[#1A3C5E] transition">
            <Copy size={14} /> {localCopied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={handleShare} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:border-[#1A3C5E] transition">
            <Share2 size={14} /> Share
          </button>
          <button onClick={onDownloadReceipt} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:border-[#1A3C5E] transition">
            <Download size={14} /> Receipt
          </button>
        </div>
        {shareMessage && <p className="mt-3 text-sm text-[#1A3C5E]">{shareMessage}</p>}
      </div>

      <div className="p-5">
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
          <div className="flex items-center gap-3 mb-3">
            <QrCode size={20} className="text-gray-400" />
            <p className="text-sm font-semibold text-gray-700">Booking QR Code</p>
          </div>
          <canvas
            ref={canvasRef}
            className="w-[200px] h-[200px] mx-auto rounded-lg"
          />
          <p className="text-[11px] text-gray-400 text-center mt-3">Scan to view booking details</p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 py-3 rounded-xl bg-[#1A3C5E] text-white font-semibold text-sm hover:bg-[#163552] transition-all flex items-center justify-center gap-2"
        >
          Back to Home <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
