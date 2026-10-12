import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Step2Props {
  data: {
    country: string
    state: string
    city: string
    zip: string
    street: string
    latitude: number | null
    longitude: number | null
  }
  onChange: (data: Partial<Step2Props['data']>) => void
}

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
  'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
  'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador',
  'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia',
  'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana',
  'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
  'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan',
  'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon',
  'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
  'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
  'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
  'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau',
  'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
  'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal',
  'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
  'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan',
  'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga',
  'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda',
  'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
  'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen',
  'Zambia', 'Zimbabwe',
]

const COUNTRY_CENTERS: Record<string, { center: [number, number]; zoom: number }> = {
  'Afghanistan': { center: [33.9391, 67.71], zoom: 5 },
  'Albania': { center: [41.1533, 20.1683], zoom: 7 },
  'Algeria': { center: [28.0339, 1.6596], zoom: 4 },
  'Andorra': { center: [42.5063, 1.5218], zoom: 8 },
  'Angola': { center: [-11.2027, 17.8739], zoom: 5 },
  'Antigua and Barbuda': { center: [17.0608, -61.7964], zoom: 8 },
  'Argentina': { center: [-38.4161, -63.6167], zoom: 4 },
  'Armenia': { center: [40.0691, 45.0382], zoom: 7 },
  'Australia': { center: [-25.27, 133.78], zoom: 4 },
  'Austria': { center: [47.5162, 14.5501], zoom: 6 },
  'Azerbaijan': { center: [40.1431, 47.5769], zoom: 6 },
  'Bahamas': { center: [25.0259, -77.3538], zoom: 7 },
  'Bahrain': { center: [26.0667, 50.5577], zoom: 9 },
  'Bangladesh': { center: [23.685, 90.3563], zoom: 7 },
  'Barbados': { center: [13.1939, -59.5432], zoom: 9 },
  'Belarus': { center: [53.7098, 27.9534], zoom: 5 },
  'Belgium': { center: [50.5039, 4.4699], zoom: 6 },
  'Belize': { center: [17.1899, -88.4976], zoom: 7 },
  'Benin': { center: [9.3077, 2.3158], zoom: 6 },
  'Bhutan': { center: [27.5142, 90.4336], zoom: 7 },
  'Bolivia': { center: [-16.2902, -63.5887], zoom: 5 },
  'Bosnia and Herzegovina': { center: [43.9159, 17.6791], zoom: 7 },
  'Botswana': { center: [-22.3285, 24.6849], zoom: 5 },
  'Brazil': { center: [-14.235, -51.9253], zoom: 4 },
  'Brunei': { center: [4.5353, 114.7277], zoom: 8 },
  'Bulgaria': { center: [42.7339, 25.4858], zoom: 6 },
  'Burkina Faso': { center: [12.3714, -1.5197], zoom: 6 },
  'Burundi': { center: [-3.3731, 29.9189], zoom: 8 },
  'Cambodia': { center: [12.5657, 104.991], zoom: 6 },
  'Cameroon': { center: [7.3697, 12.3547], zoom: 5 },
  'Canada': { center: [56.13, -106.35], zoom: 3 },
  'Cape Verde': { center: [16.5388, -23.0418], zoom: 8 },
  'Central African Republic': { center: [6.6111, 20.9394], zoom: 5 },
  'Chad': { center: [15.4542, 18.7322], zoom: 5 },
  'Chile': { center: [-35.6751, -71.543], zoom: 4 },
  'China': { center: [35.8617, 104.1954], zoom: 4 },
  'Colombia': { center: [4.5709, -74.2973], zoom: 5 },
  'Comoros': { center: [-11.6455, 43.33], zoom: 8 },
  'Congo': { center: [-4.0383, 21.7587], zoom: 5 },
  'Costa Rica': { center: [9.7489, -83.7534], zoom: 7 },
  'Croatia': { center: [45.1, 15.2], zoom: 6 },
  'Cuba': { center: [21.5218, -77.7812], zoom: 6 },
  'Cyprus': { center: [35.1264, 33.4299], zoom: 7 },
  'Czech Republic': { center: [49.8175, 15.473], zoom: 6 },
  'Denmark': { center: [56.2639, 9.5018], zoom: 5 },
  'Djibouti': { center: [11.8251, 42.5903], zoom: 8 },
  'Dominica': { center: [15.415, -61.371], zoom: 8 },
  'Dominican Republic': { center: [18.7357, -70.1627], zoom: 6 },
  'East Timor': { center: [-8.8742, 125.7275], zoom: 6 },
  'Ecuador': { center: [-1.8312, -78.1834], zoom: 6 },
  'Egypt': { center: [26.8206, 30.8025], zoom: 5 },
  'El Salvador': { center: [13.7942, -88.8965], zoom: 8 },
  'Equatorial Guinea': { center: [1.6508, 10.2679], zoom: 8 },
  'Eritrea': { center: [15.1794, 39.7823], zoom: 6 },
  'Estonia': { center: [58.5953, 25.0136], zoom: 6 },
  'Eswatini': { center: [-26.5225, 31.4659], zoom: 8 },
  'Ethiopia': { center: [9.145, 40.4897], zoom: 5 },
  'Fiji': { center: [-17.7134, 178.065], zoom: 6 },
  'Finland': { center: [61.9241, 25.7482], zoom: 4 },
  'France': { center: [46.6, 2.2137], zoom: 6 },
  'Gabon': { center: [-0.8037, 11.6094], zoom: 5 },
  'Gambia': { center: [13.4432, -15.3101], zoom: 7 },
  'Georgia': { center: [42.3154, 43.3569], zoom: 6 },
  'Germany': { center: [51.1657, 10.4515], zoom: 6 },
  'Ghana': { center: [7.9465, -1.0232], zoom: 6 },
  'Greece': { center: [39.0742, 21.8243], zoom: 6 },
  'Grenada': { center: [12.1165, -61.679], zoom: 9 },
  'Guatemala': { center: [15.7835, -90.2308], zoom: 6 },
  'Guinea': { center: [9.9456, -9.6966], zoom: 6 },
  'Guinea-Bissau': { center: [11.8037, -15.1804], zoom: 7 },
  'Guyana': { center: [4.8604, -58.9302], zoom: 6 },
  'Haiti': { center: [18.9712, -72.2852], zoom: 7 },
  'Honduras': { center: [15.2, -86.2419], zoom: 6 },
  'Hungary': { center: [47.1625, 19.5033], zoom: 6 },
  'Iceland': { center: [64.9631, -19.0208], zoom: 5 },
  'India': { center: [20.59, 78.96], zoom: 5 },
  'Indonesia': { center: [-0.7893, 113.9213], zoom: 4 },
  'Iran': { center: [32.4279, 53.688], zoom: 4 },
  'Iraq': { center: [33.2232, 43.6793], zoom: 5 },
  'Ireland': { center: [53.1424, -7.6921], zoom: 6 },
  'Israel': { center: [31.0461, 34.8516], zoom: 7 },
  'Italy': { center: [41.8719, 12.5674], zoom: 5 },
  'Ivory Coast': { center: [7.54, -5.5471], zoom: 6 },
  'Jamaica': { center: [18.1096, -77.2975], zoom: 7 },
  'Japan': { center: [36.2048, 138.2529], zoom: 5 },
  'Jordan': { center: [30.5852, 36.2384], zoom: 6 },
  'Kazakhstan': { center: [48.0196, 66.9237], zoom: 4 },
  'Kenya': { center: [-0.0236, 37.9062], zoom: 6 },
  'Kiribati': { center: [1.8708, -157.363], zoom: 4 },
  'Kosovo': { center: [42.6026, 20.902], zoom: 7 },
  'Kuwait': { center: [29.3117, 47.4818], zoom: 8 },
  'Kyrgyzstan': { center: [41.2044, 74.7661], zoom: 6 },
  'Laos': { center: [19.8563, 102.4955], zoom: 6 },
  'Latvia': { center: [56.8796, 24.6032], zoom: 6 },
  'Lebanon': { center: [33.8547, 35.8623], zoom: 7 },
  'Lesotho': { center: [-29.61, 28.2336], zoom: 8 },
  'Liberia': { center: [6.4281, -9.4295], zoom: 7 },
  'Libya': { center: [26.3351, 17.2283], zoom: 5 },
  'Liechtenstein': { center: [47.166, 9.5554], zoom: 9 },
  'Lithuania': { center: [55.1694, 23.8813], zoom: 6 },
  'Luxembourg': { center: [49.8153, 6.1296], zoom: 9 },
  'Madagascar': { center: [-18.7669, 46.8691], zoom: 5 },
  'Malawi': { center: [-13.2543, 34.3015], zoom: 6 },
  'Malaysia': { center: [4.2105, 101.9758], zoom: 5 },
  'Maldives': { center: [3.2028, 73.2207], zoom: 6 },
  'Mali': { center: [17.5707, -3.9962], zoom: 4 },
  'Malta': { center: [35.9375, 14.3754], zoom: 9 },
  'Marshall Islands': { center: [7.1315, 171.1845], zoom: 6 },
  'Mauritania': { center: [21.0079, -10.9408], zoom: 5 },
  'Mauritius': { center: [-20.3484, 57.5522], zoom: 9 },
  'Mexico': { center: [23.6345, -102.5528], zoom: 4 },
  'Micronesia': { center: [7.4256, 150.5508], zoom: 6 },
  'Moldova': { center: [47.4116, 28.3699], zoom: 7 },
  'Monaco': { center: [43.7384, 7.4246], zoom: 12 },
  'Mongolia': { center: [46.8625, 103.8467], zoom: 4 },
  'Montenegro': { center: [42.7087, 19.3744], zoom: 7 },
  'Morocco': { center: [31.7917, -7.0926], zoom: 5 },
  'Mozambique': { center: [-18.6657, 35.5296], zoom: 5 },
  'Myanmar': { center: [21.9162, 95.956], zoom: 5 },
  'Namibia': { center: [-22.9576, 18.4904], zoom: 5 },
  'Nauru': { center: [-0.5228, 166.9315], zoom: 9 },
  'Nepal': { center: [28.3949, 84.124], zoom: 7 },
  'Netherlands': { center: [52.1326, 5.2913], zoom: 6 },
  'New Zealand': { center: [-40.9006, 174.886], zoom: 5 },
  'Nicaragua': { center: [12.8654, -85.2072], zoom: 6 },
  'Niger': { center: [17.6078, 8.0817], zoom: 4 },
  'Nigeria': { center: [9.082, 8.6753], zoom: 6 },
  'North Korea': { center: [40.3399, 127.5101], zoom: 5 },
  'North Macedonia': { center: [41.5122, 21.7453], zoom: 7 },
  'Norway': { center: [60.472, 8.4689], zoom: 4 },
  'Oman': { center: [21.4735, 55.9754], zoom: 6 },
  'Pakistan': { center: [30.3753, 69.3451], zoom: 5 },
  'Palau': { center: [7.515, 134.5825], zoom: 8 },
  'Palestine': { center: [31.9522, 35.2332], zoom: 8 },
  'Panama': { center: [8.538, -80.7821], zoom: 7 },
  'Papua New Guinea': { center: [-6.315, 143.9555], zoom: 5 },
  'Paraguay': { center: [-23.4425, -58.4438], zoom: 5 },
  'Peru': { center: [-9.19, -75.0152], zoom: 5 },
  'Philippines': { center: [12.8797, 121.774], zoom: 5 },
  'Poland': { center: [51.9194, 19.1451], zoom: 5 },
  'Portugal': { center: [39.3999, -8.2245], zoom: 6 },
  'Qatar': { center: [25.3548, 51.1839], zoom: 8 },
  'Romania': { center: [45.9432, 24.9668], zoom: 6 },
  'Russia': { center: [61.524, 105.3188], zoom: 3 },
  'Rwanda': { center: [-1.9403, 29.8739], zoom: 8 },
  'Saint Kitts and Nevis': { center: [17.3578, -62.783], zoom: 9 },
  'Saint Lucia': { center: [13.9094, -60.9789], zoom: 9 },
  'Saint Vincent and the Grenadines': { center: [12.9843, -61.2872], zoom: 9 },
  'Samoa': { center: [-13.759, -172.1046], zoom: 7 },
  'San Marino': { center: [43.9424, 12.4578], zoom: 10 },
  'Sao Tome and Principe': { center: [0.1864, 6.6131], zoom: 9 },
  'Saudi Arabia': { center: [23.8859, 45.0792], zoom: 5 },
  'Senegal': { center: [14.4974, -14.4524], zoom: 6 },
  'Serbia': { center: [44.0165, 21.0059], zoom: 6 },
  'Seychelles': { center: [-4.6796, 55.492], zoom: 8 },
  'Sierra Leone': { center: [8.4606, -11.7799], zoom: 7 },
  'Singapore': { center: [1.3521, 103.8198], zoom: 11 },
  'Slovakia': { center: [48.669, 19.699], zoom: 6 },
  'Slovenia': { center: [46.1512, 14.9955], zoom: 7 },
  'Solomon Islands': { center: [-9.6457, 160.1562], zoom: 6 },
  'Somalia': { center: [5.1521, 46.1996], zoom: 5 },
  'South Africa': { center: [-30.5595, 22.9375], zoom: 5 },
  'South Korea': { center: [35.9078, 127.7669], zoom: 6 },
  'South Sudan': { center: [6.877, 31.307], zoom: 5 },
  'Spain': { center: [40.4637, -3.7492], zoom: 5 },
  'Sri Lanka': { center: [7.8731, 80.7718], zoom: 7 },
  'Sudan': { center: [12.8628, 30.2174], zoom: 5 },
  'Suriname': { center: [3.9193, -56.0278], zoom: 6 },
  'Sweden': { center: [60.1282, 18.6435], zoom: 4 },
  'Switzerland': { center: [46.8182, 8.2275], zoom: 7 },
  'Syria': { center: [34.8021, 38.9968], zoom: 6 },
  'Taiwan': { center: [23.6978, 120.9605], zoom: 7 },
  'Tajikistan': { center: [38.861, 71.2761], zoom: 6 },
  'Tanzania': { center: [-6.369, 34.8888], zoom: 5 },
  'Thailand': { center: [15.87, 100.9925], zoom: 5 },
  'Togo': { center: [8.6195, 1.208], zoom: 6 },
  'Tonga': { center: [-21.179, -175.1982], zoom: 7 },
  'Trinidad and Tobago': { center: [10.6918, -61.2225], zoom: 8 },
  'Tunisia': { center: [33.8869, 9.5375], zoom: 6 },
  'Turkey': { center: [38.9637, 35.2433], zoom: 5 },
  'Turkmenistan': { center: [38.9697, 59.5563], zoom: 5 },
  'Tuvalu': { center: [-8.5243, 179.194], zoom: 8 },
  'Uganda': { center: [1.3733, 32.2903], zoom: 6 },
  'Ukraine': { center: [48.3794, 31.1656], zoom: 5 },
  'United Arab Emirates': { center: [23.4241, 53.8478], zoom: 6 },
  'United Kingdom': { center: [54.5, -3.4], zoom: 5 },
  'United States': { center: [39.8283, -98.5795], zoom: 4 },
  'Uruguay': { center: [-32.5228, -55.7658], zoom: 6 },
  'Uzbekistan': { center: [41.3775, 64.5853], zoom: 5 },
  'Vanuatu': { center: [-15.3767, 166.9592], zoom: 6 },
  'Vatican City': { center: [41.9029, 12.4534], zoom: 13 },
  'Venezuela': { center: [6.4238, -66.5897], zoom: 5 },
  'Vietnam': { center: [14.0583, 108.2772], zoom: 5 },
  'Yemen': { center: [15.5527, 48.5164], zoom: 6 },
  'Zambia': { center: [-13.1339, 28.6387], zoom: 5 },
  'Zimbabwe': { center: [-19.0154, 29.1549], zoom: 5 },
}

