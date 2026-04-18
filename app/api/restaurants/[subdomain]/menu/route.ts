import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: { subdomain: string } }
) {
  const supabase = await createServerSupabaseClient()

  const { data: restaurant, error: restError } = await supabase
    .from("restaurants")
    .select("id, name, logo_url, address, is_active")
    .eq("subdomain", params.subdomain)
    .single()

  if (restError || !restaurant || !restaurant.is_active) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true)
    .order("display_order")

  const { data: menuItems } = await supabase
    .from("menu_items")
    .select(`
      *,
      item_allergens ( allergen_id, allergens ( id, name ) ),
      item_modifier_groups (
        modifier_group_id,
        modifier_groups (
          id, name, is_required, allow_multiple,
          modifiers ( id, name, price_adjustment_cents )
        )
      )
    `)
    .eq("restaurant_id", restaurant.id)
    .eq("is_available", true)
    .order("display_order")

  return NextResponse.json({ restaurant, categories: categories ?? [], menuItems: menuItems ?? [] })
}
