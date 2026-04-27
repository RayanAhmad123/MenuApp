import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createPublicSupabaseClient } from "@/lib/supabase/public"
import { CustomerMenuClient } from "@/components/customer/menu-client"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  SITE_URL,
  restaurantSchema,
  menuSchema,
  breadcrumbSchema,
} from "@/lib/seo/structured-data"

export const revalidate = 300

interface PageProps {
  params: {
    subdomain: string
    tableNumber: string
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const supabase = createPublicSupabaseClient()
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name, logo_url, address, is_active")
    .eq("subdomain", params.subdomain)
    .single()

  if (!restaurant || !restaurant.is_active) {
    return {
      title: "Meny",
      robots: { index: false, follow: false },
    }
  }

  const url = `${SITE_URL}/${params.subdomain}/table/${params.tableNumber}`
  const title = `${restaurant.name} — Meny`
  const description = restaurant.address
    ? `Beställ direkt från bordet hos ${restaurant.name} (${restaurant.address}). Bläddra i menyn, se priser och allergener, och beställ från mobilen — drivs av Servera.`
    : `Bläddra i menyn hos ${restaurant.name}, se priser och allergener, och beställ direkt från mobilen — drivs av Servera.`

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "sv_SE",
      url,
      siteName: "Servera",
      title,
      description,
      ...(restaurant.logo_url
        ? { images: [{ url: restaurant.logo_url, alt: restaurant.name }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(restaurant.logo_url ? { images: [restaurant.logo_url] } : {}),
    },
  }
}

export default async function MenuPage({ params }: PageProps) {
  const tableNumber = parseInt(params.tableNumber, 10)
  if (isNaN(tableNumber)) notFound()

  const supabase = createPublicSupabaseClient()

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

  const restaurantUrl = `${SITE_URL}/${params.subdomain}/table/${params.tableNumber}`
  const restaurantLd = restaurantSchema({
    name: restaurant.name,
    subdomain: params.subdomain,
    logoUrl: restaurant.logo_url,
    address: restaurant.address,
  })
  type MenuItemForLd = {
    id: string
    name: string
    description: string | null
    price_cents: number
    image_url: string | null
    is_vegetarian: boolean
    is_vegan: boolean
    is_gluten_free: boolean
    category_id: string
  }
  const menuLd = menuSchema(
    restaurantUrl,
    (categories ?? []).map((c) => ({ id: c.id, name: c.name })),
    ((menuItems ?? []) as unknown as MenuItemForLd[]).map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      price_cents: m.price_cents,
      image_url: m.image_url,
      is_vegetarian: m.is_vegetarian,
      is_vegan: m.is_vegan,
      is_gluten_free: m.is_gluten_free,
      category_id: m.category_id,
    })),
  )
  const breadcrumbLd = breadcrumbSchema([
    { name: "Servera", url: SITE_URL },
    { name: restaurant.name, url: restaurantUrl },
  ])

  return (
    <>
      <JsonLd id="ld-restaurant" data={restaurantLd} />
      <JsonLd id="ld-menu" data={menuLd} />
      <JsonLd id="ld-breadcrumb" data={breadcrumbLd} />
      <CustomerMenuClient
        restaurant={restaurant}
        subdomain={params.subdomain}
        categories={categories ?? []}
        menuItems={menuItems ?? []}
        tableNumber={tableNumber}
      />
    </>
  )
}