const DEFAULT_CENTER: [number, number] = [20, 0]
const DEFAULT_ZOOM = 2

const COUNTRY_SEARCH_HINTS: Record<string, string> = {
  'United States': 'USA',
  'United Kingdom': 'UK',
  'South Korea': 'Korea',
  'North Korea': 'DPRK',
  'Czech Republic': 'Czechia',
  'Ivory Coast': 'Cote d\'Ivoire',
  'Democratic Republic of the Congo': 'DRC',
  'Timor-Leste': 'East Timor',
  'Eswatini': 'Swaziland',
  'North Macedonia': 'Macedonia',
}

const pinIcon = L.divIcon({
  className: 'step-map-pin',
  html: '<svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 0C6.7 0 0 6.7 0 15c0 11.2 15 27 15 27s15-15.8 15-27C30 6.7 23.3 0 15 0z" fill="#e94560"/><circle cx="15" cy="15" r="6" fill="#fff"/></svg>',
  iconSize: [30, 42],
  iconAnchor: [15, 42],
})

async function reverseGeocode(lat: number, lng: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Reverse geocoding failed')
  const json = await res.json()
  const a: Record<string, string> = json.address || {}
  return {
    country: a.country || '',
    state: a.state || a.state_district || a.region || '',
    city: a.city || a.town || a.village || a.municipality || a.county || '',
    zip: a.postcode || '',
    street: [a.road, a.house_number].filter(Boolean).join(' ') || a.road || a.neighbourhood || '',
  }
}

