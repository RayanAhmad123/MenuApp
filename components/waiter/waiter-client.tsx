"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Bell, CheckCircle2, UtensilsCrossed, AlertCircle, Coffee, CreditCard, ChevronRight, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { updateOrderStatus, markOrdersPaid } from "@/lib/actions/orders"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { TablePing } from "@/types/database"

interface ReadyOrder {
  id: string
  table_number: number
  total_cents: number
  created_at: string
  order_items: Array<{ id: string; quantity: number; menu_items: { name: string } }>
}

interface TableBillingOrder {
  id: string
  table_number: number
  total_cents: number
  status: string
  payment_status: "unpaid" | "paid"
  created_at: string
  order_items: Array<{ id: string; quantity: number; item_price_cents: number; menu_items: { name: string } }>
}

interface Props {
  restaurantId: string
  staffName: string
  initialPings: TablePing[]
  initialReadyOrders: ReadyOrder[]
  initialTableOrders: TableBillingOrder[]
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

export function WaiterClient({ restaurantId, staffName, initialPings, initialReadyOrders, initialTableOrders }: Props) {
  const [pings, setPings] = useState<TablePing[]>(initialPings)
  const [readyOrders, setReadyOrders] = useState<ReadyOrder[]>(initialReadyOrders)
  const [tableOrders, setTableOrders] = useState<TableBillingOrder[]>(initialTableOrders)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const [viewTable, setViewTable] = useState<number | null>(null)
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set())
  const [markingPaid, setMarkingPaid] = useState(false)
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

  const fetchTableOrders = useCallback(async () => {
    const today = new Date().toISOString().split("T")[0]
    const { data } = await supabase
      .from("orders")
      .select("id, table_number, total_cents, status, payment_status, created_at, order_items(id, quantity, item_price_cents, menu_items(name))")
      .eq("restaurant_id", restaurantId)
      .neq("status", "cancelled")
      .gte("created_at", `${today}T00:00:00`)
      .order("table_number", { ascending: true })
      .order("created_at", { ascending: true })
    if (data) setTableOrders(data as TableBillingOrder[])
  }, [supabase, restaurantId])

