import { Grid3X3, Compass, Mountain, Building2, TreePine, Home, TrendingUp } from "lucide-react"

export interface Vibe {
  label: string
  icon: typeof Grid3X3
}

export const vibes: Vibe[] = [
  { label: "All", icon: Grid3X3 },
  { label: "Beach", icon: Compass },
  { label: "Mountains", icon: Mountain },
  { label: "City", icon: Building2 },
  { label: "Countryside", icon: TreePine },
  { label: "Design", icon: Home },
  { label: "Trending", icon: TrendingUp },
]
