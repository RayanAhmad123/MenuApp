import type { Metadata } from "next"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getCurrentRestaurant } from "@/lib/actions/restaurant"
import { getAnalyticsSummary } from "@/lib/actions/analytics"
import { formatPrice } from "@/lib/utils"
import { TrendingUp, ShoppingBag, Clock, Table2, ArrowUpRight, Flame, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Order } from "@/types/database"

export const metadata: Metadata = { title: "Översikt" }
export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<string, string> = {
  pending: "Väntar",
  confirmed: "Bekräftad",
  preparing: "Tillagas",
  ready: "Klar",
  delivered: "Levererad",
  cancelled: "Avbruten",
}

const PAYMENT_LABELS: Record<string, string> = {
  paid: "Betald",
  unpaid: "Obetald",
  refunded: "Återbetald",
  pending: "Väntar",
  failed: "Misslyckad",
}

// Note: "today" is UTC-based. Swedish restaurants in CET/CEST will see the
// boundary flip 1–2h before local midnight. Revenue/orders/pending count
// intentionally use this window; Active Tables is decoupled because live
// service carries across midnight.
export default async function DashboardPage() {
  const ctx = await getCurrentRestaurant()
  if (!ctx) return redirect("/admin/login")

  const supabase = await createServerSupabaseClient()
  const today = new Date().toISOString().split("T")[0]

  const [ordersResult, summary, restaurantResult, liveOrdersResult] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .eq("restaurant_id", ctx.restaurant.id)
      .gte("created_at", `${today}T00:00:00`)
      .order("created_at", { ascending: false }),
    getAnalyticsSummary(ctx.restaurant.id, 7),
    supabase
      .from("restaurants")
      .select("payment_enabled")
      .eq("id", ctx.restaurant.id)
      .maybeSingle(),
    // Active Tables looks at live orders regardless of the UTC "today" window,
    // but caps at 24h to avoid counting orphaned orders that never got marked
    // delivered (stuck-in-"ready" is a common real-world hygiene issue).
    supabase
      .from("orders")
      .select("table_number")
      .eq("restaurant_id", ctx.restaurant.id)
      .in("status", ["pending", "confirmed", "preparing", "ready"])
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
  ])

  const orders = (ordersResult.data ?? []) as Pick<Order, "id" | "total_cents" | "status" | "payment_status" | "table_number" | "created_at">[]
  // When a restaurant has payments disabled (cash/POS), every non-cancelled
  // order counts toward revenue — otherwise Today's Revenue is stuck at zero.
  const paymentEnabled = restaurantResult.data?.payment_enabled ?? true
  const totalRevenue = orders
    .filter(o => (paymentEnabled ? o.payment_status === "paid" : o.status !== "cancelled"))
    .reduce((s, o) => s + o.total_cents, 0)
  const pendingOrders = orders.filter(o => ["pending", "confirmed", "preparing"].includes(o.status)).length
  const liveTableRows = (liveOrdersResult.data ?? []) as Pick<Order, "table_number">[]
  const activeTables = new Set(liveTableRows.map(o => o.table_number)).size
  const topSellers = summary.topItems.filter(i => i.quantitySold > 0).slice(0, 5)
  const peakHour = summary.hourly.reduce((best, h) => h.orders > best.orders ? h : best, summary.hourly[0])

  const stats = [
    { title: "Intäkter idag", value: formatPrice(totalRevenue), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Beställningar idag", value: String(orders.length), icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Pågående beställningar", value: String(pendingOrders), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Aktiva bord", value: String(activeTables), icon: Table2, color: "text-purple-600", bg: "bg-purple-50" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800 font-semibold">
          Hej, {ctx.staffName.split(" ")[0]}
        </h1>
        <p className="text-stone-500 mt-1">Så här ser dagen ut på {ctx.restaurant.name}.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-stone-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-stone-500 font-medium">{stat.title}</p>
                  <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="font-serif text-3xl font-semibold text-stone-800">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 7-day intelligence strip */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <Card className="border-stone-200 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-stone-800 text-xl flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-600" />
              Bästsäljare — senaste 7 dagarna
            </CardTitle>
            <Link href="/admin/analytics" className="text-xs text-amber-700 hover:underline flex items-center gap-1">
              Full analys <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {topSellers.length === 0 ? (
              <p className="text-stone-400 text-center py-8 text-sm">Inga sälj än — dela QR-koder med gästerna för att komma igång.</p>
            ) : (
              <div className="space-y-1.5">
                {topSellers.map((item, i) => (
                  <div key={item.itemId} className="flex items-center gap-3 py-2">
                    <span className="text-xs font-bold text-stone-400 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                      <p className="text-xs text-stone-500">{item.categoryName ?? "—"}</p>
                    </div>
                    <span className="text-sm font-semibold text-stone-800 tabular-nums">{item.quantitySold}×</span>
                    <span className="text-xs text-stone-500 tabular-nums w-20 text-right">{formatPrice(item.revenueCents)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle className="text-stone-800 text-xl flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-amber-600" />
              7-dagars puls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Intäkter</span>
              <span className="font-semibold text-stone-800">{formatPrice(summary.totalRevenueCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Beställningar</span>
              <span className="font-semibold text-stone-800">{summary.totalOrders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Snitt per beställning</span>
              <span className="font-semibold text-stone-800">{formatPrice(summary.avgOrderCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Topptimme</span>
              <span className="font-semibold text-stone-800">
                {peakHour && peakHour.orders > 0 ? `${String(peakHour.hour).padStart(2, "0")}:00` : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Rätter per beställning</span>
              <span className="font-semibold text-stone-800">{summary.avgItemsPerOrder.toFixed(1)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent orders table */}
      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-stone-800 text-xl">Senaste beställningarna</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-stone-400 text-center py-8">Inga beställningar idag än.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-stone-500 border-b border-stone-100">
                    <th className="pb-3 font-medium">Bord</th>
                    <th className="pb-3 font-medium">Tid</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Betalning</th>
                    <th className="pb-3 font-medium text-right">Totalt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {orders.slice(0, 15).map(order => (
                    <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 font-medium text-stone-800">Bord {order.table_number}</td>
                      <td className="py-3 text-stone-500">
                        {new Date(order.created_at).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.payment_status === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-stone-100 text-stone-500"
                        }`}>
                          {PAYMENT_LABELS[order.payment_status] ?? order.payment_status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium text-stone-800">
                        {formatPrice(order.total_cents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-stone-100 text-stone-600",
    confirmed: "bg-blue-100 text-blue-700",
    preparing: "bg-amber-100 text-amber-700",
    ready: "bg-emerald-100 text-emerald-700",
    delivered: "bg-stone-100 text-stone-500",
    cancelled: "bg-red-100 text-red-700",
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status] ?? styles.pending}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
