import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.string(),
})

type FormData = z.infer<typeof schema>

function SearchCard() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { guests: '1' },
  })

  const onSubmit = (data: FormData) => {
    console.log('Search:', { ...data, guests: parseInt(data.guests) })
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-2 w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-0">
        <div className="flex-1 px-4 py-3">
          <label className="block text-xs font-semibold text-gray-800">Where</label>
          <input
            type="text"
            placeholder="Search destinations"
            {...register('destination')}
            className="w-full text-sm text-gray-500 outline-none bg-transparent mt-0.5"
          />
          {errors.destination && <p className="text-red-500 text-xs mt-0.5">{errors.destination.message}</p>}
        </div>

        <div className="w-px h-10 bg-gray-200" />

        <div className="flex-1 px-4 py-3">
          <label className="block text-xs font-semibold text-gray-800">Check in</label>
          <input
            type="date"
            {...register('checkIn')}
            className="w-full text-sm text-gray-500 outline-none bg-transparent mt-0.5"
          />
          {errors.checkIn && <p className="text-red-500 text-xs mt-0.5">{errors.checkIn.message}</p>}
        </div>

        <div className="w-px h-10 bg-gray-200" />

        <div className="flex-1 px-4 py-3">
          <label className="block text-xs font-semibold text-gray-800">Check out</label>
          <input
            type="date"
            {...register('checkOut')}
            className="w-full text-sm text-gray-500 outline-none bg-transparent mt-0.5"
          />
          {errors.checkOut && <p className="text-red-500 text-xs mt-0.5">{errors.checkOut.message}</p>}
        </div>

        <div className="w-px h-10 bg-gray-200" />

        <div className="flex-1 px-4 py-3">
          <label className="block text-xs font-semibold text-gray-800">Guests</label>
          <select
            {...register('guests')}
            className="w-full text-sm text-gray-500 outline-none bg-transparent mt-0.5"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <option key={n} value={String(n)}>{n} {n === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-accent text-white rounded-2xl px-5 py-4 ml-1 hover:bg-accent/90 transition-colors flex items-center gap-2 text-sm font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchCard
