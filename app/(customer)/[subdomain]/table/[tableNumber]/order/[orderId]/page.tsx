"use client"
import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Clock, ChefHat, CheckCheck, Truck, Bell, ArrowLeft, Plus, Check } from "lucide-react"
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
  const supabase = useMemo(() => createClient(), [])
  const { toast } = useToast()
  // Track the latest fetch across re-renders so visibility/realtime handlers
  // always call the current version without retriggering the subscribe effect.
  const fetchRef = useRef<() => Promise<void>>(() => Promise.resolve())

  const pingStorageKey = `menuapp-last-ping-${subdomain}-${tableNumber}`
  const cooldownRemaining = Math.max(0, Math.ceil((pingCooldownUntil - now) / 1000))

  const fetchOrder = useCallback(async () => {
    const { data } = await supabase
      .from("orders")
      .select(`*, order_items(*, menu_items(name, image_url), order_item_modifiers(*, modifiers(name)))`)
      .eq("id", orderId)
      .single()
    if (data) {
      setOrder(data as unknown as OrderWithItems)
      // Any successful fetch (realtime push, poll, focus) means our pipe to the
      // server is healthy. Mark the indicator live so a flaky websocket doesn't
      // leave "Återansluter…" hanging forever even though data is flowing.
      setLiveState("live")
    }
    setLoading(false)
  }, [supabase, orderId])

  useEffect(() => {
    fetchRef.current = fetchOrder
  }, [fetchOrder])

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

    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "orders",
        filter: `id=eq.${orderId}`,
      }, () => { fetchRef.current() })
      .subscribe(status => {
        if (status === "SUBSCRIBED") setLiveState("live")
        else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") setLiveState("reconnecting")
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

  const currentStep = stepIndex(order.status)
  const waitEstimate = estimateWait(order.status)

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
            disabled={cooldownRemaining > 0}
            className="w-full border-stone-700 text-stone-400 hover:text-stone-200 hover:bg-stone-800 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={async () => {
              if (cooldownRemaining > 0) return
              const { createTablePing } = await import("@/lib/actions/orders")
              const { error } = await createTablePing(order.restaurant_id, order.table_number, "assistance", order.id)
              if (error) {
                toast({ title: "Kunde inte tillkalla servitör", variant: "destructive" })
                return
              }
              const until = Date.now() + PING_COOLDOWN_MS
              setPingCooldownUntil(until)
              setNow(Date.now())
              try { localStorage.setItem(pingStorageKey, String(Date.now())) } catch { /* ignore */ }
              toast({ title: "Servitör tillkallad", description: "Någon kommer strax." })
            }}
          >
            {cooldownRemaining > 0 ? (
              <>
                <Check className="h-4 w-4 mr-2 text-emerald-400" />
                Servitör tillkallad · {cooldownRemaining}s
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Tillkalla servitör
              </>
            )}
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
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-500">
      <span className="w-1.5 h-1.5 rounded-full bg-stone-600" />
      {state === "connecting" ? "Ansluter…" : "Återansluter…"}
    </span>
  )
}
