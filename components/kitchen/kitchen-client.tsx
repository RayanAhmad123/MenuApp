"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { ChefHat, Clock, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { updateOrderStatus } from "@/lib/actions/orders"
import { useToast } from "@/hooks/use-toast"

interface OrderItem {
  id: string
  quantity: number
  special_requests: string | null
  item_status: "pending" | "preparing" | "ready"
  menu_items: { id: string; name: string }
}

interface KitchenOrder {
  id: string
  table_number: number
  status: string
  special_notes: string | null
  created_at: string
  order_items: OrderItem[]
}

interface Props {
  restaurantId: string
  initialOrders: KitchenOrder[]
}

export function KitchenClient({ restaurantId, initialOrders }: Props) {
  const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = useMemo(() => createClient(), [])

  const fetchOrders = useCallback(async () => {
    const today = new Date().toISOString().split("T")[0]
    const { data } = await supabase
      .from("orders")
      .select(`
        id, table_number, status, special_notes, created_at,
        order_items (
          id, quantity, special_requests, item_status,
          menu_items ( id, name )
        )
      `)
      .eq("restaurant_id", restaurantId)
      .in("status", ["confirmed", "preparing"])
      .gte("created_at", `${today}T00:00:00`)
      .order("created_at", { ascending: true })
    if (data) setOrders(data)
  }, [supabase, restaurantId])

  useEffect(() => {
    const channel = supabase
      .channel(`kitchen-orders-${restaurantId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "orders",
        filter: `restaurant_id=eq.${restaurantId}`,
      }, fetchOrders)
      .subscribe()

    const interval = setInterval(fetchOrders, 5000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [supabase, restaurantId, fetchOrders])

  async function handleMarkPreparing(orderId: string) {
    setUpdatingId(orderId)
    const { error } = await updateOrderStatus(orderId, "preparing")
    setUpdatingId(null)
    if (error) {
      toast({ title: "Failed to update order", variant: "destructive" })
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "preparing" } : o))
    }
  }

  async function handleMarkReady(orderId: string) {
    setUpdatingId(orderId)
    const { error } = await updateOrderStatus(orderId, "ready")
    setUpdatingId(null)
    if (error) {
      toast({ title: "Failed to update order", variant: "destructive" })
    } else {
      setOrders(prev => prev.filter(o => o.id !== orderId))
      toast({ title: "Order marked ready — waiter notified" })
    }
  }

  function elapsedMinutes(createdAt: string) {
    return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000)
  }

  return (
    <div className="min-h-screen bg-stone-950 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
          <ChefHat className="h-5 w-5 text-stone-900" />
        </div>
        <div>
          <h1 className="font-serif text-xl text-stone-50 font-semibold">Kitchen Display</h1>
          <p className="text-xs text-stone-500">
            {orders.length} active order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="ml-auto text-xs text-stone-600 font-mono">
          {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-stone-600">
          <ChefHat className="h-16 w-16 mb-4 text-stone-700" />
          <p className="text-lg font-medium">All clear!</p>
          <p className="text-sm mt-1">No active orders right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders.map(order => {
            const elapsed = elapsedMinutes(order.created_at)
            const isUrgent = elapsed > 15
            const isCritical = elapsed > 25

            return (
              <div
                key={order.id}
                className={`rounded-2xl border p-4 flex flex-col gap-3 ${
                  isCritical
                    ? "bg-red-950 border-red-700"
                    : isUrgent
                    ? "bg-amber-950 border-amber-700"
                    : order.status === "preparing"
                    ? "bg-stone-900 border-stone-700"
                    : "bg-stone-900 border-stone-800"
                }`}
              >
                {/* Order header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-stone-50">Table {order.table_number}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className={`h-3 w-3 ${isCritical ? "text-red-400" : isUrgent ? "text-amber-400" : "text-stone-500"}`} />
                      <span className={`text-xs font-medium ${isCritical ? "text-red-400" : isUrgent ? "text-amber-400" : "text-stone-500"}`}>
                        {elapsed}m ago
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    order.status === "preparing"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="flex-1 space-y-2">
                  {order.order_items.map(item => (
                    <div key={item.id} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold text-sm w-5 text-right flex-shrink-0">
                        {item.quantity}×
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-100">{item.menu_items.name}</p>
                        {item.special_requests && (
                          <p className="text-xs text-amber-300 italic mt-0.5">"{item.special_requests}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {order.special_notes && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                    <p className="text-xs text-amber-300">Note: {order.special_notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {order.status === "confirmed" && (
                    <button
                      onClick={() => handleMarkPreparing(order.id)}
                      disabled={updatingId === order.id}
                      className="w-full py-2.5 rounded-xl bg-amber-500 text-stone-900 font-semibold text-sm hover:bg-amber-400 transition-colors disabled:opacity-50"
                    >
                      {updatingId === order.id ? "Updating…" : "Start Preparing"}
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      onClick={() => handleMarkReady(order.id)}
                      disabled={updatingId === order.id}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {updatingId === order.id ? "Updating…" : "Mark Ready"}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
