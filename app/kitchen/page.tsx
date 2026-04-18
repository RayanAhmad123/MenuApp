import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { KitchenClient } from "@/components/kitchen/kitchen-client"

export const metadata: Metadata = { title: "Kitchen Display" }

export default async function KitchenPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: staff } = await supabase
    .from("staff")
    .select("restaurant_id, role")
    .eq("email", user.email!)
    .eq("is_active", true)
    .single()

  if (!staff) redirect("/admin/login")

  const today = new Date().toISOString().split("T")[0]

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id, table_number, status, special_notes, created_at,
      order_items (
        id, quantity, special_requests, item_status,
        menu_items ( id, name )
      )
    `)
    .eq("restaurant_id", staff.restaurant_id)
    .in("status", ["confirmed", "preparing"])
    .gte("created_at", `${today}T00:00:00`)
    .order("created_at", { ascending: true })

  return (
    <KitchenClient
      restaurantId={staff.restaurant_id}
      initialOrders={orders ?? []}
    />
  )
}
