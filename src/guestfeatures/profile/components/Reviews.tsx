import { MessageSquareText } from 'lucide-react'

export default function Reviews() {
  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-xl border border-brand-card-border p-12 text-center">
        <MessageSquareText size={48} className="text-brand-placeholder mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-brand-heading mb-2">No reviews yet</h2>
        <p className="text-sm text-brand-text-secondary">Your reviews will appear here after your stays.</p>
      </div>
    </div>
  )
}
