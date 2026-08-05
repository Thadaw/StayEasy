import { Tag, Shield, Clock, Headphones } from "lucide-react"

export interface TrustBadge {
  icon: typeof Tag
  title: string
  description: string
}

export const trustBadges: TrustBadge[] = [
  { icon: Tag, title: "Best Price Guarantee", description: "Find a lower price? We'll match it and give you 10% off." },
  { icon: Shield, title: "Safe & secure", description: "Book with confidence. 24/7 support." },
  { icon: Clock, title: "Flexible booking", description: "Free cancellation on most reservations." },
  { icon: Headphones, title: "24/7 support", description: "Always here whenever you need us." },
]
