import { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Toaster, toast } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { BookingProvider } from '@/context/BookingContext'
import { CouponProvider } from '@/context/CouponContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { LocationProvider } from '@/context/LocationContext'

function getErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong"
  const err = error as { response?: { data?: { message?: string } }; message?: string }
  return err.response?.data?.message || err.message || "Something went wrong"
}

// 4xx responses are definitive (bad request, unauthorised, forbidden…).
// Retrying them only hammers the API — one failed /properties call for a host
// without a tenant used to turn into a request storm.
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof AxiosError) {
    const status = error.response?.status
    if (status && status >= 400 && status < 500) return false
  }
  return failureCount < 1
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: shouldRetry,
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
