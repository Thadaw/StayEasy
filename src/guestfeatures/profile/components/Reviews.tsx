import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../../services/axios'
import { Star, MessageSquareText, RefreshCw, ChevronRight, MapPin, Pencil } from 'lucide-react'
import { EditReviewModal } from '../../review/components/EditReviewModal'
import { Pagination } from '../../search/components/Pagination'

interface ApiReview {
  id: string | number
  rating: number
  comment: string
  is_edited?: boolean
  created_at?: string
  updated_at?: string
  property?: {
    id?: string
    name?: string
    city?: string
    country?: string
    cover_photo?: string
    photos?: {
      cover?: string
      gallery?: string[]
    }
  }
}

interface NormalizedReview {
  id: string | number
  rating: number
  comment: string
  isEdited: boolean
  createdAt: string
  propertyId: string
  propertyName: string
  propertyLocation: string
  propertyPhoto: string
}

function normalizeReview(item: ApiReview): NormalizedReview {
  return {
    id: item.id,
    rating: item.rating,
    comment: item.comment,
    isEdited: item.is_edited || false,
    createdAt: item.created_at || '',
    propertyId: item.property?.id || '',
    propertyName: item.property?.name || '',
    propertyLocation: [item.property?.city, item.property?.country]
      .filter(Boolean)
      .join(', '),
    propertyPhoto: item.property?.photos?.cover || item.property?.cover_photo || '',
  }
}

export default function Reviews() {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState<NormalizedReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingReview, setEditingReview] = useState<NormalizedReview | null>(null)

  const LIMIT = 10

  const loadReviews = useCallback(async (pageNum = 1) => {
    setLoading(true)
    setError(false)
    try {
      const skip = (pageNum - 1) * LIMIT
      const { data } = await api.get('/properties/me/reviews', {
        params: { skip, limit: LIMIT },
      })
      const raw = data?.data
      const items: ApiReview[] = raw?.reviews ?? raw?.items ?? raw ?? data?.reviews ?? []
      const total: number = raw?.total ?? items.length
      const normalized = Array.isArray(items) ? items.map(normalizeReview) : []
      setReviews(normalized)
      setTotalPages(Math.max(1, Math.ceil(total / LIMIT)))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReviews(page)
  }, [page, loadReviews])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-xl border border-brand-card-border overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-brand-card-border flex items-center justify-between">
          <h2 className="text-base font-semibold text-brand-heading">My Reviews</h2>
          {!loading && !error && reviews.length > 0 && (
            <button
              onClick={() => { setPage(1); loadReviews(1) }}
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-text-secondary hover:text-brand-accent transition-colors cursor-pointer"
            >
              <RefreshCw size={12} /> Refresh
            </button>
          )}
        </div>

        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-xl border border-brand-card-border p-4 animate-pulse">
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(s => (
                      <div key={s} className="w-4 h-4 rounded bg-gray-200" />
                    ))}
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200" />
                    <div className="space-y-1.5">
                      <div className="h-3 bg-gray-200 rounded w-24" />
                      <div className="h-2 bg-gray-200 rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-brand-text-secondary mb-4">Could not load your reviews.</p>
              <button
                onClick={() => loadReviews(page)}
                className="px-5 py-2 text-sm font-semibold rounded-lg border-none text-white bg-brand-accent hover:bg-brand-accent-hover transition-colors cursor-pointer"
              >
                Try again
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquareText size={48} className="text-brand-placeholder mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-brand-heading mb-2">No reviews yet</h3>
              <p className="text-sm text-brand-text-secondary mb-6">Your reviews will appear here after your stays.</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 text-sm font-semibold rounded-lg border-none text-white bg-brand-accent hover:bg-brand-accent-hover transition-colors cursor-pointer"
              >
                Browse stays
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map(review => (
                <div
                  key={review.id}
                  className="rounded-xl border border-brand-card-border p-4 hover:shadow-card transition-shadow"
                >
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? 'fill-amber-400 stroke-amber-400' : 'fill-gray-200 stroke-gray-200'}
                      />
                    ))}
                  </div>

                  {review.propertyName && (
                    <div
                      onClick={() => review.propertyId && navigate(`/hotel/${review.propertyId}`)}
                      className="flex items-center gap-2 mb-2 cursor-pointer group"
                    >
                      {review.propertyPhoto && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          <img src={review.propertyPhoto} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-sm font-semibold text-brand-heading group-hover:text-brand-accent transition-colors truncate">
                          {review.propertyName}
                        </span>
                        <ChevronRight size={12} className="text-brand-text-secondary shrink-0 group-hover:text-brand-accent transition-colors" />
                      </div>
                    </div>
                  )}

                  {review.propertyLocation && (
                    <p className="text-[11px] flex items-center gap-0.5 text-brand-text-secondary mb-2">
                      <MapPin size={10} /> {review.propertyLocation}
                    </p>
                  )}

                  <p className="text-sm text-brand-text-secondary leading-relaxed mb-3">{review.comment}</p>

                  <div className="flex items-center justify-between">
                    {review.createdAt && (
                      <p className="text-[10px] text-brand-placeholder">
                        {formatDate(review.createdAt)}
                        {review.isEdited && <span className="ml-1 italic">(edited)</span>}
                      </p>
                    )}
                    <button
                      onClick={() => setEditingReview(review)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-brand-text-secondary hover:text-brand-accent transition-colors cursor-pointer"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      {editingReview && (
        <EditReviewModal
          propertyId={editingReview.propertyId}
          reviewId={String(editingReview.id)}
          propertyName={editingReview.propertyName}
          initialRating={editingReview.rating}
          initialComment={editingReview.comment}
          onClose={() => setEditingReview(null)}
          onUpdated={() => { setEditingReview(null); setPage(1); loadReviews(1) }}
        />
      )}
    </div>
  )
}
