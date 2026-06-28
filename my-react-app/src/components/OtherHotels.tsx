import { useState } from 'react'
import { motion } from 'framer-motion'

const hotels = [
  { id: 1, name: 'Dwarika\'s Hotel', location: 'Kathmandu', image: 'https://luxeadventuretraveler.com/wp-content/uploads/2017/06/Luxe-Adventure-Traveler-Dwarikas-Hotel-Kathmandu-9.jpg', price: 89 },
  { id: 2, name: 'Tiger Mountain Pokhara Lodge', location: 'Pokhara', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/01/cd/a0/af/main-lodge-terrace-in.jpg?w=900&h=500&s=1', price: 120 },
  { id: 3, name: 'Barahi Jungle Lodge', location: 'Chitwan', image: 'https://images.trvl-media.com/lodging/18000000/17680000/17679800/17679715/fafc8e2b.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill', price: 95 },
  { id: 4, name: 'Hotel Yak & Yeti', location: 'Kathmandu', image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/689323318.jpg?k=4162331bc04666a3bc5ee59e4bef3339b9784a3a6f7a7a812ccd9cea5cabf95b&o=', price: 150 },
  { id: 5, name: 'The Pavilions Himalayas', location: 'Pokhara', image: 'https://www.pavilionshotels.com/wp-content/uploads/2024/04/HMLV-Gallery-3.webp', price: 180 },
  { id: 6, name: 'Tiger Palace Resort', location: 'Bhairahawa', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/73/41/e4/property-facade.jpg?w=900&h=500&s=1', price: 105 },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function OtherHotels() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const toggleFav = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <section className="px-10 py-12 max-w-7xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
        Other hotels from Nepal
      </h2>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {hotels.map((h) => (
          <motion.div key={h.id} variants={cardVariants} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-3">
              <button
                onClick={(e) => { e.stopPropagation(); toggleFav(h.id) }}
                className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                aria-label="Toggle favorite"
              >
                {favorites.has(h.id) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#e34b4b" stroke="#e34b4b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                )}
              </button>
              <img
                src={h.image}
                alt={h.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{h.name}</h3>
            <p className="text-xs text-gray-500">{h.location}</p>
            <p className="text-xs text-gray-400 mt-0.5">${h.price} / night</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default OtherHotels
