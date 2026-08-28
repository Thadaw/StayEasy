import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../../../context/FavoritesContext'
import { Heart, MapPin, Building2 } from 'lucide-react'
import { FavouriteButton } from '../../../shared/components/FavouriteButton'

export default function Favourites() {
  const { favorites, getFavoriteProperties, toggleFavorite, isFavorite, loading } = useFavorites()
  const navigate = useNavigate()

  const properties = getFavoriteProperties()

  if (loading) {
    return (
      <div className="max-w-3xl">
        <div className="bg-white rounded-xl border border-brand-card-border p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent mx-auto mb-4" />
          <p className="text-sm text-brand-text-secondary">Loading favourites...</p>
        </div>
      </div>
    )
  }

  if (favorites.size === 0) {
    return (
      <div className="max-w-3xl">
        <div className="bg-white rounded-xl border border-brand-card-border p-12 text-center">
          <Heart size={48} className="text-brand-placeholder mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-brand-heading mb-2">No favourites yet</h2>
          <p className="text-sm text-brand-text-secondary mb-6">Start exploring and save properties you love.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 text-sm font-semibold rounded-lg border-none text-white bg-brand-accent hover:bg-brand-accent-hover transition-colors cursor-pointer"
          >
            Browse stays
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <h2 className="text-lg font-semibold text-brand-heading mb-4">
        Saved properties
        <span className="text-sm font-normal text-brand-text-secondary ml-2">({favorites.size})</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {properties.map((property) => {
          const location = [property.city, property.state, property.country]
            .filter(Boolean)
            .join(', ')

          return (
            <div
              key={property.property_id}
              onClick={() => navigate(`/hotel/${property.property_id}`)}
              className="bg-white rounded-xl border border-brand-card-border overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="relative h-[140px] overflow-hidden">
                {property.cover_photo ? (
                  <img
                    src={property.cover_photo}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Building2 size={40} className="text-gray-300" />
                  </div>
                )}
                <FavouriteButton
                  isFavourite={isFavorite(property.property_id)}
                  onToggle={() => toggleFavorite(property.property_id, property)}
                  size={16}
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-brand-heading">
                  {property.type}
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold leading-tight line-clamp-1 text-brand-heading">{property.name}</h3>
                <p className="text-[11px] flex items-center gap-0.5 text-brand-text-secondary mt-0.5">
                  <MapPin size={10} /> {location}
                </p>
                <p className="text-sm font-bold text-brand-heading mt-2">
                  {property.currency} {property.lowest_rate ?? property.total_price}
                  <span className="text-[10px] font-normal text-brand-text-secondary"> / night</span>
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
