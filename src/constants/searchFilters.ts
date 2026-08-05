import { Utensils, Home, Building2, Waves, Wifi, Castle, TreePine, X } from "lucide-react";

export const PROPERTY_TYPES = [
  { label: "All types", icon: Home },
  { label: "Hotels", icon: Building2 },
  { label: "Apartments", icon: Building2 },
  { label: "Villa", icon: Castle },
  { label: "Resorts", icon: Waves },
  { label: "Others", icon: TreePine },
];

export const AMENITIES_LIST = [
  { label: "Pool", icon: Waves },
  { label: "Free WiFi", icon: Wifi },
  { label: "Breakfast included", icon: Utensils },
  { label: "Free cancellation", icon: X },
  { label: "Beachfront", icon: Waves },
  { label: "Kitchen", icon: Utensils },
  { label: "Air conditioning", icon: Wifi },
  { label: "Washer", icon: Home },
  { label: "Hot tub", icon: Waves },
  { label: "BBQ grill", icon: Utensils },
  { label: "Ocean view", icon: Waves },
  { label: "Mountain view", icon: TreePine },
  { label: "Fireplace", icon: Home },
  { label: "Self check-in", icon: Home },
  { label: "Smoke detector", icon: Home },
];

export const BED_TYPES = [
  { label: "King bed" },
  { label: "Queen bed" },
  { label: "Single bed" },
  { label: "Sofa bed" },
  { label: "Bunk bed" },
  { label: "Floor mattress" },
];

export const PROPERTY_RULES = [
  { label: "Free parking" },
  { label: "Pets allowed" },
  { label: "Pet friendly" },
  { label: "Smoking allowed" },
  { label: "Events allowed" },
  { label: "Quiet hours" },
];
