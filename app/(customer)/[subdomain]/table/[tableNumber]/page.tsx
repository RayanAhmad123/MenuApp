import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { CustomerMenuClient } from "@/components/customer/menu-client"

interface PageProps {
  params: {
    subdomain: string
    tableNumber: string
  }
}

export async function generateMetadata({ params }: PageProps) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .eq("subdomain", params.subdomain)
    .single()
  return { title: data?.name ?? "Menu" }
}

export default async function MenuPage({ params }: PageProps) {
  const tableNumber = parseInt(params.tableNumber, 10)
  if (isNaN(tableNumber)) notFound()

  const supabase = await createServerSupabaseClient()

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name, logo_url, address, is_active")
    .eq("subdomain", params.subdomain)
    .single()

  if (!restaurant || !restaurant.is_active) notFound()

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

  return (
    <CustomerMenuClient
      restaurant={restaurant}
      categories={categories ?? []}
      menuItems={menuItems ?? []}
      tableNumber={tableNumber}
    />
  )
}
