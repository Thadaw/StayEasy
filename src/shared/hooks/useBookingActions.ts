import { useState } from 'react'
import toast from 'react-hot-toast'
import { printReceipt } from '../utils/ReceiptGenerator'

interface BookingActionParams {
  refNumber: string
  propertyName: string
  shareText: string
  checkIn: string
  checkOut: string
  roomNames: string
  totalGuests: number
  guestName: string
  guestEmail?: string
  guestPhone?: string
  guestNationality?: string
  rooms: { room_name: string; room_type: string; bed_type: string; base_rate: number; nights: number; subtotal: number }[]
  specialOfferDiscount?: number
  couponCode?: string
  couponDiscount?: number
  totalAmount: number
  currency: string
  propertyLocation?: string
  propertyPhone?: string
  propertyEmail?: string
  createdAt?: string
}

export function useBookingActions() {
  const [copied, setCopied] = useState(false)

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Confirmation code copied!')
      setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }

  const shareBooking = async (shareText: string) => {
    const shareData = { title: 'StayEasy booking details', text: shareText, url: window.location.href }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareText)
        toast.success('Booking details copied to clipboard')
      }
    } catch {
      // user cancelled
    }
  }

  const downloadReceipt = (params: BookingActionParams) => {
    printReceipt({
      confirmationCode: params.refNumber,
      propertyName: params.propertyName,
      propertyLocation: params.propertyLocation || `${params.propertyLocation || ''}`,
      propertyPhone: params.propertyPhone,
      propertyEmail: params.propertyEmail,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      roomNames: params.roomNames,
      totalGuests: params.totalGuests,
      guestName: params.guestName,
      guestEmail: params.guestEmail,
      guestPhone: params.guestPhone,
      guestNationality: params.guestNationality,
      rooms: params.rooms,
      specialOfferDiscount: params.specialOfferDiscount,
      couponCode: params.couponCode,
      couponDiscount: params.couponDiscount,
      totalAmount: params.totalAmount,
      currency: params.currency,
      createdAt: params.createdAt,
    })
  }

  return {
    copied,
    copyCode,
    shareBooking,
    downloadReceipt,
  }
}
