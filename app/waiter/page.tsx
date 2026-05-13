import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { StaffClient } from "@/components/waiter/waiter-client"
import { extractSubdomainFromHost, isTenantSubdomain } from "@/lib/tenant"

export const metadata: Metadata = { title: "Personalsvy" }
export const dynamic = 'force-dynamic'

export default async function WaiterPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  // Staff can belong to multiple restaurants — don't .single() here, it breaks
  // for any user who's a member of more than one tenant.
  const { data: staffRows } = await supabase
    .from("staff")
    .select("restaurant_id, role, first_name, restaurants(subdomain)")
    .eq("email", user.email!)
    .eq("is_active", true)

  type StaffRow = {
    restaurant_id: string
    role: string
    first_name: string
    restaurants: { subdomain: string } | null
  }

  const rows = (staffRows ?? []) as unknown as StaffRow[]
  if (rows.length === 0) redirect("/admin/login")

  // Pick the staff row that matches the current tenant subdomain, otherwise
  // fall back to the user's first restaurant.
  const host = (await headers()).get("host")
  const hostSub = extractSubdomainFromHost(host)
  const matchingRow = isTenantSubdomain(hostSub)
    ? rows.find((r) => r.restaurants?.subdomain === hostSub)
    : undefined
  const staff = matchingRow ?? rows[0]

  const today = new Date().toISOString().split("T")[0]

  const [
    { data: pings },
    { data: pendingOrders },
    { data: activeOrders },
    { data: tableOrders },
    { data: restaurant },
  ] = await Promise.all([
    supabase
      .from("table_pings")
      .select("*")
      .eq("restaurant_id", staff.restaurant_id)
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
    supabase
      .from("orders")
      .select("id, table_number, total_cents, special_notes, created_at, order_items(id, quantity, special_requests, menu_items(name))")
      .eq("restaurant_id", staff.restaurant_id)
      .eq("status", "pending")
      .is("stripe_payment_intent_id", null)
      .gte("created_at", `${today}T00:00:00`)
      .order("created_at", { ascending: true }),
    supabase
      .from("orders")
      .select("id, table_number, total_cents, special_notes, created_at, order_items(id, quantity, special_requests, menu_items(name))")
      .eq("restaurant_id", staff.restaurant_id)
      .in("status", ["confirmed", "preparing", "ready"])
      .gte("created_at", `${today}T00:00:00`)
      .order("created_at", { ascending: true }),
    supabase
      .from("orders")
      .select("id, table_number, total_cents, status, payment_status, created_at, order_items(id, quantity, item_price_cents, payment_status, menu_items(name))")
      .eq("restaurant_id", staff.restaurant_id)
      .neq("status", "cancelled")
      .eq("payment_status", "unpaid")
      .gte("created_at", `${today}T00:00:00`)
      .order("table_number", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("restaurants")
      .select("yellow_threshold_minutes, red_threshold_minutes, payment_enabled")
      .eq("id", staff.restaurant_id)
      .single(),
  ])

  return (
    <StaffClient
      restaurantId={staff.restaurant_id}
      staffName={staff.first_name}
      role={staff.role}
      initialPings={pings ?? []}
      initialPendingOrders={pendingOrders ?? []}
      initialActiveOrders={activeOrders ?? []}
      initialTableOrders={tableOrders ?? []}
      yellowThreshold={restaurant?.yellow_threshold_minutes ?? 10}
      redThreshold={restaurant?.red_threshold_minutes ?? 20}
      paymentEnabled={restaurant?.payment_enabled ?? true}
    />
  )
}
