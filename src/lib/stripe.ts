import { loadStripe } from "@stripe/stripe-js"
import { env } from "@/config/env"

export const stripePromise = loadStripe(env.stripePublishableKey)
