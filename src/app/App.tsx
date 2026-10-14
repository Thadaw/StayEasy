import { Suspense, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { PageLoader } from '@/components/ui/PageLoader'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ScrollRestoration } from '@/components/layout/ScrollRestoration'
import { AppRoutes } from '@/app/routes'
import { appConfig } from '@/config/appConfig'

export default function App() {
  useEffect(() => {
    document.title = `${appConfig.name} — ${appConfig.tagline}`
  }, [])

  return (
    <BrowserRouter>
      <ScrollRestoration />
      <Suspense fallback={<PageLoader />}>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </Suspense>
    </BrowserRouter>
  )
}
