import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { WaiterClient } from "@/components/waiter/waiter-client"

export const metadata: Metadata = { title: "Waiter View" }

export default async function WaiterPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: staff } = await supabase
    .from("staff")
    .select("restaurant_id, role, first_name")
    .eq("email", user.email!)
    .eq("is_active", true)
    .single()

  if (!staff) redirect("/admin/login")

  const today = new Date().toISOString().split("T")[0]

  const [{ data: pings }, { data: readyOrders }, { data: tableOrders }] = await Promise.all([
    supabase
      .from("table_pings")
      .select("*")
      .eq("restaurant_id", staff.restaurant_id)
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
    supabase
      .from("orders")
      .select("id, table_number, total_cents, created_at, order_items(id, quantity, menu_items(name))")
      .eq("restaurant_id", staff.restaurant_id)
      .eq("status", "ready")
      .gte("created_at", `${today}T00:00:00`)
      .order("created_at", { ascending: true }),
    supabase
      .from("orders")
      .select("id, table_number, total_cents, status, payment_status, created_at, order_items(id, quantity, item_price_cents, payment_status, menu_items(name))")
      .eq("restaurant_id", staff.restaurant_id)
      .neq("status", "cancelled")
      .gte("created_at", `${today}T00:00:00`)
      .order("table_number", { ascending: true })
      .order("created_at", { ascending: true }),
  ])

  return (
    <WaiterClient
      restaurantId={staff.restaurant_id}
      staffName={staff.first_name}
      initialPings={pings ?? []}
      initialReadyOrders={readyOrders ?? []}
      initialTableOrders={tableOrders ?? []}
    />
  )
}
