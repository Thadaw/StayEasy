import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function ComingSoon() {
  const location = useLocation()
  const navigate = useNavigate()

  const title = location.pathname
    .replace('/', '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <div className="min-h-screen bg-brand-secondary-surface flex items-center justify-center p-6 font-jakarta">
      <div className="w-[420px] bg-brand-surface rounded-2xl shadow-modal py-12 px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-secondary-surface flex items-center justify-center mx-auto mb-6 text-2xl">
          ⏳
        </div>
        <h1 className="text-[22px] font-bold text-brand-heading mb-2">
          {title || 'Page'}
        </h1>
        <p className="text-sm text-brand-text-secondary mb-8">
          This page is coming soon. We're working on it!
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white border-none rounded-lg text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft size={15} />
          Go Back
        </button>
      </div>
    </div>
  )
}
