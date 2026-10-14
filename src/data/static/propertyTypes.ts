import { Building2, Castle, Sparkles, Waves, Home, Landmark, UtensilsCrossed } from "lucide-react"

export interface PropertyType {
  type: string
  subtitle: string
  icon: typeof Building2
  imageUrl: string
}

export const propertyTypes: PropertyType[] = [
  { type: "Hotel", subtitle: "Comfort & convenience", icon: Building2, imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&auto=format" },
  { type: "Hostel", subtitle: "Budget-friendly stays", icon: Landmark, imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop&auto=format" },
  { type: "Villa", subtitle: "Luxury and comfort", icon: Castle, imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop&auto=format" },
  { type: "Apartment", subtitle: "Private spaces, just like home", icon: Home, imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&auto=format" },
  { type: "Resort", subtitle: "Relax & unwind", icon: Waves, imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop&auto=format" },
  { type: "Guesthouse", subtitle: "Home away from home", icon: Home, imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&auto=format" },
  { type: "Restaurant", subtitle: "Dine & stay", icon: UtensilsCrossed, imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&auto=format" },
  { type: "Other", subtitle: "Unique & one-of-a-kind", icon: Sparkles, imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop&auto=format" },
]
