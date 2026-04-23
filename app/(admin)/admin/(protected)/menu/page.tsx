import type { Metadata } from "next"
import Link from "next/link"
import { BarChart3 } from "lucide-react"
import { redirect } from "next/navigation"
import { getCurrentRestaurant } from "@/lib/actions/restaurant"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getItemStatsMap } from "@/lib/actions/analytics"
import { MenuManagementClient } from "@/components/admin/menu-management-client"

export const metadata: Metadata = { title: "Menu Management" }
export const dynamic = 'force-dynamic'

export default async function MenuPage() {
  const ctx = await getCurrentRestaurant()
  if (!ctx) return redirect("/admin/login")

  const supabase = await createServerSupabaseClient()

  const [catsResult, itemsResult, allergensResult, itemStats] = await Promise.all([
    supabase.from("categories").select("*").eq("restaurant_id", ctx.restaurant.id).order("display_order"),
    supabase
      .from("menu_items")
      .select(`
        *,
        item_allergens ( allergen_id, allergens ( id, name ) ),
        item_modifier_groups (
          modifier_group_id,
          modifier_groups ( id, name, is_required, allow_multiple, modifiers ( id, name, price_adjustment_cents ) )
        )
      `)
      .eq("restaurant_id", ctx.restaurant.id)
      .order("display_order"),
    supabase.from("allergens").select("*").eq("restaurant_id", ctx.restaurant.id),
    getItemStatsMap(ctx.restaurant.id, 30),
  ])

  const maxItemQty = Math.max(0, ...Object.values(itemStats).map(s => s.quantitySold))

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl text-stone-800 font-semibold">Menu Management</h1>
          <p className="text-stone-500 mt-1">Inline popularity signals — click any item's chart icon for 30-day stats.</p>
        </div>
        <Link
          href="/admin/analytics"
          className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
        >
          <BarChart3 className="h-4 w-4" />
          Open full analytics
        </Link>
      </div>
      <MenuManagementClient
        restaurantId={ctx.restaurant.id}
        categories={catsResult.data ?? []}
        menuItems={itemsResult.data ?? []}
        allergens={allergensResult.data ?? []}
        itemStats={itemStats}
        maxItemQty={maxItemQty}
      />
    </div>
  )
}
