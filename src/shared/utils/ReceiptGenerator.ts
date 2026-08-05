export interface ReceiptParams {
  confirmationCode: string
  propertyName: string
  propertyLocation?: string
  propertyPhone?: string
  propertyEmail?: string
  checkIn: string
  checkOut: string
  roomNames: string
  totalGuests: number
  guestName: string
  guestEmail?: string
  guestPhone?: string
  guestNationality?: string
  rooms: { room_name: string; room_type: string; bed_type: string; base_rate: number; nights: number; subtotal: number }[]
  specialOfferDiscount?: number
  couponCode?: string
  couponDiscount?: number
  totalAmount: number
  currency: string
  createdAt?: string
}

// Opens a receipt in a new window for printing instead of generating a PDF.
// This avoids a server-side PDF dependency and works offline with the browser's
// native print dialog (Ctrl+P / Cmd+P).
export function printReceipt(params: ReceiptParams) {
  const roomLines = params.rooms
    .map(
      (r) =>
        `<tr>
          <td style="padding:6px 0;border-bottom:1px solid #eee">${r.room_name}</td>
          <td style="padding:6px 0;border-bottom:1px solid #eee">${r.room_type} / ${r.bed_type}</td>
          <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right">${params.currency} ${r.base_rate.toFixed(2)} × ${r.nights}</td>
          <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right">${params.currency} ${r.subtotal.toFixed(2)}</td>
        </tr>`
    )
    .join("")

  const html = `<!DOCTYPE html>
<html><head><title>Receipt - ${params.confirmationCode}</title>
<style>
  body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:20px;color:#333}
  .receipt{max-width:680px;margin:0 auto;border:1px solid #ddd;border-radius:12px;overflow:hidden}
  .header{background:#1a1a2e;color:#fff;padding:24px 28px}
  .header h1{margin:0 0 4px;font-size:22px;font-weight:700}
  .header p{margin:0;opacity:.7;font-size:13px}
  .body{padding:24px 28px}
  .row{display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px}
  .row .label{color:#888}
  .divider{border:none;border-top:1px solid #eee;margin:16px 0}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{text-align:left;padding:8px 0;border-bottom:2px solid #ddd;font-size:11px;text-transform:uppercase;color:#888;letter-spacing:.5px}
  td{font-size:13px}
  .total-row{display:flex;justify-content:space-between;padding:12px 0 0;font-size:16px;font-weight:700;border-top:2px solid #333;margin-top:8px}
  .footer{text-align:center;padding:16px 28px;background:#f9f9f9;font-size:11px;color:#999;border-top:1px solid #eee}
  @media print{body{padding:0}.receipt{border:none}}
</style></head><body>
<div class="receipt">
  <div class="header">
    <h1>StayEasy</h1>
    <p>Booking Receipt</p>
  </div>
  <div class="body">
    <div class="row"><span class="label">Confirmation Code</span><strong>${params.confirmationCode}</strong></div>
    <div class="row"><span class="label">Guest Name</span><span>${params.guestName}</span></div>
    ${params.guestEmail ? `<div class="row"><span class="label">Email</span><span>${params.guestEmail}</span></div>` : ""}
    ${params.guestPhone ? `<div class="row"><span class="label">Phone</span><span>${params.guestPhone}</span></div>` : ""}
    <hr class="divider">
    <div class="row"><span class="label">Property</span><strong>${params.propertyName}</strong></div>
    ${params.propertyLocation ? `<div class="row"><span class="label">Location</span><span>${params.propertyLocation}</span></div>` : ""}
    <hr class="divider">
    <div class="row"><span class="label">Check-in</span><span>${params.checkIn}</span></div>
    <div class="row"><span class="label">Check-out</span><span>${params.checkOut}</span></div>
    <div class="row"><span class="label">Guests</span><span>${params.totalGuests}</span></div>
    <div class="row"><span class="label">Rooms</span><span>${params.roomNames}</span></div>
    <hr class="divider">
    <table>
      <thead><tr><th>Room</th><th>Type</th><th style="text-align:right">Rate</th><th style="text-align:right">Subtotal</th></tr></thead>
      <tbody>${roomLines}</tbody>
    </table>
    <hr class="divider">
    ${params.specialOfferDiscount ? `<div class="row"><span class="label">Special Offer Discount</span><span style="color:#16a34a">-${params.currency} ${params.specialOfferDiscount.toFixed(2)}</span></div>` : ""}
    ${params.couponCode ? `<div class="row"><span class="label">Coupon (${params.couponCode})</span><span style="color:#16a34a">-${params.currency} ${(params.couponDiscount || 0).toFixed(2)}</span></div>` : ""}
    <div class="total-row"><span>Total</span><span>${params.currency} ${params.totalAmount.toFixed(2)}</span></div>
  </div>
  <div class="footer">
    <p>Thank you for booking with StayEasy!</p>
    <p>Generated on ${params.createdAt || new Date().toLocaleString()}</p>
  </div>
</div>
<script>window.onload=function(){window.print()}</script>
</body></html>`

  const printWindow = window.open("", "_blank", "width=700,height=900")
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
  }
}
