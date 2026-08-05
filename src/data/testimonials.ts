export interface Testimonial {
  id: number
  name: string
  role: string
  avatar: string
  quote: string
}

export const testimonials: Testimonial[] = [
  { id: 1, name: "Jenny Wilson", role: "Travel enthusiast", avatar: "", quote: "StayEasy made our trip so simple! The booking process was quick, easy, and stress-free." },
  { id: 2, name: "Lola Alexander", role: "Frequent traveler", avatar: "", quote: "From booking to check out, everything was seamless and stress-free. Absolutely loved it!" },
  { id: 3, name: "Robert Fox", role: "Digital nomad", avatar: "", quote: "Amazing customer service and great hotel options. Highly recommended!" },
  { id: 4, name: "Sarah Chen", role: "Adventure seeker", avatar: "", quote: "Found the perfect hidden gem thanks to StayEasy. Will definitely book again!" },
  { id: 5, name: "Michael Brown", role: "Family traveler", avatar: "", quote: "The best travel experience we've had. Everything was organized perfectly." },
  { id: 6, name: "Emma Davis", role: "Solo traveler", avatar: "", quote: "Quick bookings, great prices, and wonderful customer support. 10/10!" },
]