async function forwardGeocode(query: string): Promise<{ lat: number; lon: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Geocoding failed')
  const json = await res.json()
  if (Array.isArray(json) && json.length > 0) {
    return { lat: parseFloat(json[0].lat), lon: parseFloat(json[0].lon) }
  }
  return null
}

export default function Step2Location({ data, onChange }: Step2Props) {
  const [countrySearch, setCountrySearch] = useState('')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const lastPlacedRef = useRef<{ lat: number; lng: number } | null>(null)
  const lastGeocodedRef = useRef<{ country: string; state: string; city: string }>({ country: '', state: '', city: '' })
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchSeqRef = useRef(0)
  const countryDropdownRef = useRef<HTMLDivElement>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const el = mapContainerRef.current
    if (!el) return

    const map = L.map(el, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      worldCopyJump: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    const placeMarker = (lat: number, lng: number) => {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng])
      } else {
        markerRef.current = L.marker([lat, lng], { icon: pinIcon }).addTo(map)
      }
    }

    map.on('click', (e) => {
      const lat = +e.latlng.lat.toFixed(6)
      const lng = +e.latlng.lng.toFixed(6)
      placeMarker(lat, lng)
      lastPlacedRef.current = { lat, lng }
      map.setView([lat, lng], Math.max(map.getZoom(), 15))
      reverseGeocode(lat, lng)
        .then((fields) => {
          lastGeocodedRef.current = { country: fields.country, state: fields.state, city: fields.city }
          onChangeRef.current({ ...fields, latitude: lat, longitude: lng })
        })
        .catch(() => onChangeRef.current({ latitude: lat, longitude: lng }))
    })

    mapRef.current = map
    const t = setTimeout(() => map.invalidateSize(), 0)

    return () => {
      clearTimeout(t)
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [])

  useEffect(() => {
    const { latitude, longitude } = data
    if (latitude == null || longitude == null) {
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      return
    }
    const last = lastPlacedRef.current
    if (last && Math.abs(last.lat - latitude) < 1e-9 && Math.abs(last.lng - longitude) < 1e-9) return
    const map = mapRef.current
    if (!map) return
    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude])
    } else {
      markerRef.current = L.marker([latitude, longitude], { icon: pinIcon }).addTo(map)
    }
    map.setView([latitude, longitude], 16)
  }, [data.latitude, data.longitude])

  useEffect(() => {
    const map = mapRef.current
    const center = COUNTRY_CENTERS[data.country]
    if (!map || !center) return
    if (lastGeocodedRef.current.country === data.country) return
    if (data.latitude != null && data.longitude != null) return
    map.setView(center.center, center.zoom)
  }, [data.country, data.latitude, data.longitude])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (lastGeocodedRef.current.city === data.city && lastGeocodedRef.current.state === data.state) return
    if (!data.city && !data.state) return

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    const seq = ++searchSeqRef.current
    const country = COUNTRY_SEARCH_HINTS[data.country] || data.country
    const query = [data.city, data.state, country].filter(Boolean).join(', ')

    searchTimerRef.current = setTimeout(() => {
      forwardGeocode(query)
        .then((res) => {
          if (!res || seq !== searchSeqRef.current) return
          map.setView([res.lat, res.lon], data.city ? 12 : 9)
        })
        .catch(() => {})
    }, 700)

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    }
  }, [data.city, data.state, data.country])

  return (
    <div className="step-location-wrapper">
      <div className="step-card flex-1">
        <h3 className="step-card-title">Physical Address</h3>
        <p className="form-hint" style={{ marginBottom: 14 }}>
          Fill the country, city, or state and the map moves to it — or click anywhere on the map to auto-fill the address.
        </p>

        <div className="form-row-2">
          <div className="form-group" style={{ position: 'relative' }} ref={countryDropdownRef}>
            <label className="form-label">Country</label>
            <input
              type="text"
              value={showCountryDropdown ? countrySearch : data.country}
              onChange={e => {
                setCountrySearch(e.target.value)
                setShowCountryDropdown(true)
              }}
              onFocus={() => {
                setCountrySearch('')
                setShowCountryDropdown(true)
              }}
              placeholder="Search country..."
              className="form-input"
            />
            {showCountryDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: 200,
                  overflowY: 'auto',
                  background: 'var(--bg-white, #fff)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  zIndex: 100,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                {COUNTRIES.filter(c =>
                  c.toLowerCase().includes(countrySearch.toLowerCase()) ||
                  (COUNTRY_SEARCH_HINTS[c] || '').toLowerCase().includes(countrySearch.toLowerCase())
                ).map(c => (
                  <div
                    key={c}
                    onClick={() => {
                      lastGeocodedRef.current = { country: '', state: '', city: '' }
                      onChange({ country: c, latitude: null, longitude: null })
                      setCountrySearch('')
                      setShowCountryDropdown(false)
                    }}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      background: c === data.country ? 'var(--primary-light, #e8f0fe)' : 'transparent',
                      borderBottom: '1px solid var(--border-light, #f0f0f0)',
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLElement).style.background = 'var(--primary-light, #e8f0fe)'
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLElement).style.background = c === data.country ? 'var(--primary-light, #e8f0fe)' : 'transparent'
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">State/Province</label>
            <input
              type="text"
              value={data.state}
              onChange={e => onChange({ state: e.target.value })}
              placeholder="State"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              value={data.city}
              onChange={e => onChange({ city: e.target.value })}
              placeholder="City"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">ZIP/Postal Code</label>
            <input
              type="text"
              value={data.zip}
              onChange={e => onChange({ zip: e.target.value })}
              placeholder="Zip Code"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Street Address</label>
          <input
            type="text"
            value={data.street}
            onChange={e => onChange({ street: e.target.value })}
            placeholder="e.g. 123 Property Lane"
            className="form-input"
          />
        </div>

        {(data.latitude != null && data.longitude != null) && (
          <p className="form-hint" style={{ color: 'var(--primary)', fontWeight: 500, marginTop: 12 }}>
            Lat: {data.latitude.toFixed(6)}, Lng: {data.longitude.toFixed(6)}
          </p>
        )}
      </div>

      <div className="map-view-panel">
        <div className="map-view-header">
          <h3 className="step-card-title" style={{ margin: 0, fontSize: 15 }}>Click to Pin Location</h3>
        </div>
        <div className="map-view-content" ref={mapContainerRef} />
      </div>
    </div>
  )
}
