import { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../auth/AuthContext'
import { FavoritesProvider } from '../context/FavoritesContext'
import { BookingProvider } from '../context/BookingContext'
import { CouponProvider } from '../context/CouponContext'
import { NotificationProvider } from '../context/NotificationContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <BookingProvider>
            <CouponProvider>
              <NotificationProvider>
                {children}
                <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
              </NotificationProvider>
            </CouponProvider>
          </BookingProvider>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
