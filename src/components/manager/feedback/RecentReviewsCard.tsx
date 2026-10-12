import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { RECENT_REVIEWS, getInitials } from './demoFeedback'

export default function RecentReviewsCard() {
  const navigate = useNavigate()

  return (
    <div className="f-card">
      <div className="f-card-head">
        <div>
          <h3 className="f-card-title">Recent Guest Reviews</h3>
          <p className="f-card-sub">Latest feedback from guests</p>
        </div>
        <button
          onClick={() => navigate('/manager/feedback')}
          style={{
            border: 'none',
            background: 'transparent',
            fontSize: 13,
            fontWeight: 600,
            color: '#2563eb',
            cursor: 'pointer',
          }}
        >
          View All Reviews →
        </button>
      </div>

      <div className="f-recent">
        {RECENT_REVIEWS.map((review) => (
          <div
            key={review.id}
            style={{ border: '1px solid #f3f4f6', borderRadius: 10, padding: 16, background: '#f9fafb' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: review.avatarColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {getInitials(review.guest)}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{review.guest}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{review.meta}</div>
              </div>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  background: '#dbeafe',
                  color: '#2563eb',
                  whiteSpace: 'nowrap',
                }}
              >
                {review.category}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ color: star <= review.rating ? '#f59e0b' : '#d1d5db', fontSize: 14 }}>
                  ★
                </span>
              ))}
            </div>

            <p style={{ margin: '0 0 12px', fontSize: 13, color: '#6b7280', lineHeight: 1.55 }}>&ldquo;{review.text}&rdquo;</p>

            <button
              onClick={() => toast.success(`Reply started for ${review.guest}`)}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                background: '#fff',
                color: '#111827',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reply
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
