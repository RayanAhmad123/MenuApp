import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getCurrentRestaurant } from "@/lib/actions/restaurant"
import { OrdersClient } from "@/components/admin/orders-client"

export const metadata: Metadata = { title: "Beställningar" }
export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const ctx = await getCurrentRestaurant()
  if (!ctx) return redirect("/admin/login")

  const supabase = await createServerSupabaseClient()
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        *,
        menu_items(name),
        order_item_modifiers(*, modifiers(name))
      )
    `)
    .eq("restaurant_id", ctx.restaurant.id)
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl text-stone-800 font-semibold mb-6">Beställningar</h1>
      <OrdersClient
        orders={orders ?? []}
        restaurantId={ctx.restaurant.id}
      />
    </div>
  )
}
