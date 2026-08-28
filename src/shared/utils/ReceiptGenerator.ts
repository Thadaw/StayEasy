export interface ReceiptParams {
  confirmationCode: string
  propertyName: string
  propertyLocation?: string
  propertyPhone?: string
  propertyEmail?: string
  propertyImage?: string
  checkIn: string
  checkOut: string
  roomNames: string
  totalGuests: number
  guestName: string
  guestEmail?: string
  guestPhone?: string
  guestNationality?: string
  rooms: { room_name: string; room_type: string; bed_type: string; base_rate: number; nights: number; subtotal: number; photo?: string }[]
  specialOfferDiscount?: number
  couponCode?: string
  couponDiscount?: number
  totalAmount: number
  currency: string
  createdAt?: string
  paymentGateway?: string
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  } catch {
    return dateStr
  }
}

function calcNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function printReceipt(params: ReceiptParams) {
  const nights = calcNights(params.checkIn, params.checkOut)
  const bookedOn = params.createdAt || formatDateTime(new Date().toISOString())

  const gatewayLabels: Record<string, string> = {
    razorpay: 'Razorpay',
    stripe: 'Stripe',
    khalti: 'Khalti',
    esewa: 'eSewa',
    arrival: 'Pay at Property',
  }
  const paymentMethodText = params.paymentGateway === 'arrival'
    ? 'Pay at Property'
    : params.paymentGateway
      ? `Online Confirmation / Guaranteed (${gatewayLabels[params.paymentGateway] || params.paymentGateway})`
      : 'Online Confirmation / Guaranteed'

  const roomLines = params.rooms
    .map(
      (r) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:13px;font-weight:600;color:#222" colspan="2">${r.room_name} (${r.room_type})</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;font-size:13px;font-weight:700;color:#222;white-space:nowrap">${params.currency} ${(r.base_rate ?? 0).toFixed(2)}</td>
      </tr>
      ${r.photo ? `<tr><td colspan="3" style="padding:0 12px 10px"><img src="${r.photo}" style="max-width:260px;height:120px;object-fit:cover;border-radius:8px;display:block" /></td></tr>` : ''}
      <tr>
        <td colspan="3" style="padding:0 12px 8px">
          <div style="background:#f9fafb;border-radius:6px;padding:8px 10px;font-size:11px;color:#666">
            <strong>Cancellation Policy (Limited Cancellation):</strong><br/>
            50% refund if cancelled up to 1 week before check-in; no refund after that.
          </div>
        </td>
      </tr>`
    )
    .join("")

  const html = `<!DOCTYPE html>
<html><head><title>Receipt - ${params.confirmationCode}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#fff;padding:0;color:#222}
  .receipt{max-width:680px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden}
  .header{background:#4A3882;padding:24px 28px;color:#fff}
  .header .brand{font-size:16px;font-weight:700;letter-spacing:.5px}
  .header h1{font-size:20px;font-weight:700;margin-top:10px}
  .header .booking-no{font-size:14px;font-weight:600;margin-top:6px}
  .header .booked-on{font-size:12px;color:rgba(255,255,255,.7);margin-top:3px}
  .booking-number-bar{background:#f0f0f0;padding:12px 28px;font-size:12px;color:#555;border-bottom:1px solid #e5e5e5}
  .booking-number-bar strong{color:#222}
  .property-info{padding:20px 28px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;border-bottom:1px solid #eee}
  .property-info .details h2{font-size:16px;font-weight:700;color:#222;margin-bottom:6px}
  .property-info .details p{font-size:12px;color:#555;line-height:1.6}
  .property-info .details a{color:#4A3882;text-decoration:none}
  .property-info .details a:hover{text-decoration:underline}
  .property-info .logo{width:100px;height:100px;border-radius:8px;object-fit:cover;flex-shrink:0}
  .section{padding:20px 28px;border-bottom:1px solid #eee}
  .section-title{font-size:14px;font-weight:700;color:#222;margin-bottom:10px;text-transform:uppercase;letter-spacing:.3px}
  .details-table{width:100%;border-collapse:collapse}
  .details-table th{background:#4A3882;color:#fff;font-size:11px;font-weight:600;padding:10px 12px;text-align:left;text-transform:uppercase;letter-spacing:.5px}
  .details-table th:last-child{text-align:right}
  .details-table td{padding:10px 12px;font-size:13px;border-bottom:1px solid #eee;color:#222}
  .details-table .time{font-size:10px;color:#888;display:block;margin-top:2px}
  .calendar-link{display:inline-flex;align-items:center;gap:5px;color:#4A3882;font-size:12px;font-weight:600;margin-top:10px;text-decoration:none}
  .info-table{width:100%;border-collapse:collapse}
  .info-table td{padding:8px 0;font-size:13px;border-bottom:1px solid #f0f0f0}
  .info-table td:first-child{color:#666;width:160px}
  .info-table td:last-child{color:#222;font-weight:500}
  .cost-table{width:100%;border-collapse:collapse;margin-top:8px}
  .cost-table td{padding:8px 12px;font-size:13px;border-bottom:1px solid #f0f0f0}
  .cost-table .label{color:#666}
  .cost-table .value{text-align:right;font-weight:600;color:#222}
  .cost-table .total-row{background:#4A3882;color:#fff}
  .cost-table .total-row td{padding:10px 12px;font-weight:700;font-size:14px;border:none}
  .location{padding:20px 28px;border-bottom:1px solid #eee}
  .location h3{font-size:13px;font-weight:700;color:#222;margin-bottom:4px}
  .location p{font-size:12px;color:#666;margin-bottom:10px}
  .location a{color:#4A3882;text-decoration:none}
  .map-btn{display:inline-block;background:#4A3882;color:#fff!important;padding:10px 20px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;margin-top:4px}
  .map-btn:hover{opacity:.9}
  .footer{background:#4A3882;padding:20px 28px;text-align:center;color:rgba(255,255,255,.7);font-size:11px;line-height:1.8}
  .footer a{color:rgba(255,255,255,.9);text-decoration:none}
  .footer .copy{font-size:10px;color:rgba(255,255,255,.5);margin-top:8px}
  @media print{body{padding:0}.receipt{max-width:100%}}
</style></head><body>
<div class="receipt">
  <div class="header">
    <div class="brand">ServerIQ</div>
    <h1>Booking confirmation</h1>
    <div class="booking-no">Booking No. ${params.confirmationCode}</div>
    <div class="booked-on">Booked on ${bookedOn}</div>
  </div>

  <div class="booking-number-bar">
    Booking number: <strong>${params.confirmationCode}</strong>
  </div>

  <div class="property-info">
    <div class="details">
      <h2>${params.propertyName}</h2>
      <p><strong>Address:</strong> ${params.propertyLocation || '—'}</p>
      ${params.propertyPhone ? `<p><strong>Phone:</strong> ${params.propertyPhone}</p>` : ''}
      ${params.propertyEmail ? `<p><strong>Email:</strong> <a href="mailto:${params.propertyEmail}">${params.propertyEmail}</a></p>` : ''}
    </div>
    ${params.propertyImage ? `<img src="${params.propertyImage}" alt="${params.propertyName}" class="logo" />` : ''}
  </div>

  <div class="section">
    <div class="section-title">Booking details</div>
    <table class="details-table">
      <thead>
        <tr>
          <th>Arrival</th>
          <th>Departure</th>
          <th style="text-align:center">Nights</th>
          <th style="text-align:center">Guests</th>
          <th style="text-align:right">Rooms</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${formatDate(params.checkIn)}<span class="time">after 12:00</span></td>
          <td>${formatDate(params.checkOut)}<span class="time">till 12:00</span></td>
          <td style="text-align:center">${nights} night${nights !== 1 ? 's' : ''}</td>
          <td style="text-align:center">${params.totalGuests} Adult${params.totalGuests !== 1 ? 's' : ''}</td>
          <td style="text-align:right">${params.rooms.length}</td>
        </tr>
      </tbody>
    </table>
    <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(params.propertyName)}&dates=${params.checkIn.replace(/-/g, '')}T120000/${params.checkOut.replace(/-/g, '')}T120000&location=${encodeURIComponent(params.propertyLocation || '')}" target="_blank" class="calendar-link">
      📅 Add to Google Calendar
    </a>
  </div>

  <div class="section">
    <div class="section-title">Customer Information</div>
    <table class="info-table">
      <tr><td>Full name</td><td>${params.guestName || '—'}</td></tr>
      <tr><td>Phone</td><td>${params.guestPhone || '—'}</td></tr>
      <tr><td>Email</td><td>${params.guestEmail || '—'}</td></tr>
      <tr><td>Special Notes / Comments</td><td>None</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Booking cost</div>
    ${roomLines}
    <table class="cost-table">
      <tr><td class="label">Subtotal</td><td class="value">${params.currency} ${params.rooms.reduce((s, r) => s + (r.subtotal ?? 0), 0).toLocaleString()}</td></tr>
      <tr><td class="label">Taxes and fees</td><td class="value">Included</td></tr>
      <tr class="total-row"><td>Total cost</td><td style="text-align:right">${params.currency} ${params.totalAmount.toLocaleString()}</td></tr>
    </table>
    <div style="padding:10px 12px;font-size:12px;color:#666;display:flex;justify-content:space-between;border-bottom:1px solid #f0f0f0">
      <span>Payment method</span>
      <span>${paymentMethodText}</span>
    </div>
  </div>

  <div class="location">
    <h3>Location ${params.propertyName}</h3>
    <p><strong>Address:</strong> ${params.propertyLocation || '—'}</p>
    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(params.propertyLocation || params.propertyName)}" target="_blank" class="map-btn">View location on google map</a>
  </div>

  <div class="footer">
    <div>© 2026 ${params.propertyName}</div>
    <div>${params.propertyLocation || ''}</div>
    <div class="copy">This message was automatically generated by ServerIQ.</div>
  </div>
</div>
<script>window.onload=function(){setTimeout(function(){window.print()},300)}</script>
</body></html>`

  const printWindow = window.open("", "_blank", "width=700,height=900")
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
  }
}
