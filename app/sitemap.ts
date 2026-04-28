import type { MetadataRoute } from "next"
import { createPublicSupabaseClient } from "@/lib/supabase/public"
import { COMPARISON_SLUGS } from "@/lib/seo/comparisons"
import { CITY_SLUGS } from "@/lib/seo/cities"
import { RESTAURANT_TYPE_SLUGS } from "@/lib/seo/restaurant-types"

const BASE_URL = "https://servera.triadsolutions.se"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/priser`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ]

  const comparisonEntries: MetadataRoute.Sitemap = COMPARISON_SLUGS.map((s) => ({
    url: `${BASE_URL}/jamfor/${s}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const cityEntries: MetadataRoute.Sitemap = CITY_SLUGS.map((s) => ({
    url: `${BASE_URL}/digital-meny/${s}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const typeEntries: MetadataRoute.Sitemap = RESTAURANT_TYPE_SLUGS.map((s) => ({
    url: `${BASE_URL}/qr-meny/${s}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  let restaurantEntries: MetadataRoute.Sitemap = []
  try {
    const supabase = createPublicSupabaseClient()
    const { data } = await supabase
      .from("restaurants")
      .select("subdomain, created_at")
      .eq("is_active", true)

    if (data) {
      restaurantEntries = data.map((r) => ({
        url: `${BASE_URL}/${r.subdomain}/table/1`,
        lastModified: r.created_at ? new Date(r.created_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    }
  } catch {
    // sitemap should never fail the build — fall back to static entries
  }

  return [
    ...staticEntries,
    ...comparisonEntries,
    ...cityEntries,
    ...typeEntries,
    ...restaurantEntries,
  ]
}
