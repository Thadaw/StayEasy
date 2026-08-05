import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../../../context/FavoritesContext'
import { Heart } from 'lucide-react'

export default function Favourites() {
  const { favorites } = useFavorites()
  const navigate = useNavigate()

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
    <div className="max-w-3xl">
      <div className="bg-white rounded-xl border border-brand-card-border p-12 text-center">
        <Heart size={48} className="text-brand-placeholder mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-brand-heading mb-2">
          Saved properties
          <span className="text-sm font-normal text-brand-text-secondary ml-2">({favorites.size})</span>
        </h2>
        <p className="text-sm text-brand-text-secondary mb-6">Favourites are syncing soon — this page will list your saved stays.</p>
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
