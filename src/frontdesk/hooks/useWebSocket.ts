import { useEffect, useRef, useCallback } from 'react'
import { refreshAccessToken } from '../../services/axios'

const WS_BASE_URL = 'wss://stay-easy-sizw.onrender.com/notifications/ws'
const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000]
const MAX_RECONNECT_ATTEMPTS = 50

function storageGet(key: string): string | null {
  return localStorage.getItem(key) || sessionStorage.getItem(key)
}

function getToken(): string | null {
  return storageGet('token')
}

interface UseWebSocketOptions {
  propertyId: string | null
  onMessage?: (event: MessageEvent) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  enabled?: boolean
}

export function useWebSocket({
  propertyId,
  onMessage,
  onOpen,
  onClose,
  onError,
  enabled = true,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef(0)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isManualClose = useRef(false)
  const tokenRef = useRef<string | null>(getToken())

  const cleanup = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current)
      reconnectTimer.current = null
    }
    if (wsRef.current) {
      wsRef.current.onclose = null
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    cleanup()

    if (!enabled || !propertyId) return

    const token = getToken()
    if (!token) return

    tokenRef.current = token
    isManualClose.current = false

    const wsUrl = `${WS_BASE_URL}/${propertyId}?token=${token}`

    try {
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        reconnectAttempts.current = 0
        onOpen?.()
      }

      ws.onmessage = (event) => {
        onMessage?.(event)
      }

      ws.onerror = (error) => {
        onError?.(error)
      }

      ws.onclose = async (event) => {
        if (isManualClose.current) return
        if (!event.wasClean && reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          const delay = RECONNECT_DELAYS[Math.min(reconnectAttempts.current, RECONNECT_DELAYS.length - 1)]
          reconnectAttempts.current++

          try {
            const newToken = await refreshAccessToken()
            tokenRef.current = newToken
          } catch {
            // Refresh failed, will retry on next reconnect
          }

          reconnectTimer.current = setTimeout(() => {
            connect()
          }, delay)
        }
        onClose?.()
      }
    } catch {
      // Connection failed, retry
      if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        const delay = RECONNECT_DELAYS[Math.min(reconnectAttempts.current, RECONNECT_DELAYS.length - 1)]
        reconnectAttempts.current++
        reconnectTimer.current = setTimeout(() => {
          connect()
        }, delay)
      }
    }
  }, [propertyId, enabled, onMessage, onOpen, onClose, onError, cleanup])

  const disconnect = useCallback(() => {
    isManualClose.current = true
    cleanup()
  }, [cleanup])

  useEffect(() => {
    if (enabled && propertyId) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [enabled, propertyId, connect, disconnect])

  return {
    disconnect,
    reconnect: connect,
  }
}
