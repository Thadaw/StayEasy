// Graduated pricing: the first guest pays full base price, each additional guest
// adds 15% of the base up to max capacity. This incentivizes single-occupancy
// bookings while scaling fairly for larger groups.
export const calcPrice = (basePrice: number, maxGuests: number, guests: number) => {
  if (maxGuests <= 1) return basePrice;
  return Math.round(basePrice * (0.85 + 0.15 * (guests - 1) / (maxGuests - 1)));
};
