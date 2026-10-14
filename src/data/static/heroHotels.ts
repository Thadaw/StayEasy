export interface HeroHotel {
  id: number
  location: string
  tagline: string
  price: number
  rating: number
  image: string
}

export const heroHotels: HeroHotel[] = [
  {
    id: 1,
    location: "Santorini, Greece",
    tagline: "Sea view villas",
    price: 198,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop&auto=format",
  },
  {
    id: 2,
    location: "Bali, Indonesia",
    tagline: "Jungle retreats",
    price: 112,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop&auto=format",
  },
  {
    id: 3,
    location: "Kyoto, Japan",
    tagline: "Traditional stays",
    price: 156,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop&auto=format",
  },
]
