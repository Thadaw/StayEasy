import { z } from "zod"

export const searchParamsSchema = z.object({
  where: z.string().default(""),
  propertyTypes: z.string().default(""),
  checkin: z.string().default(""),
  checkout: z.string().default(""),
  adults: z.string().default("2"),
  children: z.string().default("0"),
  rooms: z.string().default("1"),
  guests: z.string().default(""),
})

export const filterParamsSchema = z.object({
  min_price: z.string(),
  max_price: z.string(),
  room_type_ids: z.string(),
  bed_type_ids: z.string(),
  amenity_ids: z.string(),
})

export const fullSearchParamsSchema = searchParamsSchema.merge(filterParamsSchema)

export type SearchParams = z.infer<typeof searchParamsSchema>
export type FilterParams = z.infer<typeof filterParamsSchema>
export type FullSearchParams = z.infer<typeof fullSearchParamsSchema>

export function parseSearchParams(searchParams: URLSearchParams): FullSearchParams {
  return fullSearchParamsSchema.parse({
    where: searchParams.get("where") || "",
    propertyTypes: searchParams.get("propertyTypes") || "",
    checkin: searchParams.get("checkin") || "",
    checkout: searchParams.get("checkout") || "",
    adults: searchParams.get("adults") || "2",
    children: searchParams.get("children") || "0",
    rooms: searchParams.get("rooms") || "1",
    guests: searchParams.get("guests") || "",
    min_price: searchParams.get("min_price") || "0",
    max_price: searchParams.get("max_price") || "500",
    room_type_ids: searchParams.get("room_type_ids") || "",
    bed_type_ids: searchParams.get("bed_type_ids") || "",
    amenity_ids: searchParams.get("amenity_ids") || "",
  })
}

export function buildSearchParams(params: FullSearchParams): URLSearchParams {
  const urlParams = new URLSearchParams()

  if (params.where) urlParams.set("where", params.where)
  if (params.propertyTypes) urlParams.set("propertyTypes", params.propertyTypes)
  if (params.checkin) urlParams.set("checkin", params.checkin)
  if (params.checkout) urlParams.set("checkout", params.checkout)
  if (params.adults && params.adults !== "2") urlParams.set("adults", params.adults)
  if (params.children && params.children !== "0") urlParams.set("children", params.children)
  if (params.rooms && params.rooms !== "1") urlParams.set("rooms", params.rooms)

  const adults = parseInt(params.adults) || 2
  const children = parseInt(params.children) || 0
  const totalGuests = adults + children
  urlParams.set("guests", String(totalGuests))

  if (params.min_price && params.min_price !== "0") urlParams.set("min_price", params.min_price)
  if (params.max_price && params.max_price !== "500") urlParams.set("max_price", params.max_price)
  if (params.room_type_ids) urlParams.set("room_type_ids", params.room_type_ids)
  if (params.bed_type_ids) urlParams.set("bed_type_ids", params.bed_type_ids)
  if (params.amenity_ids) urlParams.set("amenity_ids", params.amenity_ids)

  return urlParams
}

export function buildFilterQueryString(params: FullSearchParams): string {
  const urlParams = new URLSearchParams()

  if (params.where) urlParams.set("where", params.where)
  if (params.checkin) urlParams.set("checkin", params.checkin)
  if (params.checkout) urlParams.set("checkout", params.checkout)
  if (params.adults && params.adults !== "2") urlParams.set("adults", params.adults)
  if (params.children && params.children !== "0") urlParams.set("children", params.children)
  if (params.rooms && params.rooms !== "1") urlParams.set("rooms", params.rooms)
  if (params.min_price && params.min_price !== "0") urlParams.set("min_price", params.min_price)
  if (params.max_price && params.max_price !== "500") urlParams.set("max_price", params.max_price)
  if (params.room_type_ids) urlParams.set("room_type_ids", params.room_type_ids)
  if (params.bed_type_ids) urlParams.set("bed_type_ids", params.bed_type_ids)
  if (params.amenity_ids) urlParams.set("amenity_ids", params.amenity_ids)

  return urlParams.toString()
}
