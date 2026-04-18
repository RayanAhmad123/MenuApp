"use client"
import { useState, useEffect, useCallback } from "react"
import type { CartItem } from "@/types/database"
import { generateSessionId } from "@/lib/utils"

const CART_KEY = "menuapp_cart"
const SESSION_KEY = "menuapp_session"

function getSessionId(): string {
  if (typeof window === "undefined") return ""
  let sid = localStorage.getItem(SESSION_KEY)
  if (!sid) {
    sid = generateSessionId()
    localStorage.setItem(SESSION_KEY, sid)
  }
  return sid
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [sessionId, setSessionId] = useState<string>("")

  useEffect(() => {
    const sid = getSessionId()
    setSessionId(sid)
    try {
      const stored = localStorage.getItem(CART_KEY)
      if (stored) setItems(JSON.parse(stored) as CartItem[])
    } catch {
      // ignore
    }
  }, [])

  const persist = useCallback((newItems: CartItem[]) => {
    setItems(newItems)
    localStorage.setItem(CART_KEY, JSON.stringify(newItems))
  }, [])

  const addItem = useCallback((item: Omit<CartItem, "cartItemId">) => {
    const cartItemId = Math.random().toString(36).substring(2, 10)
    persist([...items, { ...item, cartItemId }])
  }, [items, persist])

  const removeItem = useCallback((cartItemId: string) => {
    persist(items.filter(i => i.cartItemId !== cartItemId))
  }, [items, persist])

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId)
      return
    }
    persist(items.map(i => i.cartItemId === cartItemId ? { ...i, quantity } : i))
  }, [items, persist, removeItem])

  const clearCart = useCallback(() => {
    persist([])
  }, [persist])

  const totalCents = items.reduce((sum, item) => {
    const modTotal = item.selectedModifiers.reduce((s, m) => s + m.priceAdjustmentCents, 0)
    return sum + (item.priceCents + modTotal) * item.quantity
  }, 0)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return { items, sessionId, addItem, removeItem, updateQuantity, clearCart, totalCents, itemCount }
}
