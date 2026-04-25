// Lightweight client-side order history per (subdomain + table). Lets a guest
// who closes the tab and re-scans the QR code still find any orders they've
// placed in the recent past — including delivered/paid ones, not just the
// in-flight one.
const HISTORY_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours
const MAX_ENTRIES = 10

export type OrderHistoryEntry = {
  orderId: string
  createdAt: number
}

function key(subdomain: string, tableNumber: number | string) {
  return `menuapp-order-history-${subdomain}-${tableNumber}`
}

export function readOrderHistory(subdomain: string, tableNumber: number | string): OrderHistoryEntry[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(key(subdomain, tableNumber))
    if (!raw) return []
    const parsed = JSON.parse(raw) as OrderHistoryEntry[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(e => e && typeof e.orderId === "string" && typeof e.createdAt === "number")
  } catch {
    return []
  }
}

export function appendOrderHistory(subdomain: string, tableNumber: number | string, orderId: string): void {
  if (typeof window === "undefined") return
  try {
    const existing = readOrderHistory(subdomain, tableNumber)
    if (existing.some(e => e.orderId === orderId)) return
    const next = [{ orderId, createdAt: Date.now() }, ...existing].slice(0, MAX_ENTRIES)
    localStorage.setItem(key(subdomain, tableNumber), JSON.stringify(next))
  } catch {
    /* private mode / quota — non-critical */
  }
}

export function pruneOrderHistory(subdomain: string, tableNumber: number | string): OrderHistoryEntry[] {
  if (typeof window === "undefined") return []
  const cutoff = Date.now() - HISTORY_TTL_MS
  const fresh = readOrderHistory(subdomain, tableNumber).filter(e => e.createdAt >= cutoff)
  try {
    localStorage.setItem(key(subdomain, tableNumber), JSON.stringify(fresh))
  } catch {
    /* ignore */
  }
  return fresh
}

export function removeFromOrderHistory(subdomain: string, tableNumber: number | string, orderId: string): void {
  if (typeof window === "undefined") return
  try {
    const next = readOrderHistory(subdomain, tableNumber).filter(e => e.orderId !== orderId)
    localStorage.setItem(key(subdomain, tableNumber), JSON.stringify(next))
  } catch {
    /* ignore */
  }
}
