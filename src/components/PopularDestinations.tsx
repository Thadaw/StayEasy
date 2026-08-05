import { useState } from 'react'
import { motion } from 'framer-motion'

const destinations = [
  { id: 1, name: 'Mount Kailash Resort', country: 'Pokhara', image: 'https://r1imghtlak.mmtcdn.com/930f03c1-1a34-4df5-b12f-5b2aa3040903.jpg?output-format=jpg&downsize=720:*', price: 85 },
  { id: 2, name: 'Hotel Shanker-Palatial Heritage Kathmandu', country: 'Kathmandu', image: 'https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/6608967321245226-bf7e8939-a637-4e32-b605-307325176133.jpg?output-format=jpg&downsize=720:*', price: 110 },
  { id: 3, name: 'Green Park Chitwan', country: 'Chitwan', image: 'https://i.travelapi.com/lodging/10000000/9190000/9186300/9186226/2d16e056_z.jpg', price: 75 },
  { id: 4, name: 'Lo Mustang Himalayan Resort', country: 'Mustang', image: 'https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/202304161209075170-e4dff537-3fe0-432f-ab47-9bdc014d3921.jpg?output-format=jpg&downsize=720:*', price: 130 },
  { id: 5, name: 'Siddhartha Vilasa', country: 'Nepal', image: 'https://r1imghtlak.mmtcdn.com/4b767297-271b-41a6-874c-0cce0a6f84fc.jpg?output-format=jpg&downsize=720:*', price: 95 },
  { id: 6, name: 'Hotel Central Bhaktapur', country: 'Nepal', image: 'https://i.travelapi.com/lodging/35000000/34600000/34593200/34593161/7be09214_z.jpg', price: 60 },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function PopularDestinations() {
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
        Popular destinations
      </h2>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {destinations.map((d) => (
          <motion.div key={d.id} variants={cardVariants} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-3">
              <button
                onClick={(e) => { e.stopPropagation(); toggleFav(d.id) }}
                className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                aria-label="Toggle favorite"
              >
                {favorites.has(d.id) ? (
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
                src={d.image}
                alt={d.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{d.name}</h3>
            <p className="text-xs text-gray-500">{d.country}</p>
            <p className="text-xs text-gray-400 mt-0.5">${d.price} / night</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default PopularDestinations
