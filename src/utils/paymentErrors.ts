interface GatewayErrorData {
  message?: string
  detail?: string | { detail?: string }
}

// Payment gateways return errors in several shapes: `message`, a plain string
// `detail`, or FastAPI's nested `detail.detail`. Prefer the server's message and
// fall back to the JS error message, then the caller-provided default.
export function extractGatewayErrorMessage(err: unknown, fallback: string): string {
  const data = (err as { response?: { data?: GatewayErrorData } })?.response?.data
  const serverMsg = typeof data?.detail === "string" ? data.detail : data?.detail?.detail
  return data?.message || serverMsg || (err instanceof Error ? err.message : fallback)
}

export function extractErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}
