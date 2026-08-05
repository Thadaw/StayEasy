import { useState } from 'react'

const testimonials = [
  {
    id: 1,
    name: 'Aarav Sharma',
    location: 'Kathmandu, Nepal',
    avatar: './src/assets/nepman1.avif',
    rating: 5,
    quote: 'StayEasy le mero pokhara ko trip lo lagi best hotel booking and selection dherai easy banayo. Mero pokhara ko trip eekdum ramailo vayo.',
  },
  {
    id: 2,
    name: 'Sita Gurung',
    location: 'Pokhara, Nepal',
    avatar: './src/assets/nepwomen3.jpg',
    rating: 5,
    quote: 'I booked a family stay in Chitwan through StayEasy. The jungle safari package was incredible and the entire booking process was seamless.',
  },
  {
    id: 3,
    name: 'Rajan Thapa',
    location: 'Bharatpur, Nepal',
    avatar: './src/assets/nepman2.jpg',
    rating: 4,
    quote: 'Great platform for discovering hidden gems in Nepal. Found a beautiful homestay in Bandipur that wasnt listed anywhere else.',
  },
  {
    id: 4,
    name: 'Maya Rai',
    location: 'Dharan, Nepal',
    avatar: '',
    rating: 5,
    quote: 'StayEasy made my trip to Lumbini unforgettable. The hotel recommendations were spot on and the booking took less than a minute.',
  },
  {
    id: 5,
    name: 'Binod Adhikari',
    location: 'Butwal, Nepal',
    avatar: '',
    rating: 4,
    quote: 'Excellent platform! Found a great resort in Pokhara with an amazing mountain view. The prices were better than any other site.',
  },
  {
    id: 6,
    name: 'Priya Karki',
    location: 'Janakpur, Nepal',
    avatar: '',
    rating: 5,
    quote: 'I loved the homestay experience in Bandipur that I found through StayEasy. The host was wonderful and the process was so smooth.',
  },
]

function Testimonials() {
  const [startIdx, setStartIdx] = useState(0)
  const visible = 4

  const totalSlides = Math.max(0, testimonials.length - visible + 1)

  const prev = () => setStartIdx((c) => Math.max(0, c - 1))
  const next = () => setStartIdx((c) => Math.min(totalSlides - 1, c + 1))

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
    ))

  return (
    <section className="px-10 py-10 max-w-7xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
        What our guests say
      </h2>

      <div className="relative flex items-center gap-3">
        <button
          onClick={prev}
          disabled={startIdx === 0}
          className="shrink-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
          aria-label="Previous reviews"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="flex-1 overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-300"
            style={{ transform: `translateX(-${startIdx * (100 / visible)}%)` }}
          >
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm min-w-0"
                style={{ flex: `0 0 calc(${100 / visible}% - ${(visible - 1) * 4 / visible}px)` }}
              >
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(t.rating)}
                </div>
                <p className="text-gray-600 text-xs leading-relaxed mb-3 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2.5">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-xs text-gray-900">{t.name}</p>
                    <p className="text-[11px] text-gray-400">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={next}
          disabled={startIdx >= totalSlides - 1}
          className="shrink-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
          aria-label="Next reviews"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default Testimonials
