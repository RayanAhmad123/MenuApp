import { createAdminSupabaseClient } from "@/lib/supabase/server"
import { RestaurantsClient } from "@/components/superadmin/restaurants-client"

export const dynamic = "force-dynamic"
export const metadata = { title: "Superadmin – Restauranger" }

export default async function SuperadminDashboardPage() {
  const supabase = await createAdminSupabaseClient()

  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id, name, subdomain, subscription_tier, is_active, created_at")
    .order("created_at", { ascending: false })

  // Fetch staff counts per restaurant
  const { data: staffCounts } = await supabase
    .from("staff")
    .select("restaurant_id")
    .eq("is_active", true)

  const countMap: Record<string, number> = {}
  for (const s of staffCounts ?? []) {
    countMap[s.restaurant_id] = (countMap[s.restaurant_id] ?? 0) + 1
  }

  const enriched = (restaurants ?? []).map(r => ({
    ...r,
    staff_count: countMap[r.id] ?? 0,
  }))

  return <RestaurantsClient restaurants={enriched} />
}
