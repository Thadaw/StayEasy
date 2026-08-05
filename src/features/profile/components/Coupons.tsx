import { useCoupons } from '../../../context/CouponContext'
import { TicketPercent, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { Coupon } from '../../../shared/types'

export default function Coupons() {
  const { activeCoupons, usedCoupons } = useCoupons()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyCouponCode = (code: string, id: string) => {
    navigator.clipboard.write(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-xl border border-brand-card-border overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-card-border">
          <h2 className="text-base font-semibold text-brand-heading">My Coupons</h2>
        </div>
        <div className="p-6 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-brand-success" />
              <h3 className="text-sm font-semibold text-brand-heading">Active Coupons</h3>
              <span className="text-xs text-brand-text-secondary">({activeCoupons.length})</span>
            </div>
            {activeCoupons.length === 0 ? (
              <div className="rounded-xl border border-dashed border-brand-card-border p-8 text-center">
                <TicketPercent size={32} className="text-brand-placeholder mx-auto mb-2" />
                <p className="text-sm text-brand-text-secondary">No active coupons</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeCoupons.map(coupon => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    isActive
                    copiedId={copiedId}
                    onCopy={handleCopyCouponCode}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-brand-placeholder" />
              <h3 className="text-sm font-semibold text-brand-heading">Expired Coupons</h3>
              <span className="text-xs text-brand-text-secondary">({usedCoupons.length})</span>
            </div>
            {usedCoupons.length === 0 ? (
              <div className="rounded-xl border border-dashed border-brand-card-border p-8 text-center">
                <TicketPercent size={32} className="text-brand-placeholder mx-auto mb-2" />
                <p className="text-sm text-brand-text-secondary">No expired coupons</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {usedCoupons.map(coupon => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    isActive={false}
                    copiedId={copiedId}
                    onCopy={handleCopyCouponCode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CouponCard({
  coupon,
  isActive,
  copiedId,
  onCopy,
}: {
  coupon: Coupon
  isActive: boolean
  copiedId: string | null
  onCopy: (code: string, id: string) => void
}) {
  const daysLeft = isActive
    ? Math.ceil((new Date(coupon.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isActive
          ? 'border-brand-success-border bg-brand-success-light'
          : 'border-brand-card-border bg-brand-background opacity-70'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            isActive ? 'bg-brand-accent' : 'bg-brand-placeholder'
          }`}
        >
          <TicketPercent size={18} color="#fff" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <span className={`text-sm font-bold tracking-wide ${isActive ? 'text-brand-accent' : 'text-brand-text-secondary'}`}>
                {coupon.code}
              </span>
              <p className="text-xs text-brand-text-secondary mt-0.5">{coupon.description}</p>
            </div>
            <span className={`text-xs font-bold shrink-0 ml-2 ${isActive ? 'text-brand-heading' : 'text-brand-placeholder'}`}>
              {coupon.discountType === 'percentage' ? `${coupon.discount}% OFF` : `$${coupon.discount} OFF`}
            </span>
          </div>
          <div className="flex items-center justify-between mt-3">
            {isActive ? (
              <span className={`text-[10px] ${daysLeft <= 3 ? 'text-brand-danger' : 'text-brand-text-secondary'}`}>
                {daysLeft > 0 ? `${daysLeft} day${daysLeft > 1 ? 's' : ''} left` : 'Expiring today'}
              </span>
            ) : (
              <span className="text-[10px] text-brand-placeholder">
                {coupon.usedAt ? `Used ${new Date(coupon.usedAt).toLocaleDateString()}` : 'Expired'}
              </span>
            )}
            <button
              onClick={() => onCopy(coupon.code, coupon.id)}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg border border-brand-card-border bg-white hover:bg-brand-secondary-surface transition-colors cursor-pointer text-brand-heading"
            >
              {copiedId === coupon.id ? (
                <><Check size={12} className="text-brand-success" /> Copied</>
              ) : (
                <><Copy size={12} /> Copy</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
