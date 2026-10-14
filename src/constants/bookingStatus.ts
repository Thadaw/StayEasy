// Raw backend booking status → human readable label.

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CHECKED_IN: 'Checked-in',
  CHECKED_OUT: 'Checked-out',
  CANCELLED: 'Cancelled',
  CANCELLATION: 'Cancelled',
  CANCELLATION_REQUESTED: 'Cancellation Requested',
}
