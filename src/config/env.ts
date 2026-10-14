// Centralised, typed access to Vite environment variables.
//
// Only public (VITE_*) values belong here — they are inlined into the client
// bundle at build time. Secrets must stay in the backend / server.mjs and must
// never be imported into src. Values are read raw so each call site keeps its
// existing fallback semantics.

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string | undefined,
  appUrl: import.meta.env.VITE_APP_URL as string | undefined,
  stripePublishableKey: (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined) ?? '',
  razorpayKeyId: (import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined) ?? '',
}
