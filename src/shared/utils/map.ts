// Builds a map embed URL. When coordinates are available, uses OpenStreetMap
// embed. Falls back to a Google Maps search embed for address-based queries.
// (0, 0) is treated as invalid — never a real property location.
export function buildMapEmbedUrl(opts: {
  lat?: number | string | null
  lng?: number | string | null
  address?: string
}): string | null {
  const latNum = opts.lat !== undefined && opts.lat !== null && opts.lat !== "" ? Number(opts.lat) : NaN
  const lngNum = opts.lng !== undefined && opts.lng !== null && opts.lng !== "" ? Number(opts.lng) : NaN
  if (Number.isFinite(latNum) && Number.isFinite(lngNum) && (latNum !== 0 || lngNum !== 0)) {
    const pad = 0.008
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lngNum - pad},${latNum - pad},${lngNum + pad},${latNum + pad}&layer=mapnik&marker=${latNum},${lngNum}`
  }
  const query = (opts.address || "").trim()
  if (query) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
  }
  return null
}

export function buildMapDirectionsUrl(opts: {
  lat?: number | string | null
  lng?: number | string | null
  address?: string
}): string {
  const latNum = opts.lat !== undefined && opts.lat !== null && opts.lat !== "" ? Number(opts.lat) : NaN
  const lngNum = opts.lng !== undefined && opts.lng !== null && opts.lng !== "" ? Number(opts.lng) : NaN
  if (Number.isFinite(latNum) && Number.isFinite(lngNum) && (latNum !== 0 || lngNum !== 0)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${latNum},${lngNum}`
  }
  const query = (opts.address || "").trim()
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`
}
