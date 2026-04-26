"use client"
import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Clock, ChefHat, CheckCheck, Truck, Bell, ArrowLeft, Plus, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { formatPrice, timeAgo } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { OrderWithItems } from "@/types/database"

const PING_COOLDOWN_MS = 60_000

const ORDER_STEPS = [
  { key: "pending", label: "Beställning mottagen", icon: Clock },
  { key: "confirmed", label: "Bekräftad", icon: CheckCircle2 },
  { key: "preparing", label: "Tillagas", icon: ChefHat },
  { key: "ready", label: "Klar", icon: CheckCheck },
  { key: "delivered", label: "Levererad", icon: Truck },
] as const

const stepIndex = (status: string) =>
  ORDER_STEPS.findIndex(s => s.key === status)

type LiveState = "connecting" | "live" | "reconnecting"

export default function OrderStatusPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const subdomain = params.subdomain as string
  const tableNumber = params.tableNumber as string

  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [loading, setLoading] = useState(true)
  const [liveState, setLiveState] = useState<LiveState>("connecting")
  const [pingCooldownUntil, setPingCooldownUntil] = useState<number>(0)
  const [now, setNow] = useState(() => Date.now())
  const [callingWaiter, setCallingWaiter] = useState(false)
  const supabase = useMemo(() => createClient(), [])
  const { toast } = useToast()
  const pingStorageKey = `menuapp-last-ping-${subdomain}-${tableNumber}`
  const cooldownRemaining = Math.max(0, Math.ceil((pingCooldownUntil - now) / 1000))
  // Track the latest fetch across re-renders so visibility/realtime handlers
  // always call the current version without retriggering the subscribe effect.
  const fetchRef = useRef<() => Promise<void>>(() => Promise.resolve())

  const fetchOrder = useCallback(async () => {
    const { data } = await supabase
      .from("orders")
      .select(`*, order_items(*, menu_items(name, image_url), order_item_modifiers(*, modifiers(name)))`)
      .eq("id", orderId)
      .single()
    if (data) setOrder(data as unknown as OrderWithItems)
    setLoading(false)
  }, [supabase, orderId])

  useEffect(() => {
    fetchRef.current = fetchOrder
  }, [fetchOrder])

  // Restore the ping cooldown from localStorage so it survives navigation between
  // the menu and the order status page.
  useEffect(() => {
    const stored = (() => {
      try { return Number(localStorage.getItem(pingStorageKey) ?? "0") } catch { return 0 }
    })()
    if (stored && stored + PING_COOLDOWN_MS > Date.now()) {
      setPingCooldownUntil(stored + PING_COOLDOWN_MS)
    }
  }, [pingStorageKey])

  useEffect(() => {
    if (cooldownRemaining <= 0) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [cooldownRemaining])

  useEffect(() => {
    fetchOrder()

    let hasBeenLive = false
    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "orders",
        filter: `id=eq.${orderId}`,
      }, payload => {
        // Apply the new status from the realtime payload immediately so the
        // UI never visually skips a stage between events; refetch in the
        // background to keep the rest of the order in sync (items, totals).
        const next = payload.new as Partial<OrderWithItems> | undefined
        if (next?.status) {
          setOrder(prev => prev ? { ...prev, status: next.status as OrderWithItems["status"], payment_status: next.payment_status ?? prev.payment_status } : prev)
        }
        fetchRef.current()
      })
      .subscribe(status => {
        if (status === "SUBSCRIBED") {
          hasBeenLive = true
          setLiveState("live")
        } else if (
          hasBeenLive &&
          (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED")
        ) {
          // Only show "Återansluter…" once we've actually been live — avoids
          // flashing the indicator during the initial subscribe handshake or
          // the unmount-time CLOSED transition.
          setLiveState("reconnecting")
        }
      })

    // Poll more aggressively than before so that if the websocket stalls, the
    // status catches up within a few seconds. Browsers throttle intervals on
    // hidden tabs automatically — on wake we refetch immediately (below).
    const interval = setInterval(() => { fetchRef.current() }, 3000)

    const onVisible = () => {
      if (document.visibilityState === "visible") fetchRef.current()
    }
    document.addEventListener("visibilitychange", onVisible)
    window.addEventListener("focus", onVisible)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisible)
      window.removeEventListener("focus", onVisible)
    }
  }, [supabase, orderId, fetchOrder])

  if (loading) {
    return (
      <div className="menu-page min-h-screen flex items-center justify-center">
        <div className="text-stone-400 text-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Laddar beställning...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="menu-page min-h-screen flex items-center justify-center p-8 text-center">
        <p className="text-stone-400">Beställningen hittades inte.</p>
      </div>
    )
  }

  if (order.status === "cancelled") {
    return (
      <div className="menu-page min-h-screen">
        <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
            <Link href={`/${subdomain}/table/${tableNumber}`}>
              <Button variant="ghost" size="icon" className="text-stone-400 hover:text-stone-200">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-serif text-xl text-stone-50 flex-1">Beställningsstatus</h1>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-12 space-y-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-950 border border-red-800 mb-2">
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl text-stone-50">Din beställning avvisades</h2>
            <p className="text-stone-400 text-sm">
              Restaurangen kunde inte ta emot din beställning. Du har inte debiterats.
            </p>
            <p className="text-stone-500 text-xs">Bord {tableNumber} · {timeAgo(order.created_at)}</p>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden text-left">
            <div className="p-4 border-b border-stone-800">
              <h3 className="font-serif text-stone-100 font-medium">Avvisad beställning</h3>
            </div>
            <div className="divide-y divide-stone-800">
              {order.order_items.map(item => (
                <div key={item.id} className="p-4 flex items-start gap-3">
                  <span className="text-stone-500 font-semibold text-sm w-5 flex-shrink-0 mt-0.5">
                    {item.quantity}×
                  </span>
                  <div className="flex-1">
                    <p className="text-stone-300 text-sm font-medium line-through">{item.menu_items.name}</p>
                  </div>
                  <span className="text-stone-500 text-sm line-through">
                    {formatPrice(item.item_price_cents * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link href={`/${subdomain}/table/${tableNumber}`}>
            <Button variant="amber" size="xl" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Lägg ny beställning
            </Button>
          </Link>
        </main>
      </div>
    )
  }

  const currentStep = stepIndex(order.status)
  const waitEstimate = estimateWait(order.status)

  async function handleCallWaiter() {
    if (!order || cooldownRemaining > 0 || callingWaiter) return
    setCallingWaiter(true)
    const { createTablePing } = await import("@/lib/actions/orders")
    const { error } = await createTablePing(order.restaurant_id, order.table_number, "assistance", order.id)
    setCallingWaiter(false)
    if (error) {
      toast({ title: "Kunde inte tillkalla servitör", variant: "destructive" })
      return
    }
    const until = Date.now() + PING_COOLDOWN_MS
    setPingCooldownUntil(until)
    setNow(Date.now())
    try { localStorage.setItem(pingStorageKey, String(Date.now())) } catch { /* ignore */ }
    toast({ title: "Servitör är på väg!", description: "Någon kommer strax." })
  }

  return (
    <div className="menu-page min-h-screen">
      <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href={`/${subdomain}/table/${tableNumber}`}>
            <Button variant="ghost" size="icon" className="text-stone-400 hover:text-stone-200">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-serif text-xl text-stone-50 flex-1">Beställningsstatus</h1>
          <LiveIndicator state={liveState} />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Status header */}
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-3 ${
            order.status === "delivered"
              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
              : order.status === "ready"
              ? "bg-blue-950 text-blue-400 border border-blue-800"
              : "bg-amber-950 text-amber-400 border border-amber-800"
          }`}>
            {order.status === "delivered" ? "Smaklig måltid!" :
             order.status === "ready" ? "Din beställning är klar!" :
             order.status === "preparing" ? "Tillagas..." :
             order.status === "confirmed" ? "Beställning bekräftad!" :
             "Väntar på bekräftelse"}
          </div>
          <p className="text-stone-500 text-sm">Bord {tableNumber} · {timeAgo(order.created_at)}</p>
          {waitEstimate && (
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-xs text-stone-400">
              <Clock className="h-3 w-3 text-amber-400" />
              <span>{waitEstimate}</span>
            </div>
          )}
        </div>

        {/* Progress steps */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <div className="space-y-4">
            {ORDER_STEPS.map((step, idx) => {
              const Icon = step.icon
              const done = idx <= currentStep
              const active = idx === currentStep
              return (
                <div key={step.key} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    done ? "bg-amber-500 text-stone-900" :
                    "bg-stone-800 text-stone-600"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium transition-colors ${
                      active ? "text-amber-300" :
                      done ? "text-stone-200" :
                      "text-stone-600"
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  {active && (
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Order items */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-stone-800">
            <h2 className="font-serif text-stone-100 font-medium">Beställningsöversikt</h2>
          </div>
          <div className="divide-y divide-stone-800">
            {order.order_items.map(item => (
              <div key={item.id} className="p-4 flex items-start gap-3">
                <span className="text-amber-500 font-semibold text-sm w-5 flex-shrink-0 mt-0.5">
                  {item.quantity}×
                </span>
                <div className="flex-1">
                  <p className="text-stone-200 text-sm font-medium">{item.menu_items.name}</p>
                  {item.order_item_modifiers.length > 0 && (
                    <p className="text-xs text-stone-500 mt-0.5">
                      {item.order_item_modifiers.map(m => m.modifiers.name).join(", ")}
                    </p>
                  )}
                  {item.special_requests && (
                    <p className="text-xs text-stone-500 italic mt-0.5">"{item.special_requests}"</p>
                  )}
                </div>
                <span className="text-stone-400 text-sm">
                  {formatPrice(item.item_price_cents * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-stone-800 flex justify-between">
            <span className="text-stone-400 text-sm">Totalt</span>
            <span className="text-amber-400 font-semibold">{formatPrice(order.total_cents)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Link href={`/${subdomain}/table/${tableNumber}`}>
            <Button variant="amber" size="xl" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Beställ mer
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full border-stone-700 text-stone-400 hover:text-stone-200 hover:bg-stone-800 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleCallWaiter}
            disabled={cooldownRemaining > 0 || callingWaiter}
          >
            <Bell className="h-4 w-4 mr-2" />
            {cooldownRemaining > 0
              ? `Servitör tillkallad (${cooldownRemaining}s)`
              : callingWaiter
              ? "Tillkallar..."
              : "Tillkalla servitör"}
          </Button>
        </div>
      </main>
    </div>
  )
}

function estimateWait(status: string): string | null {
  switch (status) {
    case "pending":
      return "Beräknad väntetid: 15–20 min"
    case "confirmed":
      return "Beräknad väntetid: 10–15 min"
    case "preparing":
      return "Beräknad väntetid: 5–10 min"
    case "ready":
      return "Serveras strax"
    default:
      return null
  }
}

function LiveIndicator({ state }: { state: LiveState }) {
  if (state === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Live
      </span>
    )
  }
  // Hide the indicator entirely while the initial connection is in flight —
  // the websocket usually subscribes within a few hundred ms, so flashing
  // "Ansluter…" is just noise. Only show "Återansluter…" once the channel has
  // actually errored or dropped after being live.
  if (state === "reconnecting") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-amber-500">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        Återansluter…
      </span>
    )
  }
  return null
}
