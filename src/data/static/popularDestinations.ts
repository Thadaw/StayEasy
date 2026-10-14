export interface PopularDestination {
  city: string
  country: string
  countryCode: string
  rating: number
  price: number
  image: string
  properties: number
}

export const popularDestinations: PopularDestination[] = [
  { city: "Kathmandu", country: "Nepal", countryCode: "NP", rating: 4.8, price: 65, image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=600&fit=crop&auto=format", properties: 420 },
  { city: "Santorini", country: "Greece", countryCode: "GR", rating: 4.7, price: 189, image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=600&fit=crop&auto=format", properties: 324 },
  { city: "Kyoto", country: "Japan", countryCode: "JP", rating: 4.9, price: 176, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=600&fit=crop&auto=format", properties: 412 },
  { city: "Cinque Terre", country: "Italy", countryCode: "IT", rating: 4.7, price: 182, image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400&h=600&fit=crop&auto=format", properties: 567 },
  { city: "Queenstown", country: "New Zealand", countryCode: "NZ", rating: 4.8, price: 185, image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&h=600&fit=crop&auto=format", properties: 189 },
  { city: "Zürich", country: "Switzerland", countryCode: "CH", rating: 4.7, price: 192, image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&h=600&fit=crop&auto=format", properties: 245 },
  { city: "Dubai", country: "United Arab Emirates", countryCode: "AE", rating: 4.8, price: 186, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=600&fit=crop&auto=format", properties: 678 },
  { city: "Bali", country: "Indonesia", countryCode: "ID", rating: 4.6, price: 145, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=600&fit=crop&auto=format", properties: 890 },
  { city: "Malé", country: "Maldives", countryCode: "MV", rating: 4.9, price: 320, image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=600&fit=crop&auto=format", properties: 156 },
  { city: "Bangkok", country: "Thailand", countryCode: "TH", rating: 4.7, price: 78, image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=600&fit=crop&auto=format", properties: 1240 },
  { city: "Paris", country: "France", countryCode: "FR", rating: 4.8, price: 210, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=600&fit=crop&auto=format", properties: 980 },
  { city: "Barcelona", country: "Spain", countryCode: "ES", rating: 4.7, price: 155, image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=600&fit=crop&auto=format", properties: 756 },
  { city: "Istanbul", country: "Turkey", countryCode: "TR", rating: 4.6, price: 95, image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=600&fit=crop&auto=format", properties: 534 },
  { city: "Cairo", country: "Egypt", countryCode: "EG", rating: 4.5, price: 72, image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400&h=600&fit=crop&auto=format", properties: 312 },
  { city: "Marrakech", country: "Morocco", countryCode: "MA", rating: 4.6, price: 85, image: "https://images.unsplash.com/photo-1518730518541-d0843268c287?w=400&h=600&fit=crop&auto=format", properties: 278 },
  { city: "Sydney", country: "Australia", countryCode: "AU", rating: 4.8, price: 195, image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=600&fit=crop&auto=format", properties: 645 },
  { city: "Cape Town", country: "South Africa", countryCode: "ZA", rating: 4.7, price: 110, image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=600&fit=crop&auto=format", properties: 389 },
  { city: "Rio de Janeiro", country: "Brazil", countryCode: "BR", rating: 4.6, price: 120, image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=600&fit=crop&auto=format", properties: 567 },
  { city: "New York", country: "United States", countryCode: "US", rating: 4.8, price: 250, image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=600&fit=crop&auto=format", properties: 2340 },
  { city: "Singapore", country: "Singapore", countryCode: "SG", rating: 4.9, price: 175, image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=600&fit=crop&auto=format", properties: 432 },
  { city: "Hanoi", country: "Vietnam", countryCode: "VN", rating: 4.6, price: 58, image: "https://images.unsplash.com/photo-1509030741425-8e0e1f0e0191?w=400&h=600&fit=crop&auto=format", properties: 378 },
  { city: "Sigiriya", country: "Sri Lanka", countryCode: "LK", rating: 4.7, price: 75, image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=400&h=600&fit=crop&auto=format", properties: 245 },
  { city: "Siem Reap", country: "Cambodia", countryCode: "KH", rating: 4.7, price: 55, image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=400&h=600&fit=crop&auto=format", properties: 198 },
  { city: "Manila", country: "Philippines", countryCode: "PH", rating: 4.5, price: 68, image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=400&h=600&fit=crop&auto=format", properties: 412 },
  { city: "Delhi", country: "India", countryCode: "IN", rating: 4.6, price: 62, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=600&fit=crop&auto=format", properties: 890 },
  { city: "Seoul", country: "South Korea", countryCode: "KR", rating: 4.8, price: 140, image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&h=600&fit=crop&auto=format", properties: 567 },
]
