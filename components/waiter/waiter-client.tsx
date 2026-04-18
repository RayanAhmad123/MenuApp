"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Bell, CheckCircle2, UtensilsCrossed, AlertCircle, Coffee, CreditCard } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { updateOrderStatus } from "@/lib/actions/orders"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { TablePing } from "@/types/database"

interface ReadyOrder {
  id: string
  table_number: number
  total_cents: number
  created_at: string
  order_items: Array<{ id: string; quantity: number; menu_items: { name: string } }>
}

interface Props {
  restaurantId: string
  staffName: string
  initialPings: TablePing[]
  initialReadyOrders: ReadyOrder[]
}

const PING_ICONS: Record<string, React.ElementType> = {
  assistance: AlertCircle,
  refill: Coffee,
  payment: CreditCard,
}

const PING_LABELS: Record<string, string> = {
  assistance: "Behöver hjälp",
  refill: "Påfyllning begärd",
  payment: "Begär notan",
}

const PING_COLORS: Record<string, string> = {
  assistance: "bg-red-50 border-red-200",
  refill: "bg-blue-50 border-blue-200",
  payment: "bg-emerald-50 border-emerald-200",
}

const PING_ICON_COLORS: Record<string, string> = {
  assistance: "text-red-500",
  refill: "text-blue-500",
  payment: "text-emerald-500",
}

export function WaiterClient({ restaurantId, staffName, initialPings, initialReadyOrders }: Props) {
  const [pings, setPings] = useState<TablePing[]>(initialPings)
  const [readyOrders, setReadyOrders] = useState<ReadyOrder[]>(initialReadyOrders)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = useMemo(() => createClient(), [])

  const fetchPings = useCallback(async () => {
    const { data } = await supabase
      .from("table_pings")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("status", "pending")
      .order("created_at", { ascending: true })
    if (data) setPings(data)
  }, [supabase, restaurantId])

  const fetchReadyOrders = useCallback(async () => {
    const today = new Date().toISOString().split("T")[0]
    const { data } = await supabase
      .from("orders")
      .select("id, table_number, total_cents, created_at, order_items(id, quantity, menu_items(name))")
      .eq("restaurant_id", restaurantId)
      .eq("status", "ready")
      .gte("created_at", `${today}T00:00:00`)
      .order("created_at", { ascending: true })
    if (data) setReadyOrders(data)
  }, [supabase, restaurantId])

  useEffect(() => {
    // Realtime subscriptions
    const pingsChannel = supabase
      .channel(`waiter-pings-${restaurantId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "table_pings", filter: `restaurant_id=eq.${restaurantId}` }, fetchPings)
      .subscribe()

    const ordersChannel = supabase
      .channel(`waiter-orders-${restaurantId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurantId}` }, fetchReadyOrders)
      .subscribe()

    // Polling fallback — every 5 seconds
    const interval = setInterval(() => {
      fetchPings()
      fetchReadyOrders()
    }, 5000)

    return () => {
      supabase.removeChannel(pingsChannel)
      supabase.removeChannel(ordersChannel)
      clearInterval(interval)
    }
  }, [supabase, restaurantId, fetchPings, fetchReadyOrders])

  async function handleAcknowledgePing(pingId: string) {
    await supabase.from("table_pings").update({ status: "acknowledged" }).eq("id", pingId)
    setPings(prev => prev.filter(p => p.id !== pingId))
  }

  async function handleResolvePing(pingId: string) {
    await supabase.from("table_pings").update({ status: "resolved" }).eq("id", pingId)
    setPings(prev => prev.filter(p => p.id !== pingId))
  }

  async function handleDeliver(orderId: string) {
    setUpdatingOrderId(orderId)
    const { error } = await updateOrderStatus(orderId, "delivered")
    setUpdatingOrderId(null)
    if (error) {
      toast({ title: "Kunde inte markera som levererad", variant: "destructive" })
    } else {
      setReadyOrders(prev => prev.filter(o => o.id !== orderId))
      toast({ title: "Beställning markerad som levererad" })
    }
  }

  function elapsed(createdAt: string) {
    const m = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000)
    return m < 1 ? "just now" : `${m}m ago`
  }

  const hasTasks = pings.length > 0 || readyOrders.length > 0

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-stone-900 text-stone-50 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
          <Bell className="h-4 w-4 text-stone-900" />
        </div>
        <div>
          <h1 className="font-serif text-lg font-semibold">Servitörsvy</h1>
          <p className="text-xs text-stone-400">Hej, {staffName}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {pings.length > 0 && (
            <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              {pings.length} anrop
            </span>
          )}
          {readyOrders.length > 0 && (
            <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
              {readyOrders.length} klar{readyOrders.length !== 1 ? "a" : ""}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        {pings.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">Bordsförfrågningar</h2>
            <div className="space-y-2">
              {pings.map(ping => {
                const Icon = PING_ICONS[ping.ping_type] ?? AlertCircle
                return (
                  <div key={ping.id} className={`flex items-center gap-4 p-4 rounded-xl border ${PING_COLORS[ping.ping_type] ?? "bg-stone-50 border-stone-200"}`}>
                    <Icon className={`h-6 w-6 flex-shrink-0 ${PING_ICON_COLORS[ping.ping_type] ?? "text-stone-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-800">Bord {ping.table_number}</p>
                      <p className="text-sm text-stone-600">{PING_LABELS[ping.ping_type] ?? ping.ping_type}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{elapsed(ping.created_at)}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => handleAcknowledgePing(ping.id)} className="px-3 py-1.5 bg-stone-200 text-stone-700 text-xs font-medium rounded-lg hover:bg-stone-300 transition-colors">
                        På väg
                      </button>
                      <button onClick={() => handleResolvePing(ping.id)} className="px-3 py-1.5 bg-stone-900 text-stone-100 text-xs font-medium rounded-lg hover:bg-stone-800 transition-colors">
                        Löst
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {readyOrders.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">Redo att serveras</h2>
            <div className="space-y-2">
              {readyOrders.map(order => (
                <div key={order.id} className="bg-white border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-stone-800 text-lg">Bord {order.table_number}</p>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Klar</span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">{elapsed(order.created_at)}</p>
                    </div>
                    <p className="font-semibold text-stone-700">{formatPrice(order.total_cents)}</p>
                  </div>
                  <div className="space-y-1 mb-3">
                    {order.order_items.map(item => (
                      <p key={item.id} className="text-sm text-stone-600">
                        <span className="font-medium text-amber-600">{item.quantity}×</span>{" "}{item.menu_items.name}
                      </p>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDeliver(order.id)}
                    disabled={updatingOrderId === order.id}
                    className="w-full py-2.5 bg-emerald-500 text-white font-semibold text-sm rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {updatingOrderId === order.id ? "Uppdaterar…" : "Markera levererad"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {!hasTasks && (
          <div className="flex flex-col items-center justify-center py-32 text-stone-400">
            <UtensilsCrossed className="h-14 w-14 mb-4 text-stone-300" />
            <p className="text-lg font-medium text-stone-500">Allt klart!</p>
            <p className="text-sm mt-1">Inga bordsförfrågningar eller klara beställningar.</p>
          </div>
        )}
      </div>
    </div>
  )
}
