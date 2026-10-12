import { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster, toast } from 'react-hot-toast'
import { AuthProvider } from '../auth/AuthContext'
import { FavoritesProvider } from '../context/FavoritesContext'
import { BookingProvider } from '../context/BookingContext'
import { CouponProvider } from '../context/CouponContext'
import { NotificationProvider } from '../context/NotificationContext'
import { LocationProvider } from '../context/LocationContext'

function getErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong"
  const err = error as { response?: { data?: { message?: string } }; message?: string }
  return err.response?.data?.message || err.message || "Something went wrong"
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      onError: (error) => {
        toast.error(getErrorMessage(error))
      },
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
                <LocationProvider>
                  {children}
                  <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
                </LocationProvider>
              </NotificationProvider>
            </CouponProvider>
          </BookingProvider>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
