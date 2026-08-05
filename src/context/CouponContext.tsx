import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import type { Coupon } from '../shared/types'

interface CouponContextValue {
  coupons: Coupon[]
  activeCoupons: Coupon[]
  usedCoupons: Coupon[]
  useCoupon: (id: string) => void
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void
}

const CouponContext = createContext<CouponContextValue | null>(null)

function getStorageKey(userId?: number): string {
  return userId ? `coupons_${userId}` : 'coupons_guest'
}

function loadCoupons(userId?: number): Coupon[] {
  try {
    const data = localStorage.getItem(getStorageKey(userId))
    if (data) return JSON.parse(data)
  } catch {
    // Corrupted localStorage data — fall through to sample coupons below.
  }

  const sampleCoupons: Coupon[] = [
    {
      id: 'c1',
      code: 'SUMMER20',
      description: 'Get 20% off on your next booking',
      discount: 20,
      discountType: 'percentage',
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'c2',
      code: 'WELCOME10',
      description: '10% discount for new members',
      discount: 10,
      discountType: 'percentage',
      status: 'active',
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'c3',
      code: 'STAY50',
      description: '$50 off on stays above $300',
      discount: 50,
      discountType: 'fixed',
      status: 'used',
      expiresAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      usedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'c4',
      code: 'EARLY15',
      description: 'Early bird 15% discount',
      discount: 15,
      discountType: 'percentage',
      status: 'used',
      expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      usedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  saveCoupons(sampleCoupons, userId)
  return sampleCoupons
}

function saveCoupons(coupons: Coupon[], userId?: number) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(coupons))
}

export function CouponProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadCoupons(user?.id))

  useEffect(() => {
    setCoupons(loadCoupons(user?.id))
  }, [user?.id])

  useEffect(() => {
    saveCoupons(coupons, user?.id)
  }, [coupons, user?.id])

  const activeCoupons = coupons.filter(c => c.status === 'active')
  const usedCoupons = coupons.filter(c => c.status === 'used' || c.status === 'expired')

  const useCoupon = useCallback((id: string) => {
    setCoupons(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status: 'used' as const, usedAt: new Date().toISOString() } : c
      )
    )
  }, [])

  const addCoupon = useCallback((data: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...data,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    }
    setCoupons(prev => [newCoupon, ...prev])
  }, [])

  return (
    <CouponContext.Provider
      value={{
        coupons,
        activeCoupons,
        usedCoupons,
        useCoupon,
        addCoupon,
      }}
    >
      {children}
    </CouponContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCoupons() {
  const ctx = useContext(CouponContext)
  if (!ctx) throw new Error('useCoupons must be inside CouponProvider')
  return ctx
}
