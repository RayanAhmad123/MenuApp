import { NextRequest, NextResponse } from "next/server"
import { createPublicSupabaseClient } from "@/lib/supabase/public"

// Keywords that identify drink/dessert categories (case-insensitive)
const UPSELL_KEYWORDS = [
  "dryck", "drycker", "drink", "drinks", "dessert", "desserts",
  "efterrätt", "efterrätter", "läsk", "kaffe", "juice", "sötsaker",
]

export async function GET(req: NextRequest) {
  const subdomain = req.nextUrl.searchParams.get("subdomain")
  if (!subdomain) return NextResponse.json([], { status: 400 })

  const supabase = createPublicSupabaseClient()

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id")
    .eq("subdomain", subdomain)
    .eq("is_active", true)
    .single()

  if (!restaurant) return NextResponse.json([])

  // Fetch all active categories for this restaurant
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true)

  // Identify upsell category IDs (drinks/desserts)
  const upsellCategoryIds = (categories ?? [])
    .filter(c => UPSELL_KEYWORDS.some(kw => c.name.toLowerCase().includes(kw)))
    .map(c => c.id)

  if (upsellCategoryIds.length === 0) {
    // Fallback: return the 3 cheapest available items across all categories
    const { data: cheap } = await supabase
      .from("menu_items")
      .select("id, name, price_cents, image_url")
      .eq("restaurant_id", restaurant.id)
      .eq("is_available", true)
      .order("price_cents", { ascending: true })
      .limit(3)

    return NextResponse.json(cheap ?? [])
  }

  // Return up to 4 items from upsell categories, preferring cheapest
  const { data: items } = await supabase
    .from("menu_items")
    .select("id, name, price_cents, image_url")
    .eq("restaurant_id", restaurant.id)
    .eq("is_available", true)
    .in("category_id", upsellCategoryIds)
    .order("price_cents", { ascending: true })
    .limit(4)

  return NextResponse.json(items ?? [], {
    headers: { "Cache-Control": "public, s-maxage=60" },
  })
}
