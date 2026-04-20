import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getCurrentRestaurant } from "@/lib/actions/restaurant"
import { formatPrice } from "@/lib/utils"
import { TrendingUp, ShoppingBag, Clock, Table2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Order } from "@/types/database"

export const metadata: Metadata = { title: "Dashboard" }
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const ctx = await getCurrentRestaurant()
  if (!ctx) return redirect("/admin/login")

  const supabase = await createServerSupabaseClient()
  const today = new Date().toISOString().split("T")[0]

  // Fetch today's orders
  const { data: todayOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("restaurant_id", ctx.restaurant.id)
    .gte("created_at", `${today}T00:00:00`)
    .order("created_at", { ascending: false })

  const orders = (todayOrders ?? []) as Pick<Order, "id" | "total_cents" | "status" | "payment_status" | "table_number" | "created_at">[]
  const totalRevenue = orders.filter(o => o.payment_status === "paid").reduce((s, o) => s + o.total_cents, 0)
  const pendingOrders = orders.filter(o => ["pending", "confirmed", "preparing"].includes(o.status)).length
  const activeTables = new Set(orders.filter(o => !["delivered", "cancelled"].includes(o.status)).map(o => o.table_number)).size

  const stats = [
    { title: "Today's Revenue", value: formatPrice(totalRevenue), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Orders Today", value: String(orders.length), icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Pending Orders", value: String(pendingOrders), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Active Tables", value: String(activeTables), icon: Table2, color: "text-purple-600", bg: "bg-purple-50" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800 font-semibold">
          Good {getTimeOfDay()}, {ctx.staffName.split(" ")[0]}
        </h1>
        <p className="text-stone-500 mt-1">Here's what's happening at {ctx.restaurant.name} today.</p>
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

      {/* Recent orders table */}
      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-stone-800 text-xl">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-stone-400 text-center py-8">No orders yet today.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-stone-500 border-b border-stone-100">
                    <th className="pb-3 font-medium">Table</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Payment</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {orders.slice(0, 15).map(order => (
                    <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 font-medium text-stone-800">Table {order.table_number}</td>
                      <td className="py-3 text-stone-500">
                        {new Date(order.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
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
                          {order.payment_status}
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
    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${styles[status] ?? styles.pending}`}>
      {status}
    </span>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return "morning"
  if (h < 17) return "afternoon"
  return "evening"
}
