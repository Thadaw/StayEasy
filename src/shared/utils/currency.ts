const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  NPR: 'Rs.',
  INR: '₹',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  CNY: '¥',
  KRW: '₩',
  THB: '฿',
}

export function getCurrencySymbol(code: string): string {
  return currencySymbols[code?.toUpperCase()] || `${code} `
}
