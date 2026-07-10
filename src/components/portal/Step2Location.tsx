import { useEffect, useRef, useState } from 'react'

interface Step2Props {
  data: {
    country: string
    state: string
    city: string
    zip: string
    street: string
    mapLink: string
  }
  onChange: (data: Partial<Step2Props['data']>) => void
}

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'India',
  'Nepal', 'Germany', 'France', 'Italy', 'Spain', 'Japan', 'Brazil',
]

export default function Step2Location({ data, onChange }: Step2Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  const fullAddress = [data.street, data.city, data.state, data.country, data.zip].filter(Boolean).join(', ')

  const getMapEmbedUrl = () => {
    if (data.mapLink) {
      const match = data.mapLink.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
      if (match) {
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50000!2d${match[2]}!3d${match[1]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${match[1]}!5e0!3m2!1sen!2s`
      }
    }

    const query = encodeURIComponent(fullAddress || 'New York')
    return `https://www.google.com/maps?q=${query}&output=embed`
  }

  const extractCoordinates = () => {
    if (data.mapLink) {
      const atMatch = data.mapLink.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
      if (atMatch) {
        setCoordinates({ lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) })
        return
      }
      const llMatch = data.mapLink.match(/ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
      if (llMatch) {
        setCoordinates({ lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) })
        return
      }
      const qMatch = data.mapLink.match(/q=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
      if (qMatch) {
        setCoordinates({ lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) })
        return
      }
    }
    setCoordinates(null)
  }

  useEffect(() => {
    extractCoordinates()
  }, [data.mapLink])

  return (
    <div className="step-location-wrapper">
      <div className="step-card flex-1">
        <h3 className="step-card-title">Physical Address</h3>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Country</label>
            <select
              value={data.country}
              onChange={e => onChange({ country: e.target.value })}
              className="form-select"
            >
              {COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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

        <div className="form-group" style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <h4 className="form-label" style={{ marginBottom: 8 }}>Embed a map</h4>
          <input
            type="text"
            value={data.mapLink}
            onChange={e => onChange({ mapLink: e.target.value })}
            placeholder="Paste your Google Maps share or embed link..."
            className="form-input"
          />
          <p className="form-hint">Go to Google Maps → Share → Copy Link, then paste it here.</p>
          <p className="form-hint">Coordinates are automatically updated when you pin the map.</p>
          {coordinates && (
            <p className="form-hint" style={{ color: 'var(--primary)', fontWeight: 500 }}>
              Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
            </p>
          )}
        </div>
      </div>

      <div className="map-view-panel">
        <div className="map-view-header">
          <h3 className="step-card-title" style={{ margin: 0, fontSize: 15 }}>Map View</h3>
        </div>
        <div className="map-view-content" ref={mapRef}>
          {fullAddress || data.mapLink ? (
            <iframe
              title="Property Location"
              src={getMapEmbedUrl()}
              className="map-iframe"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="map-placeholder">
              <div className="map-placeholder-icon">&#128205;</div>
              <p className="map-placeholder-text">Enter an address or paste a Google Maps link</p>
              <div className="map-placeholder-marker">Property Location</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
