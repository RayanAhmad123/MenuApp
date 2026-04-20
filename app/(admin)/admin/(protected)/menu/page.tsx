import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentRestaurant } from "@/lib/actions/restaurant"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { MenuManagementClient } from "@/components/admin/menu-management-client"

export const metadata: Metadata = { title: "Menu Management" }
export const dynamic = 'force-dynamic'

export default async function MenuPage() {
  const ctx = await getCurrentRestaurant()
  if (!ctx) return redirect("/admin/login")

  const supabase = await createServerSupabaseClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", ctx.restaurant.id)
    .order("display_order")

  const { data: menuItems } = await supabase
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
    .order("display_order")

  const { data: allergens } = await supabase
    .from("allergens")
    .select("*")
    .eq("restaurant_id", ctx.restaurant.id)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800 font-semibold">Menu Management</h1>
        <p className="text-stone-500 mt-1">Manage your categories and menu items.</p>
      </div>
      <MenuManagementClient
        restaurantId={ctx.restaurant.id}
        categories={categories ?? []}
        menuItems={menuItems ?? []}
        allergens={allergens ?? []}
      />
    </div>
  )
}