  useEffect(() => {
    const pingsChannel = supabase
      .channel(`waiter-pings-${restaurantId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "table_pings", filter: `restaurant_id=eq.${restaurantId}` }, fetchPings)
      .subscribe()

    const ordersChannel = supabase
      .channel(`waiter-orders-${restaurantId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurantId}` }, () => {
        fetchReadyOrders()
        fetchTableOrders()
      })
      .subscribe()

    const interval = setInterval(() => {
      fetchPings()
      fetchReadyOrders()
      fetchTableOrders()
    }, 5000)

    return () => {
      supabase.removeChannel(pingsChannel)
      supabase.removeChannel(ordersChannel)
      clearInterval(interval)
    }
  }, [supabase, restaurantId, fetchPings, fetchReadyOrders, fetchTableOrders])

  // Computed table summaries
  const tableSummaries = useMemo(() => {
    const map = new Map<number, TableBillingOrder[]>()
    for (const order of tableOrders) {
      const arr = map.get(order.table_number) ?? []
      arr.push(order)
      map.set(order.table_number, arr)
    }
    return Array.from(map.entries())
      .map(([table_number, orders]) => ({
        table_number,
        orders,
        totalCents: orders.reduce((s, o) => s + o.total_cents, 0),
        paidCents: orders.filter(o => o.payment_status === "paid").reduce((s, o) => s + o.total_cents, 0),
      }))
      .sort((a, b) => a.table_number - b.table_number)
  }, [tableOrders])

  const viewTableOrders = useMemo(
    () => tableOrders.filter(o => o.table_number === viewTable),
    [tableOrders, viewTable]
  )

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

  async function handleMarkPaid(orderIds: string[]) {
    if (orderIds.length === 0) return
    setMarkingPaid(true)
    const { error } = await markOrdersPaid(orderIds)
    setMarkingPaid(false)
    if (error) {
      toast({ title: "Kunde inte markera som betald", variant: "destructive" })
    } else {
      setTableOrders(prev => prev.map(o =>
        orderIds.includes(o.id) ? { ...o, payment_status: "paid" as const } : o
      ))
      setSelectedOrderIds(new Set())
      toast({ title: `${orderIds.length === 1 ? "Beställning" : `${orderIds.length} beställningar`} markerad${orderIds.length !== 1 ? "e" : ""} som betald${orderIds.length !== 1 ? "a" : ""}` })
    }
  }

  function elapsed(createdAt: string) {
    const m = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000)
    return m < 1 ? "just nu" : `${m}m sedan`
  }

  const hasTasks = pings.length > 0 || readyOrders.length > 0

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
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

      {/* Body: main content + billing sidebar */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: pings + ready orders */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-xl">
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
            <div className="flex flex-col items-center justify-center py-24 text-stone-400">
              <UtensilsCrossed className="h-14 w-14 mb-4 text-stone-300" />
              <p className="text-lg font-medium text-stone-500">Allt klart!</p>
              <p className="text-sm mt-1">Inga bordsförfrågningar eller klara beställningar.</p>
            </div>
          )}
        </div>

        {/* Right: billing sidebar */}
        <div className="w-56 border-l border-stone-200 bg-white flex flex-col overflow-hidden flex-shrink-0">
          <div className="px-4 py-3 border-b border-stone-100">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Bord & Notor</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tableSummaries.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-8 px-4">Inga aktiva bord idag.</p>
            ) : (
              <div className="divide-y divide-stone-100">
                {tableSummaries.map(({ table_number, totalCents, paidCents, orders }) => {
                  const allPaid = paidCents >= totalCents
                  const somePaid = paidCents > 0 && !allPaid
                  return (
                    <button
                      key={table_number}
                      onClick={() => { setViewTable(table_number); setSelectedOrderIds(new Set()) }}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors text-left"
                    >
                      <div>
                        <p className="font-semibold text-stone-800 text-sm">Bord {table_number}</p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {orders.length} beställning{orders.length !== 1 ? "ar" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-stone-800">{formatPrice(totalCents)}</p>
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                            allPaid
                              ? "bg-emerald-100 text-emerald-700"
                              : somePaid
                              ? "bg-amber-100 text-amber-700"
                              : "bg-stone-100 text-stone-500"
                          }`}>
                            {allPaid ? "Betalt" : somePaid ? "Delvis" : "Obetalt"}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-stone-300 flex-shrink-0" />
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table billing modal */}
      <Dialog open={viewTable !== null} onOpenChange={open => { if (!open) setViewTable(null) }}>
        <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-stone-100 flex-shrink-0">
            <DialogTitle className="text-stone-800 text-xl">Bord {viewTable}</DialogTitle>
            {viewTable !== null && (() => {
              const summary = tableSummaries.find(t => t.table_number === viewTable)
              if (!summary) return null
              return (
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-stone-500">Totalt: <span className="font-semibold text-stone-800">{formatPrice(summary.totalCents)}</span></span>
                  {summary.paidCents > 0 && (
                    <span className="text-sm text-emerald-600">Betalt: <span className="font-semibold">{formatPrice(summary.paidCents)}</span></span>
                  )}
                  {summary.totalCents - summary.paidCents > 0 && (
                    <span className="text-sm text-amber-600">Kvar: <span className="font-semibold">{formatPrice(summary.totalCents - summary.paidCents)}</span></span>
                  )}
                </div>
              )
            })()}
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {viewTableOrders.map(order => {
              const isPaid = order.payment_status === "paid"
              const isSelected = selectedOrderIds.has(order.id)
              return (
                <div
                  key={order.id}
                  onClick={() => {
                    if (isPaid) return
                    setSelectedOrderIds(prev => {
                      const next = new Set(prev)
                      if (next.has(order.id)) next.delete(order.id)
                      else next.add(order.id)
                      return next
                    })
                  }}
                  className={`rounded-xl border p-4 transition-all ${
                    isPaid
                      ? "bg-stone-50 border-stone-200 opacity-60 cursor-default"
                      : isSelected
                      ? "bg-amber-50 border-amber-300 cursor-pointer"
                      : "bg-white border-stone-200 cursor-pointer hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {!isPaid && (
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "bg-amber-500 border-amber-500" : "border-stone-300"
                        }`}>
                          {isSelected && <span className="text-white text-xs leading-none">✓</span>}
                        </div>
                      )}
                      {isPaid && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      )}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        order.status === "delivered" ? "bg-stone-100 text-stone-500" :
                        order.status === "ready" ? "bg-emerald-100 text-emerald-700" :
                        order.status === "preparing" ? "bg-amber-100 text-amber-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {order.status === "delivered" ? "Levererad" :
                         order.status === "ready" ? "Klar" :
                         order.status === "preparing" ? "Tillagas" : "Bekräftad"}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-stone-800">{formatPrice(order.total_cents)}</p>
                      {isPaid && <p className="text-xs text-emerald-600 font-medium">Betald</p>}
                    </div>
                  </div>
                  <div className="space-y-0.5 ml-6">
                    {order.order_items.map(item => (
                      <p key={item.id} className="text-sm text-stone-600">
                        <span className="text-amber-600 font-medium">{item.quantity}×</span>{" "}{item.menu_items.name}
                      </p>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action buttons */}
          {viewTableOrders.some(o => o.payment_status === "unpaid") && (
            <div className="px-6 py-4 border-t border-stone-100 flex-shrink-0 space-y-2">
              {selectedOrderIds.size > 0 && (
                <button
                  onClick={() => handleMarkPaid(Array.from(selectedOrderIds))}
                  disabled={markingPaid}
                  className="w-full py-2.5 bg-amber-500 text-stone-900 font-semibold text-sm rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50"
                >
                  {markingPaid ? "Uppdaterar…" : `Markera ${selectedOrderIds.size} vald${selectedOrderIds.size !== 1 ? "a" : ""} som betald${selectedOrderIds.size !== 1 ? "a" : ""}`}
                </button>
              )}
              <button
                onClick={() => handleMarkPaid(viewTableOrders.filter(o => o.payment_status === "unpaid").map(o => o.id))}
                disabled={markingPaid}
                className="w-full py-2.5 bg-emerald-500 text-white font-semibold text-sm rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50"
              >
                {markingPaid ? "Uppdaterar…" : "Markera alla som betalda"}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
