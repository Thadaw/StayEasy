import { useState, useEffect, useRef, useCallback } from 'react'
import type { RazorpayCheckoutOptions, RazorpayPaymentResponse } from '../types/razorpay'

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js'

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  // The Razorpay SDK is loaded dynamically via a script tag instead of being
  // bundled because it injects a global `window.Razorpay` constructor and a
  // checkout overlay that must be available at runtime. Bundling it would bloat
  // the initial bundle for users who never make a payment.
  useEffect(() => {
    if (window.Razorpay) {
      setIsLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT_URL
    script.async = true
    script.onload = () => setIsLoaded(true)
    script.onerror = () => setError('Failed to load Razorpay checkout')

    document.body.appendChild(script)
    scriptRef.current = script

    // Remove the script tag on unmount to avoid a stale SDK version if the
    // component remounts (e.g. during hot module replacement in development).
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
      }
    }
  }, [])

  const openCheckout = useCallback(
    (options: Omit<RazorpayCheckoutOptions, 'handler' | 'modal'>): Promise<RazorpayPaymentResponse> => {
      return new Promise((resolve, reject) => {
        if (!window.Razorpay) {
          reject(new Error('Razorpay is not loaded'))
          return
        }

        const razorpayOptions: RazorpayCheckoutOptions = {
          ...options,
          handler: (response: RazorpayPaymentResponse) => {
            resolve(response)
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled'))
            },
          },
        }

        const rzp = new window.Razorpay(razorpayOptions)
        rzp.open()
      })
    },
    []
  )

  return {
    isLoaded,
    error,
    openCheckout,
  }
}
