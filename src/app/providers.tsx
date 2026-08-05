import { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../context/AuthContext'
import { FavoritesProvider } from '../context/FavoritesContext'
import { BookingProvider } from '../context/BookingContext'
import { CouponProvider } from '../context/CouponContext'

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <BookingProvider>
            <CouponProvider>
              {children}
              <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            </CouponProvider>
          </BookingProvider>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
