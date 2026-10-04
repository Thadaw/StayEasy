import { useEffect, useCallback, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SlidersHorizontal } from "lucide-react"
import { filterParamsSchema, type FilterParams } from "../schemas/searchParams"
import { usePropertyRoomTypes } from "../hooks/usePropertyRoomTypes"
import { usePropertyBedTypes } from "../hooks/usePropertyBedTypes"
import { usePropertyAmenities } from "../hooks/usePropertyAmenities"

interface FilterSidebarProps {
  maxPrice: number
  onMaxPriceChange?: (max: number) => void
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export function FilterSidebar({ maxPrice }: FilterSidebarProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { roomTypes } = usePropertyRoomTypes()
  const { bedTypes } = usePropertyBedTypes()
  const { amenities: systemAmenities } = usePropertyAmenities()

  const {
    control,
    setValue,
    reset,
  } = useForm<FilterParams>({
    resolver: zodResolver(filterParamsSchema),
    defaultValues: {
      min_price: searchParams.get("min_price") || "0",
      max_price: searchParams.get("max_price") || String(maxPrice),
      room_type_ids: searchParams.get("room_type_ids") || "",
      bed_type_ids: searchParams.get("bed_type_ids") || "",
      amenity_ids: searchParams.get("amenity_ids") || "",
    },
  })

  const watchedFilters = useWatch({ control })

  const debouncedPriceRange = useDebounce(
    { min: watchedFilters.min_price, max: watchedFilters.max_price },
    400
  )

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (debouncedPriceRange.min && debouncedPriceRange.min !== "0") {
        next.set("min_price", debouncedPriceRange.min)
      } else {
        next.delete("min_price")
      }
      if (debouncedPriceRange.max && debouncedPriceRange.max !== "500") {
        next.set("max_price", debouncedPriceRange.max)
      } else {
        next.delete("max_price")
      }
      return next
    }, { replace: true })
  }, [debouncedPriceRange, setSearchParams])

  const syncFilterToUrl = useCallback((key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value && value !== "0" && value !== "") {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      return next
    }, { replace: true })
  }, [setSearchParams])

  const toggleRoomType = useCallback((roomType: { id: string; room_type_name: string }) => {
    const current = watchedFilters.room_type_ids
      ? watchedFilters.room_type_ids.split(",").filter(Boolean)
      : []
    const newIds = current.includes(roomType.id)
      ? current.filter((id) => id !== roomType.id)
      : [...current, roomType.id]
    const newValue = newIds.join(",")
    setValue("room_type_ids", newValue, { shouldValidate: true })
    syncFilterToUrl("room_type_ids", newValue)
  }, [watchedFilters.room_type_ids, setValue, syncFilterToUrl])

  const toggleBedType = useCallback((bedType: { id: string }) => {
    const current = watchedFilters.bed_type_ids
      ? watchedFilters.bed_type_ids.split(",").filter(Boolean)
      : []
    const newIds = current.includes(bedType.id)
      ? current.filter((id) => id !== bedType.id)
      : [...current, bedType.id]
    const newValue = newIds.join(",")
    setValue("bed_type_ids", newValue, { shouldValidate: true })
    syncFilterToUrl("bed_type_ids", newValue)
  }, [watchedFilters.bed_type_ids, setValue, syncFilterToUrl])

  const toggleAmenity = useCallback((amenity: { id: string }) => {
    const current = watchedFilters.amenity_ids
      ? watchedFilters.amenity_ids.split(",").filter(Boolean)
      : []
    const newIds = current.includes(amenity.id)
      ? current.filter((id) => id !== amenity.id)
      : [...current, amenity.id]
    const newValue = newIds.join(",")
    setValue("amenity_ids", newValue, { shouldValidate: true })
    syncFilterToUrl("amenity_ids", newValue)
  }, [watchedFilters.amenity_ids, setValue, syncFilterToUrl])

  const clearAll = useCallback(() => {
    reset({
      min_price: "0",
      max_price: String(maxPrice),
      room_type_ids: "",
      bed_type_ids: "",
      amenity_ids: "",
    })
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete("min_price")
      next.delete("max_price")
      next.delete("room_type_ids")
      next.delete("bed_type_ids")
      next.delete("amenity_ids")
      return next
    }, { replace: true })
  }, [reset, maxPrice, setSearchParams])

  const selectedRoomTypeIds = watchedFilters.room_type_ids
    ? watchedFilters.room_type_ids.split(",").filter(Boolean)
    : []
  const selectedBedTypeIds = watchedFilters.bed_type_ids
    ? watchedFilters.bed_type_ids.split(",").filter(Boolean)
    : []
  const selectedAmenityIds = watchedFilters.amenity_ids
    ? watchedFilters.amenity_ids.split(",").filter(Boolean)
    : []

  return (
    <aside className="w-full lg:w-[260px] shrink-0 lg:border-r border-gray-200 lg:pr-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: "var(--brand-heading)" }}>
            <SlidersHorizontal size={16} /> Filters
          </h3>
          <button onClick={clearAll} className="text-xs font-semibold text-brand-accent hover:underline">Clear all</button>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--brand-heading)" }}>Price range per night</h4>
          <p className="text-xs mb-2" style={{ color: "var(--brand-text-secondary)" }}>{watchedFilters.min_price} - {watchedFilters.max_price} price</p>
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={watchedFilters.max_price}
            onChange={(e) => setValue("max_price", e.target.value, { shouldValidate: true })}
            className="w-full accent-brand-primary"
          />
          <div className="flex gap-2 mt-2">
            <input
              type="number"
              value={watchedFilters.min_price}
              onChange={(e) => setValue("min_price", e.target.value, { shouldValidate: true })}
              className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-brand-accent"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              value={watchedFilters.max_price}
              onChange={(e) => setValue("max_price", e.target.value, { shouldValidate: true })}
              className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-brand-accent"
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--brand-heading)" }}>Room type</h4>
          <div className="space-y-2">
            {roomTypes.map((roomType) => (
              <label key={roomType.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedRoomTypeIds.includes(roomType.id)}
                  onChange={() => toggleRoomType(roomType)}
                  className="w-4 h-4 rounded border-gray-300 accent-brand-primary"
                />
                <span className="text-xs flex-1" style={{ color: "var(--brand-heading)" }}>{roomType.room_type_name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--brand-heading)" }}>Bed type</h4>
          <div className="space-y-2">
            {bedTypes.map((bedType) => (
              <label key={bedType.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBedTypeIds.includes(bedType.id)}
                  onChange={() => toggleBedType(bedType)}
                  className="w-4 h-4 rounded border-gray-300 accent-brand-primary"
                />
                <span className="text-xs flex-1" style={{ color: "var(--brand-heading)" }}>{bedType.bed_name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--brand-heading)" }}>Amenities</h4>
          <div className="space-y-2">
            {systemAmenities.map((amenity) => (
              <label key={amenity.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAmenityIds.includes(amenity.id)}
                  onChange={() => toggleAmenity(amenity)}
                  className="w-4 h-4 rounded border-gray-300 accent-brand-primary"
                />
                <span className="text-xs flex-1" style={{ color: "var(--brand-heading)" }}>{amenity.amenity_name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
