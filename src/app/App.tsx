import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { PageLoader } from '../shared/components/PageLoader'
import { ErrorBoundary } from '../shared/components/ErrorBoundary'
import { ScrollRestoration } from '../shared/components/ScrollRestoration'
import { AppRoutes } from './routes'

export default function App() {
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
